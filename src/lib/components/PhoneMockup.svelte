<script>
	import { base } from '$app/paths';

	export let previewImage;
	export let title;
	export let scale = 1.0;
	export let bgColor = 'white';
</script>

<!-- スマホモックアップのコンテナ -->
<div
	class="mx-auto w-full max-w-sm"
	style="padding: 20px; border-radius: 1rem; transform-origin: top;"
>
	<!-- 物理的なデバイスのフレーム -->
	<div
		class="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-[14px] border-gray-900 bg-gray-900 shadow-2xl dark:border-gray-900"
	>
		<!-- Dynamic Island -->
		<div
			class="absolute top-[27px] left-1/2 z-10 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black"
		></div>

		<!-- 画面部分 -->
		<div
			class="flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white"
			class:bg-black={bgColor === 'black'}
		>
			<!-- 画面の画像 -->
			<img
				src="{base}{previewImage}"
				alt="{title} プレビュー"
				class="max-h-full max-w-full object-contain"
				style="transform: scale({scale});"
				on:error={() =>
					(event.target.src = `https://placehold.jp/24/ffffff/000000/300x150.png?text=${encodeURIComponent(title + '\n プレビュー画像')}`)}
			/>
		</div>
	</div>
</div>
