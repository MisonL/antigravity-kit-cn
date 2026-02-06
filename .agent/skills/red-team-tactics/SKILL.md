---
name: red-team-tactics
description: 基于 MITRE ATT&CK 的红队战术原理。攻击阶段、检测规避、报告。
allowed-tools: Read, Glob, Grep
---

# Red Team Tactics - 红队战术

> 基于 MITRE ATT&CK 框架的对手模拟原则。

---

## 1. MITRE ATT&CK 阶段

### 攻击生命周期

```
侦察 (RECONNAISSANCE) → 初始访问 (INITIAL ACCESS) → 执行 (EXECUTION) → 持久化 (PERSISTENCE)
        ↓                    ↓                      ↓                  ↓
    提权 (PRIVILEGE ESC) → 防御规避 (DEFENSE EVASION) → 凭证访问 (CRED ACCESS) → 发现 (DISCOVERY)
        ↓                    ↓                      ↓                  ↓
横向移动 (LATERAL MOVEMENT) → 收集 (COLLECTION) → C2 → 数据渗出 (EXFILTRATION) → 影响 (IMPACT)
```

### 阶段目标

| 阶段                     | 目标             |
| ------------------------ | ---------------- |
| **Recon**                | 映射攻击面       |
| **Initial Access**       | 获得第一个立足点 |
| **Execution**            | 在目标上运行代码 |
| **Persistence**          | 重启后存活       |
| **Privilege Escalation** | 获得 Admin/Root  |
| **Defense Evasion**      | 避免检测         |
| **Credential Access**    | 获取凭证         |
| **Discovery**            | 映射内部网络     |
| **Lateral Movement**     | 扩散到其他系统   |
| **Collection**           | 收集目标数据     |
| **C2**                   | 维持命令通道     |
| **Exfiltration**         | 提取数据         |

---

## 2. 侦察原则 (Reconnaissance Principles)

### 被动 (Passive) vs 主动 (Active)

| 类型        | 权衡                   |
| ----------- | ---------------------- |
| **Passive** | 不接触目标，信息有限   |
| **Active**  | 直接接触，检测风险更高 |

### 信息目标

| 类别     | 价值         |
| -------- | ------------ |
| 技术栈   | 攻击向量选择 |
| 员工信息 | 社会工程学   |
| 网络范围 | 扫描范围     |
| 第三方   | 供应链攻击   |

---

## 3. 初始访问向量 (Initial Access Vectors)

### 选择标准

| 向量                  | 何时使用           |
| --------------------- | ------------------ |
| **Phishing**          | 人类目标，邮件访问 |
| **Public exploits**   | 暴露的漏洞服务     |
| **Valid credentials** | 泄露或破解         |
| **Supply chain**      | 第三方访问         |

---

## 4. 提权原则 (Privilege Escalation Principles)

### Windows 目标

| 检查             | 机会            |
| ---------------- | --------------- |
| 未引用的服务路径 | 写入路径        |
| 弱服务权限       | 修改服务        |
| Token 权限       | 滥用 SeDebug 等 |
| 存储的凭证       | 收获            |

### Linux 目标

| 检查            | 机会             |
| --------------- | ---------------- |
| SUID 二进制文件 | 以所有者身份执行 |
| Sudo 配置错误   | 命令执行         |
| 内核漏洞        | 内核利用         |
| Cron 作业       | 可写脚本         |

---

## 5. 防御规避原则 (Defense Evasion Principles)

### 关键技术

| 技术                    | 目的         |
| ----------------------- | ------------ |
| LOLBins                 | 使用合法工具 |
| 混淆 (Obfuscation)      | 隐藏恶意代码 |
| 时间篡改 (Timestomping) | 隐藏文件修改 |
| 日志清除                | 移除证据     |

### 操作安全 (OPSEC)

- 在工作时间工作
- 模仿合法流量模式
- 使用加密通道
- 融入正常行为

---

## 6. 横向移动原则 (Lateral Movement Principles)

### 凭证类型

| 类型        | 用途             |
| ----------- | ---------------- |
| Password    | 标准认证         |
| Hash        | Pass-the-hash    |
| Ticket      | Pass-the-ticket  |
| Certificate | Certificate auth |

### 移动路径

- Admin shares (管理共享)
- 远程服务 (RDP, SSH, WinRM)
- 利用内部服务

---

## 7. Active Directory 攻击

### 攻击类别

| 攻击            | 目标             |
| --------------- | ---------------- |
| Kerberoasting   | 服务账号密码     |
| AS-REP Roasting | 无需预认证的账号 |
| DCSync          | 域凭证           |
| Golden Ticket   | 持久域访问       |

---

## 8. 报告原则 (Reporting Principles)

### 攻击叙事

记录完整的攻击链：

1. 如何获得初始访问权限
2. 使用了什么技术
3. 实现了什么目标
4. 哪里检测失败

### 检测缺口 (Detection Gaps)

对于每个成功的技术：

- 什么应该检测到它？
- 为什么检测没起作用？
- 如何改进检测

---

## 9. 道德边界 (Ethical Boundaries)

### 始终 (Always)

- 保持在范围内
- 最小化影响
- 如果发现真实威胁立即报告
- 记录所有行动

### 绝不 (Never)

- 破坏生产数据
- 造成拒绝服务 (除非在范围内)
- 超出概念验证的访问
- 保留敏感数据

---

## 10. 反模式 (Anti-Patterns)

| ❌ 不要 (Don't) | ✅ 要 (Do)   |
| --------------- | ------------ |
| 匆忙利用        | 遵循方法论   |
| 造成损害        | 最小化影响   |
| 跳过报告        | 记录一切     |
| 忽略范围        | 保持在边界内 |

---

> **记住：** 红队模拟攻击者是为了改善防御，而不是造成伤害。
