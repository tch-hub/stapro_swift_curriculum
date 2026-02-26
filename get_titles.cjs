const fs = require('fs');
const path = require('path');

function getInfo(dir) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort((a, b) => {
        const numA = parseInt(a.replace('step', '').replace('.md', ''));
        const numB = parseInt(b.replace('step', '').replace('.md', ''));
        return numA - numB;
    });

    let result = dir + ':\n';
    for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const titleMatch = content.match(/title:\s*(.*)/);
        const title = titleMatch ? titleMatch[1] : 'No title';
        result += `- ${file}: ${title}\n`;
    }
    return result;
}

console.log(getInfo('src/lib/steps/timer'));
console.log(getInfo('src/lib/steps/todolist'));
