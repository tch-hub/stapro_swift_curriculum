<script>
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	let { data } = $props();

	let sections = $state([]);
	let selectedSectionId = $state('0');
	let selectedCodeBlockIndex = $state(0);
	let message = $state('');
	let showRawJson = $state(false);
	let jsonContent = $state(data.jsonContent || '');

	// JSONをパースしてsectionsを取得
	$effect(() => {
		try {
			if (jsonContent) {
				const parsed = JSON.parse(jsonContent);
				sections = parsed.sections || [];
			}
		} catch (error) {
			console.error('JSON parse error:', error);
			sections = [];
		}
	});

	// ページロード時のメッセージ表示
	$effect(() => {
		if (data.error) {
			message = '読み込みエラー: ' + data.error;
		}
	});

	// form actionの結果を処理
	function handleAction(event) {
		const result = event.detail?.result;
		if (result?.type === 'success') {
			message = '保存しました！';
		} else if (result?.type === 'failure') {
			message = '保存エラー: ' + (result.data?.error || '不明なエラー');
		}
	}

	// 特定のsectionを更新
	function updateSection(sectionId, updatedSection) {
		sections = sections.map((section) =>
			section.id === sectionId ? { ...section, ...updatedSection } : section
		);
		// JSONを再構築
		jsonContent = JSON.stringify({ sections }, null, 2);
	}

	// 特定のcodeBlockを更新
	function updateCodeBlock(sectionId, codeBlockIndex, updatedCodeBlock) {
		sections = sections.map((section) => {
			if (section.id === sectionId) {
				const updatedCodeBlocks = [...section.codeBlocks];
				updatedCodeBlocks[codeBlockIndex] = {
					...updatedCodeBlocks[codeBlockIndex],
					...updatedCodeBlock
				};
				return { ...section, codeBlocks: updatedCodeBlocks };
			}
			return section;
		});
		// JSONを再構築
		jsonContent = JSON.stringify({ sections }, null, 2);
	}

	// 選択されたsectionを取得
	let selectedSection = $derived(sections.find((s) => s.id === selectedSectionId));

	// 選択されたcodeBlockを取得
	let selectedCodeBlock = $derived(selectedSection?.codeBlocks?.[selectedCodeBlockIndex]);
</script>

<svelte:head>
	<title>JSONエディタ - 開発環境専用</title>
</svelte:head>

{#if !dev}
	<div class="container mx-auto p-8">
		<div class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
				/>
			</svg>
			<span>このページは開発環境でのみ利用可能です。</span>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-base-100">
		<!-- 固定ヘッダー -->
		<div class="navbar sticky top-0 z-10 border-b border-base-300 bg-base-100 shadow-sm">
			<div class="navbar-start">
				<h1 class="text-xl font-bold">JSONエディタ</h1>
			</div>
			<div class="navbar-center">
				{#if message}
					<div
						class="alert {message.includes('エラー') ? 'alert-error' : 'alert-success'} px-4 py-2"
					>
						<span class="text-sm">{message}</span>
					</div>
				{/if}
			</div>
			<div class="navbar-end space-x-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showRawJson = !showRawJson)}>
					{showRawJson ? 'エディタ' : '生JSON'}
				</button>
				<form method="POST" action="?/save" use:enhance={handleAction}>
					<input type="hidden" name="jsonContent" value={jsonContent} />
					<button class="btn btn-sm btn-primary" type="submit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-1 h-4 w-4"
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
						保存
					</button>
				</form>
			</div>
		</div>

		{#if showRawJson}
			<!-- 生JSONエディタ -->
			<div class="p-6">
				<form method="POST" action="?/save" use:enhance={handleAction}>
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">生JSON編集</h2>
							<textarea
								name="jsonContent"
								bind:value={jsonContent}
								class="textarea-bordered textarea h-96 w-full font-mono text-sm"
								placeholder="JSONコンテンツ"
							></textarea>
						</div>
					</div>
				</form>
			</div>
		{:else}
			<!-- メインエディタ -->
			<div class="flex h-[calc(100vh-4rem)]">
				<!-- サイドバー -->
				<div class="w-80 overflow-y-auto border-r border-base-300 bg-base-200">
					<div class="p-4">
						<h3 class="mb-3 text-lg font-semibold">チュートリアルセクション</h3>
						<div class="space-y-2">
							{#each sections as section (section.id)}
								<button
									class="w-full rounded-lg p-3 text-left transition-colors {selectedSectionId ===
									section.id
										? 'bg-primary text-primary-content'
										: 'bg-base-100 hover:bg-base-300'}"
									onclick={() => {
										selectedSectionId = section.id;
										selectedCodeBlockIndex = 0;
									}}
								>
									<div class="font-medium">{section.id}: {section.title}</div>
									<div class="mt-1 text-sm opacity-70">
										{section.codeBlocks?.length || 0}個のコードブロック
									</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- メインコンテンツ -->
				<div class="flex-1 overflow-y-auto">
					{#if selectedSection}
						<div class="space-y-6 p-6">
							<!-- セクション情報 -->
							<div class="card bg-base-100 shadow-xl">
								<div class="card-body">
									<h2 class="card-title">セクション情報</h2>
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">ID</span>
											</label>
											<input
												type="text"
												value={selectedSection.id}
												class="input-bordered input"
												readonly
											/>
										</div>
										<div class="form-control">
											<label class="label">
												<span class="label-text font-semibold">タイトル</span>
											</label>
											<input
												type="text"
												bind:value={selectedSection.title}
												oninput={(e) =>
													updateSection(selectedSection.id, { title: e.target.value })}
												class="input-bordered input"
												placeholder="セクションのタイトル"
											/>
										</div>
									</div>
									<div class="form-control">
										<label class="label">
											<span class="label-text font-semibold">説明</span>
										</label>
										<textarea
											bind:value={selectedSection.description}
											oninput={(e) =>
												updateSection(selectedSection.id, { description: e.target.value })}
											class="textarea-bordered textarea h-12 w-full"
											placeholder="セクションの説明"
										></textarea>
									</div>
								</div>
							</div>

							<!-- コードブロック -->
							<div class="space-y-4">
								<h3 class="text-xl font-semibold">コードブロック</h3>

								<!-- コードブロック選択 -->
								<div class="flex flex-wrap gap-2">
									{#each selectedSection.codeBlocks as codeBlock, index (index)}
										<button
											class="btn btn-sm {selectedCodeBlockIndex === index
												? 'btn-primary'
												: 'btn-outline'}"
											onclick={() => (selectedCodeBlockIndex = index)}
										>
											{codeBlock.title || `ブロック ${index + 1}`}
										</button>
									{/each}
								</div>

								<!-- コードブロック編集 -->
								{#if selectedCodeBlock}
									<div class="card bg-base-100 shadow-xl">
										<div class="card-body">
											<h4 class="card-title">コードブロック編集</h4>
											<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
												<div class="space-y-4">
													<div class="form-control">
														<label class="label">
															<span class="label-text font-semibold">タイトル</span>
														</label>
														<input
															type="text"
															value={selectedCodeBlock.title || ''}
															oninput={(e) =>
																updateCodeBlock(selectedSection.id, selectedCodeBlockIndex, {
																	title: e.target.value
																})}
															class="input-bordered input"
															placeholder="コードブロックのタイトル"
														/>
													</div>

													<div class="form-control">
														<label class="label">
															<span class="label-text font-semibold">プレビュー画像</span>
														</label>
														<input
															type="text"
															value={selectedCodeBlock.previewImage || ''}
															oninput={(e) =>
																updateCodeBlock(selectedSection.id, selectedCodeBlockIndex, {
																	previewImage: e.target.value
																})}
															class="input-bordered input"
															placeholder="/previews/tutorial-1-1.png"
														/>
													</div>
												</div>

												<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
													<div class="form-control">
														<label class="label">
															<span class="label-text font-semibold">Swiftコード</span>
														</label>
														<textarea
															value={selectedCodeBlock.code || ''}
															oninput={(e) =>
																updateCodeBlock(selectedSection.id, selectedCodeBlockIndex, {
																	code: e.target.value
																})}
															class="textarea-bordered textarea h-96 font-mono text-sm"
															placeholder="Swiftコード"
														></textarea>
													</div>

													<!-- Swiftコードのプレビュー -->
													<div class="form-control">
														<label class="label">
															<span class="label-text font-semibold">プレビュー</span>
														</label>
														<div
															class="h-96 overflow-y-auto rounded-lg border border-base-300 bg-base-200 p-4"
														>
															<CodeBlock
																code={selectedCodeBlock.code || '// Swiftコードを入力してください'}
																language="swift"
																title={selectedCodeBlock.title || 'プレビュー'}
																showHeader={false}
																showLineNumbers={true}
															/>
														</div>
													</div>
												</div>
											</div>

											<!-- 説明部分をフル幅で配置 -->
											<div class="form-control mt-6">
												<label class="label">
													<span class="label-text font-semibold">説明</span>
												</label>
												<textarea
													value={selectedCodeBlock.description || ''}
													oninput={(e) =>
														updateCodeBlock(selectedSection.id, selectedCodeBlockIndex, {
															description: e.target.value
														})}
													class="textarea-bordered textarea h-[60vh] w-full"
													placeholder="コードブロックの説明"
												></textarea>
											</div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<div class="flex h-full items-center justify-center">
							<div class="text-center">
								<h3 class="text-lg font-semibold text-base-content/70">
									セクションを選択してください
								</h3>
								<p class="mt-2 text-base-content/50">
									左側のサイドバーから編集したいセクションを選んでください。
								</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/if}
