const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.match(/\.(svelte|ts|js|md)$/)) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // specific strings
    content = content.replace(/プロジェクト/g, 'アプリ制作');
    
    // Directory paths in imports or URLs
    content = content.replace(/\/project\//g, '/app-creation/');
    content = content.replace(/href="\/project\"/g, 'href="/app-creation"');
    content = content.replace(/href='\/project\'/g, 'href=\'/app-creation\'');
    content = content.replace(/href="\/project/g, 'href="/app-creation');
    content = content.replace(/\/projects\//g, '/app-creation/');
    content = content.replace(/components\/projects/g, 'components/app-creation');
    content = content.replace(/data\/projects/g, 'data/app-creation');
    
    // Identifiers
    content = content.replace(/ProjectSteps/g, 'AppCreationSteps');
    content = content.replace(/ProjectStep/g, 'AppCreationStep');
    content = content.replace(/OriginalAppProject/g, 'OriginalAppCreation');
    content = content.replace(/TimerProject/g, 'TimerAppCreation');
    content = content.replace(/ToDoListProject/g, 'ToDoListAppCreation');
    // Types & Data
    content = content.replace(/\bProject\b/g, 'AppCreation');
    content = content.replace(/\bprojects\b/g, 'appCreations');
    content = content.replace(/\bproject\b/g, 'appCreation');
    content = content.replace(/projectIdList/g, 'appCreationIdList');
    content = content.replace(/stepsByProject/g, 'stepsByAppCreation');

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
