<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Step 5: 円形プログレスバーの実装 - Swift学習カリキュラム</title>
	<meta name="description" content="SwiftUIでカスタムの円形プログレスバーを作成し、タイマーの進捗を視覚的に表示します。" />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
	<div class="grid">
		<div class="s12 center-align">
			<h1 class="primary-text">
				<i class="large">donut_large</i>
			</h1>
			<h2>Step 5: 円形プログレスバーの実装</h2>
			<p class="large-text">美しい円形プログレスバーでタイマーの進捗を表示しよう</p>
			<div class="space"></div>
			<div class="chip primary">
				<span>Step 5 / 8</span>
			</div>
			<div class="chip secondary">
				<span>カスタム描画・アニメーション</span>
			</div>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- 学習目標 -->
<section>
	<h3>このステップで学ぶこと</h3>
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">target</i> 学習目標</h6>
				<ul>
					<li>SwiftUIのPathとStrokeの使い方</li>
					<li>カスタム描画とGraphics Context</li>
					<li>アニメーションの実装方法</li>
					<li>ZStackを使ったレイヤー構造</li>
				</ul>
			</article>
		</div>
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">engineering</i> 実装するもの</h6>
				<ul>
					<li>円形の背景トラック</li>
					<li>進捗を示すプログレスバー</li>
					<li>中央の時間表示</li>
					<li>スムーズなアニメーション効果</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- SwiftUIの描画システム -->
<section>
	<h3>SwiftUIの描画システム</h3>
	<p>SwiftUIでは、Pathを使って自由な形状を描画できます。円形プログレスバーの基本概念を理解しましょう。</p>
	
	<div class="space"></div>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">circle</i> Circleの基本</h6>
				<CodeBlock code={`Circle()
    .stroke(Color.blue, lineWidth: 10)
    .frame(width: 200, height: 200)`} />
				<p class="small-text">基本的な円の輪郭を描画</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">rotate</i> 部分的な円弧</h6>
				<CodeBlock code={`Circle()
    .trim(from: 0, to: 0.5) // 50%まで表示
    .stroke(Color.red, lineWidth: 10)`} />
				<p class="small-text">円の一部分だけを表示</p>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- CircularProgressViewの作成 -->
<section>
	<h3>CircularProgressViewの実装</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">add</i> 新しいファイルを作成</h6>
		<p>Componentsフォルダに新しいSwiftファイルを作成します：</p>
		<ol>
			<li>Xcodeのプロジェクトナビゲーターで「Components」フォルダを右クリック</li>
			<li>「New File...」を選択</li>
			<li>「Swift File」を選択し、ファイル名を「CircularProgressView.swift」に設定</li>
		</ol>
	</article>
</section>

<div class="space"></div>

<!-- CircularProgressView.swiftの実装 -->
<section>
	<h3>CircularProgressView.swiftの実装</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">code</i> CircularProgressView.swift</h6>
		<p>以下のコードを新しく作成したCircularProgressView.swiftファイルに入力してください：</p>
		
		<div class="space"></div>

		<CodeBlock code={`import SwiftUI

struct CircularProgressView: View {
    // プログレスの値（0.0 - 1.0）
    let progress: Double
    // 中央に表示するテキスト
    let centerText: String
    // 線の太さ
    let lineWidth: CGFloat
    // プログレスバーの色
    let progressColor: Color
    // 背景トラックの色
    let trackColor: Color
    
    // デフォルト値を持つイニシャライザ
    init(
        progress: Double,
        centerText: String,
        lineWidth: CGFloat = 20,
        progressColor: Color = .blue,
        trackColor: Color = Color(.systemGray5)
    ) {
        self.progress = progress
        self.centerText = centerText
        self.lineWidth = lineWidth
        self.progressColor = progressColor
        self.trackColor = trackColor
    }
    
    var body: some View {
        ZStack {
            // 背景トラック（グレーの円）
            Circle()
                .stroke(trackColor, lineWidth: lineWidth)
            
            // プログレスバー（青い円弧）
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    progressColor,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round // 端を丸くする
                    )
                )
                .rotationEffect(.degrees(-90)) // 上から開始するように回転
                .animation(.easeInOut(duration: 0.5), value: progress)
            
            // 中央のテキスト
            VStack(spacing: 4) {
                Text(centerText)
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)
                
                Text("残り時間")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(width: 250, height: 250)
    }
}

// より詳細なカスタマイズが可能なバージョン
struct EnhancedCircularProgressView: View {
    let progress: Double
    let centerText: String
    let subtitle: String?
    let size: CGFloat
    let lineWidth: CGFloat
    let progressColor: Color
    let trackColor: Color
    let showPercentage: Bool
    
    init(
        progress: Double,
        centerText: String,
        subtitle: String? = nil,
        size: CGFloat = 250,
        lineWidth: CGFloat = 20,
        progressColor: Color = .blue,
        trackColor: Color = Color(.systemGray5),
        showPercentage: Bool = false
    ) {
        self.progress = progress
        self.centerText = centerText
        self.subtitle = subtitle
        self.size = size
        self.lineWidth = lineWidth
        self.progressColor = progressColor
        self.trackColor = trackColor
        self.showPercentage = showPercentage
    }
    
    var body: some View {
        ZStack {
            // 背景トラック
            Circle()
                .stroke(trackColor, lineWidth: lineWidth)
            
            // プログレスバー
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    // グラデーション効果
                    AngularGradient(
                        colors: [progressColor.opacity(0.5), progressColor],
                        center: .center,
                        startAngle: .degrees(-90),
                        endAngle: .degrees(-90 + 360 * progress)
                    ),
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut(duration: 0.5), value: progress)
            
            // 中央のコンテンツ
            VStack(spacing: 8) {
                Text(centerText)
                    .font(.system(size: size * 0.12, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)
                
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: size * 0.06, weight: .medium))
                        .foregroundStyle(.secondary)
                }
                
                if showPercentage {
                    Text("\\(Int(progress * 100))%")
                        .font(.system(size: size * 0.08, weight: .semibold))
                        .foregroundStyle(progressColor)
                }
            }
        }
        .frame(width: size, height: size)
    }
}

// プレビュー用のコード
#Preview("基本版") {
    VStack(spacing: 30) {
        CircularProgressView(
            progress: 0.7,
            centerText: "03:25"
        )
        
        CircularProgressView(
            progress: 0.3,
            centerText: "01:30",
            progressColor: .red
        )
    }
    .padding()
}

#Preview("詳細版") {
    VStack(spacing: 30) {        EnhancedCircularProgressView(
            progress: 0.6,
            centerText: "05:30",
            subtitle: "残り時間",
            progressColor: .green,
            showPercentage: true
        )

        EnhancedCircularProgressView(
            progress: 0.9,
            centerText: "00:45",
            subtitle: "もうすぐ終了",
            size: 200,
            lineWidth: 15,
            progressColor: .orange
        )
    }
    .padding()
}
`} />
	</article>
</section>

<div class="space"></div>

<!-- コードの詳細解説 -->
<section>
	<h3>コードの詳細解説</h3>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">crop</i> trim修飾子</h6>
				<div class="code-container small">
					<CodeBlock code={`Circle()
    .trim(from: 0, to: progress)`} />
				</div>
				<p class="small-text">円の一部分だけを表示します。progressが0.5なら50%の円弧を表示。</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="secondary-text">rotate_right</i> rotationEffect</h6>
				<div class="code-container small">
					<CodeBlock code={`.rotationEffect(.degrees(-90))`} />
				</div>
				<p class="small-text">円を-90度回転させて、上（12時の位置）から開始するようにします。</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="tertiary-text">animation</i> アニメーション</h6>
				<div class="code-container small">
					<CodeBlock code={`.animation(.easeInOut(duration: 0.5), value: progress)`} />
				</div>
				<p class="small-text">progressの値が変わるときにスムーズなアニメーションを適用します。</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding">
				<h6><i class="primary-text">layers</i> ZStack</h6>
				<div class="code-container small">
					<CodeBlock code={`ZStack {
    Circle() // 背景
    Circle() // プログレス
    VStack { } // テキスト
}`} />
				</div>
				<p class="small-text">複数の要素を重ねて配置し、レイヤー構造を作成します。</p>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- ViewModelとの統合 -->
<section>
	<h3>ViewModelとの統合</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">integration</i> ContentView.swiftでの使用例</h6>
		<p>Step 4で作成したTimerViewModelと組み合わせて使用する方法：</p>
		
		<div class="space"></div>
		
		<CodeBlock code={`struct ContentView: View {
    @StateObject private var viewModel = TimerViewModel()
    
    var body: some View {
        VStack(spacing: 30) {
            // 円形プログレスバー
            CircularProgressView(
                progress: viewModel.progress,
                centerText: viewModel.formattedTime,
                progressColor: progressColor
            )
            
            // TimePicker（Step 3で作成）
            if viewModel.currentState == .stopped {
                TimePicker(
                    hours: $viewModel.selectedHours,
                    minutes: $viewModel.selectedMinutes,
                    seconds: $viewModel.selectedSeconds
                )
            }
            
            // コントロールボタン
            HStack(spacing: 20) {
                Button(action: {
                    switch viewModel.currentState {
                    case .stopped, .paused:
                        viewModel.startTimer()
                    case .running:
                        viewModel.pauseTimer()
                    case .finished:
                        viewModel.resetTimer()
                    }
                }) {
                    Text(buttonTitle)
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 100, height: 50)
                        .background(progressColor)
                        .clipShape(RoundedRectangle(cornerRadius: 25))
                }
                
                if viewModel.currentState != .stopped {
                    Button("リセット") {
                        viewModel.resetTimer()
                    }
                    .font(.title2)
                    .foregroundStyle(.primary)
                    .frame(width: 100, height: 50)
                    .background(Color(.systemGray5))
                    .clipShape(RoundedRectangle(cornerRadius: 25))
                }
            }
        }
        .padding()
    }
    
    // 進捗に応じて色を変更
    private var progressColor: Color {
        switch viewModel.progress {
        case 0.0..<0.3:
            return .red
        case 0.3..<0.7:
            return .orange
        default:
            return .green
        }
    }
    
    // ボタンのタイトルを状態に応じて変更
    private var buttonTitle: String {
        switch viewModel.currentState {
        case .stopped:
            return "開始"
        case .running:
            return "停止"
        case .paused:
            return "再開"
        case .finished:
            return "リセット"
        }
    }
}`} />
	</article>
</section>

<div class="space"></div>

<!-- アニメーションの詳細 -->
<section>
	<h3>アニメーションの詳細設定</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">animation</i> アニメーションのカスタマイズ</h6>
		<p>より詳細なアニメーション効果を実装することも可能です：</p>
		
		<div class="space"></div>
		
		<CodeBlock code={`// カスタムアニメーション
struct AnimatedCircularProgressView: View {
    let progress: Double
    let centerText: String
    
    var body: some View {
        ZStack {
            // 背景トラック
            Circle()
                .stroke(Color(.systemGray5), lineWidth: 20)
            
            // アニメーション付きプログレスバー
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    LinearGradient(
                        colors: [.blue, .purple],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    style: StrokeStyle(
                        lineWidth: 20,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .animation(
                    .spring(
                        response: 0.6,
                        dampingFraction: 0.8,
                        blendDuration: 0.3
                    ),
                    value: progress
                )
            
            // パルス効果
            Circle()
                .stroke(Color.blue.opacity(0.2), lineWidth: 30)
                .scaleEffect(1.1)
                .opacity(progress > 0 ? 1 : 0)
                .animation(
                    .easeInOut(duration: 1.5)
                    .repeatForever(autoreverses: true),
                    value: progress
                )
            
            // 中央テキスト
            Text(centerText)
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)
                .scaleEffect(progress > 0.9 ? 1.1 : 1.0)
                .animation(.easeInOut(duration: 0.3), value: progress)
        }
        .frame(width: 250, height: 250)
    }
}`} />
	</article>
</section>

<div class="space"></div>

<!-- プレビューでの動作確認 -->
<section>
	<h3>プレビューでの動作確認</h3>
	
	<article class="round border padding">
		<h6><i class="primary-text">preview</i> インタラクティブプレビュー</h6>
		<p>プレビューで実際にプログレスの変化を確認してみましょう：</p>
		
		<div class="space"></div>
		
		<CodeBlock code={`#Preview("インタラクティブ") {
    struct InteractivePreview: View {
        @State private var progress: Double = 0.0

        var body: some View {
            VStack(spacing: 30) {
                CircularProgressView(
                    progress: progress,
                    centerText: String(format: "%.0f%%", progress * 100)
                )

                Slider(value: $progress, in: 0...1)
                    .padding(.horizontal)

                HStack {
                    Button("0%") { progress = 0.0 }
                    Button("25%") { progress = 0.25 }
                    Button("50%") { progress = 0.5 }
                    Button("75%") { progress = 0.75 }
                    Button("100%") { progress = 1.0 }
                }
            }
            .padding()
        }
    }

    return InteractivePreview()
}`} />
	</article>
</section>

<div class="space"></div>

<!-- よくあるエラーと解決方法 -->
<section>
	<h3>よくあるエラーと解決方法</h3>
	
	<div class="grid">
		<div class="s12 m6">
			<article class="round border padding error-container">
				<h6><i class="error-text">warning</i> アニメーションが効かない</h6>
				<div class="code-container small">
					<CodeBlock code={`.animation(.easeInOut, value: progress)`} />
				</div>
				<p class="small-text"><strong>原因:</strong> valueパラメータが不足している</p>
				<p class="small-text"><strong>解決:</strong> アニメーションの対象となる値を明示的に指定</p>
			</article>
		</div>
		
		<div class="s12 m6">
			<article class="round border padding error-container">
				<h6><i class="error-text">warning</i> 円が表示されない</h6>
				<div class="code-container small">
					<CodeBlock code={`Circle().stroke(...)`} />
				</div>
				<p class="small-text"><strong>原因:</strong> frameサイズが設定されていない</p>
				<p class="small-text"><strong>解決:</strong> .frame(width:height:)を追加</p>
			</article>
		</div>
	</div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
	<div class="grid">
		<div class="s6">
			<a href="{base}/projects/timer/step4" class="button transparent primary-text">
				<i>arrow_back</i>
				<span>Step 4に戻る</span>
			</a>
		</div>
		<div class="s6 right-align">
			<a href="{base}/projects/timer/step6" class="button primary">
				<span>Step 6へ進む</span>
				<i>arrow_forward</i>
			</a>
		</div>
	</div>
	
	<div class="space"></div>
	
	<div class="center-align">
		<a href="{base}/projects/timer" class="button transparent secondary-text">
			<i>list</i>
			<span>タイマープロジェクト概要に戻る</span>
		</a>
	</div>
</section>

<style>
	.hero-section {
		padding: 3rem 0;
		background: linear-gradient(135deg, var(--primary-container) 0%, var(--secondary-container) 100%);
		border-radius: 1rem;
		margin-bottom: 2rem;
	}
	
	.large-text {
		font-size: 1.2rem;
		line-height: 1.6;
	}
	
	.code-container {
		position: relative;
		margin: 1rem 0;
	}
	
	.code-container.small {
		margin: 0.5rem 0;
	}

	
	.error-container {
		border-left: 4px solid var(--error);
	}
	
	ol, ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	li {
		margin: 0.25rem 0;
	}
</style>
