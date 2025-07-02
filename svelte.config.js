import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : '/stapro_swift_curriculum'
		},
		prerender: {
			entries: [
				'*',
				'/tutorial/1',
				'/tutorial/2',
				'/tutorial/3',
				'/tutorial/4',
				'/tutorial/5',
				'/practice/1',
				'/practice/2',
				'/practice/3',
				'/practice/4',
				'/practice/5'
			],
			handleHttpError: ({ path, referrer, message }) => {
				// 動的ルートはプリレンダリングしない
				if (path.includes('[id]')) {
					console.warn(`Skipping prerender for dynamic route: ${path}`);
					return;
				}

				// 404エラーなど、一部のエラーは無視する
				if (message.includes('404') || message.includes('Not found')) {
					console.warn(`Skipping 404 error for path: ${path}`);
					return;
				}

				// エラーの原因となったパスに関する情報をすべてコンソールに出力する
				console.error('--- PRERENDER ERROR ---');
				console.error(`Path: ${path}`);       // 問題のパス
				console.error(`Referrer: ${referrer}`); // そのリンクがあったページ
				console.error(`Message: ${message}`);   // エラーメッセージ
				console.error('-----------------------');

				// 通常通りエラーでビルドを停止させる
				throw new Error(message);
			}
		}
	}
};

export default config;