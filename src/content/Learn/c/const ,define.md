---
title: "const ,define"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

const : 修饰的常变量
//在 C 语言中，const 修饰的 a ， 本质是变量，但是不能直接修改，有常量的属性。

```c
const int a = 10 ;
define： 定义的标识符常量
#define NUM 100
后面不用加；
#define ADD(X,Y) ((X) + (Y))
int main(){
int a = 10;
int b = 10;
int c = ADD(a,b);
printf("%d\n"， c);//输出的是A+B

}
```
