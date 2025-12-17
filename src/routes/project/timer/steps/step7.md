### 1. 音声ファイルの準備

まず、アラーム音として鳴らすための音声ファイルを用意しましょう。
<a href="/source/Alarm.mp3" download="Alarm.mp3" class="text-blue-500 hover:underline">
音声ファイル (Alarm.mp3)
</a>
をダウンロードして、Xcodeのプロジェクトナビゲータ内にある `Timer` フォルダに配置してください。。


### 2. 必要な「道具」の準備

音を扱ったり、アラートを表示したりするための変数を追加します。

```swift
// import Combineの下に追加
import AVFoundation
```

- `AVFoundation`: iPhoneで音を鳴らすための「専門ツールセット」のようなものです。これをインポートすることで、音楽再生の機能が使えるようになります。

```swift
// class TimerViewModel: ObservableObject {}内に追加
@Published var isShowingAlert = false
var audioPlayer: AVAudioPlayer?
```

- `@Published var isShowingAlert = false`: アラートを表示するかどうかを決める「スイッチ」です。最初は `false` (オフ) ですが、タイマーが終了したら `true` (オン) にします。
- `var audioPlayer: AVAudioPlayer?`: 音楽を再生するための「プレイヤー」です。最初はまだ何もセットされていないので `?` (空っぽかもしれない) がついています。

### 3. 音を鳴らす機能 (メソッド) を作る

実際に音を再生する `playSound` という命令（メソッド）を作ります。

```swift
// func restartTimer() {}の下に追加
func playSound() {
    // 1. アプリの中から "Alarm.mp3" というファイルを探します
    guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else { return }

    do {
        // 2. プレイヤーにファイルの場所を教えて、準備させます
        audioPlayer = try AVAudioPlayer(contentsOf: url)
        // 3. 再生します！
        audioPlayer?.play()
    } catch {
        // もし何らかの理由で再生できなかったら、ここにきます
        print("音声ファイルが再生できませんでした")
    }
}
```

- `guard let url = ...`: 「もしファイルが見つからなかったら、そこで中止！」という安全装置です。アプリがクラッシュするのを防ぎます。
- `do { ... } catch { ... }`: 「音の再生を試してみるよ (`do`)。でももし失敗したら、エラーを報告してね (`catch`)」という仕組みです。

### 4. カウントダウン終了時に音を鳴らす

タイマーが0になったとき、先ほど作った「スイッチ」と「音」を作動させるように書き換えます。

```swift
// func countDown() {}を編集
func countDown() {
    timer?.invalidate()
    timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
        guard let self = self else { return }
        DispatchQueue.main.async {
            if self.remainingTime > 0 {
                // まだ時間が残っているなら、1秒減らす
                self.remainingTime -= 1
            } else {
                // 時間切れ！ (0になったとき)
                timer.invalidate()          // タイマーを止める
                self.timerState = .idle     // 状態を「待機中」に戻す
                self.isShowingAlert = true  // アラート表示スイッチをON！
                self.playSound()            // 音を鳴らす！
            }
        }
    }
}
```

### 5. 画面にアラートを表示する

最後に、`ContentView`（画面側）でスイッチがONになったときにアラートを表示する設定を追加します。

```swift
// VStack(spacing: 24) {}の下に追加
.alert("時間です", isPresented: $viewModel.isShowingAlert) {
    Button("完了") {
        // "完了"ボタンが押されたら...
        viewModel.isShowingAlert = false // スイッチをOFFに戻す
        viewModel.timerState = .idle     // タイマーをリセット
        viewModel.audioPlayer?.stop()    // 音も止める
    }
}
```

- `.alert(...)`: `isShowingAlert` が `true` になった瞬間、自動的にポップアップを表示します。
- `Button("完了")`: ユーザーがこのボタンを押すと、後片付け（スイッチOFF、音停止）をして元の画面に戻ります。

---

## コード全体
```swift title="TimerViewModel.swift"
// TimerViewModel.swift
import SwiftUI
import Combine
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false

    var timer: Timer?
    var totalTime: Int = 0
    var audioPlayer: AVAudioPlayer?


    func countDown() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            DispatchQueue.main.async {
                if self.remainingTime > 0 {
                    self.remainingTime -= 1
                } else {
                    timer.invalidate()
                    self.timerState = .idle
                    self.isShowingAlert = true
                    self.playSound()
                }
            }
        }
    }



    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }

    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
        audioPlayer?.stop()
    }

    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }

    func restartTimer() {
        timerState = .running
        countDown()
    }

    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else { return }
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
}
```

<img src="/images/timer/t71.png" alt="Xcode の設定画面" width="360" style="float: right; margin-left: 1rem; margin-bottom: 1rem; max-width: 100%; height: auto;" />

```swift
// ContentView.swift
import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = TimerViewModel()
    @State var timerState: TimerState = .idle
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0

    var body: some View {
        VStack(spacing: 24) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()

            // 時間選択は待機時のみ表示
            if timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                Text("タイマーが実行中です")
                    .font(.title)
            }

            HStack(spacing: 16) {
                Button("開始") {
                    viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("キャンセル") {
                    timerState = .idle
                    hours = 0; minutes = 0; seconds = 0
                }
                .padding()
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)

                Button("一時停止") {
                    viewModel.pauseTimer()
                }
                .padding()
                .background(Color.orange)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
        .alert("時間です", isPresented: $viewModel.isShowingAlert) { // 追加
            Button("完了") {                                         // 追加
                viewModel.isShowingAlert = false                    // 追加
                viewModel.timerState = .idle                        // 追加
                viewModel.audioPlayer?.stop()                        // 追加
            }
        }
    }
}

#Preview {
    ContentView()
}
```
