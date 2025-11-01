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
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
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
								TimePickerは再利用可能なコンポーネントです。title, range,
								selectionをパラメータとして受け取り、ホイール型のPickerを表示します。
							</p>
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
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. TimeSelectionViewの作成</h2>
			<p class="mb-4">
				時間、分、秒の3つのPickerを横に並べたビューを作成します。新しくTimeSelectionView.swiftファイルを作成する必要があります：
			</p>
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
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
						</div>
						<div class="flex flex-1 items-center justify-center">
							<div class="relative">
								<img
									src="{base}/images/timer/t31.png"
									alt="iPhone mockup"
									class="w-full max-w-xs"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. ContentViewの更新</h2>
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

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. @Bindingについて</h2>
			<p class="mb-4">@Bindingは親ビューから子ビューへデータを渡すためのプロパティラッパーです：</p>
			<ul class="list-inside list-disc space-y-2">
				<li>親ビューで<code>@State var hours = 0</code>と定義</li>
				<li>子ビューで<code>@Binding var hours: Int</code>と受け取る</li>
				<li>呼び出し時に<code>$hours</code>のように$をつけて渡す</li>
				<li>子ビューでの変更が親ビューに反映される</li>
			</ul>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. Pickerのスタイル</h2>
			<p class="mb-4">Pickerには様々なスタイルがあります：</p>
			<ul class="list-inside list-disc space-y-2">
				<li><code>.pickerStyle(.wheel)</code>: ホイール型（iOS標準）</li>
				<li><code>.pickerStyle(.segmented)</code>: セグメント型</li>
				<li><code>.pickerStyle(.menu)</code>: ドロップダウンメニュー型</li>
			</ul>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step4" class="btn btn-lg btn-primary"
			>ステップ4: タイマー表示ビューの実装へ進む</a
		>
	</div>
</div>
