---
title: "struct"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

在 C 语言中，`struct` 关键字用于自定义一种新的数据类型，称为结构体。结构体可以包含多个不同类型的成员，这些成员可以是标量、数组、指针，甚至是其他结构体。

#### 结构体定义和初始化示例
```c
#include <stdio.h>

// 定义一个名为 Stu 的结构体类型
struct Stu {
    // 成员变量
    char name[20];
    int age;
    char sex[20];
    char tele[12];
};

int main() {
    // 初始化结构体变量
    struct Stu s = {"laoshuren", 20, "woermagouwudai", "66666666"};
    // 输出结构体成员的值
    printf("%s, %d, %s, %s\n", s.name, s.age, s.sex, s.tele);
    return 0;
}
```

#### 结构体数组示例
```c
#include <stdio.h>

// 定义一个名为 Stu 的结构体类型
struct Stu {
    // 成员变量
    char name[20];
    int age;
    char sex[20];
    char tele[12];
};

int main() {
    // 定义一个结构体数组
    struct Stu students[3] = {
        {"laoshuren", 20, "woermagouwudai", "66666666"},
        {"xiaohong", 18, "nv", "123456789"},
        {"xiaoming", 19, "nan", "987654321"}
    };

    // 输出结构体数组中每个结构体的成员值
    for (int i = 0; i < 3; i++) {
        printf("%s, %d, %s, %s\n", students[i].name, students[i].age, students[i].sex, students[i].tele);
    }

    return 0;
        }
```
