import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const id = params.id;
	let quizData;

	try {
		// 動的にJSONファイルをインポート
		quizData = await import(`$lib/data/swift-exercises/quiz${id}.json`);
	} catch {
		throw error(404, 'Swift基礎問題が見つかりません');
	}

	return {
		quizData: quizData.default,
		sectionId: id
	};
}
