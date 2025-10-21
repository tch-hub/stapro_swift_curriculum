import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const id = params.id;
	let quizData;

	try {
		// 動的にJSONファイルをインポート
		quizData = await import(`$lib/data/quiz/quiz${id}.json`);
	} catch {
		throw error(404, '練習問題が見つかりません');
	}

	return {
		quizData: quizData.default,
		sectionId: id
	};
}
