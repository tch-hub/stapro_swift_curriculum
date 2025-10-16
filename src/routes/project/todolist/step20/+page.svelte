<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-4 text-3xl font-bold">
		ステップ20: おもてなし機能：アプリ初回起動時にサンプルデータを登録する
	</h1>

	<!-- ナビゲーション -->
	<div class="mb-8 flex justify-between">
		<a href="{base}/project/todolist/step19" class="btn btn-outline">← 前のステップ</a>
		<a href="{base}/project/todolist/step21" class="btn btn-primary">次のステップ →</a>
	</div>

	<p class="mb-8 text-lg">
		ユーザーがアプリをダウンロードして初めて開いた時、中身が空っぽだと何をしていいか分かりません。そこで、初回起動時だけサンプルのデータを自動で登録する処理を追加します。
	</p>

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 text-2xl font-semibold">1. InitialViewを実装する</h2>
			<p class="mb-4">
				ステップ7でファイルだけ作成しておいた`Screens/Views/InitialView.swift`に、本格的なコードを記述します。このビューは、データが空かどうかをチェックし、空の場合のみ初期データを投入する役割を担います。
			</p>
			<CodeBlock
				title="InitialView.swift"
				code={`
import SwiftUI

struct InitialView: View {
    @State private var showMainStack = false
    private let todoTabService = ToDoTabService()
    private let todoTaskService = ToDoTaskService()

    var body: some View {
        // showMainStackがtrueになったらMainStackへ画面遷移
        if showMainStack {
            MainStack()
        } else {
            // データ準備中はローディング表示
            Text("データを準備しています...")
                .onAppear(perform: setupInitialData)
        }
    }

    /// 初期データをセットアップする
    private func setupInitialData() {
        // 1秒後に処理を開始（起動画面を少し見せるため）
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            do {
                // 既存のタブとタスクを取得
                let existingTabs = try todoTabService.getAll()

                // データが空の場合のみ初期データを投入
                if existingTabs.isEmpty {
                    // サンプルタブを追加
                    let tabId = try todoTabService.add(name: "今日のやること")

                    // サンプルタスクを追加
                    try todoTaskService.add(name: "SwiftUIの勉強", tabId: tabId)
                    try todoTaskService.add(name: "部屋の掃除", tabId: tabId)
                }

                // データ準備完了、メイン画面へ
                showMainStack = true

            } catch {
                print("初期データのセットアップに失敗しました: \\(error)")
                // エラーが発生しても、とりあえずメイン画面へ
                showMainStack = true
            }
        }
    }
}
`}
			/>
		</div>

		<div>
			<h2 class="mb-4 text-2xl font-semibold">コードの解説</h2>
			<ul class="mb-4 list-inside list-disc space-y-2 rounded-md bg-base-200 p-4">
				<li>
					<strong>`onAppear(perform: setupInitialData)`:</strong> `InitialView`が画面に表示された瞬間に`setupInitialData`メソッドを一度だけ呼び出します。
				</li>
				<li>
					<strong>`DispatchQueue.main.asyncAfter(...)`:</strong> 指定した時間（ここでは1秒後）に処理を遅らせて実行します。これにより、ユーザーは「データを準備しています...」のメッセージを視認できます。
				</li>
				<li>
					<strong>`todoTabService.getAll()`:</strong> まずデータベースにデータが既にあるかを確認します。
				</li>
				<li>
					<strong>`if existingTabs.isEmpty &#123; ... &#125;`:</strong> データが空（初回起動）の場合のみ、`if`文の中のサンプルデータ登録処理が実行されます。
				</li>
				<li>
					<strong>`showMainStack = true`:</strong> この変数を`true`にすることで、`body`の`if`文が再評価され、画面が`MainStack()`に切り替わります。
				</li>
			</ul>
		</div>
	</div>

	<div class="mt-12 flex justify-between">
		<a href="../step19" class="btn">前へ</a>
		<a href="../step21" class-="btn btn-primary">次へ: 仕上げ</a>
	</div>
</div>
