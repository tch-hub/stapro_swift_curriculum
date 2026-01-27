# ステップ17: FloatingButton コンポーネントの実装

<script>
    import {base} from '$app/paths';
</script>

## FloatingButton.swift の作成

`Components/`フォルダに`FloatingButton.swift`を作成します：

```swift
import SwiftUI

struct FloatingButton: View {
    let action: () -> Void
    let icon: String
    let backgroundColor: Color

    var body: some View {
        VStack {
            Spacer()

            HStack {
                Spacer()

                Button(action: action) {
                    Image(systemName: icon)
                        .font(.system(size: 24))
                        .foregroundColor(.white)
                        .frame(width: 60, height: 60)
                        .background(backgroundColor)
                        .clipShape(Circle())
                        .shadow(radius: 5)
                }
                .padding(20)
            }
        }
    }
}

#Preview {
    FloatingButton(
        action: { },
        icon: "plus",
        backgroundColor: .blue
    )
}
```

## HomeView の修正

リストとボタン部分を`ZStack`で包み、追加ボタンを`FloatingButton`に置き換えます：

```swift
ZStack {
    VStack {
        // 既存のコンテンツ（Picker、CustomListなど）

        HStack {
            Button(action: {
                navigationPath.append(NavigationItem(id: .tabManage))
            }) {
                Text("タブ管理")
            }
            .padding()
        }
    }

    FloatingButton(
        action: { showingAddTask = true },
        icon: "plus",
        backgroundColor: .blue
    )
}
```

## FloatingButton の特徴

1. **画面右下に配置**: `VStack`と`HStack`の`Spacer()`を使って配置
2. **円形デザイン**: `.clipShape(Circle())`で円形にします
3. **シャドウ効果**: `.shadow()`で浮き出た感じを表現
4. **カスタマイズ可能**: アイコンと背景色を指定できます

## 次のステップへ

次は、TextFieldを含むアラート機能を実装します。
