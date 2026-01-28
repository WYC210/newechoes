---
title: "OSS 服务（教学版）：上传 → 加密 → 临时访问 → oss-proxy"
date: 2026-01-28T20:12:00+08:00
tags: ["oss", "aliyun", "storage", "java"]
---

# OSS 服务（教学版）：上传 → 加密 → 临时访问 → oss-proxy

这份文档把 OSS 这条链路按“你要新增一个上传/下载能力时怎么写代码”来讲：每一步都有 **具体操作步骤 + 代码片段 + 你应该看到的结果**。

## 0. 你要做的事（目标）

- 生成规范的 OSS 对象路径（业务相对路径）
- 上传到 OSS（文件名加密；部分文件内容 XOR(88)）
- 给前端提供“可访问”的链接（签名临时 URL 或 `oss-proxy`）
- 在需要时对文件做解密下载（`decrypt=auto/true/false`）

## 1. 第 0 步：把配置补齐（不贴真实密钥）

### 1.1 若依后台（ruoyi）

1) 配置 `ruoyi.ossGen`（对象 key 的统一前缀）  
文件：`ruoyi-admin/src/main/resources/application.yml`

```yml
ruoyi:
  ossGen: musicKing
```

2) 配置 `oss.*`（endpoint/bucket/AK）  
文件：`ruoyi-admin/src/main/resources/application-druid.yml`（或 `application-druid1.yml`）

```yml
oss:
  endpoint: http://oss-cn-xxx-internal.aliyuncs.com
  accessKeyId: ${OSS_ACCESS_KEY_ID}
  accessKeySecret: ${OSS_ACCESS_KEY_SECRET}
  bucketName: music-king
  url: dl.example.com  # 写入 DB 的访问域名/CDN 域名
```

注意：**endpoint 不要包含 bucketName**（否则会出现 `bucket.bucket.oss-...` 这种拼错域名的问题）。

### 1.2 App API（music-app-api-standalone）

文件：`music-app-api-standalone/src/main/resources/application.yml`  
用途：生成临时 URL、上传/删除对象等（见 `music-app-api-standalone/src/main/java/com/music/api/util/OssTempUrlUtils.java`）

## 2. 第 1 步：先学会“路径怎么生成”（业务相对路径）

路径生成器：`ruoyi-system/src/main/java/com/ruoyi/system/utils/OssPathBuilder.java`

它返回的是：**业务相对路径**（不含域名、不含 bucket、不含 `ruoyi.ossGen`）。

例如：上传一个 APK，你可以这么生成路径：

```java
String objectPath = OssPathBuilder.buildAdminApkPath("apk");
// 可能长这样：admin/APK/<uuid>.apk
```

你可以照着项目现成写法抄：

- APK 上传：`ruoyi-admin/src/main/java/com/ruoyi/web/controller/music/tool/MusicVersionController.java`
- SF3 上传：`ruoyi-admin/src/main/java/com/ruoyi/web/controller/music/tool/MusicSf3FileController.java`

## 3. 第 2 步：上传文件到 OSS（你真正要调用的接口）

统一接口：`ruoyi-system/src/main/java/com/ruoyi/system/service/IOssService.java`  
实现：`ruoyi-system/src/main/java/com/ruoyi/system/service/impl/OssServiceImpl.java`

### 3.1 最常用：MultipartFile 上传

你在 Controller 里一般这么写（示例参考 `MusicVersionController` / `MusicSf3FileController`）：

```java
@PostMapping("/upload")
public AjaxResult upload(@RequestParam("file") MultipartFile file) throws Exception {
  String ext = FileUploadUtils.getExtension(file);
  String objectPath = OssPathBuilder.buildAdminApkPath(ext);

  // 关键：uploadFile 接收的是“业务相对路径”
  String url = ossService.uploadFile(file, objectPath);

  return AjaxResult.success().put("url", url).put("objectPath", objectPath);
}
```

你上传成功后应该得到：

- `objectPath`：类似 `admin/APK/<uuid>.apk`
- `url`：类似 `http://dl.xxx.com/musicKing/admin/APK/<加密后的文件名>.apk`

### 3.2 这一步 OSSServiceImpl 到底做了什么（教学重点）

`ruoyi-system/src/main/java/com/ruoyi/system/service/impl/OssServiceImpl.java` 内部关键逻辑：

1) 生成最终 objectName（拼 `ruoyi.ossGen` 前缀 + 加密文件名）：

```java
private String buildObjectName(String filePath) {
  String encryptedPath = encryptFileNameInPath(trimLeadingSlash(filePath));
  String prefix = RuoYiConfig.getOssGen(); // 比如 musicKing
  return trimTrailingSlash(prefix) + "/" + encryptedPath;
}
```

2) 对部分扩展名进行内容 XOR(88) 加密（见下一节策略）

3) 上传对象 ACL 设为 Private（所以前端不能直接无签名访问）

## 4. 第 3 步：内容加密策略（哪些文件会 XOR(88)）

策略类：`ruoyi-system/src/main/java/com/ruoyi/system/utils/OssCryptoPolicy.java`

当前规则（按代码）：

- `mkv/mp4/mp3/wav/json`：内容 XOR(88)
- legacy 明文例外：`policy/`、`sheet/sheet_cover/`、`.jpwabc` 等（给历史数据兼容）

你在后端“下载并解密”时，本质就是把每个字节 `^ 88` 还原：

```java
// ruoyi-admin/src/main/java/com/ruoyi/web/service/OssTmpOssFileService.java 内部的解密逻辑
buf[i] = (byte) (buf[i] ^ 88);
```

## 5. 第 4 步：给前端一个“可访问链接”（两种方式）

### 5.1 方式 A：生成预签名临时 URL（推荐直链/预览）

工具类：`ruoyi-system/src/main/java/com/ruoyi/system/utils/OssTempUrlUtils.java`

典型用法（伪代码）：

```java
String tempUrl = ossTempUrlUtils.generateTempUrl(fileUrlOrObjectKey, 600L);
```

### 5.2 方式 B：走 oss-proxy（解决 CORS/解密/强制下载）

控制器：`ruoyi-admin/src/main/java/com/ruoyi/web/controller/content/OssProxyController.java`

1) 直接下载（可解密）

```bash
curl -L "http://127.0.0.1:8080/content/oss-proxy/download?url=<URLEncode后的OSS_URL>&decrypt=auto&download=false"
```

2) 强制附件下载（浏览器会触发下载）

```bash
curl -L "http://127.0.0.1:8080/content/oss-proxy/download?url=<URLEncode后的OSS_URL>&decrypt=auto&download=true&filename=test.mp3"
```

3) 仅生成临时 URL（不走中转）

```bash
curl "http://127.0.0.1:8080/content/oss-proxy/temp-url?url=<URLEncode后的OSS_URL>&expireSeconds=600"
```

教学重点：

- `decrypt=false` 且 `download=false` 时，`oss-proxy` 会 **302 重定向** 到签名 URL（省服务器带宽）
- `decrypt=auto` 时会结合策略判断是否要解密（兼容历史数据）

## 6. 第 5 步：落地临时文件（下载更稳）

如果你需要“先把 OSS 文件落地到服务器，再给浏览器一个稳定的本地下载链接”，走：

- `GET /content/oss-proxy/prepare-download`

对应落盘与安全校验：

- `ruoyi-admin/src/main/java/com/ruoyi/web/service/OssTmpOssFileService.java`（落到 `/profile/tmp/oss/`）
- `ruoyi-admin/src/main/java/com/ruoyi/web/task/OssTmpOssCleanupTask.java`（每天 0 点清理）

## 7. 迁移工具：曲谱 file_url 迁移到 OSS

端到端流程文档（含关键代码摘录）：`OSS_SHEET_FILE_MIGRATE_FLOW.md`

入口 Controller：

- `ruoyi-admin/src/main/java/com/ruoyi/web/controller/music/tool/MusicSheetFileOssMigrateController.java`

