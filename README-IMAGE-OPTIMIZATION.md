# 图片优化系统使用指南

## 当前状态

目前图片优化系统已经设置好，但尚未完全激活。图片组件 `OptimizedImage` 已经安装到位，并支持懒加载功能，但响应式图片源（srcSet）功能暂时禁用，以确保基本显示功能正常。

## 完整激活图片优化系统的步骤

1. **运行图片优化脚本**：

   ```bash
   node scripts/optimize-images.mjs
   ```

   这将处理 `src/assets` 中的图片，并在 `public/images` 目录中生成优化后的图片。

2. **修改 OptimizedImage 组件**：
   在 `src/components/OptimizedImage.jsx` 文件中，取消注释 `generateSrcSet` 函数中被注释的部分，并修改路径以指向新生成的优化图片：

   ```jsx
   const generateSrcSet = () => {
     // 提取文件名（不含路径和扩展名）
     const filename = src.split('/').pop().split('.')[0];
     const extension = src.split('.').pop();
     
     // 为不同尺寸生成图片地址，指向public/images目录
     const sizes = [320, 640, 960, 1280, 1920];
     const srcSet = sizes.map(size => 
       `/images/${filename}-${size}w.webp ${size}w`
     );
     
     return srcSet.join(', ');
   }
   ```

3. **更新图片从 `assets` 目录到 `public/images` 目录的引用**：
   如果优化脚本已经运行成功，您可以将组件中的图片引用直接更新到 `public/images` 目录。

## 常见问题排查

如果图片显示为占位图，请检查：

1. 确认图片文件路径正确
2. 查看浏览器控制台是否有图片加载错误
3. 确认 OptimizedImage 组件参数设置正确
4. 如果使用了srcSet功能，确认对应的优化图片已生成
