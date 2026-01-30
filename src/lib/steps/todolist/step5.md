# ステップ5: フローティングボタンを作る

画面右下に固定表示する丸いボタンを作成します。

### 1. 変数の定義

```swift
// ボタンを押した時のアクション
let action: () -> Void
// 表示するアイコンの名前（SF Symbols）
let icon: String
// ボタンの背景色
let backgroundColor: Color
```

ボタンが押された時の処理を受け取るための `action`、表示するアイコン（SF Symbols）を指定するための `icon`、そしてボタンの色を決める `backgroundColor` を定義しています。  
これにより、場所や用途に合わせて見た目や動作を変えられる再利用可能なボタンになります。

### 2. UIの作成

```swift
// 画面全体に対する配置制御
VStack {
    // 上部の余白を埋めて、要素を下に押し下げる
    Spacer()

    // 横方向の配置制御
    HStack {
        // 左側の余白を埋めて、要素を右に押しやる
        Spacer()

        // アクション付きボタンの作成
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 24))       // アイコンのサイズ
                .foregroundColor(.white)       // アイコンの色（白）
                .frame(width: 60, height: 60)  // ボタン自体の大きさ
                .background(backgroundColor)   // 背景色を設定
                .clipShape(Circle())           // 丸型に切り抜く
                .shadow(radius: 5)             // 影をつけて浮いているように見せる
        }
        // 画面端からの余白
        .padding(20)
    }
}
```

`VStack` 内で上部に `Spacer()` を入れることで下揃えにし、さらに `HStack` 内で左側に `Spacer()` を入れることで右揃えにしています。  
これらを組み合わせることで「画面の右下」への配置を実現しています。  
ボタン自体は指定されたサイズの正方形（60x60）を作り、`.clipShape(Circle())` で丸く切り抜くことで円形のフローティングアクションボタン（FAB）のようなデザインにしています。

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
