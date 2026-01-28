---
title: "Java Stream 常用操作"
date: 2026-01-28T12:13:18+08:00
tags: ["java"]
---

# Java Stream 常用操作

## 准备工作

```java
import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
    private Long id;         // 用户ID
    private String name;     // 用户名
    private Integer age;     // 年龄
    private String city;     // 城市
    private Double salary;   // 工资
}
```

```java
List<User> userList = Arrays.asList(
    new User(1L, "张三", 22, "北京", 8000.0),
    new User(2L, "李四", 35, "上海", 15000.0),
    new User(3L, "王五", 28, "北京", 10000.0),
    new User(4L, "赵六", 40, "上海", 20000.0),
    new User(5L, "钱七", 25, "广州", 9000.0),
    new User(6L, "孙八", 30, "北京", 12000.0),
    new User(7L, "周九", null, "深圳", 7000.0) // 年龄为 null，测试空值处理
);
```

## 常见操作

### 1. 筛选「北京的用户且年龄 > 25」

```java
List<User> beijingUsers = userList.stream()
    .filter(user -> user.getAge() != null)
    .filter(user -> user.getAge() > 25 && "北京".equals(user.getCity()))
    .collect(Collectors.toList());
```

### 2. 提取所有用户名并转为大写

```java
List<String> names = userList.stream()
    .map(User::getName)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

### 3. 提取所有非空年龄并求和

```java
int ageSum = userList.stream()
    .map(User::getAge)
    .filter(Objects::nonNull)
    .mapToInt(Integer::intValue)
    .sum();
```

### 4. 判断是否存在「上海的用户且工资 > 18000」

```java
boolean exists = userList.stream()
    .anyMatch(user -> "上海".equals(user.getCity())
        && user.getSalary() != null
        && user.getSalary() > 18000);
```

### 5. 判断所有用户工资是否都 > 6000

```java
boolean allHigh = userList.stream()
    .allMatch(user -> user.getSalary() != null && user.getSalary() > 6000);
```

### 6. 判断是否没有「广州的用户且年龄 > 30」

```java
boolean none = userList.stream()
    .noneMatch(user -> "广州".equals(user.getCity())
        && user.getAge() != null
        && user.getAge() > 30);
```

### 7. 找到第一个「北京的用户」（无则返回 null）

```java
User firstBeijing = userList.stream()
    .filter(user -> "北京".equals(user.getCity()))
    .findFirst()
    .orElse(null);
```

### 8. 并行流查找任意一个

```java
User anyBeijing = userList.parallelStream()
    .filter(user -> "北京".equals(user.getCity()))
    .findAny()
    .orElse(null);
```

### 9. 按「城市」分组

```java
Map<String, List<User>> cityMap = userList.stream()
    .collect(Collectors.groupingBy(User::getCity));
```

### 10. 分组后统计数量

```java
Map<String, Long> cityCount = userList.stream()
    .collect(Collectors.groupingBy(User::getCity, Collectors.counting()));
```

### 11. 按「工资从高到低」排序，工资相同按年龄从小到大

```java
List<User> sorted = userList.stream()
    .sorted(Comparator.comparing(User::getSalary,
            Comparator.nullsLast(Comparator.reverseOrder()))
        .thenComparing(User::getAge, Comparator.nullsLast(Comparator.naturalOrder())))
    .collect(Collectors.toList());
```

### 12. 提取所有城市，去重后取前 3 个（跳过第一个）

```java
List<String> cities = userList.stream()
    .map(User::getCity)
    .distinct()
    .skip(1)
    .limit(3)
    .collect(Collectors.toList());
```

### 13. 计算所有用户工资总和

```java
double totalSalary = userList.stream()
    .map(User::getSalary)
    .filter(Objects::nonNull)
    .reduce(0.0, Double::sum);
```

### 14. 找到工资最高的用户

```java
User maxSalaryUser = userList.stream()
    .filter(user -> user.getSalary() != null)
    .max(Comparator.comparing(User::getSalary))
    .orElse(null);
```
