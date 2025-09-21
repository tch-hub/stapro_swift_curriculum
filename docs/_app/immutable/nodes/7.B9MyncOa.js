import"../chunks/DsnmJJEf.js";import"../chunks/D0a_QuUJ.js";import{f as h,t as u,a as g,s as t,c as i,r as e}from"../chunks/CcrORd8f.js";import{s as r}from"../chunks/BYfeCkmY.js";import{b as d}from"../chunks/BFK-DMXH.js";import{C as p}from"../chunks/BWity5O6.js";var C=h(`<div class="container mx-auto px-4 py-8"><h1 class="mb-8 text-center text-4xl font-bold">ステップ1: プロジェクトの作成とセットアップ</h1> <div class="mb-8 flex justify-between"><a class="btn btn-outline">← プロジェクト概要に戻る</a> <a class="btn btn-primary">次のステップ →</a></div> <div class="card mb-8 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title text-2xl">このステップで学ぶこと</h2> <ul class="list-inside list-disc"><li>Xcodeでの新規プロジェクト作成</li> <li>SwiftUIプロジェクトの基本構造</li> <li>プロジェクトファイルの理解</li></ul></div></div> <div class="space-y-6"><div><h2 class="mb-4 text-3xl font-bold">1. Xcodeで新規プロジェクトを作成</h2> <ol class="mb-6 list-inside list-decimal space-y-2"><li>Xcodeを起動します</li> <li>「Create a new Xcode project」を選択</li> <li>「App」を選択して「Next」をクリック</li> <li>以下の設定を入力： <ul class="mt-2 ml-8 list-inside list-disc"><li>Product Name: Timer</li> <li>Interface: SwiftUI</li> <li>Language: Swift</li></ul></li> <li>保存場所を選択してプロジェクトを作成</li></ol></div> <div><h2 class="mb-4 text-3xl font-bold">2. プロジェクト構造の確認</h2> <p class="mb-4">プロジェクト作成後、以下のファイルが自動生成されます：</p> <div class="mockup-code mb-6"><pre><code>Timer/
├── TimerApp.swift          # アプリのメインエントリーポイント
├── ContentView.swift        # メインのビュー
├── Assets.xcassets/         # 画像や色などのアセット
│   └── Contents.json
├── Preview Content/         # プレビュー用
└── Timer.xcodeproj          # プロジェクトファイル</code></pre></div></div> <div><h2 class="mb-4 text-3xl font-bold">3. 初期コードの確認</h2> <p class="mb-4">プロジェクト作成直後のTimerApp.swiftの内容を確認しましょう：</p> <!></div> <div><h2 class="mb-4 text-3xl font-bold">4. ContentView.swiftの確認</h2> <p class="mb-4">初期のContentView.swiftは以下のようになっています：</p> <!></div></div> <div class="mt-12 text-center"><a class="btn btn-lg btn-primary">ステップ2: 基本的なUIの作成へ進む</a></div></div>`);function A(v){var s=C(),a=t(i(s),2),c=i(a),b=t(c,2);e(a);var l=t(a,4),o=t(i(l),4),f=t(i(o),4);p(f,{title:"TimerApp.swift",code:`import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`}),e(o);var n=t(o,2),w=t(i(n),4);p(w,{title:"ContentView.swift",code:`import SwiftUI

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
}`}),e(n),e(l);var m=t(l,2),x=i(m);e(m),e(s),u(()=>{r(c,"href",`${d??""}/project/timer`),r(b,"href",`${d??""}/project/timer/step2`),r(x,"href",`${d??""}/project/timer/step2`)}),g(v,s)}export{A as component};
