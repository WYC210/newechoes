---
title: "Clion"
date: 2025-03-28T19:34:41+08:00
tags: ["编译器"]
---

注意
本教程适用于 JetBrains 全系列产品，包括 Clion、IDEA、WebStorm、Phpstorm、Clion、RubyMine、CLion、AppCode 等。
本教程适用 Windows/Mac/Linux 系统，文中以 Windows 系统为例做讲解，其他系统按照教程顺序即可。

第一步: 下载最新的 Clion 2023.2 版本安装包
我们先从 Clion 官网下载 Clion 2023.2 版本的安装包，下载链接如下：
官网:https://www.jetbrains.com/clion/

第二步：卸载老版本 Clion
注意： 若机器上安装了老版本 Clion 就先卸载，没有安装过的话，则跳过看下面步骤

如果之前有安装过老版本 Clion, 需要先彻底卸载，以免两者冲突，导致破解失败。

第三步: 开始安装 Clion 2023.2 版本
1. 安装包下载好后，双击安装包，即可开始安装 Clion 2023.2 版本，点击【Next】按钮进入下一步
2. 安装目录任意
3. Create Desktop Shortaut:DcLion 勾选上是为创建桌面图标,其他默认
Add launchers dir to the PATH 勾上是为添加环境变量
4. 安装完成后，勾选 Run Clion，点击 Finish 运行软件
5. Clion 运行成功后，首先会弹出如下对话框，勾选默认的 Do not import settings 不导入任何配置，然后点击exit

第四步：开始破解
破解文件:https://lsy22.lanzouj.com/iVpse1dnvbrc

解压破解文件
将上面图示的补丁的所属文件夹 /jetbra 复制电脑某个位置

注意：补丁所属文件夹需单独存放，且放置的路径不要有中文与空格，以免 Clion 读取补丁错误。
Windows 系统
<br/>
点击进入 /jetbra 补丁目录，再点击进入 /scripts 文件夹，双击执行install-all-users.vbs破解脚本
会提示安装补丁需要等待数秒。点击【确定】按钮后，过程大概 10 - 30 秒，如看到弹框提示 Done 时，表示成功
再执行install-current-user.vbs破解脚本
会提示安装补丁需要等待数秒。点击【确定】按钮后，过程大概 10 - 30 秒，如看到弹框提示 Done 时，表示成功

两个脚本都执行完代表成功

Mac / Linux 系统
<br/>
Mac / Linux 系统与上面 Windows 系统一样，需将补丁所属文件 /jetbra 复制到某个路径，且路径不能包含空格与中文，之后，打开终端，进入到 /jetbra/scripts 文件夹， 执行 install.sh 脚本, 命令如下：

sudo bash install.sh
看到提示 Done , 表示激活成功。

第六步：打开 Clion, 填入指定激活码完成激活
重启 Clion 后，复制下面的激活码：

```typescript
  GSSXZEZ56G-eyJsaWNlbnNlSWQiOiJHU1NYWkVaNTZHIiwibGljZW5zZWVOYW1lIjoic2lnbnVwIHNjb290ZXIiLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJQU0kiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IlBTVyIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUFdTIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJDTCIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6ZmFsc2V9LHsiY29kZSI6IlBDV01QIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfV0sIm1ldGFkYXRhIjoiMDEyMDIyMDkwMlBTQU4wMDAwMDUiLCJoYXNoIjoiVFJJQUw6NTM5ODE5MDIyIiwiZ3JhY2VQZXJpb2REYXlzIjo3LCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-iAUL9c89hA+oXgFAajsV9QyCOVsENJGkZiGQvW7XKaJID5XtXbxU4iBdMPaiJE1B8dZJy27Vt1WJjin+oQtnSC47t0MCx61vPOBGk/KAvEBoi6d8mfP5u729g0GHva3nPXsY3+IbnsWm7SIsB0syvtr1VRmqt7tBKm2F6gRn4Z8SnvkoQuyrvtZN8juJBEz3hYGHH4h+jpMnAYjXZ0M92WaD4aIvtGazp41f4/FuXW6IcSHTwualWVHuvS95fuxxAwpbyxPyYLom1Uh/la6kY9+zi3R5Z1amOHEOCyZnSoFDcMeKF3yhQU6/AjYiT/fOfICNcaK/BHYZ0VFMI8zOQA==-MIIETDCCAjSgAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTIwMTAxOTA5MDU1M1oXDTIyMTAyMTA5MDU1M1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyMDEwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUlaUFc1wf+CfY9wzFWEL2euKQ5nswqb57V8QZG7d7RoR6rwYUIXseTOAFq210oMEe++LCjzKDuqwDfsyhgDNTgZBPAaC4vUU2oy+XR+Fq8nBixWIsH668HeOnRK6RRhsr0rJzRB95aZ3EAPzBuQ2qPaNGm17pAX0Rd6MPRgjp75IWwI9eA6aMEdPQEVN7uyOtM5zSsjoj79Lbu1fjShOnQZuJcsV8tqnayeFkNzv2LTOlofU/Tbx502Ro073gGjoeRzNvrynAP03pL486P3KCAyiNPhDs2z8/COMrxRlZW5mfzo0xsK0dQGNH3UoG/9RVwHG4eS8LFpMTR9oetHZBAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUJNoRIpb1hUHAk0foMSNM9MCEAv8wSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBABqRoNGxAQct9dQUFK8xqhiZaYPd30TlmCmSAaGJ0eBpvkVeqA2jGYhAQRqFiAlFC63JKvWvRZO1iRuWCEfUMkdqQ9VQPXziE/BlsOIgrL6RlJfuFcEZ8TK3syIfIGQZNCxYhLLUuet2HE6LJYPQ5c0jH4kDooRpcVZ4rBxNwddpctUO2te9UU5/FjhioZQsPvd92qOTsV+8Cyl2fvNhNKD1Uu9ff5AkVIQn4JU23ozdB/R5oUlebwaTE6WZNBs+TA/qPj+5/we9NH71WRB0hqUoLI2AKKyiPw++FtN4Su1vsdDlrAzDj9ILjpjJKA1ImuVcG329/WTYIKysZ1CWK3zATg9BeCUPAV1pQy8ToXOq+RSYen6winZ2OO93eyHv2Iw5kbn1dqfBw1BuTE29V2FJKicJSu8iEOpfoafwJISXmz1wnnWL3V/0NxTulfWsXugOoLfv0ZIBP1xH9kmf22jjQ2JiHhQZP7ZDsreRrOeIQ/c4yR8IQvMLfC0WKQqrHu5ZzXTH4NO3CwGWSlTY74kE91zXB5mwWAx1jig+UXYc2w4RkVhy0//lOmVya/PEepuuTTI4+UJwC7qbVlh5zfhj8oTNUXgN0AOc+Q0/WFPl1aw5VV/VrO8FCoB15lFVlpKaQ1Yh+DVU8ke+rt9Th0BCHXe0uZOEmH0nOnH/0onD

```

粘贴激活码到输入框，点击 Activate 按钮完成激活

其他
设置中文
在plugins搜索Chinese ​(Simplified)​

写多个源文件不能运行
修改CMakeLists.txt文件

```typescript
 cmake_minimum_required(VERSION 3.26)
project(CWorks C)

# 使用此CMakeList时，若要新建C语言文件，请按照以下步骤：
# 1. 右键根目录——新建——C/C++源文件
# 2. 在弹出的对话框中，输入文件名(英文小写及下划线)，后缀为 ".c"，不要勾选“添加到目标”，点击确定。
# 3. 点击 左上角横线——文件——重新加载CMake项目 。
# 23为设定的C语言版本
set(CMAKE_C_STANDARD 23)

# 设定构建运行路径，避免污染根目录
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/.archive)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/.library)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/.runtime)
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR}/.path)

# 遍历项目根目录下所有的 .c 文件，自动添加
file(GLOB_RECURSE files *.c **/*.c)
foreach (file ${files})
    string(REGEX REPLACE ".+/(.+)\\..*" "\\1" exe ${file})
    add_executable(${exe} ${file})
    message(\ \ \ \ --\ \[${exe}.c\]\ will be compiled to \'.runtime/exe/${exe}.exe\')
    set_target_properties(${exe} PROPERTIES
            RUNTIME_OUTPUT_DIRECTORY "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/exe")
endforeach ()

```


中文乱码
<br/>
方法一:更换windows默认编码

Windows11 部分程序中文乱码解决方案[通用解决Windows10]

首先,打开控制面板.找到时钟和区域.选择区域.打开管理.选择非Unicode程序的语言.更改系统区域设置为中国.(...

方法二:设置GBK编码

1. 设置GKB编码

编辑器——文件编码
将全局编码和项目编码和属性文件的默认编码都设置为GBK

2. 打开外部外部控制台

调试右边三个点——编辑——开启在外部控制台中运行

更换快捷键
设置——按键映射——其他

printf出现format提示
编辑器——嵌入提示——将形参名称关闭

恢复默认设置
双击 shift -> 输入 Restore default settings

重启后无法运行
打开破解文件,先卸载,再安装
