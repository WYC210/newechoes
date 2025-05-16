---
title: "IDEA"
date: 2025-03-28T19:34:41+08:00
tags: ["编译器"]
---

idea下载链接：https://www.jetbrains.com/zh-cn/idea/download/?section=windows
## 安装IDEA ##

安装时根据自己的系统来选择
32-bit launcher

64-bit launcher

查看自己电脑系统是多少位

右键此电脑——属性——查看自己的电脑位数

下载官网.exe文件选择下载路径我下载到D:\app\tool\IntelliJ IDEA 2023.3.2
下一步——>创建快捷方式——>安装->选择运行 IDEA ——> 完成
会弹出一个导入配置的对话框，选择 Do not import settings 即可

然后前往下载破解补丁
补丁网盘链接:
链接：https://pan.baidu.com/s/1wIHDnxbNBruUCwjqezV3hg?pwd=yt91 
提取码：yt91 

备用链接:
链接：https://pan.baidu.com/s/1HeS1O_EKR9YI2ledlrYbIA?pwd=558l 
提取码：558l 

无限速蓝奏云网盘链接：https://wwz.lanzoul.com/iU4pm1d7fwxc

备用链接2：链接：https://pan.baidu.com/s/1WGgVavPrQx2sFNzQ3vwivg?pwd=IDEA 
提取码：IDEA
注意： 补丁所属文件夹需单独存放，且放置的路径不要有中文与空格，以免 IDEA 读取补丁错误。
点击进入 `/jetbra` 补丁目录，再点击进入`/scripts` 文件夹，双击执行 `install-current-user.vbs` 破解脚本：
注意：如果执行脚本被安全软件提示有风险拦截，允许执行即可。
会提示安装补丁需要等待数秒。点击【确定】按钮后，过程大概 10 - 30 秒，如看到弹框提示 `Done `时，表示激活破解成功：
Mac / Linux 系统
Mac / Linux 系统与上面 Windows 系统一样，需将补丁所属文件 /jetbra 复制到某个路径，且路径不能包含空格与中文。

之后，打开终端，进入到 /jetbra/scripts 文件夹， 执行 install.sh 脚本, 命令如下：

```typescript
  sudo bash install.sh
```
Windows 用户执行脚本后，脚本会自动在环境变量 -> 用户变量下添加了 IDEA_VM_OPTIONS 变量，变量值为 /jetbra 文件夹下的 .vmoptions 参数文件绝对路径，然后，脚本自动在 idea.vmoptions 文件中引用了破解补丁 
Mac / Linux 用户执行脚本后，脚本会自动在当期用户环境变量文件中添加了相关参数文件，Mac / Linux 需重启系统，以确保环境变量生效。

重启 IDEA
====
脚本执行成功后，一定要重启 IDEA ~~
脚本执行成功后，一定要重启 IDEA ~~
脚本执行成功后，一定要重启 IDEA ~~

第七步：填入指定激活码完成激活
====

```typescript
    6G5NXCPJZB-eyJsaWNlbnNlSWQiOiI2RzVOWENQSlpCIiwibGljZW5zZWVOYW1lIjoic2lnbnVwIHNjb290ZXIiLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJQU0kiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBEQiIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiSUkiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOmZhbHNlfSx7ImNvZGUiOiJQUEMiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBHTyIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFNXIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQV1MiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBQUyIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFJCIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0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
```
然后你就成功激活了

注意！！！
====
破解以后不要更新IDEA也不要移动破解文件，因为破解文件生成的是相对路径

## 配置运行环境 ##
下载 JDK :][官方链接](https://www.oracle.com/cn/java/technologies/downloads/)[百度网盘](https://pan.baidu.com/s/1yxW23tcJPVEXhYyAP-GYnQ?pwd=jdk8)
找到java8——选择windows——jdk-8u381-windows-x64.exe(x86为32位系统，x64为64位系统)

我更改的下载路径为 D:\app\tool\JDK8

在安装JDK时，会弹出另一个安装窗口，让你安装JRE(可安装可不安装)

我安装到了 D:\app\tool\JRE
## 配置Path ##
找到上面安装的JDK其中的biin路径D:\app\tool\JRE\bin 复制下来

我的电脑——属性——高级系统设置——环境变量 （也可直接按WIN 搜索环境变量）——用户变量中新建

变量名： JAVA_HOME（必须大写）

变量值：D:\app\tool\JRE\bin

我的电脑——属性——高级系统设置——环境变量 （也可直接按WIN 搜索环境变量）——用户变量中Path——编辑——新建

```typescript
   %JAVA_HOME%\bin
```
## 检测是否配置成功 ##
输入

```typescript
    javac
javac -version
```


出现一堆代码 和显示版本号则代表配置成功


