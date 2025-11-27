#!/usr/bin/env node

/**
 * 删除项目中所有 TypeScript/JavaScript/Astro 文件的注释
 * ⚠️ 这是一个危险操作，会永久删除所有注释
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 需要处理的文件扩展名
const extensions = ['.js', '.ts', '.jsx', '.tsx', '.astro', '.mjs', '.cjs'];

// 需要排除的目录
const excludeDirs = [
  'node_modules',
  '.git',
  'dist',
  '.astro',
  'scripts', // 排除脚本目录本身
];

// 需要排除的文件
const excludeFiles = [
  'astro.config.mjs',
  'tailwind.config.mjs',
  'postcss.config.cjs',
];

let processedFiles = 0;
let skippedFiles = 0;

/**
 * 删除单行注释 (//)
 */
function removeSingleLineComments(code) {
  // 移除单行注释，但保留 URL 中的 //
  return code.replace(/(?<!:)\/\/.*$/gm, '');
}

/**
 * 删除多行注释 (/* */)
 */
function removeMultiLineComments(code) {
  // 移除多行注释
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * 删除 HTML 注释 (<!-- -->)
 */
function removeHTMLComments(code) {
  return code.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * 清理空行（连续超过2个空行的合并为2个）
 */
function cleanEmptyLines(code) {
  return code.replace(/\n{3,}/g, '\n\n');
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // 删除注释
    content = removeSingleLineComments(content);
    content = removeMultiLineComments(content);
    content = removeHTMLComments(content);
    content = cleanEmptyLines(content);

    // 如果内容发生了变化，才写入文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ 处理: ${path.relative(projectRoot, filePath)}`);
      processedFiles++;
    } else {
      skippedFiles++;
    }
  } catch (error) {
    console.error(`✗ 错误: ${filePath}`, error.message);
  }
}

/**
 * 递归遍历目录
 */
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (excludeDirs.includes(file)) {
        continue;
      }
      walkDirectory(filePath);
    } else if (stat.isFile()) {
      // 跳过排除的文件
      if (excludeFiles.includes(file)) {
        continue;
      }

      // 检查文件扩展名
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        processFile(filePath);
      }
    }
  }
}

// 主程序
console.log('🚀 开始删除项目中的所有注释...\n');
console.log('⚠️  这是一个不可逆操作！\n');

const srcDir = path.join(projectRoot, 'src');

if (fs.existsSync(srcDir)) {
  walkDirectory(srcDir);
}

console.log('\n✅ 完成！');
console.log(`📊 处理了 ${processedFiles} 个文件`);
console.log(`⏭️  跳过了 ${skippedFiles} 个文件（无注释）`);
