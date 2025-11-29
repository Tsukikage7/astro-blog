---
title: DockerCompose搭建Kafka单机版
description: DockerCompose搭建Kafka单机版
created: 2023-06-12 15:57:08
updated: 2023-06-12 15:57:08
image: "https://assets.tsukikage7.com/blog/cover/b6823b2f.webp"
categories:
  - 后端开发
tags:
  - 开发
  - Docker
  - DockerCompose
  - Kafka
---

## 通过 Docker Compose 搭建 Kafka 单机版

### docker-compose-single-kafka.yml

```yaml
version: "2"
services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: "zk-kafka"
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka
    container_name: "kafka-single"
    ports:
      - "9092:9092"
    environment:
      # client 要访问的 broker 地址
      KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1
      # 通过端口连接 zookeeper
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      # 每个容器就是一个 broker,设置其对应的 ID
      KAFKA_BROKER_ID: 0
      # 外部网络只能获取到容器名称,在内外网络隔离情况下
      # 通过名称是无法成功访问 kafka 的
      # 因此需要通过绑定这个监听器能够让外部获取到的是 IP
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://127.0.0.1:9092
      # kafka 监听器,告诉外部连接者要通过什么协议访问指定主机名和端口开放的 Kafka 服务。
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      # Kafka默认使用-Xmx1G -Xms1G的JVM内存配置,由于服务器小,调整下启动配置
      # 这个看自己的现状做调整,如果资源充足,可以不用配置这个
      KAFKA_HEAP_OPTS: "-Xmx256M -Xms128M"
      # 设置 kafka 日志位置
      KAFKA_LOG_DIRS: "/kafka/logs"
```

### `Docker Compose` 启动命令

```bash
docker-compose -f docker-compose-single-kafka.yml  up -d
```
