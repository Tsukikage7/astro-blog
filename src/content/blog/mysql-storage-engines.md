---
title: MySQL存储引擎
description: MySQL存储引擎
draft: false
createdAt: 2024-09-10T01:16:13.000Z
updatedAt: 2024-09-10T15:23:23.000Z
image: "https://assets.tsukikage7.com/blog/cover/04a1b985.webp"
imageAlt: ""
author: Maple
categories:
  - 后端开发
tags:
  - MySQL
  - 存储引擎
status: published
featured: false
recommended: false
views: 0
hideToc: false
---

# MySQL存储引擎

## 一、存储引擎简介

存储引擎是存储数据、建立索引、更新、查询数据的实现方式，在MySQL中存储引擎是基于表的，也可以称为表类型。

```sql
create table 表名(
	字段 ...
)engine=INNODB;
```

## 二、常见存储引擎

### 1. InnoDB

InnoDb是一种兼顾高性能和高可靠性的存储引擎，在MySQL5.5版本后为默认的存储引擎。

- DML操作遵循ACID模型，支持事务。

- 支持行级锁，提升并发访问性能。

- 支持外键约束，保证数据的完整性和正确性。

`tablename.ibd`：表空间文件，存储表结构、数据和索引。

#### 逻辑存储结构

![image-20240911141627299](https://assets.tsukikage7.com/blog/makrdownImages/dc6db7f6711e296f441a4cbb42ebbadf-a00cfd.png)

- TableSpace：表空间
- Segment：段
- Extent：区
- Page：页
- Row：行

### 2. MyISAM

MyISAM是MySQL早期的默认存储引擎。

- 不支持事务，不支持外键。
- 支持表锁，不支持行锁。
- 访问速度快。

`tablename.sdi`：存储表结构信息

`tablename.MYD`：存储数据

`tablename.MYI`：存储索引

### 3. Memory

Memory引擎的表数据是存储在内存中，只能用于临时表活缓存使用。

- 内存存放
- 默认hash索引

`tablename.sdi`：存储表结构信息

### 存储引擎选择

InnoDb：默认存储引擎，在需要用到事务且在并发场景下对数据一致性有要求，包含很多增删改查的操作的情况下选择。

MyISAM：以读取和插入操作为主，少量更新和删除操作，对事务完整性和并发要求不高的情况下选择。

Memory：存储在内存中，对表大小有限制，作为临时表和缓存的时候选择。