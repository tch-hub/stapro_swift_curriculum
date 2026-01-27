<script>
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ToDoListDemo from '$lib/components/ToDoListDemo.svelte';
	import { todolistSteps } from '$lib/data/projects/todolist-steps';
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">ToDoリストアプリプロジェクト</h1>
	<p class="mb-12 text-center text-lg">
		複数タブ対応のToDoリストアプリを作成します。タスク管理、カテゴリ分類、データ永続化機能を実装します。
	</p>

	<!-- プロジェクト概要 -->
	<div class="card mb-8 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">プロジェクト概要</h2>
			<p class="mb-4">
				このプロジェクトでは、SwiftUIを使ってToDoリストアプリを作成します。以下の機能を学習できます：
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li>SwiftUIでのUI構築</li>
				<li>SwiftDataを使ったデータ管理</li>
				<li>複数タブの管理</li>
				<li>CRUD操作の実装</li>
				<li>カスタムUIコンポーネント</li>
				<li>ナビゲーション管理</li>
			</ul>
			<div class="card-actions justify-end">
				<a href="{base}/source/ToDoList.zip" download class="btn btn-primary"
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
					>UIToDoList/
├── SwiftUIToDoListApp.swift     # アプリのエントリーポイント
├── Screens/
│   ├── Views/
│   │   ├── InitialView.swift    # スプラッシュスクリーン
│   │   └── Main/
│   │       ├── HomeView.swift   # メイン画面
│   │       ├── MainStack.swift  # ナビゲーション
│   │       └── TabManageView.swift  # タブ管理画面
│   ├── Layouts/
│   │   └── NavigationBarModifier.swift
│   └── Navigation/
│       ├── ScreenID.swift
│       └── NavigationItem.swift
├── Components/
│   ├── CustomAlert.swift
│   ├── FloatingButton.swift
│   ├── ToDoListItem.swift
│   ├── CustomList.swift
│   └── TextFieldAlertModifier.swift
├── Services/
│   ├── ToDoTaskService.swift
│   └── ToDoTabService.swift
└── SwiftData/
    ├── Models/
    │   ├── ToDoTask.swift
    │   └── ToDoTab.swift
    ├── Services/
    └── Data/</code
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
			{#each todolistSteps as step}
				<div class="card bg-base-100 shadow-lg">
					<div class="card-body">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="card-title text-xl">{step.title}</h3>
								<p class="text-sm opacity-70">{step.summary}</p>
							</div>
							<a href="{base}/project/todolist/{step.id}" class="btn btn-primary">開始</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- コードサンプル -->
	<div class="space-y-8">
		<!-- SwiftUIToDoListApp.swift -->
		<CodeBlock
			title="SwiftUIToDoListApp.swift - アプリのエントリーポイント"
			code={`//
//  SwiftUIToDoListApp.swift
//  SwiftUIToDoList
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI
import SwiftData

@main
struct SwiftUIToDoListApp: App {
    var container: ModelContainer
    
    init() {
        let schema = Schema([
            ToDoTask.self,
            ToDoTab.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        
        do {
            container = try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not initialize ModelContainer: \\(error)")
        }
    }
    
    var body: some Scene {
        WindowGroup {
            InitialView()
        }
        .modelContainer(container)
    }
}`}
		/>

		<!-- ToDoTask.swift -->
		<CodeBlock
			title="ToDoTask.swift - タスクモデル"
			code={`//
//  ToDoTask.swift
//  SwiftUIToDoList
//
//  Created by mogi yoshiki on 2024/04/14.
//

import Foundation
import SwiftData

@Model
final class ToDoTask {
    var title: String
    var description: String
    var isCompleted: Bool
    var tabId: UUID
    var createdAt: Date
    
    init(title: String, description: String, tabId: UUID) {
        self.title = title
        self.description = description
        self.isCompleted = false
        self.tabId = tabId
        self.createdAt = Date()
    }
}`}
		/>

		<!-- ToDoTab.swift -->
		<CodeBlock
			title="ToDoTab.swift - タブモデル"
			code={`//
//  ToDoTab.swift
//  SwiftUIToDoList
//
//  Created by mogi yoshiki on 2024/04/14.
//

import Foundation
import SwiftData

@Model
final class ToDoTab {
    var name: String
    var createdAt: Date
    
    init(name: String) {
        self.name = name
        self.createdAt = Date()
    }
}`}
		/>

		<!-- ToDoTaskService.swift -->
		<CodeBlock
			title="ToDoTaskService.swift - タスク管理サービス"
			code={`//
//  ToDoTaskService.swift
//  SwiftUIToDoList
//
//  Created by mogi yoshiki on 2024/04/15.
//

import Foundation
import SwiftData

class ToDoTaskService {
    @MainActor
    static func addTask(_ task: ToDoTask, to modelContext: ModelContext) {
        modelContext.insert(task)
        try? modelContext.save()
    }
    
    @MainActor
    static func updateTask(_ task: ToDoTask, modelContext: ModelContext) {
        try? modelContext.save()
    }
    
    @MainActor
    static func deleteTask(_ task: ToDoTask, from modelContext: ModelContext) {
        modelContext.delete(task)
        try? modelContext.save()
    }
    
    @MainActor
    static func deleteAllTasks(for tabId: UUID, from modelContext: ModelContext) {
        let descriptor = FetchDescriptor<ToDoTask>(predicate: #Predicate { $0.tabId == tabId })
        let tasks = try? modelContext.fetch(descriptor)
        tasks?.forEach { modelContext.delete($0) }
        try? modelContext.save()
    }
}`}
		/>

		<!-- ToDoTabService.swift -->
		<CodeBlock
			title="ToDoTabService.swift - タブ管理サービス"
			code={`//
//  ToDoTabService.swift
//  SwiftUIToDoList
//
//  Created by mogi yoshiki on 2024/04/15.
//

import Foundation
import SwiftData

class ToDoTabService {
    @MainActor
    static func addTab(_ tab: ToDoTab, to modelContext: ModelContext) {
        modelContext.insert(tab)
        try? modelContext.save()
    }
    
    @MainActor
    static func deleteTab(_ tab: ToDoTab, from modelContext: ModelContext) {
        modelContext.delete(tab)
        try? modelContext.save()
    }
    
    @MainActor
    static func updateTab(_ tab: ToDoTab, modelContext: ModelContext) {
        try? modelContext.save()
    }
}`}
		/>
	</div>
</div>
