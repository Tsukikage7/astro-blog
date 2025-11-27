---
title: Golang并发度控制
description: Golang并发度控制
draft: false
createdAt: 2024-11-13T08:09:01.000Z
updatedAt: 2024-11-13T08:09:01.000Z
image: "https://assets.tsukikage7.com/blog/cover/97cb2718.webp"
imageAlt: ""
author: Maple
categories:
  - 后端开发
tags:
  - 开发
  - 并发
  - Golang
  - goroutine
status: published
featured: false
recommended: false
views: 0
hideToc: false
---

# Golang并发度控制

在Golang中可以通过channel去控制goroutine的并发度

举个例子：

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup
	concurrence := 2
	semaphore := make(chan struct{}, concurrence)
	startTime := time.Now()
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			// 抢占一个并发槽位
			semaphore <- struct{}{}
			// 模拟任务执行
			fmt.Printf("Task %d started\n", i)
			time.Sleep(time.Second)
			fmt.Printf("Task %d finished\n", i)

			// 任务执行完成后，释放一个并发槽位
			<-semaphore
		}(i)
	}
	wg.Wait()
	fmt.Printf("总耗时: %v\n", time.Since(startTime))
}
```

我们这里假设有10个任务要同时进行，然后我们的并发度设置为2，意味着在同一时间只有两个`goroutine`能够执行，每个任务需要1秒的时间去执行，那么我们就需要5秒去执行整个代码。

深入思考一下，为什么在同一时间只有两个goroutine能够去执行，其他的goroutine要出去阻塞等待状态呢？

这里是通过channel去实现了一个信号量，这个是长度为2有缓冲的channel，那么最多只能放入两个信号量，也就意味着同时只能有两个groutine能执行。

当第三个groutine启动运行的时候，尝试向信号channel中写入信号，发现写不进去，就会陷入阻塞等待，直到有任务执行完成，对应的goroutine释放从信号channel中将信号读出。

这里将concurrence并发度设为5的话，就可以同时有5个groutine同时运行。