<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Header from '$lib/components/Header.svelte';

	// ローディング状態の管理
	let isLoading = true;

	// ページマウント時にローディングを開始
	onMount(() => {
		// コンテンツの準備をシミュレート（実際のJSON読み込みに合わせて調整）
		setTimeout(() => {
			isLoading = false;
			// ローディング完了後にURLのハッシュに基づいてスクロール
			const hash = window.location.hash.substring(1); // #を除去
			if (hash) {
				// 少し遅延を入れてDOMが完全にレンダリングされた後にスクロール
				setTimeout(() => {
					scrollToSection(hash);
				}, 100);
			}
		}, 800); // かわいいアニメーションが見えるように少し遅延
	});

	// サイドバーのリンククリック時のスクロール関数
	function scrollToSection(id) {
		const element = document.getElementById(id);
		if (element) {
			const header = document.querySelector('header');
			const headerHeight = header ? header.offsetHeight : 64; // デフォルト64px
			const elementTop = element.getBoundingClientRect().top + window.scrollY;
			const offsetTop = elementTop - headerHeight - 0; // 少し余裕を持たせる
			window.scrollTo({ top: offsetTop, behavior: 'smooth' });
		}
	}

	// リンククリックハンドラー
	function handleClick(event, id) {
		event.preventDefault();
		scrollToSection(id);
	}

	// キーボードハンドラー
	function handleKeydown(event, id) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			scrollToSection(id);
		}
	}
</script>

<div class="flex">
	<!-- サイドバー（デスクトップのみ固定表示） -->
	<aside
		class="fixed top-0 left-0 hidden h-[calc(100vh)] w-80 overflow-y-auto bg-base-200 p-4 shadow-lg lg:block"
	>
		<ul class="menu">
			<li>
				<a
					href="#basic-syntax"
					onclick={(e) => handleClick(e, 'basic-syntax')}
					onkeydown={(e) => handleKeydown(e, 'basic-syntax')}
					role="button"
					tabindex="0">基本構文</a
				>
			</li>
			<li>
				<a
					href="#types"
					onclick={(e) => handleClick(e, 'types')}
					onkeydown={(e) => handleKeydown(e, 'types')}
					role="button"
					tabindex="0">型</a
				>
			</li>
			<li>
				<a
					href="#operators"
					onclick={(e) => handleClick(e, 'operators')}
					onkeydown={(e) => handleKeydown(e, 'operators')}
					role="button"
					tabindex="0">演算子</a
				>
			</li>
			<li>
				<a
					href="#control-structures"
					onclick={(e) => handleClick(e, 'control-structures')}
					onkeydown={(e) => handleKeydown(e, 'control-structures')}
					role="button"
					tabindex="0">制御構造</a
				>
			</li>
			<li>
				<a
					href="#functions"
					onclick={(e) => handleClick(e, 'functions')}
					onkeydown={(e) => handleKeydown(e, 'functions')}
					role="button"
					tabindex="0">関数</a
				>
			</li>
			<li>
				<a
					href="#collections"
					onclick={(e) => handleClick(e, 'collections')}
					onkeydown={(e) => handleKeydown(e, 'collections')}
					role="button"
					tabindex="0">コレクション</a
				>
			</li>
			<li>
				<a
					href="#classes-structs"
					onclick={(e) => handleClick(e, 'classes-structs')}
					onkeydown={(e) => handleKeydown(e, 'classes-structs')}
					role="button"
					tabindex="0">クラスと構造体</a
				>
			</li>
			<li>
				<a
					href="#methods"
					onclick={(e) => handleClick(e, 'methods')}
					onkeydown={(e) => handleKeydown(e, 'methods')}
					role="button"
					tabindex="0">メソッド</a
				>
			</li>
			<li>
				<a
					href="#optionals-error-handling"
					onclick={(e) => handleClick(e, 'optionals-error-handling')}
					onkeydown={(e) => handleKeydown(e, 'optionals-error-handling')}
					role="button"
					tabindex="0">オプションとエラー処理</a
				>
			</li>
			<li>
				<a
					href="#useful-functions"
					onclick={(e) => handleClick(e, 'useful-functions')}
					onkeydown={(e) => handleKeydown(e, 'useful-functions')}
					role="button"
					tabindex="0">便利な関数</a
				>
			</li>
		</ul>
	</aside>

	<!-- メインコンテンツ -->
	<main class="flex-1 p-4 lg:ml-80">
		{#if isLoading}
			<!-- ローディングアニメーション -->
			<div class="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
				<div class="loading loading-lg loading-spinner text-primary"></div>
				<p class="text-lg text-base-content/70">swift基本構文を読み込み中...</p>
				<div class="flex space-x-1">
					<div class="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-primary"
						style="animation-delay: 0.1s"
					></div>
					<div
						class="h-2 w-2 animate-bounce rounded-full bg-primary"
						style="animation-delay: 0.2s"
					></div>
				</div>
			</div>
		{:else}
			<div class="container mx-auto">
				<!-- SwiftFiddle実行の解説 -->
				<div id="basic-syntax" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							SwiftFiddleで実行できます
						</h2>
						<p class="mb-4">
							このページのSwiftコードは、オンライン実行環境「SwiftFiddle」で実際に動かして試すことができます。
						</p>

						<div class="grid gap-4 md:grid-cols-2">
							<div class="space-y-2">
								<h3 class="text-lg font-semibold">使い方</h3>
								<ol class="list-inside list-decimal space-y-1 text-sm">
									<li>各コードブロックの右上にある実行ボタンをクリックする</li>
									<li>
										<a
											href="https://swiftfiddle.com"
											target="_blank"
											rel="noopener noreferrer"
											class="link link-accent">SwiftFiddle</a
										>を開く
									</li>
									<li>このページのコードをコピー</li>
									<li>SwiftFiddleに貼り付けて実行</li>
									<li>結果が右側に表示されます</li>
									<li>clear consoleボタンで右側の結果をリセットできます</li>
								</ol>
							</div>
						</div>
					</div>
				</div>

				<!-- 基本構文 -->
				<div id="basic-syntax" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">基本構文</h2>
						<p>変数、定数、データ型の基本です。</p>
						<CodeBlock
							title="変数と定数"
							code={`// Swiftでは、定数（let）と変数（var）を宣言できます
// 定数の宣言（値を変更できない）
let schoolName = "中央中学校"  // 学校名を定数として宣言
let pi = 3.14159  // 円周率も定数

// 変数の宣言（値を変更できる）
var score = 85  // スコアを変数として宣言
var isStudying = true  // 勉強中かどうかを変数で管理

// データ型を明示的に指定することも可能
var height: Double = 165.5  // 身長をDouble型で宣言
var weight: Int = 50  // 体重をInt型で宣言

// print関数を使って値を出力
print("学校名: \\(schoolName)")  // 文字列補間を使って変数を埋め込み
print("スコア: \\(score)")
print("勉強中: \\(isStudying)")
print("身長: \\(height)cm")
print("体重: \\(weight)kg")`}
							output={`学校名: 中央中学校
スコア: 85
勉強中: true
身長: 165.5cm
体重: 50kg`}
							executable={true}
						/>
						<CodeBlock
							title="定数への再代入（エラー例）"
							code={`// 定数の宣言
let schoolName = "中央中学校"

// 定数への再代入はエラーになる
schoolName = "東京中学校"`}
							output={`error: cannot assign to value: 'schoolName' is a 'let' constant
schoolName = "東京中学校"
^^^^^^^^^^
note: change 'let' to 'var' to make it mutable`}
							executable={true}
						/>
						<CodeBlock
							title="列挙型（Enum）"
							code={`// 列挙型（Enum）は、関連する値をグループ化する型です
// 基本的な列挙型の定義
enum Direction {
    case north  // 北
    case south  // 南
    case east   // 東
    case west   // 西
}

// 短縮形での定義（1行で複数のcaseを定義）
enum Direction {
    case north, south, east, west
}

// enumの使用例
let currentDirection = Direction.north  // 北方向を指定

// switch文を使ってenumの値を処理
switch currentDirection {
case .north:
    print("北へ進む")  // northの場合の処理
case .south:
    print("南へ進む")  // southの場合の処理
case .east:
    print("東へ進む")  // eastの場合の処理
case .west:
    print("西へ進む")  // westの場合の処理
}

// 生の値（raw value）を持つenumの例
enum Planet: Int {  // Int型のraw valueを持つ
    case mercury = 1  // 水星
    case venus = 2    // 金星
    case earth = 3    // 地球
    case mars = 4     // 火星
}

let earthNumber = Planet.earth.rawValue  // rawValueで数値を取得
print("地球の番号: \\(earthNumber)")`}
							output={`北へ進む
地球の番号: 3`}
							executable={true}
						/>
					</div>
				</div>

				<!-- 型 -->
				<div id="types" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">型</h2>
						<p>Swiftのデータ型について学びます。</p>
						<CodeBlock
							title="基本型"
							code={`// Swiftの基本的なデータ型
// 整数型（Int）- 正負の整数を扱う
let age: Int = 13  // 年齢（整数）
let score: Int = 85  // スコア（整数）

// 浮動小数点型（Double, Float）- 小数点を扱う
let height: Double = 165.5  // 身長（倍精度浮動小数点）
let weight: Float = 50.5    // 体重（単精度浮動小数点）

// 論理型（Bool）- trueまたはfalseの値
let isStudent: Bool = true   // 学生かどうか
let hasHomework: Bool = false  // 宿題があるかどうか

// 文字列型（String）- 文字の並び
let name: String = "太郎"  // 名前
let message: String = "こんにちは"  // メッセージ

// 文字型（Character）- 単一の文字
let grade: Character = "A"  // 成績
let symbol: Character = "★"  // 記号

// 値の出力
print("年齢: \\(age)歳")
print("身長: \\(height)cm")
print("学生: \\(isStudent)")
print("名前: \\(name)")
print("成績: \\(grade)")`}
							output={`年齢: 13歳
身長: 165.5cm
学生: true
名前: 太郎
成績: A`}
							executable={true}
						/>
						<CodeBlock
							title="型の確認（type(of:)関数）"
							code={`// type(of:)関数を使って変数の型を確認する
let number = 42
let decimal = 3.14
let text = "Hello"
let flag = true

print("numberの型: \\(type(of: number))")  // Int型
print("decimalの型: \\(type(of: decimal))")  // Double型
print("textの型: \\(type(of: text))")      // String型
print("flagの型: \\(type(of: flag))")      // Bool型`}
							output={`numberの型: Int
decimalの型: Double
decimalの型: String
flagの型: Bool`}
							executable={true}
						/>
						<CodeBlock
							title="タプル（Tuple）"
							code={`// タプルは複数の値をグループ化する型
// 生徒の情報をタプルで表現
let student: (String, Int, String) = ("太郎", 13, "中学1年")
let point: (x: Int, y: Int) = (x: 10, y: 20)

// インデックスでアクセス
print("名前: \\(student.0)")  // 最初の要素（太郎）
print("年齢: \\(student.1)")  // 2番目の要素（13）
print("学年: \\(student.2)")  // 3番目の要素（中学1年）

// ラベル付きでアクセス
print("X座標: \\(point.x)")  // xラベルでアクセス
print("Y座標: \\(point.y)")  // yラベルでアクセス

// 分解して代入
let (name, age, grade) = student
print("\\(name)は\\(age)歳の\\(grade)生です")`}
							output={`名前: 太郎
年齢: 13
学年: 中学1年
X座標: 10
Y座標: 20
太郎は13歳の中学1年生です`}
							executable={true}
						/>
						<CodeBlock
							title="型の変換（キャスト）"
							code={`// 異なる型同士の変換（キャスト）
// IntからDoubleへの変換
let intValue = 42
let doubleValue = Double(intValue)  // IntからDoubleに変換
print("IntからDouble: \\(doubleValue)")  // 42.0

// DoubleからIntへの変換（小数点以下切り捨て）
let decimalValue = 3.9
let intFromDouble = Int(decimalValue)  // DoubleからIntに変換
print("DoubleからInt: \\(intFromDouble)")  // 3

// StringからIntへの変換（失敗する可能性あり）
let numberString = "123"
if let convertedNumber = Int(numberString) {
    print("StringからInt: \\(convertedNumber)")  // 変換成功
} else {
    print("変換できませんでした")
}

// IntからStringへの変換
let numberToString = String(intValue)
print("IntからString: \\(numberToString)")`}
							output={`IntからDouble: 42.0
DoubleからInt: 3
StringからInt: 123
IntからString: 42`}
							executable={true}
						/>
						<CodeBlock
							title="範囲型（Range）"
							code={`// 範囲型は連続した値の範囲を表す型
// ClosedRangeは開始値と終了値を含む範囲（...演算子）
let closedRange: ClosedRange<Int> = 1...5  // 1, 2, 3, 4, 5を含む範囲
print("ClosedRange: \\(closedRange)")  // 1...5と表示される

// 範囲を使ったループ
print("範囲内の値:")
for number in closedRange {
    print("\\(number)", terminator: " ")  // 1 2 3 4 5 と出力
}
print()  // 改行

// 範囲に値が含まれるかチェック
let testValue = 3
if closedRange.contains(testValue) {
    print("\\(testValue)は範囲内に含まれます")  // 3は範囲内に含まれる
}

// 範囲の境界値を取得
print("開始値: \\(closedRange.lowerBound)")  // 1
print("終了値: \\(closedRange.upperBound)")  // 5

// 半開範囲（..<演算子）との比較
let halfOpenRange = 1..<5  // 1, 2, 3, 4を含む（5を含まない）
print("Half-open range: \\(halfOpenRange)")  // 1..<5

// 文字の範囲も可能
let charRange: ClosedRange<Character> = "a"..."z"
print("文字の範囲: \\(charRange.contains(\\"m\\"))")  // true`}
							output={`ClosedRange: 1...5
範囲内の値:
1 2 3 4 5
3は範囲内に含まれます
開始値: 1
終了値: 5
Half-open range: 1..<5
文字の範囲: true`}
							executable={true}
						/>
					</div>
				</div>

				<!-- 演算子 -->
				<div id="operators" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">演算子</h2>
						<p>計算や比較に使う記号です。</p>
						<CodeBlock
							title="算術演算子"
							code={`// 算術演算子を使って数値の計算を行う
let a = 10  // 変数aに10を代入
let b = 3   // 変数bに3を代入

let sum = a + b        // 加算（和）: 10 + 3 = 13
let difference = a - b // 減算（差）: 10 - 3 = 7
let product = a * b    // 乗算（積）: 10 * 3 = 30
let quotient = a / b   // 除算（商）: 10 / 3 = 3（整数除算なので小数点以下切り捨て）
let remainder = a % b  // 剰余（余り）: 10 % 3 = 1

// 計算結果を出力
print("和: \\(sum)")
print("差: \\(difference)")
print("積: \\(product)")
print("商: \\(quotient)")
print("余り: \\(remainder)")`}
							output={`和: 13
差: 7
積: 30
商: 3
余り: 1`}
							executable={true}
						/>
						<CodeBlock
							title="比較演算子"
							code={`// 比較演算子を使って値の大小や等しさを比較する
let x = 5   // 変数xに5を代入
let y = 10  // 変数yに10を代入

print("x == y: \\(x == y)")  // 等しい（xはyと等しいか？）: false
print("x != y: \\(x != y)")  // 等しくない（xはyと等しくないか？）: true
print("x < y: \\(x < y)")   // より小さい（xはyより小さいか？）: true
print("x > y: \\(x > y)")   // より大きい（xはyより大きいか？）: false
print("x <= y: \\(x <= y)")  // 以下（xはy以下か？）: true
print("x >= y: \\(x >= y)")  // 以上（xはy以上か？）: false`}
							output={`x == y: false
x != y: true
x < y: true
x > y: false
x <= y: true
x >= y: false`}
							executable={true}
						/>
						<CodeBlock
							title="三項演算子"
							code={`// 三項演算子は条件式 ? 真の値 : 偽の値 の形式で、条件によって値を選択する
let score = 85  // テストのスコア

// 条件に基づいて値を選択（60点以上なら合格、そうでなければ不合格）
let result = score >= 60 ? "合格" : "不合格"
print("テスト結果: \\(result)")

// 数値の比較（aとbのうち大きい方を選択）
let a = 10
let b = 20
let max = a > b ? a : b  // aがbより大きい場合はa、そうでなければb
print("大きい方の値: \\(max)")

// 文字列の選択（学生かどうかに応じてメッセージを選択）
let isStudent = true
let message = isStudent ? "学生です" : "学生ではありません"
print(message)`}
							output={`テスト結果: 合格
大きい方の値: 20
学生です`}
							executable={true}
						/>
					</div>
				</div>
				<div id="control-structures" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">制御構造</h2>
						<p>プログラムの流れを制御します。</p>
						<CodeBlock
							title="if文"
							code={`// if文を使って条件分岐を行う
let age = 13  // 年齢

// 基本的なif-else文（13歳以上なら中学生、そうでなければ小学生）
if age >= 13 {
    print("中学生です")
} else {
    print("小学生です")
}

// 複数の条件をチェックするif-else if-else文
if age >= 18 {
    print("大人")  // 18歳以上は大人
} else if age >= 13 {
    print("中学生")  // 13-17歳は中学生
} else {
    print("小学生")  // 12歳以下は小学生
}`}
							output={`中学生です
中学生`}
							executable={true}
						/>
						<CodeBlock
							title="for-inループ"
							code={`// for-inループを使ってコレクションの要素を順番に処理する
let fruits = ["りんご", "バナナ", "オレンジ"]  // 果物の配列

// 配列の各要素を順番に処理
for fruit in fruits {
    print("好きな果物: \\(fruit)")
}

// 範囲を使ったループ（1から5までの数字を順番に処理）
for i in 1...5 {  // 1, 2, 3, 4, 5の順にiに代入される
    print("\\(i)回目のループ")
}`}
							output={`好きな果物: りんご
好きな果物: バナナ
好きな果物: オレンジ
1回目のループ
2回目のループ
3回目のループ
4回目のループ
5回目のループ`}
							executable={true}
						/>
					</div>
				</div>

				<!-- 関数 -->
				<div id="functions" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">関数</h2>
						<p>処理をまとめて再利用できるようにします。</p>
						<CodeBlock
							title="関数の定義と呼び出し"
							code={`// funcキーワードを使って関数を定義する
// 挨拶をする関数（名前を受け取って挨拶文を返す）
func greet(name: String) -> String {
    return "こんにちは、\\(name)さん!"  // 挨拶文を返す
}

// 計算を行う関数（2つの整数を受け取ってその和を返す）
func add(a: Int, b: Int) -> Int {
    return a + b  // a + bの結果を返す
}

// 関数の実行（呼び出し）
let message = greet(name: "太郎")  // greet関数を呼び出し、結果をmessageに代入
let result = add(a: 10, b: 5)     // add関数を呼び出し、結果をresultに代入

print(message)  // 挨拶文を出力
print("10 + 5 = \\(result)")  // 計算結果を出力`}
							output={`こんにちは、太郎さん!
10 + 5 = 15`}
							executable={true}
						/>
					</div>
				</div>

				<!-- コレクション -->
				<div id="collections" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">コレクション</h2>
						<p>複数の値をまとめて扱います。</p>
						<CodeBlock
							title="配列（Array）"
							code={`// 配列は複数の値を順番に格納するコレクション型
// 配列の作成（文字列の配列）
var fruits = ["りんご", "バナナ", "オレンジ"]  // 果物の名前を格納
let numbers = [1, 2, 3, 4, 5]  // 数値の配列

// インデックスを使って要素にアクセス（0から始まる）
print(fruits[0])  // 最初の要素（りんご）を出力
print(numbers[0]) // 最初の要素（1）を出力

// 要素の追加（appendメソッドを使う）
fruits.append("ぶどう")  // 配列の末尾にぶどうを追加
print(fruits)  // 追加後の配列全体を出力

// 要素数の取得（countプロパティ）
print(fruits.count)  // fruits配列の要素数を出力
print(numbers.count) // numbers配列の要素数を出力`}
							output={`りんご
1
["りんご", "バナナ", "オレンジ", "ぶどう"]
4
5`}
							executable={true}
						/>
						<CodeBlock
							title="辞書（Dictionary）"
							code={`// 辞書はキーと値のペアを格納するコレクション型
// 辞書の作成（キーが科目名、値が点数の辞書）
var scores = ["数学": 85, "英語": 92, "国語": 78]

// キーを使って値を取得（オプショナルバインディングを使用）
if let mathScore = scores["数学"] {  // 数学の点数を取得しようとする
    print("数学の点数: \\(mathScore)")  // 取得成功したら出力
}

// 値の更新または追加
scores["理科"] = 88  // 理科の点数を追加
print(scores)  // 更新後の辞書全体を出力`}
							output={`数学の点数: 85
["数学": 85, "英語": 92, "国語": 78, "理科": 88]`}
							executable={true}
						/>
					</div>
				</div>

				<!-- クラスと構造体 -->
				<div id="classes-structs" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">クラスと構造体</h2>
						<p>データをまとめて扱うための型です。</p>
						<CodeBlock
							title="構造体の定義"
							code={`// structキーワードを使って構造体を定義（関連するデータをまとめる）
struct Student {  // 学生を表す構造体
    var name: String   // 名前（変数）
    var age: Int       // 年齢（変数）
    var grade: String  // 学年（変数）
}

// 構造体のインスタンスを作成
var student1 = Student(name: "太郎", age: 13, grade: "中学1年")

// ドット記法を使ってプロパティにアクセス
print("\\(student1.name)は\\(student1.age)歳です")`}
							output="太郎は13歳です"
							executable={true}
						/>
					</div>
				</div>

				<!-- メソッド -->
				<div id="methods" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">メソッド</h2>
						<p>
							メソッドは、特定の型（クラス、構造体、列挙型）の内部で定義された関数です。その型のデータ（プロパティ）を使って処理を行う「振る舞い」を定義します。
						</p>
						<CodeBlock
							title="メソッドの定義と使用"
							code={`class Counter {
    var count = 0
    
    // カウントを1増やすメソッド
    func increment() {
        count += 1
        print("カウント: \\(count)")
    }
    
    // 指定した数だけ増やすメソッド
    func increment(by amount: Int) {
        count += amount
        print("\\(amount)増やしました。合計: \\(count)")
    }
}

// クラスのインスタンスを作成
let myCounter = Counter()

// メソッドの呼び出し
myCounter.increment()
myCounter.increment(by: 5)`}
							output={`カウント: 1
5増やしました。合計: 6`}
							executable={true}
						/>

						<div class="mt-8">
							<h3 class="mb-4 text-xl font-bold">関数とメソッドの違い</h3>
							<div class="overflow-x-auto">
								<table class="table w-full rounded-box table-zebra bg-base-200">
									<thead>
										<tr class="bg-base-300">
											<th class="text-base text-base-content">項目</th>
											<th class="text-base text-base-content">関数 (Function)</th>
											<th class="text-base text-base-content">メソッド (Method)</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="font-bold">定義場所</td>
											<td>型の外側（グローバル）</td>
											<td>型（クラス・構造体）の内側</td>
										</tr>
										<tr>
											<td class="font-bold">呼び出し方</td>
											<td><code class="rounded bg-base-300 px-1">funcName()</code></td>
											<td><code class="rounded bg-base-300 px-1">instance.methodName()</code></td>
										</tr>
										<tr>
											<td class="font-bold">役割</td>
											<td>単独で動作する処理のまとまり</td>
											<td>その型のデータ操作や振る舞い</td>
										</tr>
										<tr>
											<td class="font-bold">データアクセス</td>
											<td>引数のみ</td>
											<td>インスタンス自身のプロパティ（<code>self</code>）にアクセス可能</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				<!-- オプションとエラー処理 -->
				<div id="optionals-error-handling" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">オプションとエラー処理</h2>
						<p>値が存在しない可能性を扱います。</p>
						<CodeBlock
							title="Optional型"
							code={`// Optional型は値が存在しない可能性を表す（型名の後に?をつける）
var optionalName: String? = "太郎"  // 値があるOptional
var optionalAge: Int? = nil         // nil（値なし）のOptional

// オプショナルバインディング（if let）で安全に値を取り出す
if let name = optionalName {  // optionalNameに値があればnameに代入
    print("名前: \\(name)")
} else {
    print("名前が設定されていません")
}

// nilの値に対するオプショナルバインディング
if let age = optionalAge {  // optionalAgeはnilなので実行されない
    print("年齢: \\(age)")
} else {
    print("年齢が設定されていません")
}

// 強制アンラップ（!）はnilでないことを確認してから使用（危険）
if optionalAge != nil {
    print("年齢: \\(optionalAge!)")  // !で強制的に値を取り出す
}

// 注意: nilに対して強制アンラップするとランタイムエラーになる
// 以下のコードは実行しないこと（コメントアウト）
// let nilValue: Int? = nil
// print(nilValue!)  // Fatal error: Unexpectedly found nil while unwrapping an Optional value`}
							output={`名前: 太郎
年齢が設定されていません`}
							executable={true}
						/>
					</div>
				</div>

				<!-- 便利な関数 -->
				<div id="useful-functions" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">便利な関数</h2>
						<p>よく使う組み込み関数です。</p>
						<CodeBlock
							title="print関数"
							code={`// print関数はコンソールに値を出力する
print("Hello, World!")  // 基本的な出力
print("名前: 太郎, 年齢: 13")  // 複数の値をカンマ区切りで出力

// terminatorパラメータで改行を制御（デフォルトは\\n）
print("こんにちは", terminator: "")  // 改行なしで出力

// 明示的に改行を指定（デフォルトと同じ）
print("こんにちは", terminator: "\\n")

// 複数の改行を出力
print("1行目")  // 1行目出力
print("2行目", terminator: "\\n\\n")  // 2行目出力後に2回改行
print("4行目")  // 4行目出力`}
							output={`Hello, World!
名前: 太郎, 年齢: 13
こんにちはこんにちは
1行目
2行目

4行目`}
							executable={true}
						/>
						<CodeBlock
							title="Stringのメソッド"
							code={`let message = "Hello, Swift!"  // 文字列を変数に代入

// countプロパティで文字数を取得
print(message.count)  // 文字列の長さ（文字数）を出力

// uppercased()メソッドで大文字に変換
print(message.uppercased())  // "HELLO, SWIFT!"

// lowercased()メソッドで小文字に変換
print(message.lowercased())  // "hello, swift!"

// contains()メソッドで部分文字列の検索
if message.contains("Swift") {  // "Swift"が含まれているかチェック
    print("Swiftが見つかりました")  // 含まれていれば出力
}`}
							output={`13
HELLO, SWIFT!
hello, swift!
Swiftが見つかりました`}
							executable={true}
						/>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
