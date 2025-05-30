---
title: "CSS继承"
date: 2024-10-06T19:08:00Z
tags: ["HTML+CSS"]
---

### CSS 继承概述
CSS 继承是指子元素会继承父元素的某些 CSS 属性。在设置字体、颜色等属性时，子元素如果没有特别指定，会使用父元素的属性值。

### 代码示例
```css
body {
    /* 在 / 后面加单位是指定行高，不加单位是所有子元素 × 倍数 */
    color: pink;
    font: 12px/1.5 'Microsoft YaHei';
    /* 或者可以这样写 */
    /* font: 12px/20px 'Microsoft YaHei'; */
}

div {
    font-size: 16px;
}
```

### 注意事项
1. CSS 继承只适用于某些特定的 CSS 属性，如字体、颜色、行高等。
2. CSS 继承不会传递给子元素的子元素，即子元素不会继承孙子元素的属性。
3. 可以使用 `inherit` 关键字显式地指定一个属性继承其父元素的值。