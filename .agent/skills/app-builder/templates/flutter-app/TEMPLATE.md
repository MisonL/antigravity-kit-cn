---
name: flutter-app
description: Flutter mobile app template（移动应用模板）原则。Riverpod（状态管理）、Go Router（路由）、Clean Architecture（整洁架构）。
---

# Flutter App Template（应用模板）

## Tech Stack（技术栈）

| Component（组件） | Technology（技术） |
| --- | --- |
| Framework（框架） | Flutter 3.x |
| Language（语言） | Dart 3.x |
| State（状态） | Riverpod 2.0 |
| Navigation（导航） | Go Router |
| HTTP | Dio |
| Storage（存储） | Hive |

---

## Directory Structure（目录结构）

```
project_name/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── theme/
│   │   ├── router/
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   └── home/
│   ├── shared/
│   │   ├── widgets/
│   │   └── providers/
│   └── services/
│       ├── api/
│       └── storage/
├── test/
└── pubspec.yaml
```

---

## Architecture Layers（架构层）

| Layer（层） | Contents（内容） |
| --- | --- |
| Presentation（表现层） | Screens（页面）、Widgets（组件）、Providers（提供器） |
| Domain（领域层） | Entities（实体）、Use Cases（用例） |
| Data（数据层） | Repositories（仓储）、Models（模型） |

---

## Key Packages（关键包）

| Package（包） | Purpose（用途） |
| --- | --- |
| flutter_riverpod | 状态管理 |
| riverpod_annotation | 代码生成 |
| go_router | 导航 |
| dio | HTTP 客户端 |
| freezed | 不可变模型 |
| hive | 本地存储 |

---

## Setup Steps（设置步骤）

1. `flutter create {{name}} --org com.{{bundle}}`
2. 更新 `pubspec.yaml`
3. `flutter pub get`
4. 运行代码生成：`dart run build_runner build`
5. `flutter run`

---

## Best Practices（最佳实践）

- Feature-first（功能优先）文件夹结构
- Riverpod（状态管理）用于状态管理，React Query pattern（服务端状态模式）
- Freezed（不可变模型）用于不可变数据类
- Go Router（路由）用于声明式导航
- Material 3（设计规范）主题
