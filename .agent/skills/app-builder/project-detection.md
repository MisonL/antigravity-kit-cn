# Project Type Detection（项目类型检测）

> 分析用户请求，确定项目类型与模板。

## Keyword Matrix（关键词矩阵）

| Keywords（关键词） | Project Type（项目类型） | Template（模板） |
| --- | --- | --- |
| blog, post, article | Blog（博客） | astro-static |
| e-commerce, product, cart, payment | E-commerce（电商） | nextjs-saas |
| dashboard, panel, management | Admin Dashboard（管理面板） | nextjs-fullstack |
| api, backend, service, rest | API Service（接口服务） | express-api |
| python, fastapi, django | Python API（Python 接口） | python-fastapi |
| mobile, android, ios, react native | Mobile App（移动端应用，RN / React Native） | react-native-app |
| flutter, dart | Mobile App（Flutter） | flutter-app |
| portfolio, personal, cv | Portfolio（作品集） | nextjs-static |
| crm, customer, sales | CRM（客户管理） | nextjs-fullstack |
| saas, subscription, stripe | SaaS（软件即服务） | nextjs-saas |
| landing, promotional, marketing | Landing Page（落地页） | nextjs-static |
| docs, documentation | Documentation（文档） | astro-static |
| extension, plugin, chrome | Browser Extension（浏览器扩展） | chrome-extension |
| desktop, electron | Desktop App（桌面应用） | electron-desktop |
| cli, command line, terminal | CLI Tool（命令行工具） | cli-tool |
| monorepo, workspace | Monorepo（单体仓库） | monorepo-turborepo |

## Detection Process（检测流程）

```
1. Tokenize user request（对用户请求分词）
2. 提取关键词
3. 确定项目类型
4. 检测缺失信息 → 转发给 conversation-manager（对话管理器）
5. 建议技术栈
```
