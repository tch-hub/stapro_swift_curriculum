import componentsData from '$lib/data/components-guide.json';
import cheatsheetData from '$lib/data/cheatsheet.json';
import stylingData from '$lib/data/styling-guide.json';

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    pageTitle: string;
    pagePath: string;
    sectionId: string;
    matchType: 'title' | 'keyword' | 'code' | 'description';
    score: number;
}

export interface Section {
    id: string;
    title: string;
    description: string;
    codeBlocks: CodeBlock[];
    afterHtml?: string;
}

interface CodeBlock {
    title: string;
    code: string;
    keywords?: string[];
    description?: string;
}

const PAGES = [
    {
        data: componentsData,
        title: 'コンポーネントガイド',
        path: '/components-guide'
    },
    {
        data: cheatsheetData,
        title: 'swiftガイド',
        path: '/cheatsheet'
    },
    {
        data: stylingData,
        title: 'スタイリングガイド',
        path: '/styling-guide'
    }
];

export function searchGlobal(query: string): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    const results: SearchResult[] = [];

    for (const page of PAGES) {
        for (const section of page.data.sections as Section[]) {
            // Search in section info
            if (section.title.toLowerCase().includes(normalizedQuery) || 
                section.description.toLowerCase().includes(normalizedQuery)) {
                results.push({
                    id: `${page.path}-${section.id}`,
                    title: section.title,
                    description: section.description,
                    pageTitle: page.title,
                    pagePath: page.path,
                    sectionId: section.id,
                    matchType: 'title', // simplistic
                    score: 10
                });
            }

            // Search in code blocks
            for (const block of section.codeBlocks) {
                let matchType: SearchResult['matchType'] | null = null;
                let score = 0;

                // Check title
                if (block.title.toLowerCase().includes(normalizedQuery)) {
                    matchType = 'title';
                    score = 20;
                }
                // Check keywords
                else if (block.keywords?.some(k => k.toLowerCase().includes(normalizedQuery))) {
                    matchType = 'keyword';
                    score = 15;
                }
                // Check code
                else if (block.code.toLowerCase().includes(normalizedQuery)) {
                    matchType = 'code';
                    score = 5;
                }

                if (matchType) {
                    results.push({
                        id: `${page.path}-${section.id}-${block.title}`,
                        title: block.title,
                        description: `In ${section.title}`,
                        pageTitle: page.title,
                        pagePath: page.path,
                        sectionId: section.id,
                        matchType,
                        score
                    });
                }
            }
        }
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
}

export function getSearchResultDetail(pagePath: string, sectionId: string): Section | undefined {
    // Find the correct page data
    const page = PAGES.find(p => p.path === pagePath);
    if (!page) return undefined;

    // Find the section within that page
    const section = (page.data.sections as Section[]).find(s => s.id === sectionId);
    return section;
}
