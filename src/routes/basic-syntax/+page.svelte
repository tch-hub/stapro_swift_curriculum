<script>
	import { base, resolve } from '$app/paths';

	// タップで切り替えられるようにする（オプション）
	let activeTab = $state('vars');
</script>

<div class="container mx-auto px-4 py-8" data-base={base}>
	<div class="mb-8 text-center">
		<h2 class="mb-4 text-3xl font-bold">Swift 基本構文の解説</h2>
		<p class="text-lg">
			練習問題に出てくるSwiftプログラミングの基本的なルールと書き方を学びましょう。
		</p>
	</div>

	<!-- SwiftFiddleの使い方 -->
	<div class="card mb-8 border border-secondary/30 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl text-secondary">
				<span class="material-symbols-outlined text-secondary mr-2 text-2xl">terminal</span>
				SwiftFiddleの使い方
			</h2>
			<p>
				このページでは、ブラウザ上でSwiftコードを動かせる<strong
					>SwiftFiddle（スウィフト・フィドル）</strong
				>を使います。<br />
				それぞれの解説の下にある
				<span class="badge badge-sm badge-secondary">SwiftFiddleで試す</span> ボタンを押すと、コードが入力された画面が開きます。
			</p>
			<ul class="mt-2 ml-2 list-inside list-disc space-y-2">
				<li>
					画面上部の <span class="rounded bg-blue-600 px-2 py-0.5 text-sm text-white"
						><i class="fas fa-play mr-1"></i>Run</span
					>（青色の再生ボタン）を押すとコードが実行されます。
				</li>
				<li>実行結果は画面の右半分（Outputエリア）に表示されます。</li>
                <li>Clear Consoleボタン(消しゴムアイコン)をクリックすることで、実行結果をリセットできます。</li>
				<li>コードを書き換えて、自分で色々な数や文字を <code>print</code> で試してみましょう！</li>
			</ul>
		</div>
	</div>

	<!-- 変数と定数 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="vars">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">1</span>
				変数と定数 (var / let)
			</h2>
			<p class="mb-4">
				データを一時的に保存するための「箱」を作ります。Swiftには中身を入れ替えられる「変数」と、入れ替えられない「定数」があります。
			</p>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="card bg-base-200">
					<div class="card-body p-4">
						<h3 class="font-bold">変数 (var)</h3>
						<p class="text-sm">後から値を変更できる箱です。</p>
						<div class="mockup-code mt-2">
							<pre data-prefix="1"><code>var score = 100</code></pre>
							<pre data-prefix="2"><code>print(score) // 100 が出力される</code></pre>
							<pre data-prefix="3"><code></code></pre>
							<pre data-prefix="4"><code>score = 150 // 変更OK！</code></pre>
							<pre data-prefix="5"><code>print(score) // 150 が出力される</code></pre>
						</div>
					</div>
				</div>
				<div class="card bg-base-200">
					<div class="card-body p-4">
						<h3 class="font-bold">定数 (let)</h3>
						<p class="text-sm">
							後から値を変更できない箱です。安全のため、なるべくこちらを使います。
						</p>
						<div class="mockup-code mt-2">
							<pre data-prefix="1"><code>let name = "太郎"</code></pre>
							<pre data-prefix="2"><code>print(name) // 太郎 が出力される</code></pre>
							<pre data-prefix="3"><code></code></pre>
							<pre data-prefix="4"><code>// name = "次郎" // エラー！</code></pre>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=var+score+%3D+100%0Aprint(score)%0A%0Ascore+%3D+150%0Aprint(score)%0A%0Alet+name+%3D+%22%E5%A4%AA%E9%83%8E%22%0Aprint(name)%0A%0A%2F%2F+name+%3D+%22%E6%AC%A1%E9%83%8E%22+%2F%2F+%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E5%A4%96%E3%81%99%E3%81%A8%E3%82%A8%E3%83%A9%E3%83%BC"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<!-- データ型と型推論 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="types">
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

			<div class="card bg-base-200">
				<div class="card-body p-4">
					<h3 class="font-bold">型の指定と推論</h3>
					<div class="mockup-code mt-2 text-sm">
						<pre data-prefix="1"><code>// ① 型推論（Swiftが自動でIntと判断）</code></pre>
						<pre data-prefix="2"><code>var age = 15</code></pre>
						<pre data-prefix="3"><code>print(age) // 15 が出力される</code></pre>
						<pre data-prefix="4"><code></code></pre>
						<pre data-prefix="5"><code>// ② 型を明示する（コロン : を使う）</code></pre>
						<pre data-prefix="6"><code>var message: String = "こんにちは"</code></pre>
						<pre data-prefix="7"><code>print(message) // こんにちは が出力される</code></pre>
						<pre data-prefix="8"><code></code></pre>
						<pre data-prefix="9"><code>// 注意：一度決まった型は後から変更できません。</code></pre>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=var+age+%3D+15%0Aprint(type(of%3A+age))+%2F%2F+Int%E3%81%A8%E6%8E%A8%E8%AB%96%E3%81%95%E3%82%8C%E3%82%8B%0A%0Avar+message%3A+String+%3D+%22%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%22%0Aprint(message)%0A%0Avar+pi+%3D+3.14%0Aprint(type(of%3A+pi))+%2F%2F+Double%E3%81%A8%E6%8E%A8%E8%AB%96%E3%81%95%E3%82%8C%E3%82%8B"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<!-- 条件分岐 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="control">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">3</span>
				条件分岐 (if / switch)
			</h2>
			<p class="mb-4">「もし〇〇だったら、△△する」という処理の分かれ道を作ります。</p>

			<div class="space-y-4">
				<div class="card bg-base-200">
					<div class="card-body p-4">
						<h3 class="font-bold">if文 / else if / else</h3>
						<div class="mockup-code mt-2 text-sm">
							<pre data-prefix="1"><code>let score = 85</code></pre>
							<pre data-prefix="2"><code>if score >= 90 &lcub;</code></pre>
							<pre data-prefix="3"><code>    print("素晴らしい！")</code></pre>
							<pre data-prefix="4"><code>&rcub; else if score >= 70 &lcub;</code></pre>
							<pre data-prefix="5"><code>    print("合格です") // 今回はここが実行されます</code
								></pre>
							<pre data-prefix="6"><code>&rcub; else &lcub;</code></pre>
							<pre data-prefix="7"><code>    print("がんばりましょう")</code></pre>
							<pre data-prefix="8"><code>&rcub;</code></pre>
						</div>
					</div>
				</div>

				<div class="card bg-base-200">
					<div class="card-body p-4">
						<h3 class="font-bold">switch文</h3>
						<p class="text-sm">
							いろんなパターンがある時に便利です。<code>default</code
							>（どれにも当てはまらない場合）が必須です。
						</p>
						<div class="mockup-code mt-2 text-sm">
							<pre data-prefix="1"><code>let rank = "A"</code></pre>
							<pre data-prefix="2"><code>switch rank &lcub;</code></pre>
							<pre data-prefix="3"><code>case "A":</code></pre>
							<pre data-prefix="4"><code>    print("最高評価") // 今回はここが出力されます</code
								></pre>
							<pre data-prefix="5"><code>case "B":</code></pre>
							<pre data-prefix="6"><code>    print("良い評価")</code></pre>
							<pre data-prefix="7"><code>default:</code></pre>
							<pre data-prefix="8"><code>    print("その他の評価")</code></pre>
							<pre data-prefix="9"><code>&rcub;</code></pre>
						</div>
					</div>
				</div>

				<div class="alert alert-info shadow-lg">
					<div>
						<h3 class="font-bold">Tips: その他の便利な構文</h3>
						<ul class="mt-2 list-inside list-disc text-sm">
							<li>
								<strong>三項演算子:</strong> <code>条件式 ? 真の時の値 : 偽の時の値</code> (if文を1行で書ける)
							</li>
							<li>
								<strong>guard文:</strong> 条件を満たさない時に、早めに処理を終了(return)させるための文。「早期リターン」に大活躍！
							</li>
							<li>
								<strong>if let:</strong> 空（nil）かもしれない安全でないデータを、安全に取り出す魔法の構文（オプショナルバインディング）。
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=let+score+%3D+85%0A%0Aif+score+%3E%3D+90+%7B%0A++++print(%22%E7%B4%A0%E6%99%B4%E3%82%89%E3%81%97%E3%81%84%EF%BC%81%22)%0A%7D+else+if+score+%3E%3D+70+%7B%0A++++print(%22%E5%90%88%E6%A0%BC%E3%81%A7%E3%81%99%22)%0A%7D+else+%7B%0A++++print(%22%E3%81%8C%E3%82%93%E3%81%B0%E3%82%8A%E3%81%BE%E3%81%97%E3%82%87%E3%81%86%22)%0A%7D%0A%0Alet+rank+%3D+%22A%22%0Aswitch+rank+%7B%0Acase+%22A%22%3A%0A++++print(%22%E6%9C%80%E9%AB%98%E8%A9%95%E4%BE%A1%22)%0Acase+%22B%22%3A%0A++++print(%22%E8%89%AF%E3%81%84%E8%A9%95%E4%BE%A1%22)%0Adefault%3A%0A++++print(%22%E3%81%9D%E3%81%AE%E4%BB%96%E3%81%AE%E8%A9%95%E4%BE%A1%22)%0A%7D"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<!-- 配列 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="arrays">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">4</span>
				配列 (Array)
			</h2>
			<p class="mb-4">
				複数のデータ（同じ型）を順番に並べてひとまとめに管理できる箱です。[ ]（角括弧）を使います。
			</p>

			<div class="card bg-base-200">
				<div class="card-body p-4">
					<h3 class="font-bold">配列の使い方</h3>
					<div class="mockup-code mt-2 text-sm">
						<pre data-prefix="1"><code>// 文字列の配列</code></pre>
						<pre data-prefix="2"><code>var fruits = ["りんご", "みかん", "バナナ"]</code></pre>
						<pre data-prefix="3"><code></code></pre>
						<pre data-prefix="4"><code>// データの取り出し（0から数え始めます）</code></pre>
						<pre data-prefix="5"><code>print(fruits[0]) // "りんご"</code></pre>
						<pre data-prefix="6"><code></code></pre>
						<pre data-prefix="7"><code>// データの追加と削除</code></pre>
						<pre data-prefix="8"><code>fruits.append("ぶどう")    // 末尾に追加</code></pre>
						<pre data-prefix="9"><code>fruits.remove(at: 1)     // 1番目(みかん)を削除</code></pre>
						<pre data-prefix="10"><code></code></pre>
						<pre data-prefix="11"><code>// データの個数</code></pre>
						<pre data-prefix="12"><code>print(fruits.count)      // 残りは3個</code></pre>
					</div>
				</div>
			</div>

			<div class="card mt-4 bg-base-200">
				<div class="card-body p-4">
					<h3 class="font-bold">for-in ループ（繰り返し）</h3>
					<p class="text-sm">配列の中身を1つずつ取り出して処理する構文です。</p>
					<div class="mockup-code mt-2 text-sm">
						<pre data-prefix="1"><code>for item in fruits &lcub;</code></pre>
						<pre
							data-prefix="2"><code>    print(item) // りんご、バナナ、ぶどう が順番に表示される</code
							></pre>
						<pre data-prefix="3"><code>&rcub;</code></pre>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=var+fruits+%3D+%5B%22%E3%82%8A%E3%82%93%E3%81%94%22%2C+%22%E3%81%BF%E3%81%8B%E3%82%93%22%2C+%22%E3%83%90%E3%83%8A%E3%83%8A%22%5D%0Aprint(fruits%5B0%5D)%0A%0Afruits.append(%22%E3%81%B6%E3%81%A9%E3%81%86%22)%0Afruits.remove(at%3A+1)%0Aprint(fruits.count)%0A%0Afor+item+in+fruits+%7B%0A++++print(item)%0A%7D"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<!-- 関数 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="functions">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">5</span>
				関数 (func)
			</h2>
			<p class="mb-4">
				よく行う処理をひとまとめにして、名前を付けたものです。<code>func</code
				>キーワードで作ります。
			</p>

			<div class="card bg-base-200">
				<div class="card-body p-4">
					<div class="mockup-code text-sm">
						<pre data-prefix="1"><code>// 1. 関数の定義（作る）</code></pre>
						<pre data-prefix="2"><code
								>// 引数 name(String型) を受け取り、String型を返す(-> String)</code
							></pre>
						<pre data-prefix="3"><code>func greet(name: String) -> String &lcub;</code></pre>
						<pre data-prefix="4"><code>    return name + "さん、こんにちは！"</code></pre>
						<pre data-prefix="5"><code>&rcub;</code></pre>
						<pre data-prefix="6"><code></code></pre>
						<pre data-prefix="7"><code>// 2. 関数の呼び出し（使う）</code></pre>
						<pre data-prefix="8"><code>let message = greet(name: "太郎")</code></pre>
						<pre data-prefix="9"><code>print(message) // "太郎さん、こんにちは！"</code></pre>
					</div>
				</div>
			</div>
			<div class="mt-4 text-sm">
				<p>
					<strong>クロージャ:</strong> 名前を持たない関数のことです。変数に代入したり、他の関数に渡したりすることができます。
				</p>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=func+greet(name%3A+String)+-%3E+String+%7B%0A++++return+name+%2B+%22%E3%81%95%E3%82%93%E3%80%81%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%EF%BC%81%22%0A%7D%0A%0Alet+message+%3D+greet(name%3A+%22%E5%A4%AA%E9%83%8E%22)%0Aprint(message)"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<!-- 列挙型 -->
	<div class="card mb-8 bg-base-100 shadow-xl" id="enums">
		<div class="card-body">
			<h2 class="card-title text-2xl">
				<span class="mr-2 badge badge-lg badge-primary">6</span>
				列挙型 (Enum)
			</h2>
			<p class="mb-4">
				関連する選択肢などを自分で定義できる型です。タイポ（打ち間違い）を防ぐのに役立ちます。
			</p>

			<div class="card bg-base-200">
				<div class="card-body p-4">
					<div class="mockup-code text-sm">
						<pre data-prefix="1"><code>// 定義 (caseでケースを作る)</code></pre>
						<pre data-prefix="2"><code>enum Direction &lcub;</code></pre>
						<pre data-prefix="3"><code>    case north, south, east, west</code></pre>
						<pre data-prefix="4"><code>&rcub;</code></pre>
						<pre data-prefix="5"><code></code></pre>
						<pre data-prefix="6"><code>// 使うとき</code></pre>
						<pre data-prefix="7"><code>let myDirection = Direction.north</code></pre>
						<pre data-prefix="8"><code></code></pre>
						<pre data-prefix="9"><code>// switch文との相性がバツグン！</code></pre>
						<pre data-prefix="10"><code>switch myDirection &lcub;</code></pre>
						<pre data-prefix="11"><code>case .north:</code></pre>
						<pre data-prefix="12"><code>    print("北へ向かいます")</code></pre>
						<pre data-prefix="13"><code>case .south, .east, .west:</code></pre>
						<pre data-prefix="14"><code>    print("北以外へ向かいます")</code></pre>
						<pre data-prefix="15"><code>&rcub;</code></pre>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-end">
				<a
					href="https://swiftfiddle.com/?code=enum+Direction+%7B%0A++++case+north%2C+south%2C+east%2C+west%0A%7D%0A%0Alet+myDirection+%3D+Direction.north%0A%0Aswitch+myDirection+%7B%0Acase+.north%3A%0A++++print(%22%E5%8C%97%E3%81%B8%E5%90%91%E3%81%8B%E3%81%84%E3%81%BE%E3%81%99%22)%0Acase+.south%2C+.east%2C+.west%3A%0A++++print(%22%E5%8C%97%E4%BB%A5%E5%A4%96%E3%81%B8%E5%90%91%E3%81%8B%E3%81%84%E3%81%BE%E3%81%99%22)%0A%7D"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-sm btn-secondary"
				>
					<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>
					SwiftFiddleで試す
				</a>
			</div>
		</div>
	</div>

	<div class="mt-8 flex justify-center">
		<a href={resolve('/')} class="btn mr-4 btn-outline">トップに戻る</a>
		<a href={resolve('/quiz')} class="btn btn-primary">練習問題に挑戦する！</a>
	</div>
</div>
