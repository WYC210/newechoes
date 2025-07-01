---
title: "this"
date: 2024-10-06T19:08:00Z
tags: ["JS"]
---
*解析器在调用函数每次都会向函数内部传递进一个隐含的参数，这个隐含的参数就是this，this指向的是一个对象，这个对象我们称为函数执行的上下文对象，根据函数的调用方式的不同，this会指向不同的对象*

- 以函数的形式调用时，this永远都是window

- 以方法的形式调用时，this就是调用方法的那个对象

 *案例演示：*
 ```js
//创建一个全局变量name
var name = "全局变量name";

//创建一个函数
function fun() {
    console.log(this.name);
}

//创建一个对象
var obj = {
    name: "孙悟空",
    sayName: fun
};

//我们希望调用obj.sayName()时可以输出obj的名字而不是全局变量name的名字
obj.sayName();
```


## 创键多个
```js
// 使用工厂模式创建对象
function createPerson(name, age) {
    // 创建新的对象
    var obj = new Object();
    // 设置对象属性
    obj.name = name;
    obj.age = age;
    // 设置对象方法
    obj.sayName = function () {
        console.log(this.name);
    };
    //返回新的对象
    return obj;
}

var person1 = createPerson("孙悟空", 18);
var person2 = createPerson("猪八戒", 19);
var person3 = createPerson("沙和尚", 20);

console.log(person1);
console.log(person2);
console.log(person3);
```

