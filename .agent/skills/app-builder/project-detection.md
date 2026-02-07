# 项目类型检测

> 分析用户请求以确定项目类型和模板。

## 关键词矩阵

| 关键词                                                       | 项目类型                         | 模板               |
| ------------------------------------------------------------ | -------------------------------- | ------------------ |
| blog, post, article, 博客, 文章                              | Blog（博客）                      | astro-static       |
| e-commerce, product, cart, payment, 电商, 产品, 购物车, 支付 | E-commerce（电商）                | nextjs-saas        |
| dashboard, panel, management, 仪表盘, 控制面板, 管理系统     | Admin Dashboard（管理面板）       | nextjs-fullstack   |
| api, backend, service, rest, 接口, 后端, 服务                | API Service（接口服务）           | express-api        |
| python, fastapi, django                                      | Python API                        | python-fastapi     |
| mobile, android, ios, react native, 移动端, 手机应用         | Mobile App（RN）                  | react-native-app   |
| flutter, dart                                                | Mobile App（Flutter）             | flutter-app        |
| portfolio, personal, cv, 作品集, 个人主页, 简历              | Portfolio（作品集）               | nextjs-static      |
| crm, customer, sales, 客户管理, 销售管理                     | CRM（客户管理）                   | nextjs-fullstack   |
| saas, subscription, stripe, 订阅, 软件即服务                 | SaaS（软件即服务）                | nextjs-saas        |
| landing, promotional, marketing, 落地页, 营销页              | Landing Page（落地页）            | nextjs-static      |
| docs, documentation, 文档                                    | Documentation（文档）             | astro-static       |
| extension, plugin, chrome, 插件, 扩展                        | Browser Extension（浏览器扩展）   | chrome-extension   |
| desktop, electron, 桌面应用                                  | Desktop App（桌面应用）           | electron-desktop   |
| cli, command line, terminal, 命令行, 终端                    | CLI Tool（命令行工具）            | cli-tool           |
| monorepo, workspace, 工作区, 单体大仓                        | Monorepo（单体大仓）              | monorepo-turborepo |

## 检测流程

```
1. 标记化用户请求
2. 提取关键词
3. 确定项目类型
4. 检测缺失信息 → 转发给 conversation-manager（对话管理器）
5. 建议技术栈
```
