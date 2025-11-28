---
title: 排序算法
description: 排序算法
draft: false
createdAt: 2023-06-17T08:30:17.000Z
updatedAt: 2023-06-17T08:30:17.000Z
image: "https://assets.tsukikage7.com/blog/cover/46fd1145.webp"
imageAlt: ""
author: tsukikage
categories:
  - 算法
tags:
  - 算法
  - LeetCode
status: published
featured: false
recommended: false
views: 0
hideToc: false
---

## 冒泡排序

排序原理

1. 从最后一个元素开始进行冒泡,如果最后

```java
public static void sort(int[] array) {
    for (int i = array.length - 1; i > 0; i--) {
        for (int j = 0; j < i; j++) {
            if (array[i] < array[j]) {
                swap(array, i, j);
            }
        }
    }
}
```
