<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ14: 機能追加：タスクの完了状態を切り替えるチェックボックスを作る
	</h1>
	<p class="mb-8 text-lg">
		ToDoリストの核となる機能、タスクの完了チェックを実装します。まず、ユーザーがタップできるチェックボックスの「見た目」と「操作」を`TaskRow`ビューに追加します。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. TaskRowビューを更新</h2>
			<p class="mb-4">
				`Components/TaskRow.swift`を開き、`HStack`の先頭にチェックマーク用の`Image`を配置します。この画像を`Button`で囲むことで、タップ操作を受け付けるようにします。
			</p>
			<CodeBlock
				title="TaskRow.swift (更新)"
				code={`
import SwiftUI

struct TaskRow: View {
    var task: ToDoTask
    var onToggleCompletion: () -> Void // タップされた時に呼び出す処理

    var body: some View {
        HStack {
            // チェックボックスとして機能するボタン
            Button(action: onToggleCompletion) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(task.isCompleted ? .green : .gray)
            }
            .buttonStyle(PlainButtonStyle()) // 余計なスタイルを消す

            Text(task.name)
                // 完了状態に応じて取り消し線と文字色を切り替え
                .strikethrough(task.isCompleted, color: .primary)
                .foregroundColor(task.isCompleted ? .gray : .primary)

            Spacer()
        }
        .padding()
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. HomeViewでアクションを接続</h2>
			<p class="mb-4">
				`HomeView.swift`の`List`の中で`TaskRow`を呼び出している部分を更新し、`onToggleCompletion`に具体的な処理（現時点では空）を渡します。
			</p>
			<CodeBlock
				title="HomeView.swift (List内を更新)"
				code={`
            List {
                ForEach(filteredTasks) { task in
                    TaskRow(task: task, onToggleCompletion: {
                        // 次のステップで、この中にデータ更新処理を書く
                        print("\\(task.name)がタップされました")
                    })
                }
            }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>`Button(action: onToggleCompletion)`:</strong> `Image`を`Button`で囲み、タップされたら`onToggleCompletion`という処理を呼び出すようにしています。
				</li>
				<li>
					<strong>`Image(systemName: ...)`:</strong> `task.isCompleted`が`true`か`false`かに応じて、表示するSF
					Symbolsのアイコンを切り替えています。（`checkmark.circle.fill`と`circle`）
				</li>
				<li>
					<strong>`.strikethrough(task.isCompleted)`:</strong> こちらも`isCompleted`の状態によって、テキストに取り消し線を引くかどうかを切り替えています。
				</li>
				<li>
					<strong>`onToggleCompletion: () -> Void`</strong>:
					`TaskRow`の外（この場合は`HomeView`）から、タップされた時の処理を渡してもらうための「窓口」です。これにより、`TaskRow`は見た目に集中でき、データ操作の責任を`HomeView`に任せることができます。
				</li>
			</ul>
			<p>
				これでUIの準備は完了です。プレビューやシミュレータでチェックボックスをタップすると、Xcodeのコンソールにデバッグメッセージが出力されるはずです。
			</p>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step13" class="btn">前へ</a>
		<a href="../step15" class="btn btn-primary">次へ: 完了状態の保存</a>
	</div>
</div>
