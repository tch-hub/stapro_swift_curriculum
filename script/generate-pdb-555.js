// generate-pdb-555.js
import fs from "fs";
import path from "path";

// 5-5-5分割
const patterns = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15]
];
const names = ["pdb5_1", "pdb5_2", "pdb5_3"];

// 順列計算 P(n, k)
const fact = [1];
for (let i = 1; i <= 16; i++) fact[i] = fact[i - 1] * i;

function perm(n, k) {
    if (k < 0 || k > n) return 0;
    return fact[n] / fact[n - k];
}

// 順列ランク (Permutation Rank: Lehmer code variant)
function rankPattern(state, pattern) {
    const items = [0, ...pattern]; // 空白 + パターン (順序重要)
    let rank = 0;
    let available = 0xFFFF; // 16 bit mask (all 1 available)

    for (let i = 0; i < items.length; i++) {
        const val = items[i];
        const pos = state.indexOf(val);

        // posより前にある空き位置の数を数える
        let count = 0;
        for (let j = 0; j < pos; j++) {
            if ((available >> j) & 1) count++;
        }

        // 残り場所数 N, 残りアイテム数 K
        const n = 16 - 1 - i;
        const k = items.length - 1 - i;

        rank += count * perm(n, k);

        available &= ~(1 << pos); // 使用済みにする
    }
    return rank;
}

function neighbors(blank) {
    const r = (blank / 4) | 0;
    const c = blank % 4;
    const res = [];
    if (r > 0) res.push(blank - 4);
    if (r < 3) res.push(blank + 4);
    if (c > 0) res.push(blank - 1);
    if (c < 3) res.push(blank + 1);
    return res;
}

function generate(pattern, name) {
    console.log(`Generating ${name}... Pattern: ${pattern}`);
    const itemsLen = pattern.length + 1; // +blank
    const totalStates = perm(16, itemsLen);
    console.log(`Total states: ${totalStates}`);

    const pdb = new Uint8Array(totalStates);
    pdb.fill(255);

    const goal = Array.from({ length: 16 }, (_, i) => (i + 1) % 16);

    // BFS Queue
    const queue = [];
    queue.push({ state: goal, blank: 15, dist: 0 });

    const startRank = rankPattern(goal, pattern);
    pdb[startRank] = 0;

    let head = 0;
    let visited = 1;

    while (head < queue.length) {
        const { state, blank, dist } = queue[head++];

        if (head % 200000 === 0) {
            console.log(`${name}: visited ${head}/${queue.length} (queue size)`);
        }

        for (const next of neighbors(blank)) {
            const newState = [...state];
            [newState[blank], newState[next]] = [newState[next], newState[blank]];

            const r = rankPattern(newState, pattern);
            if (pdb[r] === 255) {
                pdb[r] = dist + 1;
                queue.push({ state: newState, blank: next, dist: dist + 1 });
                visited++;
            }
        }
    }

    const outputPath = path.join(process.cwd(), "static", `${name}.bin`);
    fs.writeFileSync(outputPath, pdb);
    console.log(`${name} DONE. Visited: ${visited}. Saved to ${outputPath}`);
}

(async () => {
    try {
        for (let i = 0; i < 3; i++) {
            generate(patterns[i], names[i]);
            // GCを促すために少し待つとか... Nodeでは明示的GCは露出していないが、スコープが切れれば解放されるはず
            await new Promise(r => setTimeout(r, 1000));
        }
        console.log("ALL DONE");
    } catch (e) {
        console.error(e);
    }
})();
