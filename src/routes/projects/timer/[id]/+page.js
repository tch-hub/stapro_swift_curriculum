// 各タイマーステップのIDをプリレンダリング対象として返す
export const prerender = true;

// 1〜8までのIDを返す（必要に応じて増減可能）
export function entries() {
    return Array.from({ length: 8 }, (_, i) => ({ id: String(i + 1) }));
}
