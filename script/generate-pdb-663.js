// generate-pdb-663.js
import fs from "fs";
import path from "path";

// 6-6-3分割
const patterns = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15]
];
const names = ["pdb6_1", "pdb6_2", "pdb6_3"];

// 順列計算 P(n, k)
const fact = [1];
for (let i = 1; i <= 16; i++) fact[i] = fact[i - 1] * i;

function perm(n, k) {
    if (k < 0 || k > n) return 0;
    return fact[n] / fact[n - k];
}

// 順列ランク (Permutation Rank)
function rankPattern(state, pattern) {
    const items = [0, ...pattern];
    let rank = 0;
    let available = 0xFFFF;

    for (let i = 0; i < items.length; i++) {
        const val = items[i];
        const pos = state.indexOf(val);

        let count = 0;
        for (let j = 0; j < pos; j++) {
            if ((available >> j) & 1) count++;
        }

        const n = 16 - 1 - i;
        const k = items.length - 1 - i;

        rank += count * perm(n, k);
        available &= ~(1 << pos);
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
    const itemsLen = pattern.length + 1;
    const totalStates = perm(16, itemsLen);
    console.log(`Total states: ${totalStates}`);

    const pdb = new Uint8Array(totalStates);
    pdb.fill(255);

    const goal = Array.from({ length: 16 }, (_, i) => (i + 1) % 16);

    // 0-1 BFS
    let currentQueue = [];
    let nextQueue = [];

    const startRank = rankPattern(goal, pattern);
    pdb[startRank] = 0;
    currentQueue.push({ state: goal, blank: 15 });

    let dist = 0;
    let visited = 1;

    // 進捗表示用
    let lastLogTime = Date.now();

    while (currentQueue.length > 0 || nextQueue.length > 0) {
        if (currentQueue.length === 0) {
            currentQueue = nextQueue;
            nextQueue = [];
            dist++;

            const now = Date.now();
            if (now - lastLogTime > 5000) { // 5秒ごとにログ
                console.log(`${name}: dist ${dist}, queue size ${currentQueue.length}, visited ${visited}/${totalStates} (${Math.round(visited / totalStates * 100)}%)`);
                lastLogTime = now;
            }

            if (dist >= 255) break;
        }

        const { state, blank } = currentQueue.pop();

        for (const next of neighbors(blank)) {
            const tile = state[next];
            const isPatternTile = pattern.includes(tile);
            const moveCost = isPatternTile ? 1 : 0;

            const newState = [...state];
            [newState[blank], newState[next]] = [newState[next], newState[blank]];

            const r = rankPattern(newState, pattern);

            if (pdb[r] === 255) {
                pdb[r] = dist + moveCost;
                if (moveCost === 0) {
                    currentQueue.push({ state: newState, blank: next });
                } else {
                    nextQueue.push({ state: newState, blank: next });
                }
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
            // GC
            if (global.gc) global.gc(); // if exposed
            await new Promise(r => setTimeout(r, 1000));
        }
        console.log("ALL DONE");
    } catch (e) {
        console.error(e);
    }
})();
