/**
 * 图片优化脚本 - 使用 Sharp 替代 imagemin
 * 使用方法: node scripts/optimize-images.js
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp'; // 确保已安装: npm install sharp --save-dev

// 获取当前文件的路径（ES模块中的 __dirname 替代方案）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/images');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 需要处理的图片类型
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// 要生成的不同尺寸
const SIZES = [320, 640, 960, 1280, 1920];

// 压缩质量设置
const QUALITY_SETTINGS = {
  jpeg: 85,
  jpg: 85,
  png: 80,
  webp: 80,
  avif: 70
};

// 统计数据
let processedCount = 0;
let totalSavings = 0;

// 处理单个图片
async function processImage(filePath, fileName, extension) {
  console.log(`处理图片: ${fileName}${extension}`);
  
  try {
    // 获取原图信息和大小
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    // 加载图片
    let imageBuffer = await sharp(filePath).toBuffer();
    const metadata = await sharp(imageBuffer).metadata();
    
    // 为每个尺寸处理图片
    for (const size of SIZES) {
      // 如果原图小于目标尺寸，跳过
      if (size > Math.max(metadata.width, metadata.height)) {
        continue;
      }

      // 调整大小参数
      const resizeOptions = {};
      if (metadata.width > metadata.height) {
        resizeOptions.width = size;
      } else {
        resizeOptions.height = size;
      }

      // 处理原始格式
      const outputPath = path.join(OUTPUT_DIR, `${fileName}-${size}w${extension}`);
      await sharp(imageBuffer)
        .resize(resizeOptions)
        .toFormat(extension.replace('.', ''), { 
          quality: QUALITY_SETTINGS[extension.replace('.', '')] || 80 
        })
        .toFile(outputPath);
        
      // 生成 WebP 版本
      const webpOutputPath = path.join(OUTPUT_DIR, `${fileName}-${size}w.webp`);
      await sharp(imageBuffer)
        .resize(resizeOptions)
        .webp({ quality: QUALITY_SETTINGS.webp })
        .toFile(webpOutputPath);
      
      // 生成 AVIF 版本 (如果 Sharp 支持)
      try {
        const avifOutputPath = path.join(OUTPUT_DIR, `${fileName}-${size}w.avif`);
        await sharp(imageBuffer)
          .resize(resizeOptions)
          .avif({ quality: QUALITY_SETTINGS.avif })
          .toFile(avifOutputPath);
      } catch (err) {
        console.warn('AVIF 格式生成失败，可能 Sharp 版本不支持 AVIF:', err.message);
      }
    }
    
    // 生成低质量的缩略图作为模糊占位符
    const placeholderPath = path.join(OUTPUT_DIR, `${fileName}-placeholder.webp`);
    await sharp(imageBuffer)
      .resize({ width: 20 })
      .blur(5)
      .webp({ quality: 20 })
      .toFile(placeholderPath);
    
    // 计算节省的空间
    const compressedPath = path.join(OUTPUT_DIR, `${fileName}-1280w${extension}`);
    if (fs.existsSync(compressedPath)) {
      const compressedStats = fs.statSync(compressedPath);
      const saving = originalSize - compressedStats.size;
      const savingPercent = ((saving / originalSize) * 100).toFixed(2);
      
      totalSavings += saving;
      console.log(`✅ 已处理: ${fileName}${extension} - 节省 ${(saving / 1024).toFixed(2)} KB (${savingPercent}%)`);
    } else {
      console.log(`✅ 已处理: ${fileName}${extension}`);
    }
    
    processedCount++;
  } catch (err) {
    console.error(`❌ 处理失败: ${fileName}${extension}`, err);
  }
}

// 处理所有图片
async function processAllImages() {
  console.log(`🔍 从 ${SOURCE_DIR} 读取图片`);
  console.log(`📦 输出到 ${OUTPUT_DIR}`);
  
  const startTime = Date.now();
  const files = fs.readdirSync(SOURCE_DIR);
  
  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (IMAGE_EXTENSIONS.includes(extension)) {
      const filePath = path.join(SOURCE_DIR, file);
      const fileName = path.basename(file, extension);
      
      await processImage(filePath, fileName, extension);
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n📊 优化结果摘要:');
  console.log(`处理了 ${processedCount} 个图片`);
  console.log(`总共节省 ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);
  console.log(`耗时 ${duration} 秒`);
}

// 执行主函数
processAllImages()
  .then(() => console.log('✨ 所有图片处理完成'))
  .catch(err => {
    console.error('图片处理失败:', err);
    process.exit(1);
  });
