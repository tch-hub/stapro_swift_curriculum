import"../chunks/DsnmJJEf.js";import"../chunks/D0a_QuUJ.js";import{f as $,t as B,a as I,s as t,c as e,r as i,n as s}from"../chunks/CcrORd8f.js";import{s as o}from"../chunks/BYfeCkmY.js";import{b as n}from"../chunks/BFK-DMXH.js";import{C as v}from"../chunks/BWity5O6.js";var j=$(`<div class="container mx-auto px-4 py-8"><h1 class="mb-8 text-center text-4xl font-bold">ステップ3: 時間選択ビューの実装</h1> <div class="mb-8 flex justify-between"><a class="btn btn-outline">← 前のステップ</a> <a class="btn btn-primary">次のステップ →</a></div> <div class="card mb-8 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title text-2xl">このステップで学ぶこと</h2> <ul class="list-inside list-disc"><li>Pickerの使い方</li> <li>@Bindingを使ったデータの受け渡し</li> <li>カスタムViewの作成</li> <li>ForEachを使った繰り返し</li></ul></div></div> <div class="space-y-6"><div><h2 class="mb-4 text-3xl font-bold">1. TimePickerコンポーネントの作成</h2> <p class="mb-4">時間を選択するためのPickerコンポーネントを作成します：</p> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><div class="flex flex-col gap-6 lg:flex-row"><div class="flex-1"><!> <p class="mt-4 text-sm text-base-content opacity-80">TimePickerは再利用可能なコンポーネントです。title, range,
								selectionをパラメータとして受け取り、ホイール型のPickerを表示します。</p></div> <div class="flex flex-1 items-center justify-center"><div class="relative"><img src="/images/iphone-mock.png" alt="iPhone mockup" class="w-full max-w-xs"/> <div class="absolute top-[12%] left-[8%] flex h-[76%] w-[84%] items-center justify-center rounded-[2rem] bg-base-100"><div class="p-4 text-center"><div class="mb-4 text-lg font-bold">TimePicker</div> <div class="space-y-2"><div class="text-sm opacity-70">ホイール型の選択UI</div> <div class="text-sm opacity-70">0-23時間、0-59分/秒</div> <div class="text-sm opacity-70">スクロールして値を選択</div></div></div></div></div></div></div></div></div></div> <div><h2 class="mb-4 text-3xl font-bold">2. TimeSelectionViewの作成</h2> <p class="mb-4">時間、分、秒の3つのPickerを横に並べたビューを作成します：</p> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><div class="flex flex-col gap-6 lg:flex-row"><div class="flex-1"><!> <p class="mt-4 text-sm text-base-content opacity-80">TimeSelectionViewは3つのTimePickerをHStackで横に並べます。各Pickerは時間、分、秒の選択を担当します。</p></div> <div class="flex flex-1 items-center justify-center"><div class="relative"><img src="/images/iphone-mock.png" alt="iPhone mockup" class="w-full max-w-xs"/> <div class="absolute top-[12%] left-[8%] flex h-[76%] w-[84%] items-center justify-center rounded-[2rem] bg-base-100"><div class="p-4 text-center"><div class="mb-4 text-lg font-bold">TimeSelectionView</div> <div class="space-y-2"><div class="text-sm opacity-70">3つのPickerを横並び</div> <div class="text-sm opacity-70">時間・分・秒を選択</div> <div class="text-sm opacity-70">HStackレイアウト</div></div></div></div></div></div></div></div></div></div> <div><h2 class="mb-4 text-3xl font-bold">3. ContentViewの更新</h2> <p class="mb-4">ContentViewでTimeSelectionViewを使用するように更新します：</p> <!></div> <div><h2 class="mb-4 text-3xl font-bold">4. @Bindingについて</h2> <p class="mb-4">@Bindingは親ビューから子ビューへデータを渡すためのプロパティラッパーです：</p> <ul class="list-inside list-disc space-y-2"><li>親ビューで<code>@State var hours = 0</code>と定義</li> <li>子ビューで<code>@Binding var hours: Int</code>と受け取る</li> <li>呼び出し時に<code>$hours</code>のように$をつけて渡す</li> <li>子ビューでの変更が親ビューに反映される</li></ul></div> <div><h2 class="mb-4 text-3xl font-bold">5. Pickerのスタイル</h2> <p class="mb-4">Pickerには様々なスタイルがあります：</p> <ul class="list-inside list-disc space-y-2"><li><code>.pickerStyle(.wheel)</code>: ホイール型（iOS標準）</li> <li><code>.pickerStyle(.segmented)</code>: セグメント型</li> <li><code>.pickerStyle(.menu)</code>: ドロップダウンメニュー型</li></ul></div></div> <div class="mt-12 text-center"><a class="btn btn-lg btn-primary">ステップ4: タイマー表示ビューの実装へ進む</a></div></div>`);function q(S){var a=j(),l=t(e(a),2),m=e(l),T=t(m,2);i(l);var c=t(l,4),d=e(c),p=t(e(d),4),b=e(p),x=e(b),f=e(x),_=e(f);v(_,{title:"TimePicker.swift",code:`import SwiftUI

struct TimePicker: View {
    var title: String          // 「時間」「分」「秒」などのタイトル
    var range: ClosedRange<Int> // 選択範囲（例: 0...23）
    @Binding var selection: Int  // 選択された値
    
    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(range, id: .self) { value in
                Text("\\(value) \\(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)  // ホイールスタイルで表示
    }
}`}),s(2),i(f),s(2),i(x),i(b),i(p),i(d);var r=t(d,2),u=t(e(r),4),g=e(u),h=e(g),w=e(h),P=e(w);v(P,{title:"TimeSelectionView.swift",code:`import SwiftUI

struct TimeSelectionView: View {
    @Binding var hours: Int
    @Binding var minutes: Int
    @Binding var seconds: Int
    
    var body: some View {
        HStack {
            TimePicker(title: "時間", range: 0...23, selection: $hours)
            TimePicker(title: "分", range: 0...59, selection: $minutes)
            TimePicker(title: "秒", range: 0...59, selection: $seconds)
        }
    }
}`}),s(2),i(w),s(2),i(h),i(g),i(u),i(r);var k=t(r,2),V=t(e(k),4);v(V,{title:"ContentView.swift (更新版)",code:`import SwiftUI

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
            if timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                // 後でタイマー表示ビューを追加
                Text("タイマーが実行中です")
                    .font(.largeTitle)
            }
            
            HStack {
                Button("開始") {
                    timerState = .running
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
}`}),i(k),s(4),i(c);var y=t(c,2),C=e(y);i(y),i(a),B(()=>{o(m,"href",`${n??""}/project/timer/step2`),o(T,"href",`${n??""}/project/timer/step4`),o(C,"href",`${n??""}/project/timer/step4`)}),I(S,a)}export{q as component};
