import componentsData from '$lib/data/components-guide.json';
import cheatsheetData from '$lib/data/cheatsheet.json';
import stylingData from '$lib/data/styling-guide.json';
import glossaryData from '$lib/data/glossary.json';

export interface SearchResult {
	id: string;
	title: string;
	description: string;
	pageTitle: string;
	pagePath: string;
	sectionId: string;
	codeBlockIndex: number;
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
	},
	{
		data: glossaryData,
		title: '用語解説',
		path: '/glossary'
	}
];

export function searchGlobal(query: string): SearchResult[] {
	const normalizedQuery = query.toLowerCase().trim();
	if (!normalizedQuery) return [];

	const results: SearchResult[] = [];

	for (const page of PAGES) {
		for (const section of page.data.sections as Section[]) {
			const sectionMatches =
				section.title.toLowerCase().includes(normalizedQuery) ||
				section.description.toLowerCase().includes(normalizedQuery);

			for (let i = 0; i < section.codeBlocks.length; i++) {
				const block = section.codeBlocks[i];
				let matchType: SearchResult['matchType'] | null = null;
				let score = 0;

				// Check code block title
				if (block.title.toLowerCase().includes(normalizedQuery)) {
					matchType = 'title';
					score = 20;
				}
				// Check keywords
				else if (block.keywords?.some((k) => k.toLowerCase().includes(normalizedQuery))) {
					matchType = 'keyword';
					score = 15;
				}
				// Check code
				else if (block.code.toLowerCase().includes(normalizedQuery)) {
					matchType = 'code';
					score = 5;
				}
				// Section title/description match
				else if (sectionMatches) {
					matchType = 'description';
					score = 10;
				}

				if (matchType) {
					results.push({
						id: `${page.path}-${section.id}-${i}`,
						title: block.title,
						description: `${section.title}`,
						pageTitle: page.title,
						pagePath: page.path,
						sectionId: section.id,
						codeBlockIndex: i,
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

export interface SearchResultDetail {
	sectionTitle: string;
	sectionDescription: string;
	codeBlock: CodeBlock;
}

export function getSearchResultDetail(
	pagePath: string,
	sectionId: string,
	codeBlockIndex: number
): SearchResultDetail | undefined {
	const page = PAGES.find((p) => p.path === pagePath);
	if (!page) return undefined;

	const section = (page.data.sections as Section[]).find((s) => s.id === sectionId);
	if (!section) return undefined;

	const codeBlock = section.codeBlocks[codeBlockIndex];
	if (!codeBlock) return undefined;

	return {
		sectionTitle: section.title,
		sectionDescription: section.description,
		codeBlock
	};
}
