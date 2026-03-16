<script>
	let { title = '練習問題', practiceImage = null, practiceContent, answerContent } = $props();
</script>

<div class="card mt-12 mb-8 border-l-4 border-l-primary bg-base-200 shadow-sm">
	<div class="card-body p-6">
		<h2 class="card-title flex items-center gap-2 text-xl font-bold text-primary">
			<span class="material-symbols-outlined text-3xl">edit_document</span>
			{title}
		</h2>

		<div class="mt-6 flex flex-col items-start gap-6 md:flex-row">
			<div class="flex w-full flex-shrink-0 flex-col items-center md:w-1/3">
				<span class="mb-2 text-sm font-bold text-base-content/70">完成イメージ</span>
				{#if practiceImage}
					<img
						src={practiceImage}
						alt="練習問題の完成イメージ"
						class="mobile-screenshot !float-none !m-0"
						onerror={(e) => {
							e.currentTarget.style.display = 'none';
							e.currentTarget.nextElementSibling.style.display = 'flex';
						}}
					/>
					<div
						class="mobile-screenshot !float-none !m-0 hidden aspect-[1/2.16] items-center justify-center bg-base-300"
					>
						<span class="text-sm font-medium text-base-content/50">No Image</span>
					</div>
				{:else}
					<div
						class="mobile-screenshot !float-none !m-0 flex aspect-[1/2.16] items-center justify-center bg-base-300 opacity-70"
					>
						<span class="text-sm font-medium text-base-content/50">No Image</span>
					</div>
				{/if}
			</div>

			<div class="flex w-full flex-col gap-6 md:w-2/3">
				{#if practiceContent}
					<div class="prose prose-base max-w-none">
						{@render practiceContent()}
					</div>
				{/if}

				{#if answerContent}
					<div class="collapse-arrow collapse border border-base-300 bg-base-100">
						<input type="checkbox" />
						<div class="collapse-title text-base font-bold text-primary">
							<span class="material-symbols-outlined mr-2 inline-block align-middle text-xl"
								>lightbulb</span
							>
							解答例を見る
						</div>
						<div class="collapse-content overflow-x-hidden pt-0">
							<div class="divider mt-0 mb-4"></div>
							<div class="overflow-x-auto">
								{@render answerContent()}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
