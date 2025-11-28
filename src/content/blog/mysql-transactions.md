---
title: MySQL事务
description: MySQL事务
draft: false
date: 2024-09-23 11:38:48
updated: 2024-09-23 11:38:48
image: "https://assets.tsukikage7.com/blog/cover/8ef81369.webp"
imageAlt: ""
author: tsukikage
categories:
  - 后端开发
tags:
  - MySQL
  - 事务
status: published
featured: false
recommended: false
views: 0
hideToc: false
---

# MySQL事务

## 简介

事务是一组操作的集合，它是一个不可分割的工作单位，事务会把索引的操作作为一个整体一起向系统提交或者撤销，即这些操作要么同时成功，要么同时失败。从而保证了数据的完整性和一致性。

## 事务操作

- 查看/设置事务提交方式

```sql
select @@autocommit;
set @@autocommit=0; -- 设置为手动提交
```

- 提交事务

```sql
commit;
```

- 回滚事务

```sql
rollback;
```

- 事务操作

```sql
start transaction; -- 开启事务
begin; -- 开启事务
commit;
rollback;
```

## 事务的四大特性

- 原子性(Atomicity)：事务是不可分割的最小操作单元，要么全部成功，要么全部失败。
- 一致性(Consitency)：事务完成时，必须使所有的数据都保持一致状态。
- 隔离性(Isolation)：数据库系统提交的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。
- 持久性(Durability)：事务一旦提交或回滚，它对数据库中数据的改变是永久的。

> 通过原子性、隔离性、持久性(AID)保证了一致性(C)

## 并发事务问题

|    问题    |                                          描述                                          |
| :--------: | :------------------------------------------------------------------------------------: |
|    脏读    |                          一个事物读到另一个事物还没提交的数据                          |
| 不可重复读 |                    一个事物先后读取同一条记录，但两次读取的数据不同                    |
|    幻读    | 一个事物按照条件查询数据时，没有对应的数据行，但是在插入数据时，发现这行数据又存在了。 |

## 事务的隔离级别

|     隔离级别     | 脏读 | 不可重复读 | 幻读 |
| :--------------: | :--: | :--------: | :--: |
| Read uncommitted |  Y   |     Y      |  Y   |
|  Read committed  |  N   |     Y      |  Y   |
| Repeatable Read  |  N   |     N      |  Y   |
|   Serializable   |  N   |     N      |  N   |

- Read uncommitted：读未提交
- Read committed：读已提交
- Repeatable Read：可重复读
- Serializable：串行读

```sql
-- 查看事务隔离级别
select @@transaction_isolation;
-- 设置事务隔离级别
set [session|global] transaction isolation level [read committed|read committed|repeatable read|serializable]
```

数据隔离级别越高，数据越安全，但是性能越低。
