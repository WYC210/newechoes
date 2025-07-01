---
title: "final"
date: 2024-10-06T19:08:00Z
tags: ["java"]
---



### `final` 



`final` 关键字可以用于修饰类、方法和变量：
- **类**：不能被继承
- **方法**：不能被重写
- **变量**：一旦赋值，不能再修改（常量）

```java
// FinalExample.java
// 最终类，不能被继承
final class FinalClass {
    // 最终变量，必须初始化，且不能再改变
    final int finalVariable = 10;

    // 最终方法，不能被重写
    public final void finalMethod() {
        System.out.println("Final method called.");
    }
}

public class FinalExample {
    public static void main(String[] args) {
        FinalClass fc = new FinalClass();
        System.out.println("Final variable: " + fc.finalVariable);
        fc.finalMethod();
    }
}
```