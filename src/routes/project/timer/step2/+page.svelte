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
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. ContentViewの基本構造を作る</h2>
			<p class="mb-4">今まで学んだことを使って、ContentViewの基本構造を作りましょう。</p>
			<div class="">
				<div class="flex flex-col gap-6 lg:flex-row">
					<div class="flex-1">
						<CodeBlock
							title="ContentView.swift"
							code={`import SwiftUI  // SwiftUIライブラリをインポートして、iOSアプリのUIを作成できるようにする

enum TimerState {  // タイマーの状態を表す列挙型を定義する
    case idle      // 待機中の状態（タイマーが何もしていない）
    case running   // 実行中の状態（タイマーがカウントダウン中）
    case paused    // 一時停止中の状態（タイマーが一時的に止まっている）
}

struct ContentView: View {  // アプリのメイン画面を定義する構造体で、Viewプロトコルに準拠
    @State var timerState: TimerState = .idle  // タイマーの現在の状態を保存する状態変数、初期値は待機中
    @State var hours = 0     // タイマーの時間を保存する状態変数
    @State var minutes = 0   // タイマーの分を保存する状態変数
    @State var seconds = 0   // タイマーの秒を保存する状態変数
    
    var body: some View {  // 画面に表示する内容を定義する計算プロパティ
        VStack {  // 子ビューを垂直方向に並べるスタックビュー
            // ここに時間設定ビューまたはタイマー表示ビューが入る
            Text("タイマーアプリ")  // 「タイマーアプリ」というテキストを表示するビュー
                .font(.largeTitle)  // フォントサイズを大きく設定
                .padding()  // ビュー周囲に余白を追加
            
            // ここにボタンが入る
            HStack {  // 子ビューを水平方向に並べるスタックビュー
                Button("開始") {  // 「開始」というラベルのボタンを作成
                    // タイマーを開始する処理（後で実装）
                }
                .padding()  // ボタン周囲に余白を追加
                .background(Color.green)  // ボタンの背景色を緑に設定
                .foregroundColor(.white)  // ボタンの文字色を白に設定
                .cornerRadius(10)  // ボタンの角を丸くする
                
                Button("キャンセル") {  // 「キャンセル」というラベルのボタンを作成
                    // タイマーをキャンセルする処理（後で実装）
                }
                .padding()  // ボタン周囲に余白を追加
                .background(Color.gray)  // ボタンの背景色を灰に設定
                .foregroundColor(.white)  // ボタンの文字色を白に設定
                .cornerRadius(10)  // ボタンの角を丸くする
            }
        }
        .padding()  // VStack全体に余白を追加
    }
}

#Preview {  // Xcodeのプレビュー機能でこのビューを表示するための設定
    ContentView()  // ContentViewのインスタンスをプレビュー
}`}
						/>
					</div>
					<div class="flex flex-1 items-center justify-center">
						<div class="relative">
							<img src="{base}/images/timer/t21.png" alt="iPhone mockup" class="w-full max-w-xs" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="">
			<h2 class="mb-4 text-3xl font-bold">2. TimerState enumとは？</h2>
			<p class="mb-4">
				まず、タイマーの状態を表すための「enum」というものを学びましょう。enumは、プログラムで「選択肢」を表すのに便利なものです。
			</p>
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
			<h2 class="mb-4 text-3xl font-bold">3. @Stateとは？</h2>
			<p class="mb-4">
				SwiftUIでは画面に表示するデータを「状態」として扱います。@StateはViewの内部で値を保持し、
				その値が変わると自動で画面が更新される仕組みを提供する属性（プロパティラッパー）です。
			</p>
			<p class="mb-4">
				例として、タイマーの残り時間や現在の動作状態（待機・実行・一時停止）などを@Stateで管理します。
			</p>
			<CodeBlock
				title="@Stateの詳細"
				code={`@State var timerState: TimerState = .idle  // タイマーの現在の状態を保持（初期値: 待機）
@State var hours = 0     // 時間を保持する状態変数
@State var minutes = 0   // 分を保持する状態変数
@State var seconds = 0   // 秒を保持する状態変数`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. VStackの使い方</h2>
			<p class="mb-4">
				VStackは、SwiftUIでビューを垂直方向（縦）に並べるためのコンテナです。テキストやボタンなどの要素を上から下へ順番に配置したいときに使います。
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li><strong>垂直配置</strong>: 子ビューを上から下へ並べます</li>
				<li>
					<strong>スペース調整</strong>: spacingパラメータを使ってビュー間の間隔を調整できます
				</li>
				<li>
					<strong>配置オプション</strong>:
					alignmentパラメータで水平方向の配置（左揃え、中央揃え、右揃え）を指定できます
				</li>
			</ul>
			<CodeBlock
				title="VStackの例"
				code={`VStack {
	Text("タイマーアプリ")
	HStack {}
}
`}
			/>
		</div>
		<div>
			<h2 class="mb-4 text-3xl font-bold">5. HStackの使い方</h2>
			<p class="mb-4">
				HStackは、SwiftUIでビューを水平方向（横）に並べるためのコンテナです。ボタンやテキストなどの要素を左から右へ順番に配置したいときに使います。
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li><strong>水平配置</strong>: 子ビューを左から右へ並べます</li>
				<li>
					<strong>スペース調整</strong>: spacingパラメータを使ってビュー間の間隔を調整できます
				</li>
				<li>
					<strong>配置オプション</strong>:
					alignmentパラメータで垂直方向の配置（上揃え、中央揃え、下揃え）を指定できます
				</li>
			</ul>
			<CodeBlock
				title="VStackとHStackの例"
				code={`HStack {
	Button("開始")
	Button("キャンセル")
}
`}
			/>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step3" class="btn btn-lg btn-primary"
			>ステップ3: 時間選択ビューの実装へ進む</a
		>
	</div>
</div>
