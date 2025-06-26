<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // コードコピー機能
  function copyToClipboard(code, buttonId) {
    navigator.clipboard.writeText(code).then(() => {
      const button = document.getElementById(buttonId);
      const originalText = button.innerHTML;
      button.innerHTML = "<i>check</i><span>コピー完了！</span>";
      button.classList.add("tertiary");

      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove("tertiary");
      }, 2000);
    });
  }
</script>

<svelte:head>
  <title>Step 6: カスタムボタンコンポーネント - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="再利用可能でスタイリッシュなカスタムボタンコンポーネントを作成し、タイマーアプリのUIを完成させます。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">smart_button</i>
      </h1>
      <h2>Step 6: カスタムボタンコンポーネント</h2>
      <p class="large-text">美しく機能的なカスタムボタンを作成しよう</p>
      <div class="space"></div>
      <div class="chip primary">
        <span>Step 6 / 8</span>
      </div>
      <div class="chip secondary">
        <span>UIコンポーネント・ボタン</span>
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
          <li>再利用可能なボタンコンポーネントの設計</li>
          <li>ButtonStyleプロトコルの使い方</li>
          <li>タップ時の視覚的フィードバック</li>
          <li>アクセシビリティ対応</li>
        </ul>
      </article>
    </div>
    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="secondary-text">engineering</i> 実装するもの</h6>
        <ul>
          <li>プライマリボタン（開始・停止用）</li>
          <li>セカンダリボタン（リセット用）</li>
          <li>アイコン付きボタン</li>
          <li>状態に応じた動的スタイル</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- SwiftUIボタンの基本 -->
<section>
  <h3>SwiftUIボタンの基本</h3>
  <p>
    SwiftUIでは、Buttonビューを使って様々なボタンを作成できます。基本的な使い方から確認しましょう。
  </p>

  <div class="space"></div>

  <div class="grid">
    <article class="round border padding s12 m6">
      <h6><i class="primary-text">radio_button_checked</i> 基本的なButton</h6>
      <CodeBlock
        code={`Button("クリック") {
    print("ボタンがタップされました")
}`}
      />
      <p class="small-text">シンプルなテキストボタン</p>
    </article>

    <article class="round border padding s12 m6">
      <h6><i class="secondary-text">palette</i> スタイル付きButton</h6>
      <CodeBlock
        code={`Button("クリック") {
    // アクション
}
.buttonStyle(.borderedProminent)`}
      />
      <p class="small-text">標準のスタイルを適用</p>
    </article>
  </div>
</section>

<div class="space"></div>

<!-- CustomButtonコンポーネントの作成 -->
<section>
  <h3>CustomButtonコンポーネントの実装</h3>

  <article class="round border padding">
    <h6><i class="primary-text">add</i> 新しいファイルを作成</h6>
    <p>Componentsフォルダに新しいSwiftファイルを作成します：</p>
    <ol>
      <li>
        Xcodeのプロジェクトナビゲーターで「Components」フォルダを右クリック
      </li>
      <li>「New File...」を選択</li>
      <li>「Swift File」を選択し、ファイル名を「CustomButton.swift」に設定</li>
    </ol>
  </article>
</section>

<div class="space"></div>

<!-- CustomButton.swiftの実装 -->
<section>
  <h3>CustomButton.swiftの実装</h3>

  <article class="round border padding">
    <h6><i class="primary-text">code</i> CustomButton.swift</h6>
    <p>
      以下のコードを新しく作成したCustomButton.swiftファイルに入力してください：
    </p>
    <div class="space"></div>
    <CodeBlock
      code={`import SwiftUI

// ボタンのスタイルを定義するenum
enum ButtonVariant {
    case primary
    case secondary
    case danger
    case success
}

// メインのカスタムボタンコンポーネント
struct CustomButton: View {
    let title: String
    let icon: String?
    let variant: ButtonVariant
    let isDisabled: Bool
    let isLoading: Bool
    let action: () -> Void

    // デフォルト値を持つイニシャライザ
    init(
        _ title: String,
        icon: String? = nil,
        variant: ButtonVariant = .primary,
        isDisabled: Bool = false,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.variant = variant
        self.isDisabled = isDisabled
        self.isLoading = isLoading
        self.action = action
    }

    var body: some View {
        Button(action: {
            if !isDisabled && !isLoading {
                // ハプティックフィードバック（振動）
                let impactFeedback = UIImpactFeedbackGenerator(style: .medium)
                impactFeedback.impactOccurred()
                action()
            }
        }) {
            HStack(spacing: 8) {
                // ローディング表示またはアイコン
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                        .foregroundStyle(textColor)
                } else if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                }
                // ボタンテキスト
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
            }
            .foregroundStyle(textColor)
            .frame(minWidth: 120, minHeight: 50)
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: 25))
            .overlay(
                RoundedRectangle(cornerRadius: 25)
                    .stroke(borderColor, lineWidth: borderWidth)
            )
            .scaleEffect(isPressed ? 0.95 : 1.0)
            .opacity(isDisabled ? 0.6 : 1.0)
            .shadow(
                color: shadowColor,
                radius: isPressed ? 2 : 4,
                x: 0,
                y: isPressed ? 1 : 2
            )
        }
        .disabled(isDisabled || isLoading)
        .buttonStyle(PressedButtonStyle())
    }

    // 押下状態の判定
    @State private var isPressed = false

    // バリアントに応じた背景色
    private var backgroundColor: Color {
        switch variant {
        case .primary:
            return .blue
        case .secondary:
            return Color(.systemGray6)
        case .danger:
            return .red
        case .success:
            return .green
        }
    }

    // バリアントに応じたテキスト色
    private var textColor: Color {
        switch variant {
        case .primary, .danger, .success:
            return .white
        case .secondary:
            return .primary
        }
    }

    // バリアントに応じた境界線色
    private var borderColor: Color {
        switch variant {
        case .secondary:
            return Color(.systemGray4)
        default:
            return .clear
        }
    }

    // 境界線の太さ
    private var borderWidth: CGFloat {
        variant == .secondary ? 1 : 0
    }

    // 影の色
    private var shadowColor: Color {
        backgroundColor.opacity(0.3)
    }
}

// カスタムボタンスタイル
struct PressedButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// アイコンボタン専用のコンポーネント
struct IconButton: View {
    let icon: String
    let variant: ButtonVariant
    let size: CGFloat
    let action: () -> Void

    init(
        icon: String,
        variant: ButtonVariant = .primary,
        size: CGFloat = 44,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.variant = variant
        self.size = size
        self.action = action
    }

    var body: some View {
        Button(action: {
            let impactFeedback = UIImpactFeedbackGenerator(style: .light)
            impactFeedback.impactOccurred()
            action()
        }) {
            Image(systemName: icon)
                .font(.system(size: size * 0.4, weight: .medium))
                .foregroundStyle(textColor)
                .frame(width: size, height: size)
                .background(backgroundColor)
                .clipShape(Circle())
                .shadow(color: backgroundColor.opacity(0.3), radius: 2, x: 0, y: 1)
        }
        .buttonStyle(PressedButtonStyle())
    }

    private var backgroundColor: Color {
        switch variant {
        case .primary: return .blue
        case .secondary: return Color(.systemGray5)
        case .danger: return .red
        case .success: return .green
        }
    }

    private var textColor: Color {
        switch variant {
        case .primary, .danger, .success: return .white
        case .secondary: return .primary
        }
    }
}

// タイマー専用のコントロールボタン
struct TimerControlButton: View {
    let timerState: TimerState
    let action: () -> Void

    var body: some View {
        CustomButton(
            buttonTitle,
            icon: buttonIcon,
            variant: buttonVariant,
            action: action
        )
    }

    private var buttonTitle: String {
        switch timerState {
        case .stopped:
            return "開始"
        case .running:
            return "停止"
        case .paused:
            return "停止"
        case .finished:
            return "リセット"
        }
    }

    private var buttonIcon: String {
        switch timerState {
        case .stopped, .paused:
            return "play.fill"
        case .running:
            return "pause.fill"
        case .finished:
            return "arrow.clockwise"
        }
    }

    private var buttonVariant: ButtonVariant {
        switch timerState {
        case .stopped, .paused:
            return .success
        case .running:
            return .danger
        case .finished:
            return .primary
        }
    }
}`}
    />
  </article>
</section>

<div class="space"></div>

<!-- コード例 -->
<section>
  <h3>コード例</h3>
  <CodeBlock
    code={`let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
		print("Timer fired!")
	}`}
  />
</section>
<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="grid">
    <div class="s6">
      <a
        href="{base}/projects/timer/step5"
        class="button transparent primary-text"
      >
        <i>arrow_back</i>
        <span>Step 5に戻る</span>
      </a>
    </div>
    <div class="s6 right-align">
      <a href="{base}/projects/timer/step7" class="button primary">
        <span>Step 7へ進む</span>
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
