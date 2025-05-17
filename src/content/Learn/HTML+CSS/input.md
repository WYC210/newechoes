---
title: "input"
date: 2024-10-06T19:08:00Z
tags: ["HTML+CSS"]
---

### 表单元素 - input 标签
`<input>` 标签是 HTML 中常用的表单元素，用于创建各种输入字段。

#### 文本输入框
```html
<input type='text' name="username" value="请输入用户名" maxlength="20" placeholder="请输入用户名">

```
- `type`：指定输入字段的类型，如文本输入框、密码输入框等。
- `name`：指定输入字段的名称，用于在提交表单时标识该输入字段。
- `value`：指定输入字段的默认值。
- `maxlength`：指定输入字段的最大字符数。
- `placeholder`：指定输入字段的占位符文本，当输入字段为空时显示。

#### 密码输入框
```html
<input type='password' name="password" placeholder="请输入密码">
```
- `type`：指定输入字段的类型为密码输入框。
- `name`：指定输入字段的名称。
- `placeholder`：指定输入字段的占位符文本。

#### 单选按钮
```html
<input type='radio' name="gender" value="male" checked> 男
<input type='radio' name="gender" value="female"> 女
```
- `type`：指定输入字段的类型为单选按钮。
- `name`：指定输入字段的名称，具有相同名称的单选按钮为一组。
- `value`：指定单选按钮的值。
- `checked`：指定默认选中的单选按钮。

#### 复选框
```html
<input type='checkbox' name="hobby" value="reading"> 阅读
<input type='checkbox' name="hobby" value="music"> 音乐
<input type='checkbox' name="hobby" value="sports"> 运动
```
- `type`：指定输入字段的类型为复选框。
- `name`：指定输入字段的名称。
- `value`：指定复选框的值。

#### 下拉列表
```html
<select name="city">
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
  <option value="guangzhou">广州</option>
</select>
```
- `name`：指定下拉列表的名称。
- `<option>`：定义下拉列表的选项。
- `value`：指定选项的值。
- `selected`：指定默认选中的选项。

#### 文件上传
```html
<input type='file' name="file">
```
- `type`：指定输入字段的类型为文件上传。
- `name`：指定输入字段的名称。

