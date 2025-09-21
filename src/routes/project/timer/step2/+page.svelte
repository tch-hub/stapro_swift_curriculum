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
			<h2 class="mb-4 text-3xl font-bold">1. TimerState enumの追加</h2>
			<p class="mb-4">タイマーの状態を表すenumを定義します：</p>
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
			<h2 class="mb-4 text-3xl font-bold">2. ContentViewの基本構造</h2>
			<p class="mb-4">ContentViewをタイマーアプリの基本構造に変更します：</p>
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="flex flex-col gap-6 lg:flex-row">
						<div class="flex-1">
							<CodeBlock
								title="ContentView.swift"
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
            // ここに時間設定ビューまたはタイマー表示ビューが入る
            Text("タイマーアプリ")
                .font(.largeTitle)
                .padding()
            
            // ここにボタンが入る
            HStack {
                Button("開始") {
                    // タイマーを開始する処理
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)
                
                Button("キャンセル") {
                    // タイマーをキャンセルする処理
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
							<p class="mt-4 text-sm text-base-content opacity-80">
								TimerState
								enumを使ってタイマーの状態を管理します。@Stateでビューの状態を保持し、条件付きレンダリングでUIを切り替えます。
							</p>
						</div>
						<div class="flex flex-1 items-center justify-center">
							<div class="relative">
								<img src="/images/iphone-mock.png" alt="iPhone mockup" class="w-full max-w-xs" />
								<div
									class="absolute top-[12%] left-[8%] flex h-[76%] w-[84%] items-center justify-center rounded-[2rem] bg-base-100"
								>
									<div class="p-4 text-center">
										<div class="mb-4 text-2xl font-bold">基本画面</div>
										<div class="space-y-2">
											<div class="text-sm opacity-70">ここにタイトルとボタンが表示されます</div>
											<div class="text-sm opacity-70">ステップ3で時間設定ビューが追加されます</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. 条件付きレンダリングの準備</h2>
			<p class="mb-4">タイマーの状態によって表示を切り替える準備をします：</p>
			<CodeBlock
				title="条件付きレンダリングの例"
				code={`var body: some View {
    VStack {
        if timerState == .idle {
            // 時間設定ビューを表示
            Text("時間を設定してください")
        } else {
            // タイマー表示ビューを表示
            Text("タイマーが実行中です")
        }
        
        // ボタン部分
        HStack {
            // ボタンの実装
        }
    }
    .padding()
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. 実装のポイント</h2>
			<ul class="list-inside list-disc space-y-2">
				<li><code>@State</code>を使ってビューの状態を管理します</li>
				<li><code>enum</code>でタイマーの状態を明確に表現します</li>
				<li><code>if</code>文を使って条件付きでビューを表示します</li>
				<li>ボタンは後で実際の機能を実装します</li>
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
