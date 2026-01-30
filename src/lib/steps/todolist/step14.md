```swift
// HomeView.swift
import SwiftUI

/// ホーム画面（枠だけ作成）
struct HomeView: View {
    @Binding var navigationPath: [NavigationItem]

    var body: some View {
        VStack(spacing: 12) {
            Text("ここにタスク一覧を表示します")
                .foregroundColor(.gray)

            Button(action: {
                navigationPath.append(NavigationItem(id: .tabManage))
            }) {
                Text("タブ管理")
            }
        }
        .padding()
        .navigationTitle("ToDoリスト")
    }
}
```
