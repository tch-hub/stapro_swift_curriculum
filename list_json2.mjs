import fs from 'fs';

const files = [
    'src/lib/data/cheatsheet.json',
    'src/lib/data/components-guide.json',
    'src/lib/data/glossary.json',
    'src/lib/data/styling-guide.json'
];

let output = '';
for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    output += `\n=== ${file} ===\n`;
    for (const section of data.sections) {
        output += `- Section [${section.id}]: ${section.title}\n`;
        for (const block of section.codeBlocks) {
            output += `  * ${block.title}\n`;
        }
    }
}
fs.writeFileSync('list_json_output.txt', output);
