import fs from 'fs';

const cheatsheetPath = 'src/lib/data/cheatsheet.json';
const componentsPath = 'src/lib/data/components-guide.json';
const stylingPath = 'src/lib/data/styling-guide.json';
const glossaryPath = 'src/lib/data/glossary.json';

const cheatsheet = JSON.parse(fs.readFileSync(cheatsheetPath, 'utf8'));
const components = JSON.parse(fs.readFileSync(componentsPath, 'utf8'));
const styling = JSON.parse(fs.readFileSync(stylingPath, 'utf8'));
const glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));

// A: Move ForEach
const foreachIdx = cheatsheet.sections.findIndex(s => s.id === "swiftui-foreach");
if (foreachIdx !== -1) {
    const foreachSection = cheatsheet.sections.splice(foreachIdx, 1)[0];
    const compDataIdx = components.sections.findIndex(s => s.id === "data");
    components.sections.splice(compDataIdx + 1, 0, foreachSection);
}

// B: Move trimmingCharacters
const gloTypes = glossary.sections.find(s => s.id === "types");
if (gloTypes) {
    const trimIdx = gloTypes.codeBlocks.findIndex(c => c.title.includes("trimmingCharacters"));
    if (trimIdx !== -1) {
        const trimBlock = gloTypes.codeBlocks.splice(trimIdx, 1)[0];
        cheatsheet.sections.find(s => s.id === "useful-functions").codeBlocks.push(trimBlock);
    }
}

// C: Remove Sorted
const gloBasics = glossary.sections.find(s => s.id === "swift-basics");
if (gloBasics) {
    const sortedIdx = gloBasics.codeBlocks.findIndex(c => c.title.includes("並べ替え (Sorted)"));
    if (sortedIdx !== -1) {
        gloBasics.codeBlocks.splice(sortedIdx, 1);
    }
}

// D: Move onSubmit
const gloSwBasics = glossary.sections.find(s => s.id === "swiftui-basics");
if (gloSwBasics) {
    const onSubIdx = gloSwBasics.codeBlocks.findIndex(c => c.title.includes("onSubmit"));
    if (onSubIdx !== -1) {
        const onSubBlock = gloSwBasics.codeBlocks.splice(onSubIdx, 1)[0];
        styling.sections.find(s => s.id === "interactive").codeBlocks.push(onSubBlock);
    }
}

// E: Move Vertical / Horizontal
if (gloSwBasics) {
    const vertHorIdx = gloSwBasics.codeBlocks.findIndex(c => c.title.includes("Vertical / Horizontal"));
    if (vertHorIdx !== -1) {
        const vertHorBlock = gloSwBasics.codeBlocks.splice(vertHorIdx, 1)[0];
        styling.sections.find(s => s.id === "layout").codeBlocks.push(vertHorBlock);
    }
}

// F: Remove Spacer
const styLayout = styling.sections.find(s => s.id === "layout");
if (styLayout) {
    const spacerIdx = styLayout.codeBlocks.findIndex(c => c.title.includes("Spacer("));
    if (spacerIdx !== -1) {
        styLayout.codeBlocks.splice(spacerIdx, 1);
    }
}

// G: Move Menu
const styInteractive = styling.sections.find(s => s.id === "interactive");
if (styInteractive) {
    const menuIdx = styInteractive.codeBlocks.findIndex(c => c.title.includes("Menu - メニューボタン"));
    if (menuIdx !== -1) {
        const menuBlock = styInteractive.codeBlocks.splice(menuIdx, 1)[0];
        components.sections.find(s => s.id === "basic").codeBlocks.push(menuBlock);
    }
}

fs.writeFileSync(cheatsheetPath, JSON.stringify(cheatsheet, null, '\t') + '\n');
fs.writeFileSync(componentsPath, JSON.stringify(components, null, '\t') + '\n');
fs.writeFileSync(stylingPath, JSON.stringify(styling, null, '\t') + '\n');
fs.writeFileSync(glossaryPath, JSON.stringify(glossary, null, '\t') + '\n');

console.log("Refactoring complete");
