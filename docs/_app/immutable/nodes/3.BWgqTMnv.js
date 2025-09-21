import"../chunks/DsnmJJEf.js";import"../chunks/D0a_QuUJ.js";import{f as q,a as B,s as a,c as e,r as t}from"../chunks/CcrORd8f.js";import"../chunks/BFK-DMXH.js";import{C as i}from"../chunks/BWity5O6.js";import"../chunks/B-TpCTtm.js";var E=q('<div class="container mx-auto px-4 py-8"><div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">基本構文</h2> <p>変数、定数、データ型の基本です。</p> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">演算子</h2> <p>計算や比較に使う記号です。</p> <!> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">制御構造</h2> <p>プログラムの流れを制御します。</p> <!> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">関数</h2> <p>処理をまとめて再利用できるようにします。</p> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">コレクション</h2> <p>複数の値をまとめて扱います。</p> <!> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">クラスと構造体</h2> <p>データをまとめて扱うための型です。</p> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">オプションとエラー処理</h2> <p>値が存在しない可能性を扱います。</p> <!></div></div> <div class="card mb-6 bg-base-100 shadow-xl"><div class="card-body"><h2 class="card-title">便利な関数</h2> <p>よく使う組み込み関数です。</p> <!> <!></div></div></div>');function K(A){var r=E(),d=e(r),p=e(d),H=a(e(p),4);i(H,{title:"変数と定数",code:`// 定数の宣言（値を変更できない）
let schoolName = "中央中学校"
let pi = 3.14159

// 変数の宣言（値を変更できる）
var score = 85
var isStudying = true

// データ型を明示的に指定
var height: Double = 165.5
var weight: Int = 50`}),t(p),t(d);var s=a(d,2),b=e(s),m=a(e(b),4);i(m,{title:"算術演算子",code:`// 基本的な計算
let a = 10
let b = 3

let sum = a + b        // 13
let difference = a - b // 7
let product = a * b    // 30
let quotient = a / b   // 3（整数除算）
let remainder = a % b  // 1`});var N=a(m,2);i(N,{title:"比較演算子",code:`// 値の比較
let x = 5
let y = 10

x == y  // false（等しい）
x != y  // true（等しくない）
x < y   // true（より小さい）
x > y   // false（より大きい）
x <= y  // true（以下）
x >= y  // false（以上）`}),t(b),t(s);var l=a(s,2),g=e(l),f=a(e(g),4);i(f,{title:"if文",code:`// 条件分岐
let age = 13

if age >= 13 {
    print("中学生です")
} else {
    print("小学生です")
}

// 複数の条件
if age >= 18 {
    print("大人")
} else if age >= 13 {
    print("中学生")
} else {
    print("小学生")
}`});var O=a(f,2);i(O,{title:"for-inループ",code:`// 配列の要素を順番に処理
let fruits = ["りんご", "バナナ", "オレンジ"]

for fruit in fruits {
    print("好きな果物: \\(fruit)")
}

// 範囲を使ったループ
for i in 1...5 {
    print("\\(i)回目のループ")
}`}),t(g),t(l);var n=a(l,2),u=e(n),C=a(e(u),4);i(C,{title:"関数の定義と呼び出し",code:`// 簡単な関数の定義
func greet(name: String) -> String {
    return "こんにちは、\\(name)さん!"
}

// 計算を行う関数
func add(a: Int, b: Int) -> Int {
    return a + b
}

// 関数の実行
let message = greet(name: "太郎")
let result = add(a: 10, b: 5)

print(message)
print("10 + 5 = \\(result)")`}),t(u),t(n);var o=a(n,2),h=e(o),_=a(e(h),4);i(_,{title:"配列（Array）",code:`// 配列の作成
var fruits = ["りんご", "バナナ", "オレンジ"]
let numbers = [1, 2, 3, 4, 5]

// 要素へのアクセス
print(fruits[0])  // りんご

// 要素の追加
fruits.append("ぶどう")
print(fruits)  // ["りんご", "バナナ", "オレンジ", "ぶどう"]

// 要素数の取得
print(fruits.count)  // 4`});var D=a(_,2);i(D,{title:"辞書（Dictionary）",code:`// 辞書の作成
var scores = ["数学": 85, "英語": 92, "国語": 78]

// 値の取得
if let mathScore = scores["数学"] {
    print("数学の点数: \\(mathScore)")
}

// 値の更新
scores["理科"] = 88
print(scores)  // ["数学": 85, "英語": 92, "国語": 78, "理科": 88]`}),t(h),t(o);var v=a(o,2),y=e(v),L=a(e(y),4);i(L,{title:"構造体の定義",code:`// 構造体の定義
struct Student {
    var name: String
    var age: Int
    var grade: String
}

// インスタンスの作成
var student1 = Student(name: "太郎", age: 13, grade: "中学1年")

// プロパティへのアクセス
print("\\(student1.name)は\\(student1.age)歳です")`}),t(y),t(v);var c=a(v,2),x=e(c),W=a(e(x),4);i(W,{title:"Optional型",code:`// Optional型の変数
var optionalName: String? = "太郎"
var optionalAge: Int? = nil

// オプショナルバインディング
if let name = optionalName {
    print("名前: \\(name)")
} else {
    print("名前が設定されていません")
}

// 強制アンラップ（注意: nilの場合はエラー）
if optionalAge != nil {
    print("年齢: \\(optionalAge!)")
}`}),t(x),t(c);var S=a(c,2),w=e(S),I=a(e(w),4);i(I,{title:"print関数",code:`// コンソール出力
print("Hello, World!")
print("名前: 太郎, 年齢: 13")

// 改行なし出力
print("こんにちは", terminator: "")`});var k=a(I,2);i(k,{title:"Stringのメソッド",code:`let message = "Hello, Swift!"

// 文字数の取得
print(message.count)  // 13

// 大文字/小文字変換
print(message.uppercased())  // "HELLO, SWIFT!"
print(message.lowercased())  // "hello, swift!"

// 文字列の検索
if message.contains("Swift") {
    print("Swiftが見つかりました")
}`}),t(w),t(S),t(r),B(A,r)}export{K as component};
