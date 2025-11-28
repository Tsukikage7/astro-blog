---
title: MySQL性能分析
description: MySQL性能分析
draft: false
date: 2024-09-13 15:27:03
updated: 2024-09-14 09:45:23
image: "https://assets.tsukikage7.com/blog/cover/0ca347b8.webp"
imageAlt: ""
author: tsukikage
categories:
  - 后端开发
tags:
  - MySQL
  - SQL
status: published
featured: false
recommended: false
views: 0
hideToc: false
---

# SQL性能分析

## SQL执行频率

通过`show status`可以查看服务器状态信息

```sql
mysql> show global status like 'COM_______';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_binlog    | 0     |
| Com_commit    | 0     |
| Com_delete    | 0     |
| Com_import    | 0     |
| Com_insert    | 0     |
| Com_repair    | 0     |
| Com_revoke    | 0     |
| Com_select    | 1     |
| Com_signal    | 0     |
| Com_update    | 0     |
| Com_xa_end    | 0     |
+---------------+-------+
```

## 慢查询日志

慢查询日志记录了所有执行时间超过指定参数（long_query_time，单位秒，默认10秒）的所有SQL语句的日志。

MySQL的慢查询日志默认没有开启，需要再MySQL的配置文件中修改。

```cnf
# 开启慢查询
slow_query_log=1
#  设置慢查询时间为2秒，执行时间超过2秒就被视为慢查询
slow_query_time=2
```

```sql
show variables link 'slow_query_log';
```

慢查询日志文件记录在`/var/lib/mysql/localhost-slow.log`

## profile详情

`show profile`能够在做SQL优化的时候帮助我们了解时间消耗。通过`have_profiling`参数，能够看到当前MySQL是否支持profile操作。

```sql
mysql> select @@have_profiling;
+------------------+
| @@have_profiling |
+------------------+
| YES              |
+------------------+
1 row in set, 1 warning (0.00 sec)
```

```sql
show profiles; -- 查看每一条SQL耗时的基本情况
-- 查看指定query在各个阶段的耗时情况
show profile for query query_id;
-- 查看指定query的cpu使用情况
show profile cpu for query query_id;
```

## explain执行计划

`explain`或者`desc`命令获取MySQL如何执行查询语句的信息，包括在查询语句执行过程中表如何连接和连接的顺序。

```sql
explain select column_name from tabe_name where select_condition;
```

```sql
mysql> explain select * from users where id = 1;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | users | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

- Id：select查询的序列号，表示查询中执行select子句或者操作表的顺序，id值越大越先执行。
- select_type： 表示查询的类型，常见取值有SIMPLE（简单表、不使用表连接或子查询）、PRIMARY（主查询，最外层的查询）、UNION（连接查询中第二个或者后面的查询语句）、SUBQUERY（select、where后的子查询）
- type：连接类型，性能由好到差分别为NULL、system、const、eq_ref、range、index、all。
- possible_key：在这张表中可能用到的索引
- Key：实际用到的索引
- Key_len：表示索引中使用的字节数，该值为所有字段最大可能长度，并不是实际使用长度，在不损失精确性的前提下，长度越短越好。
- rows：执行查询的行数，在InnoDB引擎表中是预估值。
- filtered：表示返回结果的行数占需读取行数的百分比，filtered的值越大越好。
