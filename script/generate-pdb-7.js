// generate-pdb.js
// Node 18+
// 実行:
// node --max-old-space-size=4096 generate-pdb.js

const fs = require("fs");

const SIZE = 4;
const N = 16;

// 7-8分割
const patternA = [1,2,3,4,5,6,7];
const patternB = [8,9,10,11,12,13,14,15];

// 組合せ計算用
const fact = [1];
for (let i=1;i<=16;i++) fact[i]=fact[i-1]*i;

function comb(n,k){
    if(k>n||k<0)return 0;
    return fact[n]/(fact[k]*fact[n-k]);
}

// パターン状態をランク化（完璧ハッシュ）
function rankPattern(state, pattern){
    const positions = [];

    for(const tile of pattern){
        positions.push(state.indexOf(tile));
    }
    const blank = state.indexOf(0);
    positions.push(blank);

    positions.sort((a,b)=>a-b);

    let rank=0;
    let k=positions.length;
    let prev=-1;

    for(let i=0;i<k;i++){
        for(let j=prev+1;j<positions[i];j++){
            rank+=comb(16-1-j,k-1-i);
        }
        prev=positions[i];
    }

    return rank;
}

function neighbors(blank){
    const r=(blank/4)|0;
    const c=blank%4;
    const res=[];
    if(r>0)res.push(blank-4);
    if(r<3)res.push(blank+4);
    if(c>0)res.push(blank-1);
    if(c<3)res.push(blank+1);
    return res;
}

function generate(pattern,name){
    console.log("Generating",name);

    const totalStates = comb(16, pattern.length+1);
    const pdb = new Uint8Array(totalStates);
    pdb.fill(255);

    const goal = Array.from({length:16},(_,i)=>(i+1)%16);

    const queue=[];
    queue.push({state:goal, blank:15, dist:0});

    const startRank = rankPattern(goal,pattern);
    pdb[startRank]=0;

    let visited=1;

    while(queue.length){
        const {state,blank,dist}=queue.shift();

        for(const next of neighbors(blank)){
            const newState=[...state];
            [newState[blank],newState[next]]=
                [newState[next],newState[blank]];

            const r=rankPattern(newState,pattern);

            if(pdb[r]===255){
                pdb[r]=dist+1;
                queue.push({state:newState,blank:next,dist:dist+1});
                visited++;
                if(visited%500000===0)
                    console.log(name,"visited",visited);
            }
        }
    }

    fs.writeFileSync(`${name}.bin`,Buffer.from(pdb));
    console.log(name,"DONE. states:",visited);
}

generate(patternA,"pdb7");
generate(patternB,"pdb8");

console.log("ALL DONE");
