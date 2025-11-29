---
title: 二分查找
description: 二分查找
created: 2023-07-19 07:02:34
updated: 2023-07-19 07:02:34
image: "https://assets.tsukikage7.com/blog/cover/d8563ac5.webp"
categories:
  - 算法
tags:
  - 算法
  - LeetCode
---

```java
public int binarySearch(int[] nums, int target) {
        // 二分查找
        int left = 0, right = nums.length - 1;
        int mid = 0;
        while (left <= right) {
            mid = left + ((right - left) >> 1);
            if (nums[mid] == target) {
                return mid;
            }
            // 二分查找的模板
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            }
        }

        return left;
    }
```
