<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ToDoListDemo from '$lib/components/ToDoListDemo.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ToDoリストアプリプロジェクト</h1>
	<p class="mb-12 text-center text-lg">
		SwiftDataとMVVMアーキテクチャを採用した本格的なToDoリストアプリを作成します。
	</p>

	<!-- プロジェクト概要 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">プロジェクト概要</h2>
			<p class="mb-4">
				このプロジェクトでは、SwiftUIとSwiftDataを使って、モダンなToDoリストアプリを作成します。以下の機能を学習できます：
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li>SwiftUIでのUI構築（List, Picker, NavigationStack）</li>
				<li>SwiftDataによるデータの永続化</li>
				<li>MVVMアーキテクチャに基づいた設計</li>
				<li>データの追加、更新、削除（CRUD）</li>
				<li>画面遷移と状態管理</li>
				<li>UIコンポーネントの再利用</li>
			</ul>
			<div class="card-actions justify-end">
				<a href="{base}/source/ToDoLitst.zip" download class="btn btn-primary"
					>プロジェクトをダウンロード</a
				>
			</div>
		</div>
	</div>

	<!-- プロジェクト構造 -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">プロジェクト構造</h2>
		<div class="mockup-code">
			<pre><code
					>SwiftUIToDoList/
├── SwiftUIToDoListApp.swift  # アプリのエントリーポイント
├── Screens/                  # 画面関連
│   ├── Views/
│   │   ├── InitialView.swift # 初期表示ビュー
│   │   └── Main/
│   │       ├── HomeView.swift      # ホーム画面
│   │       └── TabManageView.swift # タブ管理画面
│   └── Navigation/
│       └── MainStack.swift     # ナビゲーション管理
├── SwiftData/                # データモデル
│   ├── ToDoTab.swift
│   └── ToDoTask.swift
├── Services/                 # データ操作ロジック
│   ├── ToDoTabService.swift
│   └── ToDoTaskService.swift
└── Components/               # 再利用可能なUI部品</code
				></pre>
		</div>
	</div>

	<!-- ライブデモ -->
	<ToDoListDemo />

	<!-- 制作ステップ -->
	<div class="mb-8">
		<h2 class="mb-6 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-6">
			ToDoリストアプリを21のステップで段階的に作成しましょう。各ステップで必要な知識と実装方法を詳しく説明します。
		</p>

		<div class="space-y-4">
			<!-- ステップ1 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ1: Xcodeでプロジェクトを新規作成する</h3>
							<p class="text-sm opacity-70">Xcodeでの新規プロジェクト作成と基本設定</p>
						</div>
						<a href="{base}/project/todolist/step1" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ2 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ2: 役割ごとにフォルダを整理する</h3>
							<p class="text-sm opacity-70">ソースコードを整理するためのフォルダ構成</p>
						</div>
						<a href="{base}/project/todolist/step2" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ3 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">ステップ3: データ設計：ToDoタスクの情報を決める</h3>
							<p class="text-sm opacity-70">SwiftDataを使ったタスクモデルの作成</p>
						</div>
						<a href="{base}/project/todolist/step3" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ4 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ4: データ設計：タスクを分類する「タブ」を決める
							</h3>
							<p class="text-sm opacity-70">SwiftDataを使ったタブモデルの作成</p>
						</div>
						<a href="{base}/project/todolist/step4" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ5 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ5: データ操作の準備：ToDoTaskServiceクラスを作る
							</h3>
							<p class="text-sm opacity-70">タスクデータを操作するサービスクラス</p>
						</div>
						<a href="{base}/project/todolist/step5" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ6 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ6: データ操作の準備：ToDoTabServiceクラスを作る
							</h3>
							<p class="text-sm opacity-70">タブデータを操作するサービスクラス</p>
						</div>
						<a href="{base}/project/todolist/step6" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ7 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ7: アプリの骨組み：ナビゲーションとHomeViewを用意する
							</h3>
							<p class="text-sm opacity-70">NavigationStackを使った画面の基本構造</p>
						</div>
						<a href="{base}/project/todolist/step7" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ8 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ8: UI作成：タブを切り替えるためのピッカーを配置する
							</h3>
							<p class="text-sm opacity-70">Pickerを使ったタブ選択UIの実装</p>
						</div>
						<a href="{base}/project/todolist/step8" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ9 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ9: データ連携：作ったタブをピッカーに表示させる
							</h3>
							<p class="text-sm opacity-70">Serviceからタブデータを取得して表示</p>
						</div>
						<a href="{base}/project/todolist/step9" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ10 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ10: UI作成：タスク一覧の見た目を仮データで作る
							</h3>
							<p class="text-sm opacity-70">繰り返し表示するタスク行のUI作成</p>
						</div>
						<a href="{base}/project/todolist/step10" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ11 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ11: データ連携：選択したタブに対応するタスクを一覧表示する
							</h3>
							<p class="text-sm opacity-70">選択中のタブに応じてタスクを動的に表示</p>
						</div>
						<a href="{base}/project/todolist/step11" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ12 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ12: 機能追加：タスクを追加するための「＋」ボタンと入力画面を作る
							</h3>
							<p class="text-sm opacity-70">モーダル表示とUIの実装</p>
						</div>
						<a href="{base}/project/todolist/step12" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ13 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ13: 機能追加：入力した新しいタスクを保存する
							</h3>
							<p class="text-sm opacity-70">Service経由で新規タスクをデータ保存</p>
						</div>
						<a href="{base}/project/todolist/step13" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ14 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ14: 機能追加：タスクの完了状態を切り替えるチェックボックスを作る
							</h3>
							<p class="text-sm opacity-70">タスクの完了・未完了を切り替えるUI</p>
						</div>
						<a href="{base}/project/todolist/step14" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ15 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ15: 機能追加：チェックボックスの状態をデータに保存する
							</h3>
							<p class="text-sm opacity-70">タスクの完了状態をデータに反映</p>
						</div>
						<a href="{base}/project/todolist/step15" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ16 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ16: 機能追加：タスクをスワイプして「削除」ボタンを表示する
							</h3>
							<p class="text-sm opacity-70">ListのonDelete機能を使ったUI実装</p>
						</div>
						<a href="{base}/project/todolist/step16" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ17 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ17: 機能追加：「削除」ボタンでタスクをデータから消す
							</h3>
							<p class="text-sm opacity-70">Service経由でタスクをデータ削除</p>
						</div>
						<a href="{base}/project/todolist/step17" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ18 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ18: 新画面作成：タブを管理するための画面を作る
							</h3>
							<p class="text-sm opacity-70">タブの追加・編集・削除を行うUI</p>
						</div>
						<a href="{base}/project/todolist/step18" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ19 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ19: 画面遷移：ホーム画面からタブ管理画面へ移動できるようにする
							</h3>
							<p class="text-sm opacity-70">NavigationLinkを使った画面遷移</p>
						</div>
						<a href="{base}/project/todolist/step19" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ20 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ20: おもてなし機能：アプリ初回起動時にサンプルデータを登録する
							</h3>
							<p class="text-sm opacity-70">InitialViewでの初回データ投入処理</p>
						</div>
						<a href="{base}/project/todolist/step20" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
			<!-- ステップ21 -->
			<div class="card bg-base-100 shadow-lg">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="card-title text-xl">
								ステップ21: 仕上げ：コードを部品化してプロジェクトを綺麗にする
							</h3>
							<p class="text-sm opacity-70">Componentsフォルダを活用したリファクタリング</p>
						</div>
						<a href="{base}/project/todolist/step21" class="btn btn-primary">開始</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- コードサンプル -->
	<div class="space-y-8">
		<CodeBlock
			title="SwiftUIToDoListApp.swift - アプリのエントリーポイント"
			code={`import SwiftUI

@main
struct SwiftUIToDoListApp: App {
    let modelContainer = SwiftDataService.shared.getModelContainer() // モデルコンテナ

    var body: some Scene {
        WindowGroup {
            InitialView()
        }
        .modelContainer(modelContainer)
    }
}
`}
		/>
		<CodeBlock
			title="InitialView.swift - 初期表示ビュー"
			code={`import SwiftUI

/// 起動画面
struct InitialView: View {
    @State private var screenMessage: String = "アプリ起動中..." // 画面メッセージ
    @State private var isInitialized = false // 初期化フラグ

    private let todoTabService = ToDoTabService() // ToDoタブサービス
    private let todoTaskService = ToDoTaskService() // ToDoタスクサービス

    var body: some View {
        ZStack {
            if isInitialized {
                MainStack()
            } else {
                Text(screenMessage)
                    .padding()
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                do {
                    // タブとタスクのデータを取得
                    let toDoTabs = try todoTabService.getAll()
                    let toDoTasks = try todoTaskService.getAll()

                    // データが存在しない場合のみ初期化処理を実行
                    if toDoTabs.isEmpty && toDoTasks.isEmpty {
                        try initializeData()
                    }

                    // 初期化フラグを立てる
                    isInitialized = true

                } catch {
                    screenMessage = "アプリの起動に失敗しました。\\nアプリを再起動してください。"
                }
            }
        }
    }

    /// 初期データの登録
    private func initializeData() throws {
        for (index, tab) in INITIAL_TODO_TAB_DATA.enumerated() {
            let addedTabId = try todoTabService.add(name: tab.name)

            for task in INITIAL_TODO_TASK_DATA[index] {
                try todoTaskService.add(name: task.name, tabId: addedTabId)
            }
        }
    }
}

#Preview {
    InitialView()
}
`}
		/>
		<CodeBlock
			title="MainStack.swift - ナビゲーション管理"
			code={`import SwiftUI

/// メインスタック
struct MainStack: View {
    @State private var navigationPath: [NavigationItem] = []

    var body: some View {
        NavigationStack(path: $navigationPath) {
            // ホーム画面
            HomeView(navigationPath: $navigationPath)

                // 画面遷移定義
                .navigationDestination(for: NavigationItem.self) { item in
                    switch item.id {
                    // タブ管理画面
                    case .tabManage:
                        TabManageView()

                    default:
                        EmptyView()
                    }
                }
        }
    }
}

#Preview {
    MainStack()
}
`}
		/>
		<CodeBlock
			title="ToDoTab.swift - ToDoタブモデル"
			code={`import Foundation
import SwiftData

/// ToDoタブモデル
@Model
class ToDoTab {
    var id: UUID = UUID() // タブID
    var name: String = "" // タブ名
    var todoTasks: [ToDoTask]? // タスクのリレーション
    var createdAt: Date = Date() // 作成日時
    var updatedAt: Date? // 更新日時

    /// イニシャライザ
    init(id: UUID,
         name: String,
         createdAt: Date,
         updatedAt: Date?) {
        self.id = id
        self.name = name
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
`}
		/>
		<CodeBlock
			title="ToDoTask.swift - ToDoタスクモデル"
			code={`import Foundation
import SwiftData

/// ToDoタスクモデル
@Model
class ToDoTask {
    var id: UUID = UUID() // タスクID

    // タブが削除された際に、タブに紐づくタスクのタブ情報には null が設定される
    @Relationship(deleteRule: .nullify, inverse: \\ToDoTab.todoTasks) var todoTab: ToDoTab? // タブのリレーション

    var name: String = "" // タスク名
    var isCompleted: Bool = false // 完了フラグ
    var createdAt: Date = Date() // 作成日時
    var updatedAt: Date? // 更新日時

    /// イニシャライザ
    init(id: UUID,
         todoTab: ToDoTab?,
         name: String,
         isCompleted: Bool,
         createdAt: Date,
         updatedAt: Date?) {
        self.id = id
        self.todoTab = todoTab
        self.name = name
        self.isCompleted = isCompleted
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}
`}
		/>
		<CodeBlock
			title="ToDoTabService.swift - ToDoタブサービス"
			code={`import Foundation
import SwiftData

/// ToDoタブサービス
@MainActor
class ToDoTabService {
    private let modelContext: ModelContext? // モデルコンテキスト

    /// イニシャライザ
    init() {
        let modelContainer = SwiftDataService.shared.getModelContainer()
        self.modelContext = modelContainer.mainContext
    }
}

/// 外部公開メソッド
extension ToDoTabService {
    /// 全てのタブを取得する
    /// - Returns: 全てのタブ
    func getAll() throws -> [ToDoTab] {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        let fetchDescriptor = FetchDescriptor<ToDoTab>()
        let toDoTabs = try modelContext.fetch(fetchDescriptor)

        return toDoTabs
    }

    /// タブを追加する
    /// - Parameter name: タブ名
    /// - Returns: 追加したタブのID
    func add(name: String) throws -> UUID {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        let toDoTab = ToDoTab(id: UUID(),
                              name: name,
                              createdAt: Date(),
                              updatedAt: nil)

        modelContext.insert(toDoTab)
        try modelContext.save() // 変更を即時に書き込む

        return toDoTab.id
    }

    /// タブを修正する
    /// - Parameters:
    ///   - tabId: 修正対象のタブのID
    ///   - name: タブ名
    func edit(tabId: UUID, name: String) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 修正対象のタブを取得する
        let fetchDescriptor = FetchDescriptor<ToDoTab>(predicate: #Predicate { $0.id == tabId })
        guard let fetchedToDoTab = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タブの取得に失敗しました"])
        }

        // タブ情報を修正する
        fetchedToDoTab.name = name
        fetchedToDoTab.updatedAt = Date()

        try modelContext.save() // 変更を即時に書き込む
    }

    /// タブを削除する
    /// - Parameters tabId: 削除対象のタブのID
    func delete(tabId: UUID) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 削除対象のタブを取得する
        let fetchDescriptor = FetchDescriptor<ToDoTab>(predicate: #Predicate { $0.id == tabId })
        guard let fetchedToDoTab = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タブの取得に失敗しました"])
        }

        // タブに紐づくタスクも削除する
        if let tasks = fetchedToDoTab.todoTasks {
            for task in tasks {
                modelContext.delete(task)
            }
        }

        // タブを削除する
        modelContext.delete(fetchedToDoTab)
        try modelContext.save() // 変更を即時に書き込む
    }
}
`}
		/>
		<CodeBlock
			title="ToDoTaskService.swift - ToDoタスクサービス"
			code={`import Foundation
import SwiftData

/// ToDoタスクサービス
@MainActor
class ToDoTaskService {
    private let modelContext: ModelContext? // モデルコンテキスト

    /// イニシャライザ
    init() {
        let modelContainer = SwiftDataService.shared.getModelContainer()
        self.modelContext = modelContainer.mainContext
    }
}

/// 外部公開メソッド
extension ToDoTaskService {
    /// 全てのタスクを取得する
    /// - Returns: 全てのタスク
    func getAll() throws -> [ToDoTask] {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        let fetchDescriptor = FetchDescriptor<ToDoTask>()
        let toDoTasks = try modelContext.fetch(fetchDescriptor)

        return toDoTasks
    }

    /// タスクを追加する
    /// - Parameters:
    ///   - name: タスク名
    ///   - tabId: 関連づけるタブのID
    func add(name: String, tabId: UUID) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 関連づけるタブを取得
        let fetchDescriptor = FetchDescriptor<ToDoTab>(predicate: #Predicate { $0.id == tabId })
        guard let toDoTab = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タブの取得に失敗しました"])
        }

        // タスクを追加
        let toDoTask = ToDoTask(id: UUID(),
                                todoTab: toDoTab,
                                name: name,
                                isCompleted: false,
                                createdAt: Date(),
                                updatedAt: nil)
        modelContext.insert(toDoTask)
        try modelContext.save() // 変更を即時に書き込む
    }

    /// タスクを修正する
    /// - Parameters:
    ///   - taskId: 修正対象のタスクのID
    ///   - name: タスク名
    func edit(taskId: UUID, name: String) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 修正対象のタスクを取得する
        let fetchDescriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.id == taskId })
        guard let toDoTask = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タスクの取得に失敗しました"])
        }

        // タスク情報を修正する
        toDoTask.name = name
        toDoTask.updatedAt = Date()

        try modelContext.save() // 変更を即時に書き込む
    }

    /// タスクを削除する
    /// - Parameter taskId: 削除対象のタスクのID
    func delete(taskId: UUID) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 削除対象のタスクを取得する
        let fetchDescriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.id == taskId })
        guard let toDoTask = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タスクの取得に失敗しました"])
        }

        // タスクを削除
        modelContext.delete(toDoTask)
        try modelContext.save() // 変更を即時に書き込む
    }

    /// タスクの完了フラグを反転させる
    /// - Parameter taskId: 完了フラグを反転させるタスクのID
    func toggleCompletion(taskId: UUID) throws {
        guard let modelContext else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "ModelContextの初期化に失敗しました"])
        }

        // 更新対象のタスクを取得する
        let fetchDescriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.id == taskId })
        guard let toDoTask = try modelContext.fetch(fetchDescriptor).first else {
            throw NSError(domain: "SwiftDataError", code: 0, userInfo: [NSLocalizedDescriptionKey: "タスクの取得に失敗しました"])
        }

        // タスクの完了フラグを反転させる
        toDoTask.isCompleted.toggle()
        toDoTask.updatedAt = Date()

        try modelContext.save() // 変更を即時に書き込む
    }
}
`}
		/>
	</div>
</div>
