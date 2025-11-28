---
title: SQL优化
description: SQL优化
draft: false
createdAt: 2024-09-17T10:15:15.000Z
updatedAt: 2024-09-17T10:15:15.000Z
image: "https://assets.tsukikage7.com/blog/cover/02e447e6.webp"
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

# SQL优化

## 插入数据优化

**insert优化**

- 批量插入（500-1000条）
- 手动提交事务
- 主键顺序插入
- 大批量插入数据，使用`load`命令插入

```sql
# 客户端连接时加上对应参数
mysql --local-infile -utroot -p
# 设置启用local_infile全局参数
set global local_infile=1
# 执行load命令加载数据到表结构中
load data local infile '/root/test.csv' into table `tests` fields terminayed by ',' lines terminated by '\n';
```

## 主键优化

**数据组织方式**

在`InnoDB`存储引擎中，表数据都是根据主键顺序组织存放的，这种存储方式的表成为==索引组织表==。

**页分裂**

页可以为空，页可以一半，也可以填充满，每个页包含了2-N行数据（如果一行数据过大，会行溢出），更具主键排列。

如果主键乱序插入的话，就会产生页分裂现象。当一个数据页满时，插一个新的数据，新数据会分配到新的页。

**页合并**

当删除一行数据时，实际上并没有被物理删除，只是被标记为删除，并且他的空间变得允许被其他记录声明使用。

当删除数据达到合并阈值时，InnoDB会寻找最靠近的页，并看看是否能将两个页合并为一个页，以优化空间。

**主键设计原则**

- 满足业务需求的情况下，尽量降低主键的长度。
- 插入数据时，尽量选择顺序插入，选择`atuo_increament`自增主键。
- 尽量不要使用UUID或其他自然主键。
- 业务操作时，尽量避免对主键的修改。

## order by优化

**Using filesort：**通过表的所有或者全表扫描，读取满足条件的数据行，然后再排序缓存区`sort buffer`中完成排序操作，索引不是通过索引直接返回排序结果的排序都是`filesort`排序。

**Using Index：**通过有序索引顺序扫描直接返回有序数据，这种情况不需要额外排序，操作效率高。

**排序索引设计原则**

- 根据排序字段建立合适的所有，多字段排序时，也遵循最左前缀法则。
- 尽量使用覆盖索引。
- 多字段排序，一个升序，一个降序，需要在创建联合索引时指定排序规则（desc/asec）。
- 如果不可避免的出现`filesort`，大数据量排序时，可以适当增加排序缓存区`sort_buffer_size`（默认256k）的大小

## gourp by优化

- 在分组操作时，可以通过索引提升效率。

- 分组操作时，索引的使用也是满足最左前缀法则。

## limit优化

> 例如执行`limit 2000000,1`操作，MySQL需要对前2000010的数据进行排序，仅仅值返回2000000-2000010的数据，其他数据丢弃，查询排序代价非常大。

使用覆盖索引加子查询的方式优化。

## count优化

- MyISAM引擎把一个表的总行数存在了磁盘上，因此在执行`count(*)`操作的时候就会直接返回这个数，查询效率很高。
- InnoDB引擎比较麻烦，需要把数据一行一行的读出来，然后累计计数。

**count的用法**

- count()是一个聚合函数，对于返回的结果集，一行一行的判断，如果count函数的参数不是NULL，累计值加1，否则不加，最后返回累计值。
- count(主键)：InnoDB会遍历整张表，把每一行主键id都取出来进行累加计数。
- count(字段)：
  - 没有`not null`约束：InnoDB会遍历整张表，把每一行字段值都取出来，然后判断是否为null，部位null计数累加。
  - 有`not null`约束：InnoDB会遍历整张表，把每一行的字段值都取出来，直接累加计数。
- count(1)：InnoDB会遍历整张表，但不取值，直接按行进行累加计数。
- count(\*)：InnoDB不会把所有字段取出来，在MySQL中做了优化，直接按行进行累加。

## Update优化

InnoDB中的行锁是针对索引加的锁，不是针对记录加的锁，并且该索引不能失效，否则会从行锁升级为表锁。
