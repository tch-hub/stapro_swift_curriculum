<script>
	import { base, resolve } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	// タップで切り替えられるようにする（オプション）
	let activeTab = $state('vars');
</script>

<main class="container mx-auto px-4 py-8" data-base={base}>
	<header class="mb-8 text-center">
		<h2 class="mb-4 text-3xl font-bold">Swift 基本構文の解説</h2>
		<p class="text-lg">
			練習問題に出てくるSwiftプログラミングの基本的なルールと書き方を学びましょう。
		</p>
	</header>

	<!-- SwiftFiddleの使い方 -->
	<section class="card mb-8 border border-secondary/30 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl text-secondary">
				<span class="material-symbols-outlined mr-2 text-2xl text-secondary">terminal</span>
				SwiftFiddleの使い方
			</h2>
			<p>
				このページでは、ブラウザ上でSwiftコードを動かせる<strong
					>SwiftFiddle（スウィフト・フィドル）</strong
				>を使います。<br />
				それぞれのコードブロックの右上に表示される 再生ボタンを押すと、コードが入力された画面が開きます。
			</p>
			<ul class="mt-2 ml-2 list-inside list-disc space-y-2">
				<li>
					画面上部の <span class="rounded bg-blue-600 px-2 py-0.5 text-sm text-white"
						><i class="fas fa-play mr-1"></i>Run</span
					>（青色の再生ボタン）を押すとコードが実行されます。
				</li>
				<li>実行結果は画面の右半分（Outputエリア）に表示されます。</li>
				<li>
					Clear Consoleボタン(消しゴムアイコン)をクリックすることで、実行結果をリセットできます。
				</li>
				<li>コードを書き換えて、自分で色々な数や文字を <code>print</code> で試してみましょう！</li>
			</ul>
		</div>
	</section>

	<!-- 変数と定数 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="vars">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">1</span>
				変数と定数 (var / let)
			</h2>
			<p class="mb-4">
				データを一時的に保存するための「箱」を作ります。Swiftには中身を入れ替えられる「変数」と、入れ替えられない「定数」があります。
			</p>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">変数 (var)</h3>
						<p class="text-sm">後から値を変更できる箱です。</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`var score = 100\nprint(score) // 100 が出力される\n\nscore = 150 // 変更OK！\nprint(score) // 150 が出力される`}
							/>
						</div>
					</div>
				</div>
				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">定数 (let)</h3>
						<p class="text-sm">
							後から値を変更できない箱です。安全のため、なるべくこちらを使います。
						</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`let name = "太郎"\nprint(name) // 太郎 が出力される\n\n\n// name = "次郎" // エラー！`}
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/1')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<!-- データ型と型推論 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="types">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">2</span>
				データ型と型推論
			</h2>
			<p class="mb-4">
				データには「整数」や「文字」といった「型」があります。Swiftは入れた値から自動的に型を推論してくれます（型推論）。
			</p>

			<ul class="mb-4 list-inside list-disc space-y-2">
				<li><strong>Int</strong>: 整数 (例: <code>10</code>, <code>-5</code>)</li>
				<li><strong>Double</strong>: 小数 (例: <code>3.14</code>)</li>
				<li><strong>String</strong>: 文字列 (例: <code>"Hello"</code>)</li>
				<li><strong>Bool</strong>: 真偽値 (例: <code>true</code>, <code>false</code>)</li>
			</ul>

			<div class="card bg-base-100">
				<div class="card-body p-4">
					<h3 class="font-bold">型の指定と推論</h3>
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`// ① 型推論（Swiftが自動でIntと判断）\nvar age = 15\nprint(age) // 15 が出力される\n\n// ② 型を明示する（コロン : を使う）\nvar message: String = "こんにちは"\nprint(message) // こんにちは が出力される\n\n// 注意：一度決まった型は後から変更できません。`}
						/>
					</div>
				</div>
			</div>

			<div class="card bg-base-100">
				<div class="card-body p-4">
					<h3 class="font-bold">空の定義（空文字・空配列・nil）</h3>
					<p class="text-sm">
						最初から中身を「空」にしておきたい場合の書き方です。型を明示する必要があります。
					</p>
					<div class="mt-2">
						<CodeBlock
							description="空文字（&quot;&quot;）は、「文字が何も書かれていないノート」を持っている状態です。一方、nilは、「ノート自体を持っていない（無）」状態を表します。これらは全くの別物なので注意しましょう！"
							executable={true}
							code={`// 空の文字列\nvar emptyText: String = ""\n\n// 空の配列\nvar emptyArray: [Int] = []\n\n// 空（何もない状態）を表すnil（型に?をつける）\nvar nothing: String? = nil`}
						/>
					</div>
				</div>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/2')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<!-- 条件分岐 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="control">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">3</span>
				条件分岐 (if / switch)
			</h2>
			<p class="mb-4">「もし〇〇だったら、△△する」という処理の分かれ道を作ります。</p>

			<div class="space-y-4">
				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">if文 / else if / else</h3>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`let score = 85\n\nif score >= 90 {\n    print("素晴らしい！")\n} else if score >= 70 {\n    print("合格です") // 今回はここが実行されます\n} else {\n    print("がんばりましょう")\n}`}
							/>
						</div>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">switch文</h3>
						<p class="text-sm">
							いろんなパターンがある時に便利です。<code>default</code
							>（どれにも当てはまらない場合）が必須です。
						</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`let rank = "A"\n\nswitch rank {\ncase "A":\n    print("最高評価") // 今回はここが出力されます\ncase "B":\n    print("良い評価")\ndefault:\n    print("その他の評価")\n}`}
							/>
						</div>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">三項演算子</h3>
						<p class="text-sm">
							<code>条件式 ? 真の時の値 : 偽の時の値</code>
							(if文を1行で書ける)
						</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`let isSunny = true\nlet message = isSunny ? "晴れです" : "雨です"\nprint(message) // 晴れです`}
							/>
						</div>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">??（空合体演算子）</h3>
						<p class="text-sm">
							データが空（<code>nil</code>）だった場合に「代わりの値」を使う、とても便利な構文です。
						</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`var nickname: String? = nil\n// nicknameがnilなら"ゲスト"を使う\nlet displayName = nickname ?? "ゲスト"\nprint(displayName) // ゲスト が出力される`}
							/>
						</div>
					</div>
				</div>

				<div class="bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">guard文</h3>
						<p class="text-sm">
							条件を満たさない時に、早めに処理を終了(return)させるための文。「早期リターン」に大活躍！
						</p>
						<div class="mt-2">
							<CodeBlock
								description="if文は、「条件を満たす場合に、中の処理をする」時に使います。一方、guard文は、「条件を満たさないなら、ここで処理を終了（return）する」という用途で使います。コードの入れ子（ネスト）が深くならないため、見やすいコードになります。"
								executable={true}
								code={`func checkAge(age: Int) {\n    guard age >= 18 else {\n        print("18歳未満は利用できません")\n        return\\n    }\n    print("ようこそ！受付完了です")\n}\n\ncheckAge(age: 15) // 18歳未満は利用できません\ncheckAge(age: 20) // ようこそ！受付完了です`}
							/>
						</div>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body p-4">
						<h3 class="font-bold">if let</h3>
						<p class="text-sm">
							空（<code>nil</code
							>）かもしれない安全でないデータを、安全に取り出す魔法の構文（オプショナルバインディング）。
						</p>
						<div class="mt-2">
							<CodeBlock
								executable={true}
								code={`var nickname: String? = "たろう" // ?はnil(空)かもしれない印\n\nif let safeName = nickname {\n    print("こんにちは、\\(safeName)さん！")\n} else {\n    print("名無しさん、こんにちは！")\n}`}
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/3')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<!-- 配列 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="arrays">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">4</span>
				配列 (Array)
			</h2>
			<p class="mb-4">
				複数のデータ（同じ型）を順番に並べてひとまとめに管理できる箱です。[ ]（角括弧）を使います。
			</p>

			<div class="card bg-base-100">
				<div class="card-body p-4">
					<h3 class="font-bold">配列の使い方</h3>
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`// 文字列の配列\nvar fruits = ["りんご", "みかん", "バナナ"]\n\n// データの取り出し（0から数え始めます）\nprint(fruits[0]) // "りんご"\n\n// データの追加と削除\nfruits.append("ぶどう")    // 末尾に追加\nfruits.remove(at: 1)     // 1番目(みかん)を削除\n\n// データの個数\nprint(fruits.count)      // 残りは3個`}
						/>
					</div>
				</div>
			</div>

			<div class="card mt-4 bg-base-100">
				<div class="card-body p-4">
					<h3 class="font-bold">空の配列の定義</h3>
					<p class="text-sm">
						最初からデータが入っていない「空の配列」を作りたい場合は、中に入れるデータの「型」を指定する必要があります。
					</p>
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`// ① 型を明示して [] を書く方法\nvar emptyNames: [String] = []\nemptyNames.append("太郎")\nprint(emptyNames) // ["太郎"]\n\n// ② [型]() を使う方法\nvar emptyNumbers = [Int]()\nemptyNumbers.append(100)\nprint(emptyNumbers) // [100]`}
						/>
					</div>
				</div>
			</div>

			<div class="card mt-4 bg-base-100">
				<div class="card-body p-4">
					<h3 class="font-bold">for-in ループ（繰り返し）</h3>
					<p class="text-sm">配列の中身を1つずつ取り出して処理する構文です。</p>
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`for item in fruits {\n    print(item) // りんご、バナナ、ぶどう が順番に表示される\n}`}
						/>
					</div>
				</div>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/4')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<!-- 関数 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="functions">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">5</span>
				関数 (func)
			</h2>
			<p class="mb-4">
				よく行う処理をひとまとめにして、名前を付けたものです。<code>func</code
				>キーワードで作ります。
			</p>

			<div class="card bg-base-100">
				<div class="card-body p-4">
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`// 1. 関数の定義（作る）\n// 引数 name(String型) を受け取り、String型を返す(-> String)\nfunc greet(name: String) -> String {\n    return name + "さん、こんにちは！"\n}\n\n// 2. 関数の呼び出し（使う）\nlet message = greet(name: "太郎")\nprint(message) // "太郎さん、こんにちは！"`}
						/>
					</div>
				</div>
			</div>
			<div class="mt-4 text-sm">
				<p>
					<strong>クロージャ:</strong> 名前を持たない関数のことです。変数に代入したり、他の関数に渡したりすることができます。
				</p>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/5')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<!-- 列挙型 -->
	<section class="card mb-8 bg-base-100 shadow-xl" id="enums">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">6</span>
				列挙型 (Enum)
			</h2>
			<p class="mb-4">
				関連する選択肢などを自分で定義できる型です。タイポ（打ち間違い）を防ぐのに役立ちます。
			</p>

			<div class="card bg-base-100">
				<div class="card-body p-4">
					<div class="mt-2">
						<CodeBlock
							executable={true}
							code={`// 定義 (caseでケースを作る)\nenum Direction {\n    case north, south, east, west\n}\n\n// 使うとき\nlet myDirection = Direction.north\n\n// switch文との相性がバツグン！\nswitch myDirection {\ncase .north:\n    print("北へ向かいます")\ncase .south, .east, .west:\n    print("北以外へ向かいます")\n}`}
						/>
					</div>
				</div>
			</div>

			<div class="mt-6 card-actions justify-end pr-4">
				<a href={resolve('/quiz/6')} class="btn btn-primary">
					<span class="material-symbols-outlined mr-1">quiz</span>
					このセクションの練習問題に挑戦
				</a>
			</div>
		</div>
	</section>

	<nav class="mt-8 flex justify-center">
		<a href={resolve('/')} class="btn mr-4 btn-outline">トップに戻る</a>
		<a href={resolve('/quiz')} class="btn btn-primary">練習問題に挑戦する！</a>
	</nav>
</main>
