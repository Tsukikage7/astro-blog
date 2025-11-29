---
title: 排序算法
description: 排序算法
created: 2023-06-17 08:30:17
updated: 2023-06-17 08:30:17
image: "https://assets.tsukikage7.com/blog/cover/46fd1145.webp"
categories:
  - 算法
tags:
  - 算法
  - LeetCode
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
