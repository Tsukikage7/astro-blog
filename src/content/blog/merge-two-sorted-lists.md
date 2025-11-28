---
title: 合并两个有序链表
description: 合并两个有序链表
draft: false
createdAt: 2023-07-16T06:15:36.000Z
updatedAt: 2023-07-16T06:15:36.000Z
image: "https://assets.tsukikage7.com/blog/cover/f988079b.webp"
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

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // 边界条件设置
        if (list1 == null) {
            return list2;
        } else if (list2 == null) {
            return list1;
        } else if (list1.val < list2.val) {
            // list1 的 val 小于 liste2,将 list1 节点的下一个节点指向递归后合并的链表
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}
```
