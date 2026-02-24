<script>
	// === データ定義 ===
	let lists = $state([
		{ id: 1, name: 'リスト' },
		{ id: 2, name: '仕事' },
		{ id: 3, name: 'プライベート' }
	]);

	let allTasks = $state([
		{ id: 1, listId: 1, text: 'アイテムA', completed: false },
		{ id: 2, listId: 1, text: 'アイテムB', completed: false },
		{ id: 3, listId: 1, text: 'アイテムC', completed: true },
		{ id: 4, listId: 2, text: 'ミーティング資料を作る', completed: false },
		{ id: 5, listId: 2, text: 'メールを返信する', completed: true },
		{ id: 6, listId: 3, text: '買い物に行く', completed: false }
	]);

	// === UI状態 ===
	let selectedListId = $state(1);
	let showListPicker = $state(false);
	let newTaskText = $state('');
	let nextTaskId = $state(7);

	// === 派生値 ===
	let selectedList = $derived(lists.find((l) => l.id === selectedListId));
	let filteredTasks = $derived(allTasks.filter((t) => t.listId === selectedListId));

	// === アクション ===
	function addTask() {
		if (!newTaskText.trim()) return;
		allTasks = [
			...allTasks,
			{ id: nextTaskId++, listId: selectedListId, text: newTaskText, completed: false }
		];
		newTaskText = '';
	}

	function selectList(id) {
		selectedListId = id;
		showListPicker = false;
	}

	function toggleTask(task) {
		task.completed = !task.completed;
	}
</script>

<!-- モック電話画面 -->
<div class="mockup-phone">
	<div class="mockup-phone-camera"></div>
	<div class="mockup-phone-display bg-white text-black">
		<div class="screen">
			<!-- タイトル -->
			<div class="px-5 pt-14 pb-2">
				<h1 class="text-3xl font-bold text-black">ToDo リスト</h1>
			</div>

			<!-- リストヘッダー -->
			<div class="relative flex items-center justify-between px-5 py-3">
				<!-- リスト切り替えボタン -->
				<button
					class="flex items-center gap-0.5 text-base font-normal text-[#007AFF]"
					onclick={() => (showListPicker = !showListPicker)}
				>
					{selectedList?.name}
					<span class="icon transition-transform {showListPicker ? 'rotate-180' : ''}">
						expand_more
					</span>
				</button>

				<!-- フィルターボタン -->
				<button class="icon-btn" aria-label="フィルター">
					<span class="icon">filter_list</span>
				</button>

				<!-- リスト選択ドロップダウン -->
				{#if showListPicker}
					<div class="dropdown">
						{#each lists as list, i (list.id)}
							<button
								class="dropdown-item {list.id === selectedListId ? 'selected' : ''}"
								onclick={() => selectList(list.id)}
							>
								<span>{list.name}</span>
								{#if list.id === selectedListId}
									<span class="icon text-base text-[#007AFF]">check</span>
								{/if}
							</button>
							{#if i < lists.length - 1}
								<div class="mx-4 border-b border-gray-100"></div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- タスクリスト -->
			<div
				class="flex-1 overflow-y-auto"
				onclick={() => {
					if (showListPicker) showListPicker = false;
				}}
				role="presentation"
			>
				{#each filteredTasks as task, i (task.id)}
					<button
						class="flex w-full items-center gap-3 px-5 py-3 text-left"
						onclick={() => toggleTask(task)}
					>
						<!-- チェック円 -->
						{#if task.completed}
							<span class="check-circle completed">
								<span class="icon text-sm text-white">check</span>
							</span>
						{:else}
							<span class="check-circle pending"></span>
						{/if}

						<!-- タスクテキスト -->
						<span
							class="flex-grow text-base {task.completed
								? 'text-gray-400 line-through'
								: 'text-black'}"
						>
							{task.text}
						</span>
					</button>

					{#if i < filteredTasks.length - 1}
						<div class="ml-14 border-b border-gray-200"></div>
					{/if}
				{/each}

				{#if filteredTasks.length === 0}
					<div class="py-10 text-center text-sm text-gray-400">タスクがありません</div>
				{/if}
			</div>

			<!-- 入力エリア -->
			<div class="absolute right-0 bottom-6 left-0 bg-[#F2F2F7] px-4 py-3">
				<div class="flex items-center gap-2">
					<input
						type="text"
						placeholder="新しいタスクを追加..."
						class="flex-1 border-none bg-transparent text-sm text-gray-400 outline-none placeholder:text-gray-400"
						bind:value={newTaskText}
						onkeydown={(e) => e.key === 'Enter' && addTask()}
					/>
					<button
						class="send-btn {newTaskText.trim() ? 'active' : ''}"
						onclick={addTask}
						aria-label="タスクを追加"
					>
						<span class="icon text-base">arrow_upward</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* 画面全体 */
	.screen {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		height: 100%;
		width: 100%;
		overflow: hidden;
		background-color: #f2f2f7;
		color: black;
	}

	/* Material Icons 共通 */
	.icon {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 1.25rem;
		line-height: 1;
		display: inline-block;
		user-select: none;
	}

	/* フィルターアイコンボタン */
	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		background-color: #eaf2ff;
		color: #007aff;
	}

	/* ドロップダウン */
	.dropdown {
		position: absolute;
		top: 100%;
		left: 0.75rem;
		z-index: 10;
		min-width: 160px;
		overflow: hidden;
		border-radius: 0.75rem;
		background: white;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.dropdown-item {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.875rem;
		color: black;
		transition: background-color 0.15s;
	}

	.dropdown-item:hover {
		background-color: #f9fafb;
	}

	.dropdown-item.selected {
		font-weight: 500;
		color: #007aff;
	}

	/* チェック円 */
	.check-circle {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
	}

	.check-circle.completed {
		background-color: #9ca3af;
	}

	.check-circle.pending {
		border: 2px solid #007aff;
	}

	/* 送信ボタン */
	.send-btn {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background-color: #9ca3af;
		color: white;
		transition: background-color 0.15s;
	}

	.send-btn.active {
		background-color: #007aff;
	}
</style>
