<script>
	let tabs = [
		{ id: 1, name: '勉強' },
		{ id: 2, name: 'やること' }
	];
	let selectedTabId = 1;

	let tasks = [
		{ id: 1, tabId: 1, text: 'SwiftUIの基礎を学ぶ', completed: true },
		{ id: 2, tabId: 1, text: 'SwiftDataについて調べる', completed: false },
		{ id: 3, tabId: 2, text: '買い物に行く', completed: false },
		{ id: 4, tabId: 2, text: '部屋の掃除をする', completed: true }
	];

	let newTaskText = '';
	let nextTaskId = 5;

	function addTask() {
		if (newTaskText.trim() === '') return;
		tasks = [
			...tasks,
			{ id: nextTaskId++, tabId: selectedTabId, text: newTaskText, completed: false }
		];
		newTaskText = '';
	}

	function deleteTask(taskId) {
		tasks = tasks.filter((t) => t.id !== taskId);
	}

	$: filteredTasks = tasks.filter((task) => task.tabId === selectedTabId);
</script>

<div class="card mb-8 bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title text-2xl">ライブデモ</h2>
		<div class="mockup-phone border-primary">
			<div class="camera"></div>
			<div class="display">
				<div class="artboard artboard-demo phone-1">
					<div class="navbar bg-base-300">
						<div class="flex-1 px-4 font-bold">ToDoリスト</div>
						<div class="flex-none">
							<button class="btn btn-square btn-ghost">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block h-5 w-5 stroke-current"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
									></path></svg
								>
							</button>
						</div>
					</div>

					<div class="p-4">
						<!-- タブ選択 -->
						<div class="tabs-boxed mb-4 tabs">
							{#each tabs as tab}
								<a
									class="tab grow"
									class:tab-active={selectedTabId === tab.id}
									on:click={() => (selectedTabId = tab.id)}
								>
									{tab.name}
								</a>
							{/each}
						</div>

						<!-- タスク追加フォーム -->
						<div class="mb-4 flex gap-2">
							<input
								type="text"
								placeholder="新しいタスクを入力"
								class="input-bordered input w-full"
								bind:value={newTaskText}
								on:keydown={(e) => e.key === 'Enter' && addTask()}
							/>
							<button class="btn btn-primary" on:click={addTask}>追加</button>
						</div>

						<!-- タスクリスト -->
						<div class="space-y-2">
							{#each filteredTasks as task (task.id)}
								<div class="flex items-center gap-2 rounded-lg bg-base-200 p-2">
									<input type="checkbox" class="checkbox" bind:checked={task.completed} />
									<span class="grow" class:line-through={task.completed}>
										{task.text}
									</span>
									<button class="btn btn-ghost btn-xs" on:click={() => deleteTask(task.id)}
										>削除</button
									>
								</div>
							{:else}
								<div class="text-center opacity-50">このタブにはタスクがありません。</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.mockup-phone .display .artboard {
		background: #f9fafb;
	}
	:global(html.dark) .mockup-phone .display .artboard {
		background: #1d232a;
	}
</style>
