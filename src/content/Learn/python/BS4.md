---
title: "BS4"
date: 2024-10-06T19:08:00Z
tags: ["python"]
---

attrs 获取标签的属性和属性值
soup.a.attrs
find 返回第一个符合的数据
soup.find('a//标签')
soup.find*all('a') //查找所有的 a 标签
根据 class 查找
soup.find('a' , class* = 'a1')
soup.find_all 如果要获取多个数据需要在里面写成列表
soup.find('li' , limit = 2)//limit 是获取前几个数据
