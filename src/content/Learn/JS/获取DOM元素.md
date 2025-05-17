---
title: "获取DOM元素"
date: 2024-10-06T19:08:00Z
tags: ["JS"]
---

## 单个选择

```js
<body>
  <div class="box">123</div>
</body>
let box = document.querySelector('div')
或
let box = document.querySelector('.box') //这里是 .box
comsole.log(box)
```

## 复合选择

```js
<p id = nav>123 </p>
const nav = document.querySelector('#nav')
<ul>
<li>123</li>
<li>456</li>
<li>789</li>
</ul>
const li = document.querySelector('ul li:first-child') //获取第一个li标签
//选择所有的li标签
const lis = document.querySelectorAll('ul li')//返回数组形式的对象的集合
```

## 直接修改样式

```js
<p id = nav>123 </p>
const nav = document.querySelector('#nav')
nav.style.color = 'red'
```

## 遍历元素

```js
<u class= navl>
<li>123</li>
<li>456</li>
<li>789</li>
</ul>
const lis =document.querySelectorAll(''.nav li")
for(let i = 0; i <lis.length; i++){
console.log(lis[i])
}
```

## 其他获取 DOM 元素的方法

```js
document.getElementById('nav')//根据ID获取元素
//以下是伪数组，是getElements
document.getElementsByTagName('div') //根据标签获取元素
document.getElementsByClassName('W') //根据类名获取元素
```
