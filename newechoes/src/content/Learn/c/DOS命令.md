---
title: "DOS命令"
date: 2024-10-06T19:08:00Z
tags: ["c"]
---

在 C 语言中，可以使用 `system` 函数来执行 DOS 命令，从而调用系统的一些应用程序。

#### 常见 DOS 命令调用示例
```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 打开计算器
    system("calc"); 
    // 打开记事本
    system("notepad"); 
    // 打开画图板
    system("mspaint"); 
    // 打开指定路径的应用程序
    system("D:/ps/ps.exe"); 
    return 0;
}
```
#### 常见 DOS 命令
- `dir`：列出当前目录下的文件和文件夹。
- `cd`：改变当前目录。
- `copy`：复制文件。
- `del`：删除文件。
- `move`：移动文件。
- `ren`：重命名文件或文件夹。
- `type`：显示文件内容。
- `echo`：显示消息。
- `cls`：清屏。
- `exit`：退出命令提示符。
- `ipconfig`：查看网络配置信息。
- `ping`：测试网络连接。
- `netstat`：查看网络状态。
- `tasklist`：查看当前运行的任务。
- `taskkill`：结束指定的任务。
- `shutdown`：关机或重启计算机。
- `mspaint`：打开画图板。
- `notepad`：打开记事本。
- `calc`：打开计算器。
- `msconfig`：打开系统配置。
- `msinfo32`：查看系统信息。
- `dxdiag`：查看 DirectX 信息。
- `wmic`：查看系统硬件信息。
- `driverquery`：查看驱动程序信息。
- `sfc`：修复系统文件。
- `chkdsk`：检查磁盘错误。
- `diskpart`：磁盘管理工具。
- `bcdedit`：修改启动配置。
- `msiexec`：安装或卸载 Windows Installer 程序。
- `regedit`：打开注册表编辑器。
- `gpedit.msc`：打开组策略编辑器。
- `mmc`：打开 Microsoft 管理控制台。
- `devmgmt.msc`：打开设备管理器。
- `services.msc`：打开服务管理器。
- `eventvwr.msc`：打开事件查看器。
- `compmgmt.msc`：打开计算机管理器。
- `diskmgmt.msc`：打开磁盘管理器。
- `oobe/msoobe /a`：打开 Windows 自动化设置向导。
- `dxdiag`：打开 DirectX 信息工具。