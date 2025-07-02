import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : '/githubpagestest'
		},
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				// 動的ルートはプリレンダリングしない
				if (path.includes('[id]')) {
					console.warn(`Skipping prerender for dynamic route: ${path}`);
					return;
				}

				// エラーの原因となったパスに関する情報をすべてコンソールに出力する
				console.error('--- PRERENDER ERROR ---');
				console.error(`Path: ${path}`);       // 問題のパス (例: /)
				console.error(`Referrer: ${referrer}`); // そのリンクがあったページ (例: /githubpagestest/)
				console.error(`Message: ${message}`);   // エラーメッセージ
				console.error('-----------------------');

				// ビルドを強制的に続行させたい場合は、下の行のコメントを外す
				// return;

				// 通常通りエラーでビルドを停止させる
				throw new Error(message);
			}
		}
	}
};

export default config;