# Task Manager — Demo Implementation

## アーキテクチャ概要

現在は **ブラウザ内で完結するフロントエンドSPA（`web/`）のみ実装済み**で、バックエンドAPI・PostgreSQL・AI連携は設計書に基づく【計画】段階です。

```mermaid
C4Container
  title Container - Task Manager

  Person(user, "業務担当者", "Webブラウザで利用")

  System_Boundary(tm, "Task Manager") {
    Container(spa, "Web SPA【実装済み】", "React 18, TypeScript, Vite, Zustand, Tailwind", "TODO一覧の表示、優先度ソート、キャパシティフィルタ、完了/工数操作。データはメモリ内サンプル")
    Container(api, "Backend API【計画】", "Node.js, TypeScript, REST", "タスクデータの永続化、状態遷移の整合性保証、AI生成結果の draft/adopted 管理")
    ContainerDb(db, "Database【計画】", "PostgreSQL", "User, Project, Phase, Task(自己参照), TaskWorkLog, Status, Link, Template")
  }

  System_Ext(ai, "AIサービス【計画】", "独立サービス。JSON入出力")

  Rel(user, spa, "操作", "HTTPS / ブラウザ")
  Rel(spa, api, "CRUD【計画】", "REST / JSON")
  Rel(api, db, "読み書き【計画】", "SQL")
  Rel(api, ai, "タスク分解・要約依頼【計画】", "JSON")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

System Context / Component 図、データフロー、ディレクトリ構成の詳細は [docs/architecture.md](docs/architecture.md) を参照してください。

---

このリポジトリに、`docs/` 以下の設計書を基にしたブラウザ版 (フロントエンドのみ) の最小実装を追加しました。

## 実装概要
- `web/` に Vite + React + TypeScript プロジェクト
- Tailwind, Zustand を使用
- 実装済み: TODO一覧画面（並び順、期日強調、状態チップ、完了ボタン、工数ログ(+30m)、キャパシティフィルタ、タスク詳細モーダル）

## 使い方（ローカル）
1. cd web
2. npm install
3. npm run dev

ブラウザで表示されるTODO一覧を確認できます（データはメモリ内のサンプルデータ）。

## 次のステップ候補
- バックエンドAPI（Node.js + PostgreSQL）と接続して永続化
- AI連携インターフェース（設計書にある入出力フォーマット準拠）
- 詳細ページ（フェーズ・サブタスク編集など）
- テスト、アクセシビリティ改善

---

短いデモを作成しました。続けてバックエンドやAI連携など、どこから作業しますか？
