---
title: "Git常见命令"
date: 2025-03-28T19:34:05+08:00
tags: ["git"]
---

1. 基础

---

```typescript
git add
<file
  >　 # 提交到 暂存区 git commit -m "commnet" 　 # 提交到 版本库 git branch -M
  main # 重新命名分支 git remote add origin # 添加远程仓库 git pull origin
  master # 从名为 origin 的远程仓库的 master
  分支拉取最新的提交，并将其合并到当前分支 git push origin main　　#
  将本地仓库的文件push到远程仓库(若 push 不成功，可加 -f 进行强推操作) git diff
  read.txt # 查看文件变化
</file>
```

2. 版本回退

---

```typescript
git reset --hard HEAD^ # 恢复到上一个版本 git reset --hard HEAD~10 #
恢复到网上10个版本 git reset --hard commitID # 恢复到指定commit版本
```

3. 撤销修改

---

```typescript
git restore
<file>
  # 工作区 git restore --staged
  <file>
    # 暂存区，工作区需要执行上一步 add git reset --hard HEAD^ #
    工作区、暂存区、本地仓库都回退 commit</file
  ></file
>
```

4. 删除文件

---

```typescript
rm file git add file git commit -m ""
```

5. 分支操作

---

```typescript
git branch test # 创建分支 test git branch # 查看当前分支 git switch -c test #
创建test分支，然后切换到test分支 git branch test git checkout test git switch
master # 切换 git merge test # 合并指定分支到当前分支 git merge --no-ff -m
"no-ff" test # 禁用快进（fast-forward）合并，强制创建一个新的合并提交 git branch
-d test # 删除分支 git branch -D test # 强制删除 git log --graph #
查看分支合并图
```

6. 保存和恢复

---

```typescript
git stash save "Your stash message" # 保存工作进度 git stash list # 查看 stash
列表 git stash apply [<stash-index
  >] # 应用 git stash drop [<stash-index
    >] # 删除 git stash pop [<stash-index
      >] # 应用并删除 git cherry-pick #
      将一个或多个提交从一个分支应用到另一个分支</stash-index
    ></stash-index
  ></stash-index
>
```

7. 多人协作

---

```typescript
git remote -v # 查看远程库的信息 git switch -c dev origin/dev #
本地创建一个新分支 dev，并将其设置为跟踪远程仓origin/dev 分支 git branch -u
origin/dev dev # 本地分支 dev 设置为跟踪远程仓库的 origin/dev 分支 git push
origin master　　 # 将本地仓库文件push到远程(若push不成功，可加-f进行强推) git
pull origin master #
从远程仓库origin的master分支拉取最新提交，并将其合并到当前分支 git rebase #
把本地未push的分叉提交历史整理成直线
```

8. 标签

---

<!--more-->

标签总是和某个 commit 挂钩。如果这个 commit 既出现在 master 分支，又出现在 dev 分支，那么在这两个分支上都可以看到这个标签。

```typescript
git tag v1.0 # 打一个新标签V1.0，默认是打在最新提交的commit上 git log
--pretty=oneline --abbrev-commit # 每一行包含了一个提交的简略哈希和提交信息 git
tag v0.9 f52c633 # 在特点commit上打标签 git tag -a v0.1 -m "v0.1 released"
1094adb # 创建带有说明的标签，用-a指定标签名，-m指定说明文字 git tag #
查看所有标签 git show v0.9 # 查看标签信息,标签不是按时间顺序列出，而是按字母排序
git tag -d v0.1 # 删除标签 git push origin v1.0 # 推送标签到远程 git push origin
--tags # 一次性推送全部尚未推送到远程的本地标签 git push origin -d tag tagName #
删除一个远程标签 git ls-remote --tags origin # 查看删除远程tags执行效果
```
