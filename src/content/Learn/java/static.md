---
title: "static"
date: 2024-10-06T19:08:00Z
tags: ["java"]
---

# static

`static` 关键字用于创建类的静态成员，静态成员属于类本身，而不是类的实例。

```java
// StaticExample.java
public class StaticExample {
    // 静态变量
    static int staticVariable = 0;
    // 实例变量
    int instanceVariable = 0;

    // 静态方法
    public static void staticMethod() {
        staticVariable++;
        System.out.println("Static variable: " + staticVariable);
    }

    // 实例方法
    public void instanceMethod() {
        instanceVariable++;
        System.out.println("Instance variable: " + instanceVariable);
    }

    public static void main(String[] args) {
        // 调用静态方法
        StaticExample.staticMethod();

        // 创建实例
        StaticExample obj1 = new StaticExample();
        StaticExample obj2 = new StaticExample();

        // 调用实例方法
        obj1.instanceMethod();
        obj2.instanceMethod();
    }
}
```

输出结果：

```
Static variable: 1
Instance variable: 1
Instance variable: 2
```

在这个例子中，`staticVariable` 是一个静态变量，它属于 `StaticExample` 类本身，而不是类的实例。因此，无论创建多少个 `StaticExample` 对象，`staticVariable` 都只有一个副本。

`staticMethod` 是一个静态方法，它可以直接通过类名调用，而不需要创建类的实例。在 `main` 方法中，我们直接使用 `StaticExample.staticMethod()` 调用了静态方法。
