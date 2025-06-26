<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // ステップ情報
  const stepInfo = {
    number: 2,
    title: "タイマーの状態を管理するEnum",
    description: "タイマーの3つの状態（待機、実行中、一時停止）を定義しよう",
    duration: "15分",
    difficulty: "初級",
    icon: "category",
  };

  // ナビゲーション情報
  const navigation = {
    prev: {
      title: "ステップ1: プロジェクトの準備",
      href: `${base}/projects/timer/step1`,
    },
    next: {
      title: "ステップ3: 時間設定用のPicker作成",
      href: `${base}/projects/timer/step3`,
    },
  };

  // 完全なSwiftコード
  const fullSwiftCode = `import SwiftUI

// TimerStateを定義
enum TimerState {
    case idle      // 待機中
    case running   // 実行中
    case paused    // 一時停止中
}

struct ContentView: View {
    @State var timerState: TimerState = .idle
    
    var body: some View {
        VStack(spacing: 20) {
            Text("タイマーアプリ")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("現在の状態: \(timerStateText)")
                .font(.title2)
                .foregroundColor(timerStateColor)
            
            Button("状態を変更") {
                changeTimerState()
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
    
    // 状態に応じたテキストを返す
    var timerStateText: String {
        switch timerState {
        case .idle:
            return "待機中"
        case .running:
            return "実行中"
        case .paused:
            return "一時停止中"
        }
    }
    
    // 状態に応じた色を返す
    var timerStateColor: Color {
        switch timerState {
        case .idle:
            return .gray
        case .running:
            return .green
        case .paused:
            return .orange
        }
    }
    
    // 状態を順番に変更する関数
    func changeTimerState() {
        switch timerState {
        case .idle:
            timerState = .running
        case .running:
            timerState = .paused
        case .paused:
            timerState = .idle
        }
    }
}`;
</script>

<svelte:head>
  <title>ステップ2: タイマーの状態管理 - タイマーアプリ作成</title>
  <meta
    name="description"
    content="SwiftでEnumを使ってタイマーの状態を管理する方法を学習。待機、実行中、一時停止の3つの状態を定義。"
  />
</svelte:head>

<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">{stepInfo.icon}</i>
      </h1>
      <h2>ステップ {stepInfo.number}: {stepInfo.title}</h2>
      <p class="large-text">{stepInfo.description}</p>
      <div class="space"></div>
      <div class="chip primary">
        <span>{stepInfo.difficulty}</span>
      </div>
      <div class="chip secondary">
        <span>所要時間: {stepInfo.duration}</span>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 学習目標 -->
<section>
  <div class="center-align">
    <h3>このステップの目標</h3>
    <p class="medium-text">Enumを使った状態管理の基本を理解しよう</p>
  </div>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large primary-text">category</i>
          <h6>Enumの理解</h6>
          <p class="small-text">関連する値をグループ化するEnumの使い方</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large secondary-text">track_changes</i>
          <h6>状態管理</h6>
          <p class="small-text">アプリの状態を明確に定義して管理する方法</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large tertiary-text">alt_route</i>
          <h6>状態遷移</h6>
          <p class="small-text">状態がどのように変化するかを理解する</p>
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- Enumとは -->
<section>
  <h3>🤔 Enumって何？</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 l6">
      <article class="card round">
        <div class="padding">
          <h5>JavaScriptとの比較</h5>
          <div class="space"></div>
          <h6 class="secondary-text">JavaScript（定数を使った場合）</h6>
          <pre class="surface-container round padding"><code
              >const TIMER_STATE = &#123;
  IDLE: &quot;idle&quot;,
  RUNNING: &quot;running&quot;, 
  PAUSED: &quot;paused&quot;
&#125;;

let currentState = TIMER_STATE.IDLE;</code
            ></pre>

          <div class="space"></div>
          <h6 class="primary-text">Swift（Enumを使用）</h6>
          <pre class="primary-container round padding"><code class=""
              >enum TimerState &#123;
    case idle
    case running
    case paused
&#125;

var currentState = TimerState.idle</code
            ></pre>
        </div>
      </article>
    </div>

    <div class="s12 l6">
      <article class="tertiary-container round padding">
        <h5 class="">
          <i>lightbulb</i>
          Enumのメリット
        </h5>
        <div class="space"></div>
        <ul class="">
          <li>
            <strong>型安全性:</strong> 間違った値を代入するとコンパイルエラー
          </li>
          <li><strong>補完機能:</strong> Xcodeが自動的に選択肢を表示</li>
          <li><strong>switch文:</strong> 全ケースを網羅しているかチェック</li>
          <li><strong>読みやすさ:</strong> コードの意図が明確</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 実装手順 -->
<section>
  <h3>📝 実装手順</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">edit</i>
            ステップ 2-1: ContentView.swiftを編集
          </h5>
          <div class="space"></div>
          <ol class="medium-text">
            <li>Xcodeで<strong>ContentView.swift</strong>ファイルを開きます</li>
            <li>
              ファイルの先頭（import SwiftUIの下）にTimerStateを追加します
            </li>
            <li>ContentView structを更新します</li>
          </ol>

          <div class="space"></div>
          <h6>追加するコード:</h6>
          <CodeBlock code={fullSwiftCode} />
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- コード解説 -->
<section>
  <h3>💡 コード解説</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 m6">
      <article class="card round">
        <div class="padding">
          <h6>
            <i class="primary-text">category</i>
            Enum定義
          </h6>
          <CodeBlock
            code={`enum TimerState {
    case idle      // 待機中
    case running   // 実行中
    case paused    // 一時停止中
}`}
          />
          <p class="small-text">
            タイマーの3つの状態を定義。caseキーワードで各状態を宣言します。
          </p>
        </div>
      </article>
    </div>

    <div class="s12 m6">
      <article class="card round">
        <div class="padding">
          <h6>
            <i class="secondary-text">alt_route</i>
            @State変数
          </h6>
          <CodeBlock code={`@State var timerState: TimerState = .idle`} />
          <p class="small-text">
            @Stateで状態を管理。初期値は.idle（待機中）に設定。
          </p>
        </div>
      </article>
    </div>

    <div class="s12 m6">
      <article class="card round">
        <div class="padding">
          <h6>
            <i class="tertiary-text">code</i>
            switch文
          </h6>
          <CodeBlock
            code={`switch timerState {
case .idle:
    return "待機中"
case .running:
    return "実行中"
case .paused:
    return "一時停止中"
}`}
          />
          <p class="small-text">
            Enumの全ケースを網羅するswitch文。型安全で漏れがありません。
          </p>
        </div>
      </article>
    </div>

    <div class="s12 m6">
      <article class="card round">
        <div class="padding">
          <h6>
            <i class="inverse-text">touch_app</i>
            状態変更
          </h6>
          <CodeBlock
            code={`func changeTimerState() {
    switch timerState {
    case .idle:
        timerState = .running
    case .running:
        timerState = .paused
    case .paused:
        timerState = .idle
    }
}`}
          />
          <p class="small-text">現在の状態に応じて次の状態に遷移する関数。</p>
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 動作確認 -->
<section class="primary-container round padding">
  <div class="center-align">
    <h4 class="">🧪 動作確認</h4>
    <p class="">以下の動作を確認してみましょう</p>
    <div class="space"></div>
  </div>

  <div class="grid">
    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">play_arrow</i>
        </div>
        <div class="max">
          <h6 class="">1. アプリを実行</h6>
          <p class="">
            シミュレーターでアプリを起動し、「待機中」と表示されることを確認
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">touch_app</i>
        </div>
        <div class="max">
          <h6 class="">2. ボタンをタップ</h6>
          <p class="">「状態を変更」ボタンをタップして状態が変わることを確認</p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">palette</i>
        </div>
        <div class="max">
          <h6 class="">3. 色の変化</h6>
          <p class="">
            状態に応じてテキストの色が変わることを確認（グレー→緑→オレンジ）
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">refresh</i>
        </div>
        <div class="max">
          <h6 class="">4. 循環確認</h6>
          <p class="">
            待機中→実行中→一時停止中→待機中の順で状態が循環することを確認
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 重要なポイント -->
<section class="secondary-container round padding">
  <div class="center-align">
    <h4 class="">🎯 重要なポイント</h4>
    <div class="space"></div>
  </div>

  <div class="grid">
    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">verified</i>
        </div>
        <div class="max">
          <h6 class="">型安全性</h6>
          <p class="">
            Enumを使うことで、存在しない状態を誤って代入することを防げます。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">rule</i>
        </div>
        <div class="max">
          <h6 class="">網羅性チェック</h6>
          <p class="">
            switch文で全てのケースを処理しないとコンパイルエラーになります。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">code</i>
        </div>
        <div class="max">
          <h6 class="">可読性</h6>
          <p class="">
            コードを読んだときに、どのような状態があるかが一目でわかります。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">auto_awesome</i>
        </div>
        <div class="max">
          <h6 class="">Xcodeの支援</h6>
          <p class="">
            自動補完やリファクタリング機能がEnumを適切にサポートします。
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="row">
    <div class="max">
      {#if navigation.prev}
        <a href={navigation.prev.href} class="button transparent primary-text">
          <i>arrow_back</i>
          <span>{navigation.prev.title}</span>
        </a>
      {/if}
    </div>
    <div class="min">
      {#if navigation.next}
        <a href={navigation.next.href} class="button primary">
          <span>{navigation.next.title}</span>
          <i>arrow_forward</i>
        </a>
      {/if}
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding: 3rem 0;
    background: linear-gradient(
      135deg,
      var(--primary-container) 0%,
      var(--secondary-container) 100%
    );
    border-radius: 1rem;
    margin-bottom: 2rem;
  }

  .large-text {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .medium-text {
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .small-text {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .card {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    margin-bottom: 1rem;
  }

  pre {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 0.85rem;
    line-height: 1.4;
    overflow-x: auto;
    margin: 0.5rem 0;
  }

  code {
    color: inherit;
    white-space: pre-wrap;
  }

  ol,
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
</style>
