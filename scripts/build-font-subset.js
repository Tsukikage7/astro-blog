import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import subsetFont from 'subset-font';

// ES Module 环境下获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 颜色定义
const colors = {
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[0;34m',
  reset: '\x1b[0m'
};

// 项目路径
const projectRoot = path.resolve(__dirname, '..');
const sourceFontDir = path.join(projectRoot, 'src/fonts/source/monaco-nerd');
const outputFontDir = path.join(projectRoot, 'public/fonts/monaco-nerd');
const charsetFile = path.join(projectRoot, 'src/fonts/charset.txt');

// 字体文件列表
const fonts = [
  'LigaMonacoNerdFont-Regular.ttf',
  'LigaMonacoNerdFont-Bold.ttf',
  'LigaMonacoNerdFont-Italic.ttf',
  'LigaMonacoNerdFont-BoldItalic.ttf'
];

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
  return (bytes / (1024 * 1024)).toFixed(1) + 'M';
}

/**
 * 获取目录总大小
 */
function getDirSize(dir) {
  let totalSize = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

/**
 * 主函数
 */
async function main() {
  console.log(`${colors.blue}🔧 Monaco Nerd Font 子集化构建${colors.reset}\n`);

  // 检查源字体目录
  if (!fs.existsSync(sourceFontDir)) {
    console.error(`${colors.red}❌ 错误: 源字体目录不存在: ${sourceFontDir}${colors.reset}`);
    process.exit(1);
  }

  // 检查字符集文件
  if (!fs.existsSync(charsetFile)) {
    console.log(`${colors.yellow}⚠️  警告: 字符集文件不存在，先运行字体分析脚本${colors.reset}`);
    console.log(`${colors.blue}正在运行: node scripts/analyze-font-usage.js${colors.reset}\n`);

    // 动态导入分析脚本
    const analyzeModule = await import('./analyze-font-usage.js');
    if (analyzeModule.default) {
      await analyzeModule.default();
    }
  }

  // 读取字符集
  const charset = fs.readFileSync(charsetFile, 'utf-8');
  console.log(`${colors.green}📝 已加载字符集: ${charset.length} 个字符${colors.reset}\n`);

  // 创建输出目录
  if (!fs.existsSync(outputFontDir)) {
    fs.mkdirSync(outputFontDir, { recursive: true });
  }

  console.log(`${colors.green}📦 开始处理字体文件...${colors.reset}\n`);

  let successCount = 0;
  let failCount = 0;

  // 处理每个字体文件
  for (const font of fonts) {
    const sourceFile = path.join(sourceFontDir, font);

    if (!fs.existsSync(sourceFile)) {
      console.log(`${colors.yellow}⚠️  跳过: ${font} (文件不存在)${colors.reset}`);
      failCount++;
      continue;
    }

    console.log(`${colors.blue}🔄 处理: ${font}${colors.reset}`);

    try {
      // 读取源字体文件
      const fontBuffer = fs.readFileSync(sourceFile);
      const originalSize = fontBuffer.length;
      console.log(`   原始大小: ${formatSize(originalSize)}`);

      // 生成子集
      console.log(`   ${colors.yellow}→${colors.reset} 生成子集 WOFF2...`);

      const subsetBuffer = await subsetFont(fontBuffer, charset, {
        targetFormat: 'woff2'
      });

      // 输出文件
      const basename = path.basename(font, '.ttf');
      const outputFile = path.join(outputFontDir, `${basename}.woff2`);

      fs.writeFileSync(outputFile, subsetBuffer);

      const subsetSize = subsetBuffer.length;
      const reduction = ((1 - subsetSize / originalSize) * 100).toFixed(1);

      console.log(`   ${colors.green}✓${colors.reset} WOFF2: ${formatSize(subsetSize)} (压缩 ${reduction}%)`);
      successCount++;

    } catch (error) {
      console.error(`   ${colors.red}✗${colors.reset} 处理失败: ${error.message}`);
      failCount++;
    }

    console.log('');
  }

  console.log(`${colors.green}✅ 字体子集化完成！${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} 成功: ${successCount} 个`);
  if (failCount > 0) {
    console.log(`   ${colors.red}✗${colors.reset} 失败: ${failCount} 个`);
  }
  console.log('');

  // 显示输出目录内容
  console.log(`${colors.blue}📁 输出目录: ${outputFontDir}${colors.reset}`);
  const outputFiles = fs.readdirSync(outputFontDir);

  for (const file of outputFiles) {
    const filePath = path.join(outputFontDir, file);
    const stats = fs.statSync(filePath);
    const size = formatSize(stats.size);
    console.log(`   ${file.padEnd(40)} ${size.padStart(8)}`);
  }

  // 计算总大小对比
  try {
    const totalSourceSize = getDirSize(sourceFontDir);
    const totalOutputSize = getDirSize(outputFontDir);
    const totalReduction = ((1 - totalOutputSize / totalSourceSize) * 100).toFixed(1);

    console.log(`\n${colors.green}💾 总大小对比:${colors.reset}`);
    console.log(`   原始: ${formatSize(totalSourceSize)}`);
    console.log(`   优化后: ${formatSize(totalOutputSize)}`);
    console.log(`   压缩率: ${totalReduction}%`);
  } catch (error) {
    console.error(`${colors.yellow}⚠️  无法计算大小对比${colors.reset}`);
  }

  console.log(`\n${colors.green}🎉 构建完成！${colors.reset}`);
}

// 执行主函数
main().catch(error => {
  console.error(`${colors.red}❌ 构建失败: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});
