---
title: "extern"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

extern 是调用外部文件的命令
基本用法：

```c
//源文件
#include <stdio.h>
#include "try12.h"int main(){
    int a ;
    int b ;
    printf("输入你想要求和的两个数");
    scanf("%d%d" , &a , &b );
    int z = Add(a,b);
    printf("计算的结果为： " ,  z);
    ststem("pause");
}


```

//被调用文件

```c
extern int Add( int x , int y){

    int z = x+y ;

    return z;
}
```

**特别注意，被调用文件的文件后缀不是.c 格式，是.h 格式**


