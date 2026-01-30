# ステップ5: フローティングボタンを作る

画面右下に固定表示する丸いボタンを作成します。

### 1. 変数の定義

```swift
let action: () -> Void
let icon: String
let backgroundColor: Color
```

- `action` はボタンタップ時の処理です。
- `icon` は SF Symbols の名前を受け取ります。
- `backgroundColor` でボタン色を変更できます。

### 2. UIの作成

```swift
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
```

- `VStack` と `HStack` に `Spacer()` を入れることで右下に配置されます。
- `clipShape(Circle())` で円形にします。

---

## コード全体

<img src="/images/timer/t21.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

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
