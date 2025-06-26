<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";

  // ステップ情報
  const stepInfo = {
    number: 1,
    title: "プロジェクトの準備",
    description: "Xcodeで新しいSwiftUIプロジェクトを作成しよう",
    duration: "10分",
    difficulty: "初級",
    icon: "settings",
  };

  // ナビゲーション情報
  const navigation = {
    prev: null, // 最初のステップなので前はなし
    next: {
      title: "ステップ2: タイマーの状態管理",
      href: `${base}/projects/timer/step2`,
    },
  };
</script>

<svelte:head>
  <title>ステップ1: プロジェクトの準備 - タイマーアプリ作成</title>
  <meta
    name="description"
    content="Xcodeで新しいSwiftUIプロジェクトを作成する手順を学習。タイマーアプリ開発の第一歩。"
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
    <p class="medium-text">Xcodeでの新規プロジェクト作成手順を覚えよう</p>
  </div>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large primary-text">laptop_mac</i>
          <h6>Xcodeの基本操作</h6>
          <p class="small-text">Xcodeでプロジェクトを作成する基本的な手順</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large secondary-text">widgets</i>
          <h6>SwiftUIプロジェクト</h6>
          <p class="small-text">SwiftUIを使ったiOSアプリの基本構造</p>
        </div>
      </article>
    </div>

    <div class="s12 m4">
      <article class="round border padding">
        <div class="center-align">
          <i class="large tertiary-text">tune</i>
          <h6>プロジェクト設定</h6>
          <p class="small-text">Bundle Identifierなどの重要な設定項目</p>
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 手順説明 -->
<section>
  <h3>📋 作業手順</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">play_arrow</i>
            ステップ 1-1: Xcodeを起動する
          </h5>
          <div class="space"></div>
          <ol class="medium-text">
            <li>
              Macのアプリケーションフォルダから<strong>Xcode</strong
              >を起動します
            </li>
            <li>
              起動後、<strong>「Create a new Xcode project」</strong
              >をクリックします
            </li>
            <li>
              もしくはメニューバーから<strong>File → New → Project</strong
              >を選択します
            </li>
          </ol>

          <div class="space"></div>
          <div class="secondary-container round padding">
            <h6 class="">
              <i>info</i>
              ポイント
            </h6>
            <p class="">
              Xcodeが初回起動の場合、コマンドラインツールのインストールを求められることがあります。その場合は指示に従ってインストールしてください。
            </p>
          </div>
        </div>
      </article>
    </div>

    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">smartphone</i>
            ステップ 1-2: iOSアプリを選択
          </h5>
          <div class="space"></div>
          <ol class="medium-text">
            <li><strong>iOS</strong>タブを選択します</li>
            <li><strong>App</strong>テンプレートを選択します</li>
            <li><strong>Next</strong>ボタンをクリックします</li>
          </ol>

          <div class="space"></div>
          <div class="tertiary-container round padding">
            <h6>
              <i>lightbulb</i>
              なぜiOS Appテンプレート？
            </h6>
            <p>
              iOS
              Appテンプレートは、iPhoneとiPad両方で動作するアプリを作成するためのテンプレートです。基本的なファイル構造が自動的に作成されます。
            </p>
          </div>
        </div>
      </article>
    </div>

    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">edit</i>
            ステップ 1-3: プロジェクト設定
          </h5>
          <div class="space"></div>
          <div class="grid">
            <div class="s12 m6">
              <h6>設定項目</h6>
              <ul class="medium-text">
                <li><strong>Product Name:</strong> Timer</li>
                <li><strong>Interface:</strong> SwiftUI</li>
                <li><strong>Language:</strong> Swift</li>
                <li><strong>Bundle Identifier:</strong> com.yourname.Timer</li>
              </ul>
            </div>
            <div class="s12 m6">
              <h6>チェックボックス</h6>
              <ul class="medium-text">
                <li>☑️ Use Core Data（今回は不要）</li>
                <li>☑️ Include Tests（今回は不要）</li>
              </ul>
            </div>
          </div>

          <div class="space"></div>
          <div class="error-container round padding">
            <h6 class="">
              <i>warning</i>
              重要な注意点
            </h6>
            <p class="">
              Bundle
              Identifierは一意である必要があります。「yourname」の部分は自分の名前やイニシャルに変更してください。例:
              com.taro.Timer
            </p>
          </div>
        </div>
      </article>
    </div>

    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">save</i>
            ステップ 1-4: 保存場所を選択
          </h5>
          <div class="space"></div>
          <ol class="medium-text">
            <li>
              プロジェクトを保存する場所を選択します（デスクトップやDocumentsフォルダがおすすめ）
            </li>
            <li><strong>Create</strong>ボタンをクリックします</li>
            <li>Xcodeがプロジェクトを作成し、自動的に開きます</li>
          </ol>
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 生成されるファイル -->
<section>
  <h3>📁 作成されるファイル構造</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12 l6">
      <article class="card round">
        <div class="padding">
          <h6>TimerApp.swift</h6>
          <p class="small-text">アプリケーションのエントリーポイント</p>
          <div class="space"></div>
          <CodeBlock
            code={`import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`}
            language="swift"
          />
        </div>
      </article>
    </div>

    <div class="s12 l6">
      <article class="card round">
        <div class="padding">
          <h6>ContentView.swift</h6>
          <p class="small-text">メインのユーザーインターフェース</p>
          <div class="space"></div>
          <CodeBlock
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
            language="swift"
          />
        </div>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- 動作確認 -->
<section class="primary-container round padding">
  <div class="center-align">
    <h4 class="">🚀 動作確認をしてみよう</h4>
    <div class="space"></div>
  </div>

  <div class="grid">
    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">play_arrow</i>
        </div>
        <div class="max">
          <h6 class="">シミュレーターで実行</h6>
          <p class="">
            Xcode上部の▶️ボタンをクリックして、シミュレーターでアプリを実行してみましょう。
          </p>
        </div>
      </div>
    </div>

    <div class="s12 m6">
      <div class="row">
        <div class="min">
          <i class="medium">visibility</i>
        </div>
        <div class="max">
          <h6 class="">プレビューで確認</h6>
          <p class="">
            ContentView.swiftの右側にあるプレビューでリアルタイムにUIを確認できます。
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="space"></div>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="row">
    <div class="max">
      <a href="{base}/projects/timer" class="button transparent primary-text">
        <i>arrow_back</i>
        <span>概要に戻る</span>
      </a>
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

<!-- 追加されたコードブロックセクション -->
<section>
  <h3>📝 実装手順</h3>

  <div class="space"></div>

  <div class="grid">
    <div class="s12">
      <article class="card round">
        <div class="padding">
          <h5>
            <i class="primary-text">edit</i>
            ステップ 1: プロジェクトの準備
          </h5>
          <div class="space"></div>
          <ol class="medium-text">
            <li>Xcodeで新しいSwiftUIプロジェクトを作成します</li>
            <li>プロジェクト名を「TimerApp」に設定します</li>
            <li>ContentView.swiftを確認します</li>
          </ol>

          <div class="space"></div>
          <h6>追加するコード:</h6>
          <CodeBlock
            code={`import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, TimerApp!")
            .padding()
    }
}`}
            language="swift"
          />
        </div>
      </article>
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


  ol,
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
</style>
