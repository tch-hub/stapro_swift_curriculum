// generate-pdb-7.js
// Node 18+
// 実行:
// node --max-old-space-size=4096 script/generate-pdb-7.js

import fs from "fs";
import path from "path";

// 7-8分割
const patternA = [1, 2, 3, 4, 5, 6, 7];
const patternB = [8, 9, 10, 11, 12, 13, 14, 15];

// 組合せ計算用
const fact = [1];
for (let i = 1; i <= 16; i++) fact[i] = fact[i - 1] * i;

function comb(n, k) {
    if (k > n || k < 0) return 0;
    return fact[n] / (fact[k] * fact[n - k]);
}

// パターン状態をランク化（完璧ハッシュ）
function rankPattern(state, pattern) {
    // タイル位置と空白位置を取得
    const positions = [];
    for (const tile of pattern) {
        positions.push(state.indexOf(tile));
    }
    const blank = state.indexOf(0);
    positions.push(blank);

    // 昇順にソート（組み合わせとして扱うため）
    positions.sort((a, b) => a - b);

    let rank = 0;
    let k = positions.length;
    let prev = -1;

    for (let i = 0; i < k; i++) {
        for (let j = prev + 1; j < positions[i]; j++) {
            rank += comb(16 - 1 - j, k - 1 - i);
        }
        prev = positions[i];
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
    console.log("Generating", name);
    console.log("Pattern:", pattern);

    // 組み合わせ数: 16個の場所から (pattern.length + 1) 個選ぶ
    const k = pattern.length + 1;
    const totalStates = comb(16, k);
    console.log(`Total states (comb(16, ${k})):`, totalStates);

    const pdb = new Uint8Array(totalStates);
    pdb.fill(255);

    const goal = Array.from({ length: 16 }, (_, i) => (i + 1) % 16); // [1,2,3...15,0]

    const queue = [];
    // 初期状態: ゴール状態, 空白位置=15, 距離=0
    queue.push({ state: goal, blank: 15, dist: 0 });

    const startRank = rankPattern(goal, pattern);
    console.log("Start Rank:", startRank);

    if (startRank >= totalStates) {
        console.error("Error: Start Rank exceeds totalStates!");
    }

    pdb[startRank] = 0;

    let visited = 1;
    let head = 0;

    while (head < queue.length) {
        const { state, blank, dist } = queue[head++];

        // Debug output for first few states
        if (head <= 5) {
            console.log(`[DEBUG] Pop: blank=${blank}, dist=${dist}, state=${state.slice(0, 5)}...`);
        }

        for (const next of neighbors(blank)) {
            const newState = [...state];
            [newState[blank], newState[next]] =
                [newState[next], newState[blank]];

            const r = rankPattern(newState, pattern);

            if (head <= 5) {
                console.log(`  Next blank=${next}, Rank=${r}, CurrentPDB=${pdb[r]}`);
            }

            if (pdb[r] === 255) {
                pdb[r] = dist + 1;
                queue.push({ state: newState, blank: next, dist: dist + 1 });
                visited++;
                if (visited % 1000 === 0) // 頻度高めに
                    console.log(name, "visited", visited);
            }
        }
    }

    // static フォルダに出力
    const outputPath = path.join(process.cwd(), "static", `${name}.bin`);
    fs.writeFileSync(outputPath, Buffer.from(pdb));
    console.log(name, "DONE. states:", visited, "Saved to:", outputPath);
}

// 実行
try {
    generate(patternA, "pdb7");
    generate(patternB, "pdb8");
    console.log("ALL DONE");
} catch (e) {
    console.error("Unhandled error:", e);
}
