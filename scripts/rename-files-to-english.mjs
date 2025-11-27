#!/usr/bin/env node
/**
 * 批量重命名博客文件:中文文件名 → 英文文件名
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');

// 中文文件名到英文的映射
const nameMapping = {
  // Java & JVM
  'Java多线程': 'java-multithreading',
  'Java多线程学习2-0': 'java-multithreading-2',
  'JavaIO流': 'java-io-streams',
  'JUC面试题': 'juc-interview-questions',
  'HashMap和常用集合类的区别': 'hashmap-and-collections-differences',
  'HashMap的底层实现': 'hashmap-implementation',

  // MySQL & 数据库
  'MySQL索引': 'mysql-indexes',
  'MySQL存储引擎': 'mysql-storage-engines',
  'MySQL性能分析': 'mysql-performance-analysis',
  'MySQL事务': 'mysql-transactions',
  'InnoDB引擎': 'innodb-engine',
  '索引使用注意事项': 'index-usage-notes',
  'SQL优化': 'sql-optimization',

  // Redis
  'Redis缓存相关解决方案': 'redis-cache-solutions',

  // Scala & Spark
  'Scala高阶函数': 'scala-higher-order-functions',
  'Scala模式匹配': 'scala-pattern-matching',
  'Scala偏函数': 'scala-partial-functions',
  'Scala泛型': 'scala-generics',
  'ScalaActor并发编程模型': 'scala-actor-concurrency-model',
  'Akka构建简单的Spark通信框架': 'akka-simple-spark-communication-framework',
  'Spark面试知识点': 'spark-interview-questions',

  // Hadoop & 大数据
  'Hadoop面试知识点': 'hadoop-interview-questions',
  'Ubuntu搭建Hadoop伪分布式': 'ubuntu-hadoop-pseudo-distributed',
  '数仓分层': 'data-warehouse-layering',
  '大数据常用集群脚本': 'big-data-cluster-scripts',

  // Golang
  'Golang并发度控制': 'golang-concurrency-control',
  'Wire实现Golang依赖注入': 'golang-wire-dependency-injection',

  // 算法
  '十大排序算法': 'top-ten-sorting-algorithms',
  '排序算法': 'sorting-algorithms',
  'KMP算法': 'kmp-algorithm',
  '二分查找': 'binary-search',
  '两数之和': 'two-sum',
  '回文数': 'palindrome-number',
  '有效的括号': 'valid-parentheses',
  '合并两个有序链表': 'merge-two-sorted-lists',
  '多数元素I': 'majority-element-1',
  '多数元素II': 'majority-element-2',

  // 面试
  '字节跳动数据开发面试复盘': 'bytedance-data-dev-interview-review',
  '蔚来面试算法题复盘': 'nio-algorithm-interview-review',

  // 工具 & 部署
  'Docker搭建一个小而美的网站流量监控——Umami': 'docker-umami-setup',
  'Centos7.9安装Docker': 'centos-docker-installation',
  'CentOS安装MySQL': 'centos-mysql-installation',
  'CentOS安装Kubernetes': 'centos-kubernetes-installation',
  'DockerCompose搭建Kafka单机版': 'docker-compose-kafka-standalone',
  'DockerCompose搭建ClickHouse单机版': 'docker-compose-clickhouse-standalone',
  'Git版本控制': 'git-version-control',
  '线上调试Arthas的学习使用': 'arthas-debugging-guide',

  // 其他
  '常用限流算法': 'common-rate-limiting-algorithms',
};

async function renameFiles() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') && f !== '-index.md');

  console.log(`找到 ${files.length} 个文件\n`);

  const renameMap = [];

  for (const filename of files) {
    const nameWithoutExt = filename.replace('.md', '');

    // 如果文件名已经是英文,跳过
    if (/^[a-z0-9-]+$/.test(nameWithoutExt)) {
      console.log(`✓ 跳过(已是英文): ${filename}`);
      continue;
    }

    // 查找映射
    const englishName = nameMapping[nameWithoutExt];

    if (englishName) {
      const newFilename = `${englishName}.md`;
      renameMap.push({
        old: filename,
        new: newFilename,
      });
    } else {
      console.log(`⚠️  未找到映射: ${filename}`);
    }
  }

  // 显示预览
  console.log('\n=== 重命名预览 ===\n');
  renameMap.forEach(({ old, new: newName }) => {
    console.log(`${old}`);
    console.log(`  → ${newName}\n`);
  });

  console.log(`\n总计: ${renameMap.length} 个文件将被重命名\n`);

  // 执行重命名
  console.log('开始重命名...\n');
  let successCount = 0;

  for (const { old, new: newName } of renameMap) {
    const oldPath = path.join(BLOG_DIR, old);
    const newPath = path.join(BLOG_DIR, newName);

    try {
      // 检查目标文件是否已存在
      if (fs.existsSync(newPath)) {
        console.log(`⚠️  跳过(目标已存在): ${old} → ${newName}`);
        continue;
      }

      fs.renameSync(oldPath, newPath);
      console.log(`✓ ${old} → ${newName}`);
      successCount++;
    } catch (error) {
      console.error(`✗ 失败: ${old}`, error.message);
    }
  }

  console.log(`\n完成! 成功重命名 ${successCount}/${renameMap.length} 个文件`);
}

renameFiles().catch(console.error);
