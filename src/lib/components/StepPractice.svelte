<script>
	let { title = '練習問題', practiceImage = null, practiceContent, answerContent } = $props();
</script>

<div class="card mt-12 mb-8 border-l-4 border-l-primary bg-base-200 shadow-sm">
	<div class="card-body p-6">
		<h2 class="card-title flex items-center gap-2 text-xl font-bold text-primary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
				/>
			</svg>
			{title}
		</h2>

		<div class="mt-4 alert alert-info py-3 shadow-none">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-5 w-5 shrink-0 stroke-current text-info-content"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span class="text-sm font-medium text-info-content">
				Point: 練習問題は、StepごとにXcodeで<strong>新規プロジェクト</strong
				>を作成して取り組んでください。
			</span>
		</div>

		<div class="mt-6 flex flex-col items-start gap-6 md:flex-row">
			<div class="flex w-full flex-shrink-0 flex-col items-center md:w-1/3">
				<span class="mb-2 text-sm font-bold text-base-content/70">完成イメージ</span>
				{#if practiceImage}
					<div class="mockup-phone border-primary">
						<div class="camera"></div>
						<div class="display">
							<div class="artboard artboard-demo phone-1 relative overflow-hidden bg-base-100">
								<img
									src={practiceImage}
									alt="練習問題の完成イメージ"
									class="h-full w-full object-cover"
									onerror={(e) => {
										e.currentTarget.style.display = 'none';
										e.currentTarget.nextElementSibling.style.display = 'flex';
									}}
								/>
								<div class="absolute inset-0 flex hidden items-center justify-center bg-base-300">
									<span class="text-sm font-medium text-base-content/50">No Image</span>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="mockup-phone border-base-300 opacity-70">
						<div class="camera"></div>
						<div class="display">
							<div
								class="artboard artboard-demo phone-1 flex items-center justify-center bg-base-300"
							>
								<span class="text-sm font-medium text-base-content/50">No Image</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex w-full flex-col gap-6 md:w-2/3">
				{#if practiceContent}
					<div class="prose max-w-none">
						{@render practiceContent()}
					</div>
				{/if}

				{#if answerContent}
					<div class="collapse-arrow collapse border border-base-300 bg-base-100">
						<input type="checkbox" />
						<div class="collapse-title flex items-center gap-2 text-base font-bold text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.496 1.509 1.333 1.509 2.316V18"
								/>
							</svg>
							解答例を見る
						</div>
						<div class="collapse-content prose max-w-none pt-0">
							<div class="divider mt-0 mb-4"></div>
							{@render answerContent()}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
