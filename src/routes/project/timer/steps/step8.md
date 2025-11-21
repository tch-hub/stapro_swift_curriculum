# ステップ8: 最終調整とテスト

このステップはアプリの最終調整と総合テストを扱います。コンポーネントの最終形を確認し、UI と ViewModel を統合した動作を点検します。

### 1. ColorButtonコンポーネント

- 再利用可能な円形ボタンコンポーネントです。テキスト・色・アクションを受け取り、見た目を統一します。

コード例（ColorButton の最小実装）:

```swift
struct ColorButton: View {
    let text: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(text)
                .foregroundStyle(color)
                .font(.subheadline)
        }
        .frame(width: 90, height: 90)
        .background(color.opacity(0.2))
        .clipShape(Circle())
    }
}
```

### 2. ContentViewの最終形

- ContentView 内で、`ColorButton` を使い状態に応じて操作を切り替えます。アラートや音声停止の連携も行います。

コード例（操作ボタンとアラートの断片）:

```swift
HStack(spacing: 130) {
    ColorButton(text: "キャンセル", color: .black, action: viewModel.stopTimer)
        .opacity(viewModel.timerState == .idle ? 0.3 : 1)
        .disabled(viewModel.timerState == .idle)

    switch viewModel.timerState {
    case .idle:
        ColorButton(text: "開始", color: .green, action: {
            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
        })
    case .running:
        ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
    case .paused:
        ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
    }
}
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        viewModel.isShowingAlert = false
        viewModel.timerState = .idle
        viewModel.audioPlayer?.stop()
    }
}
```

---

### 3. プロジェクト構造の最終確認

以下は最終的なプロジェクト構造の例です。各ファイルが適切なディレクトリに整理されていることを確認してください。

```text
Timer/
├── TimerApp.swift
├── ContentView.swift
├── ViewModels/
│   └── TimerViewModel.swift
├── Views/
│   ├── TimeSelectionView.swift
│   └── TimerDisplayView.swift
└── Components/
    ├── ColorButton.swift
    └── TimePicker.swift
```

### 4. 総合テスト項目

- 基本機能: 時間設定、開始、キャンセル、一時停止、再開。
- UI: TimeSelectionView と TimerDisplayView の切り替え、プログレスバーのアニメーション。
- 音声: 終了時に音が鳴り、アラートで停止する。
- エッジケース: 0秒、長時間、バックグラウンドでの動作。

---

### 5. 機能の一覧

- 時間設定（時・分・秒）
- タイマー開始/一時停止/再開/キャンセル
- カウントダウン表示
- 円形プログレスバー
- アラーム音声とアラート

---

### 6. 次のステップ案

- 複数アラームの追加
- 履歴保存
- ダークモード対応
- 通知機能
- プリセット時間

---

### コード全体 — 最終版 (ColorButton + 操作ボタン / アラート)

下記は `ColorButton` と ContentView の操作エリア（ボタン類とアラート）をまとめた最終版のコード断片です。これを `ContentView` に組み込めば動作確認ができます。

```swift
// Components/ColorButton.swift
import SwiftUI

struct ColorButton: View {
    let text: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(text)
                .foregroundStyle(color)
                .font(.subheadline)
        }
        .frame(width: 90, height: 90)
        .background(color.opacity(0.2))
        .clipShape(Circle())
    }
}

// ContentView の操作エリア
HStack(spacing: 130) {
    ColorButton(text: "キャンセル", color: .black, action: viewModel.stopTimer)
        .opacity(viewModel.timerState == .idle ? 0.3 : 1)
        .disabled(viewModel.timerState == .idle)

    switch viewModel.timerState {
    case .idle:
        ColorButton(text: "開始", color: .green, action: {
            viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
        })
    case .running:
        ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
    case .paused:
        ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
    }
}
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        viewModel.isShowingAlert = false
        viewModel.timerState = .idle
        viewModel.audioPlayer?.stop()
    }
}
```
