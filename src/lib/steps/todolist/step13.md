# ステップ13: ホーム画面の枠を作る(HomeView.swift)

## 1. 画面の土台作成

`Views/HomeView.swift` を開き、ホーム画面の土台を作成します。
現時点ではまだタスクリストなどは表示せず、シンプルなテキストのみを配置して画面遷移のテストができるようにします（後のステップで機能を実装します）。

```swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    var body: some View {
        VStack(spacing: 12) {
            // 仮のテキスト表示
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}

#Preview {
    NavigationStack {
        HomeView()
    }
}
```

- `navigationTitle`: 画面上部にタイトルを表示します。`NavigationStack` の中にある時だけ有効になります。

---

## コード全体

<img src="/images/todolist/Homeview.png" alt="HomeViewの完成イメージ" class="mobile-screenshot" />

### Views/HomeView.swift

```swift
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

