---
title: "Git常见命令"
date: 2025-03-28T19:34:05+08:00
tags: ["git"]
---

# Git 常见命令

## 基础流程

```bash
git status
git add <file>
git add .
git commit -m "message"
```

## 分支操作

```bash
git branch
git branch <name>
git switch <name>
git switch -c <name>
git merge <name>
git branch -d <name>
git branch -D <name>
```

## 远程仓库

```bash
git remote add origin <url>
git remote -v
git pull origin main
git push origin main
git push -u origin main
```

## 回退与撤销

```bash
git restore <file>
git restore --staged <file>
git reset --hard HEAD^
git reset --hard <commit>
```

## 暂存区与工作区

```bash
git diff
git log --oneline --graph
```

## 保存与恢复（stash）

```bash
git stash push -m "msg"
git stash list
git stash apply stash@{0}
git stash pop
git stash drop stash@{0}
```

## 标签

```bash
git tag v1.0
git tag -a v0.1 -m "v0.1 released"
git show v1.0
git tag -d v0.1
git push origin v1.0
git push origin --tags
git push origin -d v0.1
```
