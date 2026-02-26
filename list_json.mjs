import fs from 'fs';

const files = [
    'src/lib/data/cheatsheet.json',
    'src/lib/data/components-guide.json',
    'src/lib/data/glossary.json',
    'src/lib/data/styling-guide.json'
];

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n=== ${file} ===`);
    for (const section of data.sections) {
        console.log(`- Section [${section.id}]: ${section.title}`);
        for (const block of section.codeBlocks) {
            console.log(`  * ${block.title}`);
        }
    }
}
