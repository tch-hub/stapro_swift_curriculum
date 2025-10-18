<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ2: 基本的なUIの作成</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step1" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step3" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>SwiftUIでの基本的なレイアウト（VStack, HStack）</li>
				<li>状態管理の基本（@State）</li>
				<li>enumを使った状態の表現</li>
				<li>条件付きレンダリング（if文）</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. TimerState enumとは？</h2>
			<p class="mb-4">
				まず、タイマーの状態を表すための「enum」というものを学びましょう。enumは、プログラムで「選択肢」を表すのに便利なものです。
			</p>
			<CodeBlock
				title="enumの例"
				code={`// 例: 果物の種類を表すenum
enum Fruit {
    case apple    // りんご
    case banana   // バナナ
    case orange   // オレンジ
}`}
			/>
			<p class="mb-4">タイマーアプリでは、タイマーの状態を3つに分けます：</p>
			<ul class="mb-4 list-inside list-disc">
				<li><strong>idle</strong>: 待機中（まだ何もしていない状態）</li>
				<li><strong>running</strong>: 実行中（タイマーが動いている状態）</li>
				<li><strong>paused</strong>: 一時停止中（タイマーが止まっている状態）</li>
			</ul>
			<CodeBlock
				title="TimerState enum"
				code={`enum TimerState {
    case idle      // 待機中
    case running   // 実行中
    case paused    // 一時停止中
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. @Stateとは？</h2>
			<p class="mb-4">
				SwiftUIでは、画面に表示する情報を「状態」として管理します。@Stateは、その状態を保存しておくための特別なキーワードです。
			</p>
			<p class="mb-4">例えば、タイマーの時間を保存したり、現在の状態を保存したりします。</p>
			<CodeBlock
				title="@Stateの例"
				code={`@State var hours = 0     // 時間を保存
@State var minutes = 0   // 分を保存
@State var seconds = 0   // 秒を保存
@State var timerState: TimerState = .idle  // タイマーの状態を保存`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. VStackとHStackとは？</h2>
			<p class="mb-4">SwiftUIでは、画面のレイアウトを「スタック」と呼ばれるもので作ります。</p>
			<ul class="mb-4 list-inside list-disc">
				<li><strong>VStack</strong>: 縦（Vertical）に並べるスタック</li>
				<li><strong>HStack</strong>: 横（Horizontal）に並べるスタック</li>
			</ul>
			<CodeBlock
				title="VStackとHStackの例"
				code={`VStack {        // 縦に並べる
    Text("上")     // 上に表示
    Text("下")     // 下に表示
}

HStack {        // 横に並べる
    Text("左")     // 左に表示
    Text("右")     // 右に表示
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. ContentViewの基本構造を作る</h2>
			<p class="mb-4">今まで学んだことを使って、ContentViewの基本構造を作りましょう。</p>
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex flex-col gap-6 lg:flex-row">
						<div class="flex-1">
							<CodeBlock
								title="ContentView.swift"
								code={`import SwiftUI  // SwiftUIというライブラリを読み込む。これでiOSアプリの画面を作れるようになる

enum TimerState {  // タイマーの状態を表すための選択肢を定義する
    case idle      // 待機中（何もしていない状態）
    case running   // 実行中（タイマーが動いている状態）
    case paused    // 一時停止中（タイマーが止まっている状態）
}

struct ContentView: View {  // アプリのメイン画面を定義する構造体
    @State var timerState: TimerState = .idle  // タイマーの現在の状態を保存する変数。最初は待機中
    @State var hours = 0     // タイマーの時間を保存する変数
    @State var minutes = 0   // タイマーの分を保存する変数
    @State var seconds = 0   // タイマーの秒を保存する変数
    
    var body: some View {  // 画面に表示する内容を定義する部分
        VStack {  // 縦に並べるレイアウトを使う
            // ここに時間設定ビューまたはタイマー表示ビューが入る
            Text("タイマーアプリ")  // 画面に「タイマーアプリ」という文字を表示
                .font(.largeTitle)  // 文字を大きくする
                .padding()  // 文字の周りに余白を追加
            
            // ここにボタンが入る
            HStack {  // 横に並べるレイアウトを使う
                Button("開始") {  // 「開始」というボタンを作る
                    // タイマーを開始する処理（後で実装）
                }
                .padding()  // ボタンの周りに余白を追加
                .background(Color.green)  // ボタンの背景を緑色にする
                .foregroundColor(.white)  // 文字を白くする
                .cornerRadius(10)  // ボタンの角を丸くする
                
                Button("キャンセル") {  // 「キャンセル」というボタンを作る
                    // タイマーをキャンセルする処理（後で実装）
                }
                .padding()  // ボタンの周りに余白を追加
                .background(Color.gray)  // ボタンの背景を灰色にする
                .foregroundColor(.white)  // 文字を白くする
                .cornerRadius(10)  // ボタンの角を丸くする
            }
        }
        .padding()  // 全体の周りに余白を追加
    }
}

#Preview {  // Xcodeでプレビューを表示するための設定
    ContentView()  // ContentViewをプレビューする
}`}
							/>
							<p class="mt-4 text-sm text-base-content opacity-80">
								このコードでは、<strong>TimerState enum</strong
								>を使ってタイマーの状態を管理しています。例えば、「待機中」「実行中」「一時停止中」の3つの状態を明確に分け、プログラムが今何をしているかをわかりやすくしています。これにより、タイマーが動いているのか止まっているのかを簡単に判断できます。<br
								/><br />
								<strong>@State</strong
								>は、画面に表示する情報を保存しておくためのものです。例えば、タイマーの時間や現在の状態を保存し、情報が変わると自動的に画面が更新されます。これがないと、ボタンを押しても画面が変わりません。<br
								/><br />
								<strong>条件付きレンダリング</strong
								>は、「もし～なら」という条件で画面の表示を変える機能です。例えば、タイマーが待機中の時は時間設定画面を表示し、実行中の時はカウントダウン画面を表示します。これで、アプリが状況に合わせて自然に画面が変わります。
							</p>
						</div>
						<div class="flex flex-1 items-center justify-center">
							<div class="relative">
								<img src="images\timer\timer.png" alt="iPhone mockup" class="w-full max-w-xs" />
								<!-- <div
									class="absolute top-[12%] left-[8%] flex h-[76%] w-[84%] items-center justify-center rounded-[2rem] bg-base-100"
								>
									<div class="p-4 text-center">
										<div class="mb-4 text-2xl font-bold">基本画面</div>
										<div class="space-y-2">
											<div class="text-sm opacity-70">ここにタイトルとボタンが表示されます</div>
											<div class="text-sm opacity-70">ステップ3で時間設定ビューが追加されます</div>
										</div>
									</div>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">5. if文で条件付き表示</h2>
			<p class="mb-4">
				プログラムでは、「もし～なら」という条件で表示を変えることができます。これを「条件付きレンダリング」と言います。
			</p>
			<p class="mb-4">例えば、タイマーの状態によって違う画面を表示します：</p>
			<CodeBlock
				title="if文の例"
				code={`if timerState == .idle {
    // 待機中の時は時間設定画面を表示
    Text("時間を設定してください")
} else {
    // 実行中や一時停止中の時はタイマー画面を表示
    Text("タイマーが動いています")
}`}
			/>
			<p class="mb-4">これで、タイマーの状態が変わると自動的に画面が変わります。</p>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">6. 実装のポイントまとめ</h2>
			<ul class="list-inside list-disc space-y-2">
				<li><code>@State</code>で画面の情報を保存します</li>
				<li><code>enum</code>で選択肢をきれいに表します</li>
				<li><code>VStack</code>と<code>HStack</code>でレイアウトを作ります</li>
				<li><code>if</code>文で条件によって表示を変えます</li>
				<li>ボタンは後で実際の機能をつけます</li>
			</ul>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step3" class="btn btn-lg btn-primary"
			>ステップ3: 時間選択ビューの実装へ進む</a
		>
	</div>
</div>
