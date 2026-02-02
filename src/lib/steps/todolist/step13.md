# ステップ13: ホーム画面の枠を作る(HomeView.swift)

このステップでは、ホーム画面の土台だけを作ります。  
まずはシンプルな画面として作成し、後のステップで画面遷移機能を追加します。

### 1. 画面の中身

ステップ1で作成した `Views/HomeView.swift` を編集します。

```swift
VStack(spacing: 12) {
    // 仮のテキスト表示
    Text("ここにタスク一覧を表示します")
        .foregroundColor(.gray)
}
```

現時点ではまだタスクリストの機能は実装せず、仮のテキストだけを配置しています。  
`.navigationTitle()` モディファイアでナビゲーションバーのタイトルを設定しています。

---

## コード全体

<img src="/images/todolist/Homeview.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// HomeView.swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        HomeView()
    }
}
```
