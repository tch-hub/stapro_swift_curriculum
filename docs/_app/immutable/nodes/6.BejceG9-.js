import"../chunks/DsnmJJEf.js";import"../chunks/D0a_QuUJ.js";import{p as le,f as se,a as ae,d as re,t as oe,s,c as t,r as i}from"../chunks/CcrORd8f.js";import{s as w}from"../chunks/BYfeCkmY.js";import{b as g}from"../chunks/BFK-DMXH.js";import{C as B}from"../chunks/BWity5O6.js";import{o as ce}from"../chunks/Dz2LzsWF.js";import{i as de}from"../chunks/pjAo5Reh.js";var ve=se('<div class="card mb-8 bg-base-100 shadow-xl"><div class="card-body"><h2 class="mb-4 card-title text-2xl">ライブデモ</h2> <p class="mb-6">完成したタイマーアプリをHTMLで再現したものです。実際に操作してみてください。</p> <div class="flex justify-center"><div class="mockup-phone border-primary"><div class="camera"></div> <div class="display"><div class="artboard artboard-demo phone-1"><div id="timer-demo" class="relative flex h-full flex-col items-center justify-center p-4"><div id="notification-banner" class="absolute top-4 right-4 left-4 z-50 -translate-y-full transform rounded-lg bg-white p-3 text-black shadow-lg transition-transform duration-300" style="display: none;"><div class="flex items-center space-x-3"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500"><span class="notification-icon text-sm text-white">⏰</span></div> <div class="flex-1"><div class="text-sm font-semibold">タイマー</div> <div class="notification-message text-xs text-gray-600">時間です！</div></div> <button id="notification-close-btn" class="text-xs font-medium text-blue-600 hover:text-blue-800">完了</button></div></div> <div id="setup-mode" class="flex flex-col items-center space-y-6"><div class="flex space-x-4"><div class="flex flex-col items-center"><div class="wheel-picker svelte-f5teva" data-unit="hours" data-value="0"><div class="wheel-container svelte-f5teva"></div> <div class="wheel-overlay svelte-f5teva"></div></div></div> <div class="flex flex-col items-center"><div class="wheel-picker svelte-f5teva" data-unit="minutes" data-value="0"><div class="wheel-container svelte-f5teva"></div> <div class="wheel-overlay svelte-f5teva"></div></div></div> <div class="flex flex-col items-center"><div class="wheel-picker svelte-f5teva" data-unit="seconds" data-value="0"><div class="wheel-container svelte-f5teva"></div> <div class="wheel-overlay svelte-f5teva"></div></div></div></div> <div class="flex space-x-12"><button id="reset-btn" class="large-circle-btn cancel-btn-custom btn btn-circle btn-lg svelte-f5teva" title="キャンセル"><span class="text-xs font-bold">キャンセル</span></button> <button id="start-btn" class="large-circle-btn start-btn-custom btn btn-circle btn-lg svelte-f5teva" title="開始"><span class="text-xs font-bold">開始</span></button></div></div> <div id="timer-mode" class="flex flex-col items-center space-y-6" style="display: none;"><div class="relative"><svg width="200" height="200" class="-rotate-90 transform"><circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="10" fill="none" class="text-base-300" opacity="0.3"></circle><circle id="progress-circle" cx="100" cy="100" r="90" stroke="currentColor" stroke-width="10" fill="none" class="text-orange-500" stroke-linecap="round" stroke-dasharray="565.48" stroke-dashoffset="565.48" style="transition: stroke-dashoffset 1s linear;"></circle></svg> <div class="absolute inset-0 flex items-center justify-center"><div id="time-display" class="text-4xl font-bold">00:00:00</div></div></div> <div class="flex space-x-12"><button id="timer-cancel-btn" class="large-circle-btn cancel-btn-custom btn btn-circle btn-lg svelte-f5teva" title="キャンセル"><span class="text-xs font-bold">キャンセル</span></button> <button id="pause-btn" class="large-circle-btn pause-btn-custom btn btn-circle btn-lg svelte-f5teva" title="一時停止"><span class="text-xs font-bold">一時停止</span></button></div></div> <div id="alert-modal" class="modal" style="display: none;"><div class="modal-box"><h3 class="text-lg font-bold">時間です！</h3> <p class="py-4">タイマーが終了しました。</p> <div class="modal-action"><button id="alert-ok-btn" class="btn">完了</button></div></div></div></div></div></div></div></div></div></div>');function me(Q,Y){le(Y,!1);let u=null,c=0,f=0,y=!1,x,h,p,v,T,M,m,k,E,A,r,C,D;ce(()=>{x=document.getElementById("setup-mode"),h=document.getElementById("timer-mode"),p=document.getElementById("alert-modal"),v=document.getElementById("time-display"),T=document.getElementById("progress-circle"),M=document.getElementById("start-btn"),m=document.getElementById("pause-btn"),k=document.getElementById("reset-btn"),E=document.getElementById("timer-cancel-btn"),A=document.getElementById("alert-ok-btn"),r=document.getElementById("notification-banner"),C=document.getElementById("notification-close-btn"),D=document.querySelectorAll(".wheel-picker"),M&&M.addEventListener("click",U),m&&m.addEventListener("click",X),k&&k.addEventListener("click",I),E&&E.addEventListener("click",I),A&&A.addEventListener("click",ee),C&&C.addEventListener("click",Z),D.forEach(e=>{te(e)})});function L(e){const n=Math.floor(e/3600),l=Math.floor(e%3600/60),d=e%60;return`${n.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}:${d.toString().padStart(2,"0")}`}function q(){if(f===0)return;const e=c/f,n=565.48,l=n-e*n;T&&(T.style.strokeDashoffset=l)}function U(){const e=parseInt(document.querySelector('[data-unit="hours"]').dataset.value),n=parseInt(document.querySelector('[data-unit="minutes"]').dataset.value),l=parseInt(document.querySelector('[data-unit="seconds"]').dataset.value);if(f=e*3600+n*60+l,console.log("Timer values:",{hours:e,minutes:n,seconds:l,totalTime:f}),f===0){P("時間を設定してください","⚠️");return}c=f,y=!0,x&&(x.style.display="none"),h&&(h.style.display="flex"),m&&(m.textContent="一時停止"),q(),u=setInterval(()=>{c>0?(c--,v&&(v.textContent=L(c)),q()):(clearInterval(u),y=!1,P("時間です！","⏰"),p&&(p.style.display="flex"),O())},1e3)}function X(){y?(clearInterval(u),y=!1,m&&(m.textContent="再開")):(u=setInterval(()=>{c>0?(c--,v&&(v.textContent=L(c)),q()):(clearInterval(u),y=!1,p&&(p.style.display="flex"),O())},1e3),y=!0,m&&(m.textContent="一時停止"))}function I(){clearInterval(u),y=!1,c=0,f=0,x&&(x.style.display="flex"),h&&(h.style.display="none"),v&&(v.textContent="00:00:00"),T&&(T.style.strokeDashoffset="565.48")}function ee(){p&&(p.style.display="none"),I()}function P(e="時間です！",n="⏰",l=!0){if(r){const d=r.querySelector(".notification-icon"),S=r.querySelector(".notification-message"),b=r.querySelector("#notification-close-btn");d&&(d.textContent=n),S&&(S.textContent=e),b&&(b.style.display=l?"block":"none"),r.style.display="block",setTimeout(()=>{r.style.transform="translateY(0)"},100),l||setTimeout(()=>{r.style.transform="translateY(-100%)",setTimeout(()=>{r.style.display="none"},300)},3e3)}}function Z(){r&&(r.style.transform="translateY(-100%)",setTimeout(()=>{r.style.display="none"},300)),I()}function O(){try{const e=new(window.AudioContext||window.webkitAudioContext),n=e.createOscillator(),l=e.createGain();n.connect(l),l.connect(e.destination),n.frequency.setValueAtTime(800,e.currentTime),l.gain.setValueAtTime(.3,e.currentTime),n.start(e.currentTime),n.stop(e.currentTime+.5)}catch{console.log("Audio not available")}}function te(e){const n=e.querySelector(".wheel-container");e.querySelectorAll(".wheel-item");let l=0,d=0,S=0,b=!1,J=0;const z=e.dataset.unit;let _,V;switch(z){case"hours":_=24,V="時間";break;case"minutes":case"seconds":_=59,V=z==="minutes"?"分":"秒";break;default:_=59,V=""}for(let a=0;a<=_;a++){const o=document.createElement("div");o.className="wheel-item",o.dataset.value=a,o.textContent=`${a} ${V}`,n.appendChild(o)}const N=n.querySelectorAll(".wheel-item");j(),e.addEventListener("mousedown",F),document.addEventListener("mousemove",G),document.addEventListener("mouseup",R),e.addEventListener("touchstart",F,{passive:!1}),document.addEventListener("touchmove",G,{passive:!1}),document.addEventListener("touchend",R);function F(a){a.preventDefault(),b=!0,d=a.type==="mousedown"?a.clientY:a.touches[0].clientY,J=d;const $=(n.style.transform||"translateY(0px)").match(/translateY\((-?\d+)px\)/);S=$?parseInt($[1]):0}function G(a){if(!b)return;a.preventDefault();const $=(a.type==="mousemove"?a.clientY:a.touches[0].clientY)-d,ie=S+$;n.style.transform=`translateY(${ie}px)`}function R(a){if(!b)return;b=!1;const $=(a.type==="mouseup"?a.clientY:a.changedTouches[0].clientY)-J,ne=Math.round($/30);l=Math.max(0,Math.min(N.length-1,l-ne)),j(),W(),K(l)}function K(a){l=a,j(),e.dataset.value=N[l].dataset.value}function j(){N.forEach((a,o)=>{a.classList.toggle("selected",o===l)})}function W(){const o=-l*30+45;n.style.transform=`translateY(${o}px)`}W()}de();var H=ve();ae(Q,H),re()}var ue=se(`<div class="container mx-auto px-4 py-8"><h1 class="mb-8 text-center text-4xl font-bold">タイマーアプリプロジェクト</h1> <p class="mb-12 text-center text-lg">シンプルなタイマーアプリを作成します。時間設定、カウントダウン、アラーム機能を実装します。</p> <div class="card mb-8 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title text-2xl">プロジェクト概要</h2> <p class="mb-4">このプロジェクトでは、SwiftUIを使ってタイマーアプリを作成します。以下の機能を学習できます：</p> <ul class="mb-4 list-inside list-disc"><li>SwiftUIでのUI構築</li> <li>状態管理（@State, @StateObject）</li> <li>タイマーの実装</li> <li>アラーム音の再生</li> <li>アニメーションの実装</li> <li>MVVMアーキテクチャ</li></ul> <div class="card-actions justify-end"><a download="" class="btn btn-primary">プロジェクトをダウンロード</a></div></div></div> <div class="mb-8"><h2 class="mb-6 text-3xl font-bold">プロジェクト構造</h2> <div class="mockup-code"><pre><code>Timer/
├── TimerApp.swift          # アプリのエントリーポイント
├── ContentView.swift        # メインのビュー
├── ViewModels/
│   └── TimerViewModel.swift # タイマーのロジック
├── Views/
│   ├── TimeSelectionView.swift  # 時間設定ビュー
│   └── TimerDisplayView.swift   # タイマー表示ビュー
└── Components/
    ├── ColorButton.swift    # カスタムボタン
    └── TimePicker.swift     # 時間選択ピッカー</code></pre></div></div> <!> <div class="mb-8"><h2 class="mb-6 text-3xl font-bold">制作ステップ</h2> <p class="mb-6">タイマーアプリを8つのステップで段階的に作成しましょう。各ステップで必要な知識と実装方法を詳しく説明します。</p> <div class="space-y-4"><div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ1: プロジェクトの作成とセットアップ</h3> <p class="text-sm opacity-70">Xcodeでの新規プロジェクト作成と基本構造の理解</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ2: 基本的なUIの作成</h3> <p class="text-sm opacity-70">ContentViewの作成と状態管理の基本</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ3: 時間選択ビューの実装</h3> <p class="text-sm opacity-70">Pickerと@Bindingを使った時間設定</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ4: タイマー表示ビューの実装</h3> <p class="text-sm opacity-70">円形プログレスバーとアニメーション</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ5: ViewModelの作成</h3> <p class="text-sm opacity-70">MVVMアーキテクチャとObservableObject</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ6: タイマーロジックの追加</h3> <p class="text-sm opacity-70">Timer.scheduledTimerを使ったカウントダウン</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ7: アラーム機能の実装</h3> <p class="text-sm opacity-70">AVAudioPlayerとAlertの実装</p></div> <a class="btn btn-primary">開始</a></div></div></div> <div class="card bg-base-100 shadow-lg"><div class="card-body"><div class="flex items-center justify-between"><div><h3 class="card-title text-xl">ステップ8: 最終調整とテスト</h3> <p class="text-sm opacity-70">ColorButtonと総合テスト</p></div> <a class="btn btn-primary">開始</a></div></div></div></div></div> <div class="space-y-8"><!> <!> <!> <!> <!> <!> <!></div></div>`);function Te(Q){var Y=ue(),u=s(t(Y),4),c=t(u),f=s(t(c),6),y=t(f);i(f),i(c),i(u);var x=s(u,4);me(x,{});var h=s(x,2),p=s(t(h),4),v=t(p),T=t(v),M=t(T),m=s(t(M),2);i(M),i(T),i(v);var k=s(v,2),E=t(k),A=t(E),r=s(t(A),2);i(A),i(E),i(k);var C=s(k,2),D=t(C),L=t(D),q=s(t(L),2);i(L),i(D),i(C);var U=s(C,2),X=t(U),I=t(X),ee=s(t(I),2);i(I),i(X),i(U);var P=s(U,2),Z=t(P),O=t(Z),te=s(t(O),2);i(O),i(Z),i(P);var H=s(P,2),e=t(H),n=t(e),l=s(t(n),2);i(n),i(e),i(H);var d=s(H,2),S=t(d),b=t(S),J=s(t(b),2);i(b),i(S),i(d);var z=s(d,2),_=t(z),V=t(_),N=s(t(V),2);i(V),i(_),i(z),i(p),i(h);var F=s(h,2),G=t(F);B(G,{title:"TimerApp.swift - アプリのエントリーポイント",code:`//
//  TimerApp.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI

@main
struct TimerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}`});var R=s(G,2);B(R,{title:"ContentView.swift - メインのビュー",code:`//
//  ContentView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI

enum TimerState {
    case idle
    case running
    case paused
}

struct ContentView: View {
    @StateObject var viewModel = TimerViewModel()
    @State var hours = 0
    @State var minutes = 0
    @State var seconds = 0
    
    var body: some View {
        VStack {
            if viewModel.timerState == .idle {
                TimeSelectionView(hours: $hours, minutes: $minutes, seconds: $seconds)
            } else {
                TimerDisplayView(remainingTime: viewModel.remainingTime, totalTime: viewModel.totalTime)
            }
            
            HStack(spacing: 130) {
                ColorButton(text: "キャンセル", color: .white, action: viewModel.stopTimer)
                    .opacity(viewModel.timerState == .idle ? 0.3 : 1)
                    .disabled(viewModel.timerState == .idle)
                
                switch viewModel.timerState {
                case .idle:
                    ColorButton(text: "開始", color: .green, action: {
                        viewModel.startTimer(hours: hours, minutes: minutes, seconds: seconds)
                    })
                case .running:
                    ColorButton(text: "一時停止", color: .orange, action: viewModel.pauseTimer)
                case .paused:
                    ColorButton(text: "再開", color: .green, action: viewModel.restartTimer)
                }
            }
        }
        .alert("時間です", isPresented: $viewModel.isShowingAlert) {
            Button("完了") {
                viewModel.isShowingAlert = false
                viewModel.timerState = .idle
                viewModel.audioPlayer?.stop()
            }
        }
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}`});var K=s(R,2);B(K,{title:"TimerViewModel.swift - タイマーのロジック",code:`//
//  TimerViewModel.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/14.
//

import SwiftUI
import AVFoundation

class TimerViewModel: ObservableObject {
    @Published var remainingTime = 0
    @Published var timerState: TimerState = .idle
    @Published var isShowingAlert = false
    var audioPlayer: AVAudioPlayer?
    var timer: Timer?
    var totalTime: Int = 0
    
    func startTimer(hours: Int, minutes: Int, seconds: Int) {
        remainingTime = hours * 3600 + minutes * 60 + seconds
        totalTime = remainingTime
        timerState = .running
        countDown()
    }
    
    func stopTimer() {
        timerState = .idle
        timer?.invalidate()
    }
    
    func pauseTimer() {
        timerState = .paused
        timer?.invalidate()
    }
    
    func restartTimer() {
        timerState = .running
        countDown()
    }
    
    func playSound() {
        guard let url = Bundle.main.url(forResource: "Alarm", withExtension: "mp3") else {return}
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("音声ファイルが再生できませんでした")
        }
    }
    
    func countDown() {
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.remainingTime > 0 {
                self.remainingTime -= 1
            } else {
                timer.invalidate()
                self.isShowingAlert = true
                self.playSound()
            }
        }
    }
}`});var j=s(K,2);B(j,{title:"TimeSelectionView.swift - 時間設定ビュー",code:`//
//  TimeSelectionView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/10.
//

import SwiftUI

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
}`});var W=s(j,2);B(W,{title:"TimerDisplayView.swift - タイマー表示ビュー",code:`//
//  TimerDisplayView.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/23.
//

import SwiftUI

struct TimerDisplayView: View {
    var remainingTime: Int
    var totalTime: Int
    
    var completionPercentage: Double {
        return (totalTime > 0) ? (Double(remainingTime) / Double(totalTime)) : 1
    }
    
    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0.0, to: CGFloat(completionPercentage))
                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .foregroundColor(.orange)
                .rotationEffect(Angle(degrees: 270))
                .animation(.linear, value: completionPercentage)
                .padding(10)
            
            Text(formatTime(seconds: remainingTime))
                .font(.system(size: 70))
        }
    }
    
    func formatTime(seconds: Int) -> String {
        let hours = seconds / 3600
        let minutes = (seconds % 3600) / 60
        let seconds = seconds % 60
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
}`});var a=s(W,2);B(a,{title:"ColorButton.swift - カスタムボタン",code:`//
//  ColorButton.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/19.
//

import SwiftUI

struct ColorButton: View {
    let text: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(text)
                .foregroundStyle(color)
                .font(.subheadline)
        }
        .frame(width: 90, height: 90)
        .background(color.opacity(0.2))
        .clipShape(Circle())
    }
}`});var o=s(a,2);B(o,{title:"TimePicker.swift - 時間選択ピッカー",code:`//
//  TimePicker.swift
//  Timer
//
//  Created by mogi yoshiki on 2024/04/11.
//

import SwiftUI

struct TimePicker: View {
    var title: String
    var range: ClosedRange<Int>
    @Binding var selection: Int
    
    var body: some View {
        Picker(selection: $selection, label: Text(title)) {
            ForEach(range, id: .self) { value in
                Text("\\(value) \\(title)").tag(value)
            }
        }
        .pickerStyle(.wheel)
    }
}`}),i(F),i(Y),oe(()=>{w(y,"href",`${g??""}/docs/Timer/Timer.zip`),w(m,"href",`${g??""}/project/timer/step1`),w(r,"href",`${g??""}/project/timer/step2`),w(q,"href",`${g??""}/project/timer/step3`),w(ee,"href",`${g??""}/project/timer/step4`),w(te,"href",`${g??""}/project/timer/step5`),w(l,"href",`${g??""}/project/timer/step6`),w(J,"href",`${g??""}/project/timer/step7`),w(N,"href",`${g??""}/project/timer/step8`)}),ae(Q,Y)}export{Te as component};
