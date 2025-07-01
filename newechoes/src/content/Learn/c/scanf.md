---
title: "scanf"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

接收键盘输入
scanf 的两种用法
例：

```c
**`原版**

#includ <stdio.h>
int main(){
int i = 10 ;
printf("i = %d\n , i"); //输出i 的数值
return 0 ;
}
`
```

```c
**`用scanf**

#includ <stdio.h>
int main(){
int i = 10 ;
scanf("%d\n , &i"); //&i 表示变量 i 的地址 &是取址符
printf("i = %d\n , i"); //输出i 的数值
return 0 ;
}`
```

```c
**多个数据类型**
`#includ <stdio.h>
int main(){
char a , b , c ;
scanf("%c%c%c" , &a ,&b , &c);
printf("a = %c , b = %c , c = %c\n " , a , b , c );
return 0;
}`
```

# 注在 scanf 中
scanf("%d%d\n" , &a,&b);
\n 也会被定义为要求输入的一位
比如：
%d 对应的 &a
%d 对应的 &b
\n 也被算为一个要求对应的，但是他并没有对应的数，即使输入了也不知道去哪了，但是不会报错可以运行
输入：12 ——对应 &a 这个数
输入：21——对应&b 这个数
输入：23——没有对应的数，但是不会报错
因为这个是%d%d\n,所以必须要输入三个
scanf( " %s" ， aa）;
输入字符的时候前面最好加一个空格，不加可能会出问题
