import { base } from "$app/paths";

// 事前レンダリングを有効化し、利用可能なエントリを指定
export const prerender = true;

export function entries() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' }
    ];
}

export async function load({ params }) {
    const problemId = params.id;

    if (!problemId) {
        throw new Error("問題IDが指定されていません");
    }

    return {
        problemId
    };
}
