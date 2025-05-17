---
title: "form表单域"
date: 2024-10-06T19:08:00Z
tags: ["HTML+CSS"]
---

### form 表单域概述
`<form>` 标签用于创建 HTML 表单，它会把其范围内的数据提交给服务器。

### 代码示例
```html
<form action="demo.php" method="POST" name="userForm">
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username"><br>
    <label for="password">密码：</label>
    <input type="password" id="password" name="password"><br>
    <input type="submit" value="提交">
</form>
```

### 属性
- `action`：指定表单提交的地址。
- `method`：指定表单提交的方式，常用的有 `GET` 和 `POST`。
- `name`：指定表单的名称，用于标识表单。

### 注意事项
- `<form>` 标签内的 `<input>` 标签必须指定 `name` 属性，否则提交时无法获取数据。
- `<form>` 标签内的 `<input>` 标签必须指定 `type` 属性，否则无法识别输入类型。
- `<form>` 标签内的 `<input>` 标签必须指定 `value` 属性，否则提交时无法获取数据。
- `<form>` 标签内的 `<input>` 标签必须指定 `id` 属性，否则无法与 `<label>` 标签关联。
- `<form>` 标签内的 `<input>` 标签必须指定 `name` 属性，否则无法与 `<label>` 标签关联。