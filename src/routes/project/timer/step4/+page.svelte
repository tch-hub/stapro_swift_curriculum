<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ステップ4: タイマー表示ビューの実装</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/timer/step3" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/timer/step5" class="btn btn-primary">次のステップ →</a>
	</div>

	<!-- ステップ説明 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">このステップで学ぶこと</h2>
			<ul class="list-inside list-disc">
				<li>ZStackを使ったビュー重ね</li>
				<li>Circleとtrimを使った円形プログレスバー</li>
				<li>SwiftUI Animationの基本</li>
				<li>計算プロパティ</li>
				<li>時間フォーマットの方法</li>
			</ul>
		</div>
	</div>

	<!-- 手順 -->
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-3xl font-bold">1. TimerDisplayViewの作成</h2>
			<p class="mb-4">タイマーの残り時間を円形のプログレスバーで表示するビューを作成します：</p>
			<div class="">
				<div class="flex flex-col gap-6 lg:flex-row">
					<div class="flex-1">
						<CodeBlock
							title="TimerDisplayView.swift"
							code={`import SwiftUI

struct TimerDisplayView: View {
    var remainingTime: Int  // 残り時間（秒）
    var totalTime: Int      // 合計時間（秒）
    
    // 完了率を計算するプロパティ
    var completionPercentage: Double {
        return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
    }
    
    var body: some View {
        ZStack {
            // 円形プログレスバー
            Circle()
                .trim(from: 0.0, to: CGFloat(completionPercentage))
                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .foregroundColor(.orange)
                .rotationEffect(Angle(degrees: 270))  // 上から始まるように回転
                .animation(.linear, value: completionPercentage)
                .padding(10)
            
            // 時間表示テキスト
            Text(formatTime(seconds: remainingTime))
                .font(.system(size: 70))
        }
    }
    
    // 秒数を「HH:MM:SS」形式に変換
    func formatTime(seconds: Int) -> String {
        let hours = seconds / 3600
        let minutes = (seconds % 3600) / 60
        let seconds = seconds % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
}`}
						/>

						<!-- 円形プログレスバー各行の個別解説 -->
						<div class="mt-4 text-sm text-base-content opacity-80">
							<p>
								TimerDisplayViewはZStackを使って円形プログレスバーと時間表示を重ねます。以下はプログレスバーを構成する各行の説明です。
							</p>
							<ul class="mt-2 ml-4 list-inside list-disc">
								<li>
									<code>Circle()</code>:
									SwiftUIの基本的な図形ビューで、ここではプログレスのベースとなる円を描画します。
								</li>
								<li>
									<code>.trim(from: 0.0, to: CGFloat(completionPercentage))</code>:
									円の一部だけを表示するための修飾子です。<code>from</code>と<code>to</code
									>は0〜1の割合で開始位置と終了位置を指定します。<code>completionPercentage</code
									>に応じて表示される円弧の長さが変わります。
								</li>
								<li>
									<code>.stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))</code>:
									図形を塗りつぶすのではなく線で描画します。ここでは線幅を10にし、<code
										>lineCap</code
									>を<code>.round</code>にすることで線の端が丸くなります。<em>注意:</em>
									<code>trim</code>で切り取った後に<code>stroke</code
									>を適用することで、切り取られた円弧に対して線が引かれます。
								</li>
								<li>
									<code>.foregroundColor(.orange)</code>:
									図形または線の色を指定します。ここでは進捗を分かりやすくするためオレンジ色に設定しています。
								</li>
								<li>
									<code>.rotationEffect(Angle(degrees: 270))</code>:
									円全体を回転させます。デフォルトだと円の開始位置は右（3時）方向なので、270度回転させることで表示が上（12時）から始まるように調整しています。
								</li>
								<li>
									<code>.animation(.linear, value: completionPercentage)</code>:
									<code>completionPercentage</code> の変化に対してアニメーションを適用します。ここでは線形イージング（linear）を使い、値が変わると円弧の長さが滑らかに変化します。
								</li>
								<li>
									<code>.padding(10)</code>:
									ビューの周囲に余白を追加します。親コンテナとの余白を確保して、円が端に張り付かないようにします。
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">2. 各要素の説明</h2>
			<div class="space-y-4">
				<div>
					<h3 class="text-xl font-semibold">ZStack</h3>
					<p>ZStackはビューを重ねて表示します。プログレスバーとテキストを重ねます。</p>
				</div>

				<div>
					<h3 class="text-xl font-semibold">Circle().trim()</h3>
					<p>Circleをtrimで一部だけ表示することで円弧を作成します。</p>
					<ul class="ml-4 list-inside list-disc">
						<li><code>from: 0.0</code>: 開始位置（12時方向）</li>
						<li><code>to: CGFloat(completionPercentage)</code>: 終了位置（完了率に応じて）</li>
					</ul>
				</div>

				<div>
					<h3 class="text-xl font-semibold">rotationEffect</h3>
					<p>円を回転させて、上から時計回りにプログレスが進むようにします。</p>
				</div>

				<div>
					<h3 class="text-xl font-semibold">animation</h3>
					<p>completionPercentageの変化をアニメーションで滑らかに表示します。</p>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">3. ContentViewの更新</h2>
			<p class="mb-4">ContentViewでTimerDisplayViewを使用するように更新します：</p>
			<!-- コード表示と画像を横並び（レスポンシブで縦並びにも）に配置 -->
			<div class="flex flex-col gap-6 lg:flex-row">
				<div class="flex-1">
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
    
	// 仮の残り時間（後でViewModelから取得）
	@State var remainingTime = 3600  // 1時間
	@State var totalTime = 3600       // 1時間
    
	var body: some View {
		VStack {
			if timerState == .idle {
				TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
			} else {
				TimerDisplayView(remainingTime: remainingTime, totalTime: totalTime)
			}
            
			HStack {
				Button("開始") {
					timerState = .running
					// 選択された時間を秒に変換
					totalTime = hours * 3600 + minutes * 60 + seconds
					remainingTime = totalTime
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
						<img src="{base}/images/timer/t41.png" alt="iPhone mockup" class="w-full max-w-xs" />
					</div>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-3xl font-bold">4. 計算プロパティについて</h2>
			<p class="mb-4">計算プロパティは、値の計算結果をプロパティのように扱えます：</p>
			<CodeBlock
				title="計算プロパティの例"
				code={`var completionPercentage: Double {
    return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
}`}
			/>
		</div>
	</div>

	<!-- 次のステップ -->
	<div class="mt-12 text-center">
		<a href="{base}/project/timer/step5" class="btn btn-lg btn-primary"
			>ステップ5: ViewModelの作成へ進む</a
		>
	</div>
</div>
