import { base } from "$app/paths";

// 動的ルートなのでプリレンダリングを無効化
export const prerender = false;

export async function load({ params }) {
    const tutorialId = params.id;

    if (!tutorialId) {
        throw new Error("チュートリアルIDが指定されていません");
    }

    return {
        tutorialId
    };
}
