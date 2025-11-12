<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ3: 時間選択ビューの実装</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step2" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step4" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>Pickerの使い方</li>
				<li>@Bindingを使ったデータの受け渡し</li>
				<li>カスタムViewの作成</li>
				<li>ForEachを使った繰り返し</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. TimePickerコンポーネントの作成</h2>
			<p class="mb-4">
				時間を選択するためのPickerコンポーネントを作成します。新しくTimePicker.swiftファイルを作成する必要があります：
			</p>
			<div class="">
				<div class="flex flex-col gap-6 lg:flex-row">
					<div class="flex-1">
						<CodeBlock
							title="TimePicker.swift"
							code={`import SwiftUI  // SwiftUIフレームワークをインポート

struct TimePicker: View {  // TimePickerという名前のView構造体を定義
    var title: String          // 「時間」「分」「秒」などのタイトルを表すプロパティ
    var range: ClosedRange<Int> // 選択範囲（例: 0...23）を表すプロパティ
    @Binding var selection: Int  // 選択された値を表すバインディングプロパティ
    
    var body: some View {  // Viewのボディを定義
        Picker(selection: $selection, label: Text(title)) {  // Pickerを作成、選択値とラベルを設定
            ForEach(Array(range), id: \.self) { value in  // rangeの各値をループ
                Text("\\(value) \\(title)").tag(value)  // 値をテキストとして表示し、タグを設定
            }
        }
        .pickerStyle(.wheel)  // ホイールスタイルで表示
    }
}`}
						/>
						<p class="mt-4 text-sm text-base-content opacity-80">
							TimePickerは再利用可能なSwiftUIコンポーネントです。以下の点を
							参考に実装と配置を行ってください。
						</p>
						<ul class="mt-3 list-inside list-disc space-y-2 text-sm">
							<li>
								ファイル配置: Xcodeプロジェクトの中で「TimePicker.swift」という
								新しいSwiftファイルを作成し、同じターゲットに追加してください。
							</li>
							<li>
								使い始めのタイミング: Swiftで作成したコンポーネントは、
								Xcode上のプロジェクトにファイルを追加してビルドしてから
								使用できるようになります。Svelteのドキュメント上でコードを
								読むことはできますが、このリポジトリ内で直接実行されるわけ ではありません。
							</li>
							<li>
								インポート方法: 親ビュー（例: ContentView.swift）で `import
								SwiftUI`の後に`TimePicker`を普通にインスタンス化して
								使用します。具体例は次のセクションのContentViewの更新で示します。
							</li>
							<li>
								注意点: `@Binding`で受け取る値は親側で`@State`として宣言し、
								呼び出す際に`$`を付けて渡してください（例: `TimePicker(..., selection: $hours)`）。
							</li>
						</ul>
					</div>
					<div class="flex flex-1 items-center justify-center">
						<div class="relative">
							<img
								src="{base}/images/timer/picker.png"
								alt="iPhone mockup"
								class="w-full max-w-xs"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="">
			<h2 class="mb-4 text-3xl font-bold">2. Pickerの詳細</h2>
			<p class="mb-4">
				PickerはSwiftUIで選択肢から値を選択するためのビューです。selectionパラメータで選択された値を@Bindingで受け取り、labelでラベルを設定します。ForEachを使って範囲内の各値をループし、Textで表示します。最後にpickerStyle(.wheel)でホイールスタイルを適用します。
			</p>
			<CodeBlock
				title="ContentViewの条件分岐部分"
				code={`Picker(selection: $selection, label: Text(title)) {  // Pickerを作成、選択値とラベルを設定
    ForEach(Array(range), id: .self) { value in  // rangeの各値をループ
        Text("\(value) \(title)").tag(value)  // 値をテキストとして表示し、タグを設定
    }
}
.pickerStyle(.wheel)`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. TimeSelectionViewの作成</h2>
			<p class="mb-4">
				時間、分、秒の3つのPickerを横に並べたビューを作成します。新しくTimeSelectionView.swiftファイルを作成する必要があります：
			</p>
			<div class="">
				<div class="flex flex-col gap-6 lg:flex-row">
					<div class="flex-1">
						<CodeBlock
							title="TimeSelectionView.swift"
							code={`import SwiftUI  // SwiftUIフレームワークをインポート

struct TimeSelectionView: View {  // TimeSelectionViewという名前のView構造体を定義
    @Binding var hours: Int  // 時間を表すバインディングプロパティ
    @Binding var minutes: Int  // 分を表すバインディングプロパティ
    @Binding var seconds: Int  // 秒を表すバインディングプロパティ
    
    var body: some View {  // Viewのボディを定義
        HStack {  // 水平方向にビューを並べるコンテナ
            TimePicker(title: "時間", range: 0...23, selection: $hours)  // 時間のPickerを表示
            TimePicker(title: "分", range: 0...59, selection: $minutes)  // 分のPickerを表示
            TimePicker(title: "秒", range: 0...59, selection: $seconds)  // 秒のPickerを表示
        }
    }
}`}
						/>
						<p class="mt-4 text-sm text-base-content opacity-80">
							TimeSelectionViewは3つのTimePickerをHStackで横に並べます。各Pickerは時間、分、秒の選択を担当します。
						</p>
						<ul class="mt-3 list-inside list-disc space-y-2 text-sm">
							<li>
								ファイル配置: Xcodeプロジェクト内に「TimeSelectionView.swift」を作成し、
								このファイルと先に作成した`TimePicker.swift`を同じターゲットに追加してください。
							</li>
							<li>
								依存関係:
								`TimeSelectionView`は`TimePicker`を使っているため、両方のファイルがプロジェクト内に存在し、ビルドターゲットに含まれている必要があります。
							</li>
							<li>
								バインディングの渡し方: 親ビュー（例: `ContentView.swift`）側で`@State var hours =
								0`などを定義し、呼び出す側で`TimeSelectionView(hours: $hours, minutes: $minutes,
								seconds: $seconds)`のように`$`を付けて渡します。
							</li>
							<li>
								テスト方法:
								SwiftUIの`#Preview`やXcodeのプレビューで`TimeSelectionView`単体や`ContentView`内で動作確認してください。Svelteページではコード例を読むことはできますが、実行・プレビューはXcodeで行います。
							</li>
							<li>
								拡張案:
								`ForEach`や`Array(range)`の代わりに`Array(range)`を使う形は可読性が高く、将来的にローカライズ（単位表記の変更など）やカスタムスタイルを適用しやすいです。
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="">
				<h2 class="mb-4 text-3xl font-bold">4. TimePickerの使い方</h2>
				<p class="mb-4">
					TimePickerコンポーネントは、指定された範囲から値を選択するためのPickerを提供します。以下の例のように使用します：
				</p>
				<CodeBlock
					title="TimePickerの使用例"
					code={`TimePicker(title: "時間", range: 0...23, selection: $hours)`}
				/>
				<p class="mt-4">
					各パラメータの説明：<br />
					- <code>title</code>: Pickerのラベルとして表示される文字列（例: "時間"）<br />
					- <code>range</code>: 選択可能な値の範囲（例: 0...23）<br />
					- <code>selection</code>:
					選択された値を保持する@Bindingプロパティ（親ビューで@Stateとして定義し、$を付けて渡す）
				</p>
			</div>
		</div>

		<div class="">
			<div class="flex flex-col gap-6 lg:flex-row">
				<div class="flex-1">
					<h2 class="mb-4 text-3xl font-bold">5. ContentViewの更新</h2>
					<p class="mb-4">ContentViewでTimeSelectionViewを使用するように更新します：</p>
					<CodeBlock
						title="ContentView.swift (更新版)"
						code={`import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}

struct ContentView: View {
    @State var timerState: TimerState = .idle
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0
    
    var body: some View {
        VStack {
            if timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                // 後でタイマー表示ビューを追加
                Text("タイマーが実行中です")
                    .font(.largeTitle)
            }
            
            HStack {
                Button("開始") {
                    timerState = .running
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)
                
                Button("キャンセル") {
                    timerState = .idle
                }
                .padding()
                .background(Color.gray)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`}
					/>
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="relative">
						<img src="{base}/images/timer/t31.png" alt="iPhone mockup" class="w-full max-w-xs" />
					</div>
				</div>
			</div>
		</div>
		<div class="">
			<h2 class="mb-4 text-3xl font-bold">6. ContentViewの条件分岐</h2>
			<p class="mb-4">
				ContentViewでは、タイマーの状態に応じて表示するビューを切り替えています。timerStateが.idleの場合は時間選択ビューを表示し、それ以外の場合はタイマー実行中のメッセージを表示します。
			</p>
			<CodeBlock
				title="ContentViewの条件分岐部分"
				code={`if timerState == .idle {  // タイマーが待機状態の場合
    TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)  // 時間選択ビューを表示
} else {  // タイマーが実行中または一時停止の場合
    // 後でタイマー表示ビューを追加
    Text("タイマーが実行中です")  // 実行中のメッセージを表示
}`}
			/>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step4" class="btn btn-lg btn-primary"
			>ステップ4: タイマー表示ビューの実装へ進む</a
		>
	</div>
</div>
