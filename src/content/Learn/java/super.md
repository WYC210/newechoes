---
title: "super"
date: 2024-10-06T19:08:00Z
tags: ["java"]
---


### `super`

`super` 关键字用于引用父类的成员（变量、方法或构造函数）。

```java
// SuperExample.java
class Parent {
    String name;

    public Parent(String name) {
        this.name = name;
    }

    public void printName() {
        System.out.println("Parent name: " + name);
    }
}

class Child extends Parent {
    String childName;

    public Child(String parentName, String childName) {
        // 调用父类的构造函数
        super(parentName);
        this.childName = childName;
    }

    public void printAllNames() {
        // 调用父类的方法
        super.printName();
        System.out.println("Child name: " + childName);
    }
}

public class SuperExample {
    public static void main(String[] args) {
        Child child = new Child("John", "Tom");
        child.printAllNames();
    }
}
```

输出结果：

```
Parent name: John
Child name: Tom
```

在上面的例子中，`Child` 类继承了 `Parent` 类，并使用 `super` 关键字调用了父类的构造函数和 `printName` 方法。