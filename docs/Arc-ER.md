以下は、本タスク管理アプリの**論理ER図（実装直前レベル）**です。
PlantUMLやDB設計にそのまま落とせる粒度で記載しています。

---

## 1. 全体構造（概要）

```
User
 ├─ Project
 │    ├─ Phase
 │    ├─ Task (階層構造)
 │    │    ├─ Task (子)
 │    │    └─ TaskWorkLog
 │    └─ Link
 ├─ Status
 └─ Template
```

---

## 2. エンティティ定義

### 2.1 User（利用者）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| name | string | 表示名 |
| email | string | ログイン用 |
| created_at | datetime | |

※ 初期は単一ユーザー想定だが拡張可能

---

### 2.2 Project（プロジェクト／チケット）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK(User) |
| title | string | プロジェクト名 |
| description | text | 背景・概要（AI活用想定） |
| external_type | enum | 問合せ / 開発 / レビュー / 提出物 / その他 |
| due_date | date | 完了期日（任意） |
| status_id | UUID | FK(Status) |
| created_at | datetime | |

---

### 2.3 Phase（フェーズ）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK(Project) |
| name | string | フェーズ名 |
| sort_order | int | 表示順 |

※ プロジェクト単位でカスタマイズ

---

### 2.4 Task（タスク／サブタスク共通）

> **Taskは再帰構造**（無限階層）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK(Project) |
| phase_id | UUID | FK(Phase) |
| parent_task_id | UUID | FK(Task) nullable |
| title | string | タスク名 |
| description | text | 詳細（AI補助想定） |
| due_date | date | 期日（重要） |
| status_id | UUID | FK(Status) |
| estimated_minutes | int | 見積工数 |
| is_leaf | boolean | 子タスクを持たない最下層フラグ |
| created_at | datetime | |

- parent_task_id = NULL → 親タスク
- parent_task_id != NULL → サブタスク
- is_leaf = true → 最下層サブタスク（直接作業対象）

- parent_task_id = NULL → 親タスク
- parent_task_id != NULL → サブタスク

---

### 2.5 TaskWorkLog（工数ログ）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| task_id | UUID | FK(Task) |
| minutes | int | 実績工数 |
| work_date | date | 作業日 |
| note | string | 任意メモ |

※ 集計は常に子 → 親へロールアップ

---

### 2.6 Status（状態マスタ：完全カスタマイズ）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK(User) |
| name | string | 状態名 |
| sort_order | int | 表示順 |
| is_done | boolean | 完了フラグ |
| is_wait | boolean | 待ちフラグ |

- プロジェクト／タスク／サブタスク共通

---

### 2.7 Link（URL紐づけ）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| target_type | enum | Project / Task |
| target_id | UUID | 対象ID |
| url | string | URL |
| link_type | enum | Redmine / Jira / GSS / Other |
| memo | string | 補足 |

※ Taskは階層問わず紐づけ可能

---

### 2.8 Template（テンプレート）

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK(User) |
| name | string | テンプレ名 |
| structure | json | タスク階層定義 |

※ DB出荷・問合せ対応・リリース用

---

## 3. リレーションまとめ

- User 1 ─ * Project
- Project 1 ─ * Phase
- Project 1 ─ * Task
- Task 1 ─ * Task（自己参照）
- Task 1 ─ * TaskWorkLog
- User 1 ─ * Status
- Project / Task 1 ─ * Link

---

## 4. このERの強み

- 階層タスク完全対応
- 状態・フェーズ・テンプレすべてユーザー定義
- AI生成に耐える自由記述設計
- ERP開発／問合せ／DB業務すべてを表現可能

---

次ステップ：
- 優先度算出ロジック
- 一覧画面用クエリ設計
- 技術スタック別DDL化

どこまで行きますか？

