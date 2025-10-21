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
			<li class="pt-16">
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
				<!-- 基本構文 -->
				<div id="basic-syntax" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">基本構文</h2>
						<p>変数、定数、データ型の基本です。</p>
						<CodeBlock
							title="変数と定数"
							code={`// 定数の宣言（値を変更できない）
let schoolName = "中央中学校"
let pi = 3.14159

// 変数の宣言（値を変更できる）
var score = 85
var isStudying = true

// データ型を明示的に指定
var height: Double = 165.5
var weight: Int = 50

// 値の出力
print("学校名: \\(schoolName)")
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
							code={`// 列挙型の定義
enum Direction {
    case north
    case south
    case east
    case west
}

// 短縮形での定義
enum Direction {
    case north, south, east, west
}

// enumの使用
let currentDirection = Direction.north

// switch文での使用
switch currentDirection {
case .north:
    print("北へ進む")
case .south:
    print("南へ進む")
case .east:
    print("東へ進む")
case .west:
    print("西へ進む")
}

// 生の値を持つenum
enum Planet: Int {
    case mercury = 1
    case venus = 2
    case earth = 3
    case mars = 4
}

let earthNumber = Planet.earth.rawValue
print("地球の番号: \\(earthNumber)")`}
							output={`北へ進む
地球の番号: 3`}
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
							code={`// 基本的な計算
let a = 10
let b = 3

let sum = a + b        // 13
let difference = a - b // 7
let product = a * b    // 30
let quotient = a / b   // 3（整数除算）
let remainder = a % b  // 1

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
							code={`// 値の比較
let x = 5
let y = 10

print("x == y: \\(x == y)")  // false（等しい）
print("x != y: \\(x != y)")  // true（等しくない）
print("x < y: \\(x < y)")   // true（より小さい）
print("x > y: \\(x > y)")   // false（より大きい）
print("x <= y: \\(x <= y)")  // true（以下）
print("x >= y: \\(x >= y)")  // false（以上）`}
							output={`x == y: false
x != y: true
x < y: true
x > y: false
x <= y: true
x >= y: false`}
							executable={true}
						/>
					</div>
				</div>

				<!-- 制御構造 -->
				<div id="control-structures" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">制御構造</h2>
						<p>プログラムの流れを制御します。</p>
						<CodeBlock
							title="if文"
							code={`// 条件分岐
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
}`}
							output={`中学生です
中学生`}
							executable={true}
						/>
						<CodeBlock
							title="for-inループ"
							code={`// 配列の要素を順番に処理
let fruits = ["りんご", "バナナ", "オレンジ"]

for fruit in fruits {
    print("好きな果物: \\(fruit)")
}

// 範囲を使ったループ
for i in 1...5 {
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
							code={`// 簡単な関数の定義
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
print("10 + 5 = \\(result)")`}
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
							code={`// 配列の作成
var fruits = ["りんご", "バナナ", "オレンジ"]
let numbers = [1, 2, 3, 4, 5]

// 要素へのアクセス
print(fruits[0])  // りんご
print(numbers[0]) // 1

// 要素の追加
fruits.append("ぶどう")
print(fruits)  // ["りんご", "バナナ", "オレンジ", "ぶどう"]

// 要素数の取得
print(fruits.count)  // 4
print(numbers.count) // 5`}
							output={`りんご
1
["りんご", "バナナ", "オレンジ", "ぶどう"]
4
5`}
							executable={true}
						/>
						<CodeBlock
							title="辞書（Dictionary）"
							code={`// 辞書の作成
var scores = ["数学": 85, "英語": 92, "国語": 78]

// 値の取得
if let mathScore = scores["数学"] {
    print("数学の点数: \\(mathScore)")
}

// 値の更新
scores["理科"] = 88
print(scores)  // ["数学": 85, "英語": 92, "国語": 78, "理科": 88]`}
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
							code={`// 構造体の定義
struct Student {
    var name: String
    var age: Int
    var grade: String
}

// インスタンスの作成
var student1 = Student(name: "太郎", age: 13, grade: "中学1年")

// プロパティへのアクセス
print("\\(student1.name)は\\(student1.age)歳です")`}
							output="太郎は13歳です"
							executable={true}
						/>
					</div>
				</div>

				<!-- オプションとエラー処理 -->
				<div id="optionals-error-handling" class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">オプションとエラー処理</h2>
						<p>値が存在しない可能性を扱います。</p>
						<CodeBlock
							title="Optional型"
							code={`// Optional型の変数
var optionalName: String? = "太郎"
var optionalAge: Int? = nil

// オプショナルバインディング
if let name = optionalName {
    print("名前: \\(name)")
} else {
    print("名前が設定されていません")
}

// nilの値に対するオプショナルバインディング
if let age = optionalAge {
    print("年齢: \\(age)")
} else {
    print("年齢が設定されていません")
}

// 強制アンラップ（注意: nilの場合はエラー）
if optionalAge != nil {
    print("年齢: \\(optionalAge!)")
}

// エラーが発生する例（実行時はコメントアウトを外さないでください）
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
							code={`// コンソール出力
print("Hello, World!")
print("名前: 太郎, 年齢: 13")

// 改行なし出力
print("こんにちは", terminator: "")

// 改行付き出力（デフォルト）
print("こんにちは", terminator: "\\n")

// 複数の改行
print("1行目")
print("2行目", terminator: "\\n\\n")  // 2行改行
print("4行目")`}
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
							code={`let message = "Hello, Swift!"

// 文字数の取得
print(message.count)  // 13

// 大文字/小文字変換
print(message.uppercased())  // "HELLO, SWIFT!"
print(message.lowercased())  // "hello, swift!"

// 文字列の検索
if message.contains("Swift") {
    print("Swiftが見つかりました")
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
