<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ12: 機能追加：タスクを追加するための「＋」ボタンと入力画面を作る
	</h1>
	<p class="mb-8 text-lg">
		ユーザーが新しいタスクを追加できるように、操作の起点となる「＋」ボタンと、タスク名を入力するための専用画面を作ります。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. フローティングアクションボタンを追加</h2>
			<p class="mb-4">
				画面の右下に常に表示される「＋」ボタンを配置します。`HomeView.swift`に`ZStack`を追加して、リストの手前にボタンが来るようにします。
			</p>
			<CodeBlock
				title="HomeView.swift (bodyを更新)"
				code={`
    var body: some View {
        ZStack(alignment: .bottomTrailing) { // ZStackで要素を重ねる
            VStack {
                // ... PickerとListの部分は変更なし ...
            }

            // フローティングアクションボタン
            Button(action: {
                // ボタンが押された時の処理（後述）
            }) {
                Image(systemName: "plus")
                    .font(.title.weight(.semibold))
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .clipShape(Circle())
                    .shadow(radius: 4, x: 0, y: 4)
            }
            .padding()
        }
        .navigationTitle("ホーム")
    }
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">2. タスク追加用のビューを作成</h2>
			<p class="mb-4">
				`Components`フォルダの中に、`AddTaskView.swift`という名前で新しいSwiftUI
				Viewファイルを作成します。この画面は、タスク名を入力する`TextField`と、「追加」「キャンセル」ボタンで構成されます。
			</p>
			<CodeBlock
				title="AddTaskView.swift"
				code={`
import SwiftUI

struct AddTaskView: View {
    @State private var taskName: String = ""
    var onAdd: (String) -> Void
    var onCancel: () -> Void

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("タスク情報")) {
                    TextField("タスク名を入力", text: $taskName)
                }
            }
            .navigationTitle("新規タスク追加")
            .navigationBarItems(
                leading: Button("キャンセル", action: onCancel),
                trailing: Button("追加", action: {
                    onAdd(taskName)
                }).disabled(taskName.isEmpty)
            )
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">3. ボタンをタップしたらモーダル表示</h2>
			<p class="mb-4">
				`HomeView`に戻り、「＋」ボタンがタップされたら`AddTaskView`が下からスライドして表示される（モーダル表示）ようにします。
			</p>
			<CodeBlock
				title="HomeView.swift (更新)"
				code={`
struct HomeView: View {
    // ... @Queryなどのプロパティ ...
    @State private var isAddTaskPresented = false // モーダル表示状態を管理

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            // ... VStackとList ...

            Button(action: {
                isAddTaskPresented = true // ボタンが押されたらtrueに
            }) {
                // ... Buttonの見た目 ...
            }
            .padding()
        }
        .navigationTitle("ホーム")
        .sheet(isPresented: $isAddTaskPresented) { // isAddTaskPresentedがtrueになったら表示
            AddTaskView(
                onAdd: { name in
                    // 追加処理（次のステップ）
                    isAddTaskPresented = false // 画面を閉じる
                },
                onCancel: {
                    isAddTaskPresented = false // 画面を閉じる
                }
            )
        }
    }
}
`}
			/>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step11" class="btn">前へ</a>
		<a href="../step13" class="btn btn-primary">次へ: タスク保存</a>
	</div>
</div>
