---
title: InnoDB引擎
description: InnoDB引擎
draft: false
createdAt: 2024-09-26T02:00:27.000Z
updatedAt: 2024-09-26T02:00:27.000Z
image: "https://assets.tsukikage7.com/blog/cover/e4f44202.webp"
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

# InnoDB引擎

## 逻辑存储结构

![image-20240911141627299](https://assets.tsukikage7.com/blog/makrdownImages/dc6db7f6711e296f441a4cbb42ebbadf-a00cfd.png)

- TableSpace：表空间(idb文件)，一个mysql实例对应多个表空间，用于存储记录、索引等数据。
- Segment：段，分为数据段、索引段、回滚段、InnoDB是索引组织表，数据段就是B+树的叶子结点，索引段位B+树的非叶子结点。
- Extent：区，表空间内的单元结构，每个区的大小为1MB。默认情况下InnoDB存储引擎页大小为16K，即一个区中有64个页。
- Page：页，InnoDB存储引擎磁盘管理的最小单元，默认为16KB。为保证页的连续，InnoDB存储引擎每次从磁盘申请4-5个区。
- Row：行，InnoDB存储引擎数据是按行存放的。
- Trx_id：每次对某条记录进行修改时，都会把对应的事务id赋值给Trx_id隐藏列。
- Roll_point：每次对某条记录进行修改时，都会把旧的版本写入到Udo日志中，然后这个隐藏列相当于一个指针，可以通过它来找到修改前的信息。

## 架构

### 内存架构

Buffer Poll：缓冲池是主内存中的一个区域，里面可以缓存磁盘上经常操作的真实数据，在执行增删改查操作时，先操作缓冲池中的数据（如果缓冲池中没有数据，则从磁盘中加载并缓存），然后再以一定频率熟悉到磁盘，从而减少磁盘IO，加快处理速度。

缓冲池以Page页为单位，底层采用链表数据结构管理Page。根据状态Page分为三种类型：

- free page：空闲page，未被使用。
- clean page：被使用的page，数据没有被修改过。
- dirty page：脏页，被使用的page，数据被修改过，缓冲池中的数据和磁盘中的数据不一致。

Change Buffer：更改缓冲区（针对于非唯一二级索引页），在执行DML语句时，如果这些数据Page不在Buffer Pool中，不会直接操作磁盘，而是将数据变更存放在Change Buffer中，在未来数据被读取时，再将数据合并恢复到Buffer Pool中，并将合并后的数据刷新到磁盘中。

Change Buffer存在的意义在于减少随机插入的二级索引，通过在缓冲池中的合并降低了磁盘IO。

Adaptive Hash Index：自适应hash索引，用于优化对Buffer Pool数据的查询。InnoDB引擎会监控对表上页的查询，如果观测到hash索引可以提升速度，则会建立hash索引，称为自适应hash索引。

自适应hash索引不需要人工干预，是系统工具情况自动完成的。

Log Buffer：日志缓存区，用于保存要写入到磁盘的log日志数据（redo log、undo log），默认大小为16MB，日志缓冲区的日志会定期刷新到磁盘中。如果需要更新、插入或删除多行的事务，增加日志缓冲区的大小可以节省磁盘IO。

### 磁盘结构

System Tablespace：系统表空间是更改缓冲区的存储结构。如果表是在系统表空间而不是在每个表文件或者通用表空间中穿件的，它也可能包含表和索引数据。

File-Per-Table Tablespace：每个表的文件表空间，包含单个InnoDB表的数据和索引，并存储在文件系统商的单个数据文件中。

General Tablespace：通用表空间，需要通过创建表空间语法`create tablespace`创建通用表空间。

Undo Tablespace：撤销表空间，MySQL实例在初始化时会自动创建两个默认的undo表空间（初始大小为16MB），用于存储undo log日志。

Temporary Tablespace：会话临时表空间和全局临时表空间，存储用户创建的临时表。

Doublewrite Buffer Files：双写缓冲区，InnoDB引擎在将数据也从缓冲区熟悉到磁盘前，先将数据也写入双写缓冲区文件中，便于系统异常时恢复数据。

Redo Log：重做日志，用于实现事务的持久性。该文件由两部分组成：重做日志缓冲和重做日志文件，前者在内存中，后者在磁盘中。当事务提交后会把所有的修改信息都存到该日志中，用于在熟悉脏页到磁盘发生错误时，进行数据恢复。

## 后台线程

Master Thread：核心后台线程，负责调度其他线程，还负责将缓冲池中的数据异步刷新到磁盘中，保持数据的一致性，还包括脏页的刷新，合并插入缓存、undo页的回收。

IO Thread：在InnoDB引擎中使用了大量AIO来处理IO请求，这样可以极大提升数据库的性能，二IO Thread主要负责这些IO请求的回调。

|       线程类型       | 默认个数 |          职责          |
| :------------------: | :------: | :--------------------: |
|     Read Thread      |    4     |         读操作         |
|     Write Thread     |    4     |         写操作         |
|      Log Thread      |    1     | 将日志缓冲区刷新到磁盘 |
| Insert Buffer Thread |    1     |  将写缓冲区刷新到磁盘  |

Purge Thread：用于回收事务已经提交的undo logo，在事务提交后，undo log可能不用了，愧就回收掉。

Page Cleaner Thread：协助Master Thread筛选脏页到磁盘的现场，可以减轻Master Thread的工作压力，减少阻塞。

## 事务原理