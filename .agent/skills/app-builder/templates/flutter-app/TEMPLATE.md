---
name: flutter-app
description: Flutter 移动应用模板原则。Riverpod、Go Router、Clean Architecture。
---

# Flutter App Template（模板）

## Tech Stack（技术栈）

| Component | Technology |
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

| Layer | Contents |
| --- | --- |
| Presentation（表现层） | Screens, Widgets, Providers |
| Domain（领域层） | Entities, Use Cases |
| Data（数据层） | Repositories, Models |

---

## Key Packages（关键包）

| Package | Purpose |
| --- | --- |
| flutter_riverpod | State management（状态管理） |
| riverpod_annotation | Code generation（代码生成） |
| go_router | Navigation（导航） |
| dio | HTTP client |
| freezed | Immutable models（不可变模型） |
| hive | Local storage（本地存储） |

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
- Riverpod 用于状态，React Query 模式用于服务端状态
- Freezed 用于不可变数据类
- Go Router 用于声明式导航
- Material 3 主题
