---
title: "全局声明 "
date: 2024-10-06T19:08:00Z
tags: ["python"]
---

# global声明全局变量
```python
num =10
def aa():
	num += 10
	#此时会出问题，虽然外面声明了全局变量但是没有加global关键词所以他们的名字虽然相同但是指向的并不是同一块空间
	global num += 10 此时有global的声明才是跟外面的num全局变量一样
```