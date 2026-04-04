# 星轨人生 - 证书与配置信息汇总

**整理时间**: 2026-04-04

---

## 证书位置

### 本地证书

| 文件 | 位置 | 用途 |
|------|------|------|
| `distribution.pem` | 项目根目录 | iOS分发证书 |
| `cert_base64.txt` | 项目根目录 | iOS证书Base64 |
| `entitlements.plist` | 项目根目录 | iOS权限配置 |

### 备份证书

| 文件 | 位置 |
|------|------|
| `cert.pem` | ~/星轨人生证书备份/ |
| `certificate.p12` | ~/星轨人生证书备份/ |

---

## 项目配置

### Bundle ID

- iOS: `com.yinan.xinggui0`
- Mac: `com.yinan.xingguirensheng`

### 构建配置

- iOS: `.github/workflows/ios-build.yml`
- Mac: `.github/workflows/mac-deploy.yml`

---

## GitHub Secrets (iOS)

需要配置:
- `BUILD_CERTIFICATE_BASE64`
- `P12_PASSWORD`
- `BUILD_PROVISION_PROFILE_BASE64`
- `KEYCHAIN_PASSWORD`

---

## 历史版本

| 目录 | 说明 |
|------|------|
| ~/Desktop/星轨人生pro | 完整打包版本 |
| ~/Desktop/星轨人生-整合版 | 整合版本 |
| docs/ | 历史代码备份 |

---

*整理完成*