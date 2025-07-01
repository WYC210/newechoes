---
title: "全局配置-tabBar"
date: 2024-10-06T19:08:00Z
tags: ["wechatApp"]
---

全局配置-tabBar

4.每个 tab 项的配置选项
属性
pagePath : String [必填] : 页面路径，页面必须在 pages 中预先定义
text : String [必填] : tab 上显示的文字
iconPath : String [非必填] : 未选中时的图标路径;当 postion 为 top 时，不显示 icon
selectedlconPath : String [非必填] ：选中时的图标路径;当 postion 为 top 时，显示 icon

3.页面配置中常用的配置项
属性
navigationBarBackgroundColor:HexColor[#000000 只能填二进制符号] 当前页面导航栏背景颜色，如 #000000
navigationBarTextStyle:String [white] 当前页面导航栏标题颜色，仅支持 black/white
navigationBarTitleText : String [无] 当前页面导航栏标题文字内容
backgroundColor :HexColor [#ffffff] 当前页面窗口的背景色
backgroundTextStyle: String [dark] 当前页面下拉 loading 的样式，仅支持 dark/light
enablePullDownRefresh:Boolean [false] 是否为当前页面开启下拉刷新的效果
onReachBottomDistance:Number [50] 页面上拉触底事件触发时距页面底部距离，单位为 pX
