#!/usr/bin/env node

/**
 * 字体使用分析脚本
 * 扫描项目中的所有文本内容，提取使用的字符集
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 需要扫描的文件类型
const FILE_PATTERNS = [
  'src/**/*.{astro,tsx,ts,jsx,js,md,mdx}',
  'public/**/*.{html,json}',
];

// 忽略的目录
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.astro/**',
];

/**
 * 提取文件中的所有字符
 */
function extractCharacters(content) {
  const chars = new Set();

  // 遍历每个字符
  for (const char of content) {
    // 跳过控制字符
    const code = char.charCodeAt(0);
    if (code < 32 && code !== 10 && code !== 13 && code !== 9) {
      continue;
    }

    chars.add(char);
  }

  return chars;
}

/**
 * 主函数
 */
async function main() {
  console.log('📊 开始分析字体使用情况...\n');

  const allChars = new Set();
  let fileCount = 0;

  // 获取所有文件
  const files = await glob(FILE_PATTERNS, {
    cwd: projectRoot,
    ignore: IGNORE_PATTERNS,
    absolute: true,
  });

  console.log(`📁 找到 ${files.length} 个文件需要扫描\n`);

  // 扫描每个文件
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const chars = extractCharacters(content);

      chars.forEach(char => allChars.add(char));
      fileCount++;

      if (fileCount % 50 === 0) {
        console.log(`✓ 已扫描 ${fileCount}/${files.length} 个文件...`);
      }
    } catch (error) {
      console.warn(`⚠️  无法读取文件: ${file}`);
    }
  }

  console.log(`\n✅ 扫描完成！共分析了 ${fileCount} 个文件\n`);

  // 统计字符
  const sortedChars = Array.from(allChars).sort((a, b) => {
    return a.charCodeAt(0) - b.charCodeAt(0);
  });

  // 分类统计
  const stats = {
    total: sortedChars.length,
    ascii: 0,
    chinese: 0,
    japanese: 0,
    korean: 0,
    symbols: 0,
    numbers: 0,
    punctuation: 0,
    other: 0,
  };

  sortedChars.forEach(char => {
    const code = char.charCodeAt(0);

    if (code >= 48 && code <= 57) {
      stats.numbers++;
    } else if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
      stats.ascii++;
    } else if (code >= 0x4E00 && code <= 0x9FFF) {
      stats.chinese++;
    } else if (code >= 0x3040 && code <= 0x309F || code >= 0x30A0 && code <= 0x30FF) {
      stats.japanese++;
    } else if (code >= 0xAC00 && code <= 0xD7AF) {
      stats.korean++;
    } else if (code >= 33 && code <= 47 || code >= 58 && code <= 64 ||
               code >= 91 && code <= 96 || code >= 123 && code <= 126) {
      stats.punctuation++;
    } else if (code > 127) {
      stats.symbols++;
    } else {
      stats.other++;
    }
  });

  // 输出统计信息
  console.log('📈 字符统计:');
  console.log(`  总字符数: ${stats.total}`);
  console.log(`  ASCII 字母: ${stats.ascii}`);
  console.log(`  数字: ${stats.numbers}`);
  console.log(`  标点符号: ${stats.punctuation}`);
  console.log(`  中文字符: ${stats.chinese}`);
  console.log(`  日文字符: ${stats.japanese}`);
  console.log(`  韩文字符: ${stats.korean}`);
  console.log(`  其他符号: ${stats.symbols}`);
  console.log(`  其他字符: ${stats.other}\n`);

  // 生成字符集文本（用于 pyftsubset）
  const charText = sortedChars.join('');

  // 保存到文件
  const outputDir = path.join(projectRoot, 'src/fonts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const charsetFile = path.join(outputDir, 'charset.txt');
  fs.writeFileSync(charsetFile, charText, 'utf-8');
  console.log(`💾 字符集已保存到: ${charsetFile}`);

  // 生成 Unicode 范围列表（用于 pyftsubset --unicodes 参数）
  const unicodes = sortedChars
    .map(char => `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
    .join(',');

  const unicodesFile = path.join(outputDir, 'unicodes.txt');
  fs.writeFileSync(unicodesFile, unicodes, 'utf-8');
  console.log(`💾 Unicode 列表已保存到: ${unicodesFile}\n`);

  // 生成统计报告 JSON
  const reportFile = path.join(outputDir, 'font-usage-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    filesScanned: fileCount,
    stats,
    sampleChars: {
      first50: sortedChars.slice(0, 50).join(''),
      last50: sortedChars.slice(-50).join(''),
    },
  };

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📄 详细报告已保存到: ${reportFile}\n`);

  console.log('✨ 分析完成！可以运行字体子集化脚本了。\n');
}

main().catch(error => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
