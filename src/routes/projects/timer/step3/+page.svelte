<script>
  import { base } from "$app/paths";
  import CodeBlock from "$lib/CodeBlock.svelte";
</script>

<svelte:head>
  <title>Step 3: カスタムTimePicker作成 - Swift学習カリキュラム</title>
  <meta
    name="description"
    content="SwiftUIで時間選択用のカスタムPickerコンポーネントを作成する方法を学びます。"
  />
</svelte:head>
<!-- ヘッダーセクション -->
<section class="hero-section">
  <div class="grid">
    <div class="s12 center-align">
      <h1 class="primary-text">
        <i class="large">schedule</i>
      </h1>
      <h2>Step 3: カスタムTimePicker作成</h2>
      <p class="large-text">時間選択用のカスタムコンポーネントを作成しよう</p>
      <div class="space"></div>
      <div class="chip primary">
        <span>Step 3 / 8</span>
      </div>
      <div class="chip secondary">
        <span>SwiftUIコンポーネント</span>
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
          <li>SwiftUIのPickerコンポーネントの使い方</li>
          <li>カスタムコンポーネントの作成方法</li>
          <li>@Bindingプロパティラッパーの理解</li>
          <li>時間・分・秒の選択UIの実装</li>
        </ul>
      </article>
    </div>
    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="secondary-text">engineering</i> 実装するもの</h6>
        <ul>
          <li>時間選択用のPicker</li>
          <li>分選択用のPicker</li>
          <li>秒選択用のPicker</li>
          <li>再利用可能なTimePickerコンポーネント</li>
        </ul>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- Pickerの基本概念 -->
<section>
  <h3>SwiftUI Pickerの基本</h3>
  <p>
    Pickerは、複数の選択肢から一つを選ぶためのUIコンポーネントです。まずは基本的な使い方を理解しましょう。
  </p>

  <div class="space"></div>

  <article class="round border padding">
    <h6><i class="primary-text">info</i> Pickerの基本構文</h6>
    <div class="space"></div>

    <CodeBlock
      code={`Picker("選択してください", selection: $selectedValue) {
    Text("選択肢1").tag(1)
    Text("選択肢2").tag(2)
    Text("選択肢3").tag(3)
}
.pickerStyle(.wheel) // ホイール形式で表示`}
    />

    <div class="space"></div>

    <div class="primary-container round padding">
      <h6 class="">重要なポイント</h6>
      <ul class="">
        <li>
          <strong>selection:</strong> 選択された値を格納する変数（@Bindingで渡す）
        </li>
        <li><strong>tag():</strong> 各選択肢に固有の値を設定</li>
        <li><strong>.pickerStyle():</strong> 表示スタイルを指定</li>
      </ul>
    </div>
  </article>
</section>

<div class="space"></div>

<!-- TimePickerコンポーネントの作成 -->
<section>
  <h3>TimePickerコンポーネントの実装</h3>
  <p>時間、分、秒を選択できるカスタムコンポーネントを作成します。</p>

  <div class="space"></div>

  <article class="round border padding">
    <h6><i class="primary-text">add</i> 新しいファイルを作成</h6>
    <p>Xcodeで新しいSwiftファイルを作成します：</p>
    <ol>
      <li>
        Xcodeのプロジェクトナビゲーターで「Components」フォルダを右クリック
      </li>
      <li>「New File...」を選択</li>
      <li>「Swift File」を選択し、ファイル名を「TimePicker.swift」に設定</li>
    </ol>
  </article>
</section>

<div class="space"></div>

<!-- TimePicker.swiftの実装 -->
<section>
  <h3>TimePicker.swiftの実装</h3>

  <article class="round border padding">
    <h6><i class="primary-text">code</i> TimePicker.swift</h6>
    <p>
      以下のコードを新しく作成したTimePicker.swiftファイルに入力してください：
    </p>

    <div class="space"></div>

    <CodeBlock
      code={`import SwiftUI

struct TimePicker: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int

    var body: some View {
        HStack(spacing: 0) {
            Picker("時間", selection: $hours) {
                ForEach(0...23, id: \".self\") { hour in
                    Text("\(hour)")
                        .foregroundStyle(.primary)
                        .tag(hour)
                }
            }
            .pickerStyle(.wheel)
            .frame(width: 80)

            Text("時間")
                .foregroundStyle(.secondary)
                .font(.caption)

            Picker("分", selection: $minutes) {
                ForEach(0...59, id: \".self\") { minute in
                    Text("\(minute)")
                        .foregroundStyle(.primary)
                        .tag(minute)
                }
            }
            .pickerStyle(.wheel)
            .frame(width: 80)

            Text("分")
                .foregroundStyle(.secondary)
                .font(.caption)

            Picker("秒", selection: $seconds) {
                ForEach(0...59, id: \".self\") { second in
                    Text("\(second)")
                        .foregroundStyle(.primary)
                        .tag(second)
                }
            }
            .pickerStyle(.wheel)
            .frame(width: 80)

            Text("秒")
                .foregroundStyle(.secondary)
                .font(.caption)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.systemGray6))
        )
    }

    #Preview {
        TimePicker(
            hours: .constant(0),
            minutes: .constant(5),
            seconds: .constant(0)
        )
        .padding()
    }`}
    />
  </article>
</section>

<div class="space"></div>

<!-- コードの詳細解説 -->
<section>
  <h3>コードの詳細解説</h3>

  <div class="grid">
    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="primary-text">data_object</i> @Bindingプロパティ</h6>
        <div class="code-container small">
          <CodeBlock
            code={`@Binding var hours: Int
@Binding var minutes: Int
@Binding var seconds: Int`}
            language="swift"
          />
        </div>
        <p class="small-text">
          親ビューから時間データを受け取り、変更を反映させるためのプロパティです。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="secondary-text">loop</i> ForEachループ</h6>
        <div class="code-container small">
              <CodeBlock 
      code={`ForEach(0...59, id: \.self) {minute in
                Text("(minute)").tag(minute)}`} 
      language="swift" 
    />
        </div>
        <p class="small-text">
          0から59までの数値を自動生成してPicker選択肢を作成します。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="tertiary-text">tune</i> pickerStyle設定</h6>
        <div class="code-container small">
              <CodeBlock 
      code={`.pickerStyle(.wheel)
.frame(width: 80)`} 
      language="swift" 
    />
        </div>
        <p class="small-text">
          ホイール形式で表示し、幅を80ポイントに固定します。
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding">
        <h6><i class="primary-text">palette</i> 背景デザイン</h6>
        <div class="code-container small">
          <pre><code
              >.background(
    RoundedRectangle(cornerRadius: 12)
        .fill(Color(.systemGray6))
)</code
            ></pre>
        </div>
        <p class="small-text">
          角丸の背景色を追加して、コンポーネントを目立たせます。
        </p>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- プレビューでの動作確認 -->
<section>
  <h3>プレビューでの動作確認</h3>

  <article class="round border padding">
    <h6><i class="primary-text">preview</i> プレビューの実行</h6>
    <p>
      コードを入力したら、Xcodeの右側にあるプレビューエリアで動作を確認しましょう：
    </p>

    <div class="space"></div>

    <ol>
      <li>TimePicker.swiftファイルが選択されていることを確認</li>
      <li>右側のプレビューエリアで「Resume」ボタンをクリック</li>
      <li>3つのホイールピッカーが表示されることを確認</li>
      <li>各ピッカーをスクロールして値が変更されることを確認</li>
    </ol>

    <div class="space"></div>

    <div class="secondary-container round padding">
      <h6 class="">期待される動作</h6>
      <ul class="">
        <li>時間: 0-23時間の選択が可能</li>
        <li>分: 0-59分の選択が可能</li>
        <li>秒: 0-59秒の選択が可能</li>
        <li>グレーの背景で囲まれた見やすいデザイン</li>
      </ul>
    </div>
  </article>
</section>

<div class="space"></div>

<!-- 次のステップでの使用方法 -->
<section>
  <h3>次のステップでの使用方法</h3>

  <article class="round border padding">
    <h6><i class="primary-text">info</i> TimePickerの使用例</h6>
    <p>
      作成したTimePickerコンポーネントは、次のステップでViewModelと組み合わせて使用します：
    </p>

    <div class="space"></div>

    <CodeBlock
      code={`// 他のビューでの使用例
struct SomeView: View {
    @State private var hours = 0
    @State private var minutes = 5
    @State private var seconds = 0

    var body: some View {
        TimePicker(
            hours: $hours,
            minutes: $minutes,
            seconds: $seconds
        )
    }
}`}
    />
  </article>
</section>

<div class="space"></div>

<!-- トラブルシューティング -->
<section>
  <h3>よくあるエラーと解決方法</h3>

  <div class="grid">
    <div class="s12 m6">
      <article class="round border padding error-container">
        <h6><i class="error-text">warning</i> エラー例</h6>
        <div class="code-container small">
          <pre><code>Cannot find 'TimePicker' in scope</code></pre>
        </div>
        <p class="small-text">
          <strong>原因:</strong> ファイル名が間違っているか、import文が不足している
        </p>
        <p class="small-text">
          <strong>解決:</strong> ファイル名が「TimePicker.swift」であることを確認
        </p>
      </article>
    </div>

    <div class="s12 m6">
      <article class="round border padding error-container">
        <h6><i class="error-text">warning</i> プレビューエラー</h6>
        <div class="code-container small">
          <pre><code>Cannot preview in this file</code></pre>
        </div>
        <p class="small-text">
          <strong>原因:</strong> プレビューコードの構文エラー
        </p>
        <p class="small-text">
          <strong>解決:</strong> #Previewブロックの構文を確認
        </p>
      </article>
    </div>
  </div>
</section>

<div class="space"></div>

<!-- ナビゲーション -->
<section>
  <div class="grid">
    <div class="s6">
      <a
        href="{base}/projects/timer/step2"
        class="button transparent primary-text"
      >
        <i>arrow_back</i>
        <span>Step 2に戻る</span>
      </a>
    </div>
    <div class="s6 right-align">
      <a href="{base}/projects/timer/step4" class="button primary">
        <span>Step 4へ進む</span>
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

  .code-container {
    position: relative;
    margin: 1rem 0;
  }

  .code-container.small {
    margin: 0.5rem 0;
  }

  .code-container pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .error-container {
    border-left: 4px solid var(--error);
  }

  ol,
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.25rem 0;
  }
</style>
