---
title: "this"
date: 2024-10-06T19:08:00Z
tags: ["java"]
---

this 关键字用于区分局部变量和实例变量

## 如果局部变量的名称与实例变量的名称相同，那么使用 this 关键字可以区分它们

```
public class Person {
private String name;
private int age;

public Person(String name, int age) {
    this.name = name;
    this.age = age;
}

public void printInfo() {
    System.out.println("Name: " + this.name);
    System.out.println("Age: " + this.age);
}
}
```
