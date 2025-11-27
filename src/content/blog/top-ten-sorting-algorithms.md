---
title: 十大排序算法
description: 十大排序算法
draft: false
createdAt: 2024-04-10T16:24:39.000Z
updatedAt: 2024-04-10T16:24:39.000Z
image: "https://assets.tsukikage7.com/blog/cover/a1f5131b.webp"
imageAlt: ""
author: Maple
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

# 十大排序算法

## 冒泡排序 (Bubble Sort)

> 冒泡排序是一种简单的排序算法
>
> 它重复地遍历要排序的数列,一次比较两个元素,如果顺序错误就把它们交换过来
>
> 遍历的最终结果是会把最大的数冒泡地沉到最底下,最小的数会像鱼泡一样被冒泡地推到最上面来

### 算法步骤

1. 比较相邻的元素。如果第一个比第二个大,就交换它们两个

2. 对每一对相邻元素作同样的工作,从开始第一对到结尾的最后一对,这样在最后的元素应该会是最大的数

3. 针对所有的元素重复以上的步骤,除了最后一个

4. 重复步骤 1~3,直到排序完成

### 图解算法

![0dfb7d6a6aadfc4dd30751c6e9a70e43](https://assets.tsukikage7.com/blog/makrdownImages/0dfb7d6a6aadfc4dd30751c6e9a70e43.gif)

### 实现代码

```java
/**
 * 冒泡排序
 *
 * @param nums 待排序数组
 */
public static void BubbleSort(int[] nums) {
    // 初始化两个指针,slow和fast
    int slow = 0, fast = 1;
    // 外层循环,遍历整个数组
    for (int i = 0; i < nums.length; i++) {
        // 内层循环,遍历未排序的部分
        while (fast < nums.length - i) {
            // 如果slow指向的元素大于fast指向的元素,交换它们
            if (nums[slow] > nums[fast]) {
                int tmp = nums[fast];
                nums[fast] = nums[slow];
                nums[slow] = tmp;
            }
            // 移动slow和fast指针
            slow++;
            fast++;
            // 打印每次排序后的结果
            print(nums);
        }
        // 重置slow和fast指针
        slow = 0;
        fast = 1;
    }
}
```

### 算法分析

- 稳定性: 稳定
- 时间复杂度: 最佳: O(n) ,最差: O(n2), 平均: O(n2)
- 空间复杂度: O(1)
- 排序方式: In-place

## 选择排序 (Selection Sort)

> 选择排序是一种简单直观的排序算法,无论什么数据进去都是 O(n²) 的时间复杂度
>
> 所以用到它的时候,数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了吧
>
> 它的工作原理: 首先在未排序序列中找到最小（大）元素,存放到排序序列的起始位置,然后,再从剩余未排序元素中继续寻找最小（大）元素,然后放到已排序序列的末尾。以此类推,直到所有元素均排序完毕

### 算法步骤

1. 找到数组中最小的元素,和第一个元素交换位置
2. 在剩余的元素中找到最小的元素,和第二个元素交换位置
3. 重复步骤2,直到找到数组的最后一个元素

### 算法图解

![e409c3cc4ccbebd5d7ca0343fd6689b6](https://assets.tsukikage7.com/blog/makrdownImages/e409c3cc4ccbebd5d7ca0343fd6689b6.gif)

### 代码实现

```java
/**
 * 选择排序
 * @param nums 待排序数组
 */
public static void selectionSort(int[] nums) {
    // 遍历整个数组
    for (int i = 0; i < nums.length; i++) {
        // 假设当前索引为最小元素的索引
        int minIndex = i;
        // 从当前索引的下一个元素开始,遍历未排序的部分
        for (int j = i + 1; j < nums.length; j++) {
            // 如果找到比当前最小元素还小的元素,更新最小元素的索引
            if (nums[minIndex] > nums[j]) {
                minIndex = j;
            }
        }
        // 将找到的最小元素与未排序部分的第一个元素交换位置
        int tmp = nums[i];
        nums[i] = nums[minIndex];
        nums[minIndex] = tmp;
        // 打印每次排序后的结果
        print(nums);
    }
}
```

### 算法分析

- 稳定性: 不稳定
- 时间复杂度: 最佳: O(n2) ,最差: O(n2), 平均: O(n2)
- 空间复杂度: O(1)
- 排序方式: In-place

## 插入排序(Insertion Sort)

> 插入排序是一种简单直观的排序算法
>
> 它的工作原理是通过构建有序序列,对于未排序数据,在已排序序列中从后向前扫描,找到相应位置并插入
>
> 插入排序在实现上,通常采用 in-place 排序(即只需用到 O(1) 的额外空间的排序),因而在从后向前扫描过程中,需要反复把已排序元素逐步向后挪位,为最新元素提供插入空间
>
> 插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴,但它的原理应该是最容易理解的了,因为只要打过扑克牌的人都应该能够秒懂
>
> 插入排序是一种最简单直观的排序算法,它的工作原理是通过构建有序序列,对于未排序数据,在已排序序列中从后向前扫描,找到相应位置并插入
>
> 插入排序和冒泡排序一样,也有一种优化算法,叫做拆半插入

### 算法步骤

1. 从第一个元素开始,该元素可以认为已经被排序
2. 取出下一个元素,在已经排序的元素序列中从后向前扫描
3. 如果该元素（已排序）大于新元素,将该元素移到下一位置
4. 重复步骤 3,直到找到已排序的元素小于或者等于新元素的位置
5. 将新元素插入到该位置后
6. 重复步骤 2~5

### 图解算法

![c86146955b30ec70c181638e3dd94f8b](https://assets.tsukikage7.com/blog/makrdownImages/c86146955b30ec70c181638e3dd94f8b.gif)


### 代码实现

```java
/**
 * 插入排序
 *
 * @param nums 待排序数组
 */
public static void InsertionSort(int[] nums) {
    // 从第二个元素开始遍历数组
    for (int i = 1; i < nums.length; i++) {
        // preIndex是待插入元素的前一个元素的索引
        int preIndex = i - 1;
        // current是待插入的元素
        int current = nums[i];
        // 当preIndex不小于0且待插入元素小于前一个元素时,将前一个元素后移一位
        while (preIndex >= 0 && current < nums[preIndex]) {
            nums[preIndex + 1] = nums[preIndex];
            preIndex--;
        }
        // 找到了待插入元素的位置,插入元素
        nums[preIndex + 1] = current;
    }
}
```

### 算法分析

- 稳定性: 稳定
- 时间复杂度: 最佳: O(n) ,最差: O(n2), 平均: O(n2)
- 空间复杂度: O(1)
- 排序方式: In-place

## 希尔排序(Shell Sort)

> 希尔排序是希尔 (Donald Shell) 于 1959 年提出的一种排序算法
>
> 希尔排序也是一种插入排序,它是简单插入排序经过改进之后的一个更高效的版本,也称为递减增量排序算法,同时该算法是冲破 O(n²) 的第一批算法之一
>
> 希尔排序的基本思想是: 先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序,待整个序列中的记录`基本有序`时,再对全体记录进行依次直接插入排序

### 算法步骤

我们来看下希尔排序的基本步骤,在此我们选择增量 gap=length/2,缩小增量继续以 gap = gap/2 的方式,这种增量选择我们可以用一个序列来表示,{n/2, (n/2)/2, ..., 1},称为增量序列。希尔排序的增量序列的选择与证明是个数学难题,我们选择的这个增量序列是比较常用的,也是希尔建议的增量,称为希尔增量,但其实这个增量序列不是最优的。此处我们做示例使用希尔增量

先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序,具体算法描述:

1. 选择一个增量序列 {t1, t2, …, tk},其中 (ti>tj, i<j, tk=1)
2. 按增量序列个数 k,对序列进行 k 趟排序
3. 每趟排序,根据对应的增量 t,将待排序列分割成若干长度为 m 的子序列,分别对各子表进行直接插入排序。仅增量因子为 1 时,整个序列作为一个表来处理,表长度即为整个序列的长度

### 图解算法

![2135ce7a536f4353ba1ca61597b9fc62](https://assets.tsukikage7.com/blog/makrdownImages/2135ce7a536f4353ba1ca61597b9fc62.gif)

### 代码实现

```java
/**
 * 希尔排序
 *
 * @param nums 待排序数组
 */
public static void ShellSort(int[] nums) {
    // 定义初始间隔为数组长度的一半
    int gap = nums.length / 2;
    // 当间隔大于0时,继续排序
    while (gap > 0) {
        // 从间隔位置开始,遍历数组
        for (int i = gap; i < nums.length; i++) {
            // preIndex是待插入元素的前一个元素的索引
            int preIndex = i - gap;
            // current是待插入的元素
            int current = nums[i];
            // 当preIndex不小于0且待插入元素小于前一个元素时,将前一个元素后移一位
            while (preIndex >= 0 && current < nums[preIndex]) {
                nums[preIndex + gap] = nums[preIndex];
                preIndex -= gap;
            }
            // 找到了待插入元素的位置,插入元素
            nums[preIndex + gap] = current;
        }
        // 更新间隔为原来的一半
        gap /= 2;
    }
}
```

### 算法分析

- 稳定性: 不稳定
- 时间复杂度: 最佳: O(nlogn), 最差: O(n2) 平均: O(nlogn)
- 空间复杂度: O(1)

## 归并排序 (Merge Sort)

> 归并排序是建立在归并操作上的一种有效的排序算法
>
> 该算法是采用分治法 (Divide and Conquer) 的一个非常典型的应用
>
> 归并排序是一种稳定的排序方法
>
> 将已有序的子序列合并,得到完全有序的序列
>
> 即先使每个子序列有序,再使子序列段间有序。若将两个有序表合并成一个有序表,称为 2 - 路归并
>
> 和选择排序一样,归并排序的性能不受输入数据的影响,但表现比选择排序好的多,因为始终都是 O(nlogn)的时间复杂度,代价是需要额外的内存空间

算法步骤
归并排序算法是一个递归过程,边界条件为当输入序列仅有一个元素时,直接返回,具体过程如下: 

1. 如果输入内只有一个元素,则直接返回,否则将长度为 n 的输入序列分成两个长度为 n/2 的子序列
2. 分别对这两个子序列进行归并排序,使子序列变为有序状态
3. 设定两个指针,分别指向两个已经排序子序列的起始位置
4. 比较两个指针所指向的元素,选择相对小的元素放入到合并空间（用于存放排序结果）,并移动指针到下一位置
5. 重复步骤 3~4 直到某一指针达到序列尾
6. 将另一序列剩下的所有元素直接复制到合并序列尾

### 图解算法

![merge_sort](https://assets.tsukikage7.com/blog/makrdownImages/merge_sort.gif)

### 代码实现

```java
/**
 * 归并排序
 * @param nums 待排序数组
 * @return 排序后数组
 */
public static int[] MergeSort(int[] nums) {
    // 如果数组长度小于等于1,直接返回
    if (nums.length <= 1) return nums;
    // 计算中间位置
    int middle = nums.length / 2;
    // 将数组分为两部分
    int[] nums1 = Arrays.copyOfRange(nums, 0, middle);
    int[] nums2 = Arrays.copyOfRange(nums, middle, nums.length);
    // 对两部分分别进行归并排序,然后合并结果
    return merge(MergeSort(nums1), MergeSort(nums2));
}

/**
 * 归并排序合并方法
 * @param nums1 合并有序数组1
 * @param nums2 合并有序数组 2
 * @return 合并后有序数组
 */
public static int[] merge(int[] nums1, int[] nums2) {
    // 创建一个新数组,长度为两个输入数组的长度之和
    int[] nums = new int[nums1.length + nums2.length];
    // 初始化三个指针,p指向新数组,p1和p2分别指向两个输入数组
    int p = 0, p1 = 0, p2 = 0;
    // 当两个输入数组都有元素时,比较当前元素,将较小的元素放入新数组
    while (p1 < nums1.length && p2 < nums2.length) {
        if (nums1[p1] < nums2[p2]) {
            nums[p] = nums1[p1];
            p1++;
        } else {
            nums[p] = nums2[p2];
            p2++;
        }
        p++;
    }
    // 如果第一个数组还有剩余元素,将它们复制到新数组
    if (p1 < nums1.length) {
        while (p1 < nums1.length) {
            nums[p] = nums1[p1];
            p1++;
            p++;
        }
    } 
    // 如果第二个数组还有剩余元素,将它们复制到新数组
    else {
        while (p2 < nums2.length) {
            nums[p] = nums2[p2];
            p2++;
            p++;
        }
    }

    // 返回新数组
    return nums;
}
```

### 算法分析

- 稳定性: 稳定
- 时间复杂度: 最佳: O(nlogn), 最差: O(nlogn), 平均: O(nlogn)
- 空间复杂度: O(n)

## 快速排序 (Quick Sort)

> 快速排序用到了`分治思想`,同样的还有归并排序
>
> 乍看起来快速排序和归并排序非常相似,都是将问题变小,先排序子串,最后合并
>
> 不同的是快速排序在划分子问题的时候经过多一步处理,将划分的两组数据划分为一大一小,这样在最后合并的时候就不必像归并排序那样再进行比较。但也正因为如此,划分的不定性使得快速排序的时间复杂度并不稳定
>
> 快速排序的基本思想: 通过一趟排序将待排序列分隔成独立的两部分,其中一部分记录的元素均比另一部分的元素小,则可分别对这两部分子序列继续进行排序,以达到整个序列有序

### 算法步骤

快速排序使用分治法open in new window（Divide and conquer）策略来把一个序列分为较小和较大的 2 个子序列,然后递回地排序两个子序列。具体算法描述如下: 

1. 从序列中随机挑出一个元素,做为`基准`(pivot)
2. 重新排列序列,将所有比基准值小的元素摆放在基准前面,所有比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个操作结束之后,该基准就处于数列的中间位置。这个称为分区（partition）操作
3. 递归地把小于基准值元素的子序列和大于基准值元素的子序列进行快速排序

### 算法图解

![random_quick_sort](https://assets.tsukikage7.com/blog/makrdownImages/random_quick_sort.gif)

### 代码实现

```java
```