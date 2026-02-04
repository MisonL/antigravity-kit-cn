---
description: 红队战术原理、攻击阶段与检测规避
---

# 红队战术 (Red Team Tactics)

**注意：仅用于授权的渗透测试和安全研究。**

## MITRE ATT&CK 框架

攻击链通常遵循以下阶段：

1.  **侦查 (Reconnaissance)**: 收集目标信息 (Whois, Shodan, LinkedIn)。
2.  **资源开发 (Resource Development)**: 购买域名，准备钓鱼服务器。
3.  **初始访问 (Initial Access)**: 钓鱼邮件，利用公开漏洞。
4.  **执行 (Execution)**: 运行恶意代码。
5.  **持久化 (Persistence)**: 修改注册表，创建计划任务。
6.  **提权 (Privilege Escalation)**: 从 User 提权到 Admin/Root。
7.  **横向移动 (Lateral Movement)**: 攻击内网其他机器。
8.  **数据渗漏 (Exfiltration)**: 偷取数据。

## 常用工具

- **Nmap**: 网络扫描。
- **Metasploit**: 漏洞利用框架。
- **Burp Suite**: Web 代理与拦截。
- **Cobalt Strike**: 后渗透平台。

## 防御规避

- **Living off the Land (LOLBins)**: 利用系统自带工具 (PowerShell, CertUtil) 进行攻击，以躲避杀毒软件。
