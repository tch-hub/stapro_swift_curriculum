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
			base: process.argv.includes('dev') ? '' : '/stapro_swift_curriculum'
		},
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
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
