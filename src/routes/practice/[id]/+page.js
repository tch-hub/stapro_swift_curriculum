import { base } from "$app/paths";

export async function load({ params }) {
    const problemId = params.id;

    if (!problemId) {
        throw new Error("問題IDが指定されていません");
    }

    return {
        problemId
    };
}
