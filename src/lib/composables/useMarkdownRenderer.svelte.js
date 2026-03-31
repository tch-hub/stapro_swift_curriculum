// マークダウンレンダリングロジックを管理するcomposable
import { marked } from 'marked';

/**
 * Mark downのコンテンツをレンダリング可能な形に処理する
 * @param {string} content - マークダウンコンテンツ
 * @param {string} baseUrl - 画像やリンクのベースURL
 * @returns {Object} - 処理済みのトークンとレンダリング関数
 */
export function useMarkdownRenderer(content, baseUrl = '') {
	const parserOptions = { headerIds: false };
	const showcaseKeyword = '完成イメージ';
	const showcaseClassName = 'lesson-showcase-image';

	/**
	 * URLをbaseで正規化する
	 */
	function normalizeUrlWithBase(url) {
		if (!url) return url;
		if (baseUrl && url.startsWith('/')) {
			const normalizedBase = (baseUrl || '').replace(/\/$/, '');
			return `${normalizedBase}${url}`;
		}
		return url;
	}

	/**
	 * マークダウントークンをHTMLレンダリング可能な形に処理する
	 */
	function processTokens(tokens) {
		return tokens
			.filter((token) => token.type !== 'space')
			.map((token) => {
				// コードブロックの処理
				if (token.type === 'code') {
					let fileName = '';
					let lang = token.lang || 'swift';
					let meta = token.meta || '';

					// langに空白が含まれている場合、メタデータとして扱う
					const spaceIndex = lang.indexOf(' ');
					if (spaceIndex !== -1) {
						meta = lang.slice(spaceIndex + 1) + (meta ? ' ' + meta : '');
						lang = lang.slice(0, spaceIndex);
					}

					if (meta) {
						const titleMatch = meta.match(/title="([^"]+)"/);
						if (titleMatch) {
							fileName = titleMatch[1];
						}
					}

					return {
						type: 'code',
						code: token.text,
						language: lang,
						fileName
					};
				}

				// GitHubスタイルアラート (Callouts) の処理
				if (token.type === 'blockquote') {
					// 引用符(>)を取り除いた中身のテキストを取得
					const rawText = token.raw.replace(/^>\s?/gm, '').trim();
					// [!NOTE] などのパターンをチェック
					const alertMatch = rawText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

					if (alertMatch) {
						const type = alertMatch[1].toUpperCase();
						// アラートの見出し部分を取り除いたコンテンツを取得
						const alertContentRaw = rawText.replace(
							/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i,
							''
						);
						// コンテンツをMarkdownとしてパース
						const alertHtml = marked.parse(alertContentRaw, parserOptions);

						// タイプに応じたアイコンとクラスの設定
						const config = {
							NOTE: { icon: 'info', class: 'note' },
							TIP: { icon: 'lightbulb', class: 'tip' },
							IMPORTANT: { icon: 'priority_high', class: 'important' },
							WARNING: { icon: 'warning', class: 'warning' },
							CAUTION: { icon: 'report', class: 'caution' }
						};
						const { icon, class: typeClass } = config[type] || config.NOTE;

						const html = `
<div class="alert-callout alert-callout-${typeClass}">
	<div class="alert-callout-header">
		<span class="material-symbols-outlined">${icon}</span>
		<span>${type}</span>
	</div>
	<div class="prose prose-sm max-w-none">
		${alertHtml}
	</div>
</div>`;
						return { type: 'html', html };
					}
				}

				let html = marked.parse(token.raw, parserOptions);

				if (baseUrl) {
					const normalizedBase = (baseUrl || '').replace(/\/$/, '');
					html = html.replace(/(src|href)=(['"])\/(?!\/)([^'"]*)/g, (m, attr, q, rest) => {
						return `${attr}=${q}${normalizedBase}/${rest}`;
					});
					html = html.replace(/url\((['"]?)\/(?!\/)([^)'"]*)\)/g, (m, q, rest) => {
						return `url(${q}${normalizedBase}/${rest})`;
					});
				}

				return {
					type: 'html',
					html
				};
			});
	}

	/**
	 * 「## 練習問題」セクションを見つけるヘルパー関数
	 */
	function findPracticeIndex(tokens) {
		return tokens.findIndex(
			(t) => t.type === 'heading' && t.depth === 2 && t.text.trim() === '練習問題'
		);
	}

	/**
	 * 「### ヒント」セクションを見つけるヘルパー関数
	 */
	function findHintIndex(tokens) {
		return tokens.findIndex(
			(t) => t.type === 'heading' && t.depth === 3 && t.text.trim() === 'ヒント'
		);
	}

	/**
	 * 「### 解答例」セクションを見つけるヘルパー関数
	 */
	function findAnswerIndex(tokens) {
		return tokens.findIndex(
			(t) => t.type === 'heading' && t.depth === 3 && t.text.trim() === '解答例'
		);
	}

	// マークダウントークンをパース
	const parsedTokens = content ? marked.lexer(content, parserOptions) : [];

	// タイトルを除外したトークン
	const tokensWithoutTitle = (() => {
		if (!parsedTokens.length) return parsedTokens;
		const [firstToken, ...restTokens] = parsedTokens;
		if (firstToken.type === 'heading' && firstToken.depth === 1 && firstToken.text.trim()) {
			return restTokens;
		}
		return parsedTokens;
	})();

	// メインコンテンツ（「## 練習問題」前）
	const practiceIndex = findPracticeIndex(tokensWithoutTitle);
	const mainTokens =
		practiceIndex !== -1 ? tokensWithoutTitle.slice(0, practiceIndex) : tokensWithoutTitle;

	// 練習問題コンテンツ（「## 練習問題」から「### 解答例」または「### ヒント」前まで）
	const restTokens = practiceIndex !== -1 ? tokensWithoutTitle.slice(practiceIndex + 1) : [];
	const hintIndex = findHintIndex(restTokens);
	const answerIndex = findAnswerIndex(restTokens);

	let practiceEndIndex = restTokens.length;
	if (hintIndex !== -1 && (answerIndex === -1 || hintIndex < answerIndex)) {
		practiceEndIndex = hintIndex;
	} else if (answerIndex !== -1) {
		practiceEndIndex = answerIndex;
	}
	const practiceTokens = restTokens.slice(0, practiceEndIndex);

	// ヒントコンテンツ（「### ヒント」から「### 解答例」前まで）
	let hintTokens = [];
	if (hintIndex !== -1) {
		let hintEndIndex = answerIndex !== -1 && answerIndex > hintIndex ? answerIndex : restTokens.length;
		hintTokens = restTokens.slice(hintIndex + 1, hintEndIndex);
	}

	// 解答例コンテンツ（「### 解答例」以降）
	const answerTokens = answerIndex !== -1 ? restTokens.slice(answerIndex + 1) : [];

	// レンダリング済みブロック
	const renderedBlocks = processTokens(mainTokens);
	const practiceBlocks = processTokens(practiceTokens);
	const hintBlocks = processTokens(hintTokens);
	const answerBlocks = processTokens(answerTokens);

	/**
	 * 練習問題ブロックから最初の画像を抽出
	 */
	function extractPracticeImage() {
		// tokenから直接探す
		for (const token of practiceTokens) {
			if (token.type === 'image') {
				return {
					url: normalizeUrlWithBase(token.href),
					alt: token.text || ''
				};
			}
			// 段落内などのインライン画像
			if (token.tokens) {
				const imgToken = token.tokens.find((t) => t.type === 'image');
				if (imgToken) {
					return {
						url: normalizeUrlWithBase(imgToken.href),
						alt: imgToken.text || ''
					};
				}
			}
		}

		// HTMLパース後のブロックから探す
		for (const block of practiceBlocks) {
			if (block.type === 'html' && block.html.includes('<img')) {
				const srcMatch = block.html.match(/src=['"]([^'"]+)['"]/i);
				if (srcMatch) {
					const altMatch = block.html.match(/alt=['"]([^'"]*)['"]/i);
					return {
						url: srcMatch[1],
						alt: altMatch ? altMatch[1] : ''
					};
				}
			}
		}

		return null;
	}

	/**
	 * 単独の語像のみのHTMLを除外し、画像タグを削除したHTMLを返す
	 */
	function createDisplayPracticeBlocks(blocks) {
		return blocks
			.filter((block) => {
				if (block.type === 'html') {
					const textOnly = block.html
						.replace(/<img[^>]*>/gi, '')
						.replace(/<[^>]*>/g, '')
						.trim();

					if (block.html.toLowerCase().includes('<img') && textOnly === '') {
						return false;
					}
				}
				return true;
			})
			.map((block) => {
				if (block.type === 'html' && block.html.toLowerCase().includes('<img')) {
					return {
						...block,
						html: block.html.replace(/<img[^>]*>/gi, '')
					};
				}
				return block;
			});
	}

	const practiceImageInfo = extractPracticeImage();

	return {
		// トークンとブロック
		parsedTokens,
		tokensWithoutTitle,
		mainTokens,
		practiceTokens,
		hintTokens,
		answerTokens,
		renderedBlocks,
		practiceBlocks,
		hintBlocks,
		answerBlocks,

		// ヘルパー関数
		processTokens,
		normalizeUrlWithBase,
		createDisplayPracticeBlocks,

		// 抽出済み情報
		practiceImageInfo,
		practiceImage: practiceImageInfo?.url ?? null,
		practiceImageAlt: practiceImageInfo?.alt || '練習問題の完成イメージ',
		practiceImageClass: practiceImageInfo?.alt.includes(showcaseKeyword) ? showcaseClassName : '',
		hasPractice: practiceTokens.length > 0,
		hasHint: hintTokens.length > 0,
		hasAnswer: answerTokens.length > 0
	};
}
