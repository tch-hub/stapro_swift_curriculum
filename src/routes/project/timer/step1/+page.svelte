<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ1: プロジェクトの作成とセットアップ</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer" class="btn btn-outline">← プロジェクト概要に戻る</a>
		<a href="{base}/project/timer/step2" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>Xcodeでの新規プロジェクト作成</li>
				<li>SwiftUIプロジェクトの基本構造</li>
				<li>プロジェクトファイルの理解</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. Xcodeで新規プロジェクトを作成</h2>
			<ol class="mb-6 list-inside list-decimal space-y-2">
				<li>Xcodeを起動します</li>
				<li>「Create a new Xcode project」を選択</li>
				<li>「App」を選択して「Next」をクリック</li>
				<li>
					以下の設定を入力：
					<ul class="mt-2 ml-8 list-inside list-disc">
						<li>Product Name: Timer</li>
						<li>Interface: SwiftUI</li>
						<li>Language: Swift</li>
					</ul>
				</li>
				<li>保存場所を選択してプロジェクトを作成</li>
			</ol>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. プロジェクト構造の確認</h2>
			<p class="mb-4">プロジェクト作成後、以下のファイルが自動生成されます：</p>
			<div class="mockup-code mb-6">
				<pre><code
						>Timer/
├── TimerApp.swift          # アプリのメインエントリーポイント
├── ContentView.swift        # メインのビュー
├── Assets.xcassets/         # 画像や色などのアセット
│   └── Contents.json
├── Preview Content/         # プレビュー用
└── Timer.xcodeproj          # プロジェクトファイル</code
					></pre>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. 初期コードの確認</h2>
			<p class="mb-4">プロジェクト作成直後のTimerApp.swiftの内容を確認しましょう：</p>
			<CodeBlock
				title="TimerApp.swift"
				code={`import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. ContentView.swiftの確認</h2>
			<p class="mb-4">初期のContentView.swiftは以下のようになっています：</p>
			<CodeBlock
				title="ContentView.swift"
				code={`import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`}
			/>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step2" class="btn btn-lg btn-primary"
			>ステップ2: 基本的なUIの作成へ進む</a
		>
	</div>
</div>
