import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 图片源目录
const SRC_DIR = './src/assets';
// 要处理的图片类型
const FILE_TYPES = ['.jpg', '.jpeg', '.png'];

// 读取目录下的所有图片
fs.readdir(SRC_DIR, (err, files) => {
  if (err) {
    console.error('读取目录失败:', err);
    return;
  }

  // 过滤出需要处理的图片
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return FILE_TYPES.includes(ext);
  });

  // 处理每个图片
  imageFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file);
    const fileNameWithoutExt = path.basename(file, path.extname(file));
    
    // 转换为WebP
    sharp(filePath)
      .webp({ quality: 80 })
      .toFile(path.join(SRC_DIR, `${fileNameWithoutExt}.webp`))
      .then(() => console.log(`${file} -> ${fileNameWithoutExt}.webp 转换成功`))
      .catch(err => console.error(`${file} WebP 转换失败:`, err));
    
    // 转换为AVIF
    sharp(filePath)
      .avif({ quality: 65 })
      .toFile(path.join(SRC_DIR, `${fileNameWithoutExt}.avif`))
      .then(() => console.log(`${file} -> ${fileNameWithoutExt}.avif 转换成功`))
      .catch(err => console.error(`${file} AVIF 转换失败:`, err));
  });
});
