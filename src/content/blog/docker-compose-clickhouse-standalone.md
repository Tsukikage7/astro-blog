---
title: DockerCompose搭建ClickHouse单机版
description: DockerCompose搭建ClickHouse单机版
created: 2023-06-12 15:53:07
updated: 2023-06-12 15:53:07
image: "https://assets.tsukikage7.com/blog/cover/d78e4b2d.webp"
categories:
  - 后端开发
tags:
  - 开发
  - Docker
  - Docker Compose
  - ClickHouse
---

## 通过 Docker Compose 搭建 ClickHouse 单机版

### docker-compose-single-clickhouse.yml

```yaml
version: "3"

services:
  clickhouse:
    image: yandex/clickhouse-server
    container_name: clickhouse
    restart: always
    networks:
      - deng
    ports:
      - "8123:8123"
      - "9000:9000"
    volumes:
      # 默认配置
      - ./data/config/docker_related_config.xml:/etc/clickhouse-server/config.d/docker_related_config.xml:rw
      - ./data/config/config.xml:/etc/clickhouse-server/config.xml:rw
      - ./data/config/users.xml:/etc/clickhouse-server/users.xml:rw
      - /etc/localtime:/etc/localtime:ro
      # 运行日志
      - ./data/log:/var/log/clickhouse-server
      # 数据持久
      - ./data:/var/lib/clickhouse:rw

networks:
  deng:
    external: true
```
