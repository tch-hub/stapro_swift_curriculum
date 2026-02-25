const fs = require('fs');
let file = 'src/routes/basic-syntax/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const regex = /<svg[\s\S]*?viewBox="0 0 24 24"[\s\S]*?d="M14\.25 9\.75[\s\S]*?<\/svg>/g;

content = content.replace(regex, (match) => {
    if (match.includes('w-6') || match.includes('h-6')) {
        return '<span class="material-symbols-outlined text-secondary mr-2 text-2xl">terminal</span>';
    } else {
        return '<span class="material-symbols-outlined mr-1 text-[16px]">terminal</span>';
    }
});

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced SVGs successfully');
