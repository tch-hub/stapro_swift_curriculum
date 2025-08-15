import { base } from "$app/paths";
import fs from 'fs';

// 事前レンダリングを有効化し、利用可能なエントリを指定
export const prerender = true;

export function entries() {
    // tutorial-data.jsonからデータを同期的に読み込む
    const data = JSON.parse(fs.readFileSync('static/tutorial-data.json', 'utf8'));

    // 全てのレッスンのIDを抽出して、SvelteKitが期待する形式の配列を作成
    const ids = data.tutorialCategories.flatMap(category =>
        category.lessons.map(lesson => ({ id: lesson.id }))
    );

    return ids;
}

export async function load({ params }) {
    const tutorialId = params.id;

    if (!tutorialId) {
        throw new Error("チュートリアルIDが指定されていません");
    }

    // tutorialIdをコンポーネントに渡す
    return {
        tutorialId
    };
}
