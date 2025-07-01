---
title: "typeof"
date: 2024-10-06T19:08:00Z
tags: ["JS"]
---
console.log(typeof 123);
console.log(typeof "Hello,World!");
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);

查看变量/常量是什么数据类型

## Undefined 类型
在使用 var 声明变量但未对其加以初始化时，这个变量的值就是 undefined。

注意：使用typeof对没有初始化和没有声明的变量，会返回“undefined”。

## Boolean 类型

0 假 1 真

## Null 类型

Null 类型是第二个只有一个值的数据类型，这个特殊的值是 null。

undefined值实际上是由null值衍生出来的，所以如果比较undefined和null是否相等，会返回true。

注意：从语义上看null表示的是一个空的对象，所以使用typeof检查null会返回一个Object。