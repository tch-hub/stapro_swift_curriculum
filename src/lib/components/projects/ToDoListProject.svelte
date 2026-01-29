<script>
	import { base } from '$app/paths';
	import ToDoListDemo from '$lib/components/ToDoListDemo.svelte';
	import { todolistSteps } from '$lib/data/projects/todolist-steps';
	import ProjectSteps from './ProjectSteps.svelte';
	import ProjectCodeSamples from './ProjectCodeSamples.svelte';

	const codeSamples = [
		{
			title: 'ToDoListApp.swift - アプリのエントリーポイント',
			fileName: 'ToDoListApp.swift',
			code: `//
//  ToDoListApp.swift
//  ToDoList
//
//  Created by mogi yoshiki on 2024/04/09.
//

import SwiftUI
import SwiftData

@main
struct ToDoListApp: App {
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
            ContentView()
        }
        .modelContainer(container)
    }
}`
		},
		{
			title: 'ToDoTask.swift - タスクモデル',
			fileName: 'ToDoTask.swift',
			code: `//
//  ToDoTask.swift
//  ToDoList
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
}`
		},
		{
			title: 'ToDoTab.swift - タブモデル',
			fileName: 'ToDoTab.swift',
			code: `//
//  ToDoTab.swift
//  ToDoList
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
}`
		},
		{
			title: 'ToDoTaskService.swift - タスク管理サービス',
			fileName: 'ToDoTaskService.swift',
			code: `//
//  ToDoTaskService.swift
//  ToDoList
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
}`
		},
		{
			title: 'ToDoTabService.swift - タブ管理サービス',
			fileName: 'ToDoTabService.swift',
			code: `//
//  ToDoTabService.swift
//  ToDoList
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
}`
		}
	];
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
			ToDoリストアプリプロジェクト
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-base-content/80">
			複数タブ対応のToDoリストアプリを作成します。タスク管理、カテゴリ分類、データ永続化機能を実装します。
		</p>
	</div>

	<!-- プロジェクト概要 -->
	<section class="mb-16">
		<div class="card overflow-hidden bg-base-100 shadow-xl">
			<div class="card-body p-8 sm:p-10">
				<div class="flex flex-col gap-8 lg:flex-row lg:items-start">
					<div class="flex-1">
						<h2 class="mb-4 text-2xl font-bold">プロジェクト概要</h2>
						<p class="mb-6 leading-relaxed">
							このプロジェクトでは、SwiftUIを使ってToDoリストアプリを作成します。以下の機能を学習できます：
						</p>
						<ul class="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								SwiftUIでのUI構築
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								SwiftDataを使ったデータ管理
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								複数タブの管理
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								CRUD操作の実装
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								カスタムUIコンポーネント
							</li>
							<li class="flex items-center gap-2">
								<svg
									class="h-5 w-5 text-success"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								ナビゲーション管理
							</li>
						</ul>
						<div>
							<a href="{base}/source/ToDoList.zip" download class="btn btn-primary">
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								プロジェクトをダウンロード
							</a>
						</div>
					</div>
					<div class="flex w-full justify-center lg:w-1/3">
						<ToDoListDemo />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- プロジェクト構造 -->
	<section class="mb-16 hidden">
		<details class="collapse-arrow collapse bg-base-200">
			<summary class="collapse-title text-xl font-medium">プロジェクト構造</summary>
			<div class="collapse-content">
				<div class="mockup-code text-sm">
					<pre><code
							>UIToDoList/
├── ToDoListApp.swift     # アプリのエントリーポイント
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
│   ├── Alert.swift
│   ├── FloatingButton.swift
│   ├── ListItem.swift
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
		</details>
	</section>

	<!-- 制作ステップ -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">制作ステップ</h2>
		<p class="mb-8 text-lg text-base-content/80">
			ToDoリストアプリを21のステップで段階的に作成しましょう。各ステップで必要な知識と実装方法を詳しく説明します。
		</p>
		<ProjectSteps steps={todolistSteps} projectId="todolist" />
	</section>

	<!-- コードサンプル -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold">完成コード</h2>
		<ProjectCodeSamples {codeSamples} />
	</section>
</div>
