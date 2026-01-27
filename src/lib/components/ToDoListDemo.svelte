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

<div class="mockup-phone">
	<div class="mockup-phone-camera"></div>
	<div class="mockup-phone-display bg-[#F2F2F7] text-black">
		<!-- 以下モニター内 -->
		<div
			class="relative flex h-full w-full flex-col items-stretch justify-start overflow-hidden bg-[#F2F2F7] pt-12 text-black"
		>
			<!-- iOS Segmented Control -->
			<div class="mb-4 px-4">
				<div class="relative flex rounded-lg bg-gray-200 p-1">
					{#each tabs as tab}
						<button
							class="flex-1 rounded-md py-1.5 text-sm font-medium transition-all duration-200 {selectedTabId ===
							tab.id
								? 'bg-white text-black shadow-sm'
								: 'text-gray-500 hover:text-gray-900'}"
							on:click={() => (selectedTabId = tab.id)}
						>
							{tab.name}
						</button>
					{/each}
				</div>
			</div>

			<!-- Task List (Inset Grouped) -->
			<div class="flex-1 overflow-y-auto px-4 pb-24">
				<div class="space-y-3">
					{#each filteredTasks as task (task.id)}
						<div class="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
							<button
								class="flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors {task.completed
									? 'border-blue-500 bg-blue-500'
									: 'border-gray-300'}"
								on:click={() => (task.completed = !task.completed)}
							>
								{#if task.completed}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 text-white"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
							<span
								class="flex-grow text-left text-black {task.completed
									? 'text-gray-400 line-through'
									: ''}"
							>
								{task.text}
							</span>
							<button
								class="text-gray-400 hover:text-red-500"
								aria-label="タスクを削除"
								on:click={() => deleteTask(task.id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					{:else}
						<div class="py-10 text-center text-sm text-gray-400">タスクがありません</div>
					{/each}
				</div>
			</div>

			<!-- Input Area -->
			<div class="absolute right-0 bottom-0 left-0 border-t border-gray-200 p-4">
				<div class="flex gap-2">
					<input
						type="text"
						placeholder="新しいタスク"
						class="flex-1 rounded-full border-none bg-white px-4 py-2 text-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
						bind:value={newTaskText}
						on:keydown={(e) => e.key === 'Enter' && addTask()}
					/>
					<button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition-colors hover:bg-blue-600 disabled:bg-blue-300"
						on:click={addTask}
						disabled={!newTaskText.trim()}
						aria-label="タスクを追加"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
