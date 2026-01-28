---
title: "BS4"
date: 2024-10-06T19:08:00Z
tags: ["python"]
---

# BeautifulSoup 基础

`bs4` 用于解析 HTML，常见用法如下：

## 常用方法

- `find()`：返回第一个匹配的标签
- `find_all()`：返回所有匹配标签
- `attrs`：获取标签属性字典

## 示例

```python
from bs4 import BeautifulSoup

html = "<a class='a1' href='https://example.com'>link</a>"
soup = BeautifulSoup(html, "html.parser")

soup.find("a")
soup.find_all("a")
soup.find("a", class_="a1")
soup.find_all("li", limit=2)
soup.a.attrs
soup.a.get("href")
```
