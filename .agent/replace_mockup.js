const fs = require('fs');
const file = 'src/routes/basic-syntax/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import CodeBlock from')) {
    content = content.replace("import { base, resolve } from '$app/paths';", "import { base, resolve } from '$app/paths';\n\timport CodeBlock from '$lib/components/CodeBlock.svelte';");
}

let result = '';
let startIndex = 0;
while (true) {
    const mockupIndex = content.indexOf('<div class="mockup-code', startIndex);
    if (mockupIndex === -1) {
        result += content.substring(startIndex);
        break;
    }

    result += content.substring(startIndex, mockupIndex);

    const divEndIndex = content.indexOf('</div>', mockupIndex);
    const blockContent = content.substring(mockupIndex, divEndIndex);

    const codeMatches = [...blockContent.matchAll(/<code[^>]*>(.*?)<\/code>/gs)];
    let codeStr = '';
    for (let i = 0; i < codeMatches.length; i++) {
        let line = codeMatches[i][1];
        line = line.replace(/&lcub;/g, '{').replace(/&rcub;/g, '}').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        line = line.replace(/^\s+|\s+$/g, ''); // trim whitespace or newlines inside code
        if (i > 0) codeStr += '\n';
        codeStr += line;
    }

    const escapedCode = codeStr.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    result += `<CodeBlock executable={true} code={\`${escapedCode}\`} />`;

    startIndex = divEndIndex + 6;
}

fs.writeFileSync(file, result, 'utf8');
console.log('Replaced mockup-code with CodeBlock');
