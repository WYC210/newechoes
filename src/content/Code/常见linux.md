---
title: "常见 Linux 命令"
date: 2026-01-28T19:33:54+08:00
tags: ["linux"]
---

# 简单常用的命令

| 命令 | 中文含义 | 常用示例 |
| --- | --- | --- |
| `ls` | 列出目录内容 | `ls -al` |
| `cd` | 切换目录 | `cd /var/log` |
| `rm` | 删除文件/目录（谨慎） | `rm file.txt` / `rm -r dir`（慎用 `-f`） |
| `top` | 查看系统负载与进程 | `top` |
| `nohup` | 让命令在后台运行并忽略挂断信号 | `nohup cmd > out.log 2>&1 &` |
| `tail` | 查看文件末尾/实时追踪日志 | `tail -n 200 app.log` / `tail -f app.log` |
| `kill` | 向进程发送信号（常用结束进程） | `kill <pid>`（必要时再用 `-9`） |
| `mkdir` | 创建目录 | `mkdir -p a/b/c` |
| `touch` | 创建空文件/更新时间戳 | `touch a.txt` |
| `vim` | 终端文本编辑器 | `vim a.txt` |

补充：不确定参数时先看帮助：`cmd --help` 或 `man cmd`（部分精简系统可能没有 `man`）。

