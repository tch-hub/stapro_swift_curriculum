# ステップ9: 初期データを投入する

アプリ起動時にタブとタスクが空なら、初期データを作成します。

### 1. 初期データの定義

`Constants.swift` に初期タブとタスクを定義します。

```swift
// Constants.swift
import Foundation

// 初期データの定義：タブ名と、それに紐づくタスク名のリスト
// ("タブ名", ["タスク1", "タスク2", ...]) という形式で記述
let INITIAL_TODO_TABS = [
    ("リスト", [
        "アイテムA",
        "アイテムB",
        "アイテムC"
    ]),
    ("宿題", [
        "作文",
        "テスト勉強",
        "レポート"
    ]),
    ("買い物", [
        "食料品",
        "日用品",
        "衣類"
    ])
]
```

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// Constants.swift
import Foundation

// 初期タブデータ
let INITIAL_TODO_TABS = [
    ("仕事", [
        "プロジェクト企画書を作成",
        "メール返信",
        "会議資料準備"
    ]),
    ("プライベート", [
        "映画を見る",
        "友人に連絡",
        "運動する"
    ]),
    ("買い物", [
        "食料品",
        "日用品",
        "衣類"
    ])
]
```