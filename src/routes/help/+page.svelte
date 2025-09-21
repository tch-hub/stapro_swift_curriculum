<script>
	import { base } from '$app/paths';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h1 class="mb-6 card-title text-3xl">🔧 トラブルシューティング</h1>

			<div class="collapse-arrow collapse mb-2 bg-base-200">
				<input type="checkbox" checked />
				<div class="collapse-title text-xl font-medium">Xcodeが起動しない</div>
				<div class="collapse-content">
					<ul class="list-inside list-disc space-y-1">
						<li>Macを再起動してから再試行</li>
						<li>ストレージ容量を確認（15GB以上必要）</li>
						<li>macOSを最新版にアップデート</li>
						<li>Xcodeを一度削除して再インストール</li>
					</ul>
				</div>
			</div>

			<div class="collapse-arrow collapse mb-2 bg-base-200">
				<input type="checkbox" />
				<div class="collapse-title text-xl font-medium">シミュレーターが起動しない</div>
				<div class="collapse-content">
					<ul class="list-inside list-disc space-y-1">
						<li>Xcode → Developer Tool → Simulator を起動</li>
						<li>Device → iOS → iPhone（最新版）を選択</li>
						<li>Hardware → Restart を試行</li>
						<li>Xcodeを再起動</li>
					</ul>
				</div>
			</div>

			<div class="collapse-arrow collapse mb-2 bg-base-200">
				<input type="checkbox" />
				<div class="collapse-title text-xl font-medium">ビルドエラーが発生する</div>
				<div class="collapse-content">
					<ul class="list-inside list-disc space-y-1">
						<li>Product → Clean Build Folder を実行</li>
						<li>プロジェクト名に日本語や特殊文字が含まれていないか確認</li>
						<li>Xcodeを最新版にアップデート</li>
						<li>新しいプロジェクトを作成し直す</li>
					</ul>
				</div>
			</div>

			<div class="collapse-arrow collapse bg-base-200">
				<input type="checkbox" />
				<div class="collapse-title text-xl font-medium">動作が重い</div>
				<div class="collapse-content">
					<ul class="list-inside list-disc space-y-1">
						<li>他のアプリを終了してメモリを解放</li>
						<li>シミュレーターの設定で「Slow Animations」をオフ</li>
						<li>古いシミュレーターを削除（Device → Manage Devices）</li>
						<li>必要に応じてMacを再起動</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 text-center">
		<a href="{base}/setup" class="btn btn-outline">セットアップに戻る</a>
	</div>
</div>
