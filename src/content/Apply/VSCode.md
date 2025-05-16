---
title: "VSCode"
date: 2025-03-28T19:34:41+08:00
tags: ["编译器"]
---

## 一.VSCode 配置 C/C++环境

1. 下载 Microsoft vsCode（注：stable 是稳定版本；insider 是内部测试版本，可能会出问题，建议选 stable）
   vsCode 官网下载:https://code.visualstudio.com/
2. 安装 vsCode

{cat_tips_info"}必须选：添加到 path(重启后生效)
其他看个人习惯
注意，这里安装路径最好是全英文的，不要创建中文文件夹。另外最好不要放在 c 盘{/cat_tips_info} 3.安装 vscode 插件

{cat_tips_info"}1.在打开应用后左侧有七个选项选择第五个个选项点击打开(或按 ctrl+shift+x) 2.在打开的选项卡中有个搜索框在里面搜索 C/C++点击 Install 接着搜索 chinese 会显示简体中文的选项在右下角点击 Install 3.此时右下角会提示"Would you ike to change Vsal Sudio Codes dsplay languageto Chinese Simplid and rstart?”选择右下角用蓝色标注的'Change LanquageandRestart' 4.之后便会自动重启该软件(此时中文就设置好了){/cat_tips_info}

## 二.安装 MinGW-w64

C/C++的编译器有很多种，大家可自行选择，但网上大部分人都用的 MinGW-w64，故以此编译器为例
https://sourceforge.net/projects/mingw-w64/files/mingw-w64/mingw-w64-release/
下载压缩包
推荐安装 ×86_64-posix-sjlj(在最底下)

{cat_tips_error"}x86 64 是 64 位系统用的版本
i686 是 32 版本
seh 结尾是纯 64 位编译
sjj 结尾是 32 64 两种编译，需加-m32 或-m64 参数
posix 通常用于跨平台，比 win32 兼容性好一些
不懂的可以安装 x86 64-posix-sjlj{/cat_tips_error}

```typescript
我的将MinGW-w64下载好放在Microsoft VS Code根目录下路径为:D:\Program
Files\Microsoft VS Code\mingw64
```

2.设置系统环境变量

{cat_tips_success"}右击“此电脑”——“属性”——“高级系统设置”——“环境变量”——找到“系统变量”中的“Path”条目——“编辑”——“新建”——将你的 MinGW-w64 下载路径复制到新条目中(格式形如 D:\Microsoft VS Code\mingw64\bin，一定要写到 bin 这个文件夹)——完成{/cat_tips_success}

## 三.设置 vscode 里的环境

1.配置编译器(生成 c_cpp_properties.json 文件)

-Ⅰ.在电脑中创建一个未来用于存放代码的文件夹(用英文命名)，随后打开 vscode，点击“打开文件夹”，从而在 vscode 内打开该文件夹
-Ⅱ.按下快捷键 shift+ctrl+p，展示全局命令面板，搜索找到 C/C++ Edit Configurations(UI)
点击该条目，进入如下画面，看左侧栏目可发现程序自动在我们存代码的文件夹下建立了一个“.vscode”文件夹(这个文件夹非常重要，后续的配置都是在它内部建立文件的)
配置“编译器路径”(写自己的编译器下载路径加 gcc.exe),我的路径是:D:\Microsoft VS Code\mingw64\bin\gcc.exe
“IntelliSense 模式”设为：windows-gcc-x64
设置完成后该文件夹下出现.vscode 这个文件夹,.vscode 文件夹下出现文件 c_cpp_properties.json
{/cat_tips_info} 2.配置构建任务(生成 tasks.json 文件)

-Ⅰ.点击“文件——新建文件”，输入一段简单的测试代码(我们会发现代码明明没错却被划上了曲线，这是因为配置还没完成，暂时不用管)，随后按 ctrl+s 保存(一定要保存，否则无法进行后续操作)，注意要保存为.c 格式而不是默认的.txt
-Ⅱ.运行刚刚的文件,会报错,.vscode 这个文件夹生成 tasks.json 文件就成功了{/cat_tips_success} 3.配置调试设置(生成 launch.json 文件)

回到测试代码界面，点击右上角小齿轮再选择“g++.exe - 生成和调试活动文件"，此时会出现一个名为 launch.json 的配置文件{/cat_tips_info} 4.测试是否成功
创建一个文件夹放项目，项目名可以为 helloWorld.c，然后按 F5 运行

```typescript
#include
<stdio.h>
  #include
  <windows.h>
    int main() { printf("Hello World\n"); system("pause"); return 0;
    }</windows.h
  ></stdio.h
>
```

## 四.问题

启用 cmd 控制台
把 launch.json 文件中"externalConsole"项目的值改为 true，就能看到外部控制台了(默认是 false，使用集成控制台)

启用 cmd 控制台,运行文件一闪而过
方法一:在代码最后一段加上命令集合中的暂停命令
system("pause");或者 getchar();

断点调试
开启 debug 模式
如果你 launch.json 文件中 stopAtEntry 这一字段的值没有改成 true，建议至少在 main 函数第一行添加一个（不然程序就会像第一次调试一样直接一骨碌执行完就退出了）头部文件

终端输出的中文为乱码 1.首先打开文件-首选项-设置 2.在设置中搜索 encoding 3.设置编码方式为 Simplifed Chinese(GBK)
之后我们在 VScode 中新建的文件就会默认为 GBK 编码了，和 cmd 的默认编码方式一样。这样就能避免中文乱码的问题了

## 我们要安装的图像库为 EasyX

EasyX ([官网地址](https://easyx.cn/download/EasyX_2023%E5%A4%A7%E6%9A%91%E7%89%88.exe))（[百度网盘](链接：https://pan.baidu.com/s/1zgWkyrpRs-t_DP_Ls9dRJg?pwd=easy)提取码：easy）
安装以后他会自动识别你已安装的编程软件，例如:Visual Studio 2022 点击安装即可
