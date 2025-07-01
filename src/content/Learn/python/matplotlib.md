---
title: "matplotlib"
date: 2024-10-06T19:08:00Z
tags: ["python"]
---

## 图形化

```python
import matplotlib.pyplot as plt
x = range(2,26,2)
y = [15,19,22,45,67,12,44,90,67,91,47,9]
plt.figure(figsize=(20,10),dpi=100)
plt.plot(x,y)
plt.savefig('try01.png')
plt.show()
```

```python
plt.figure(figsize=(图像的长,图像的宽),dpi=清晰度)
plt.figure(figsize=(20,10),dpi=100)

//保存图片
plt.savefig('try01.png')
```

```python
//设置x，y轴
plt.xticks(range(2,20))
plt.yticks(range(min(y),max(y)))
```

## rotation 旋转的度数
