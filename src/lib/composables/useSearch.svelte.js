import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/**
 * セクション検索用のcomposable
 * cheatsheet, components-guide, styling-guideで共通利用
 */

/**
 * 正規表現の特殊文字をエスケープ
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープ済み文字列
 */
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 検索機能を提供するcomposableを作成
 * @param {Array} sections - 検索対象のセクション配列
 * @returns {Object} 検索状態と関数
 */
export function createSearch(sections) {
	// 検索クエリ
	let searchQuery = $state('');

	// デバウンス用のクエリ（実際の検索に使用）
	let debouncedQuery = $state('');
	let debounceTimer = null;

	// 検索結果（非同期で更新）
	let filteredSections = $state(sections);
	let resultCount = $state(sections.reduce((acc, section) => acc + section.codeBlocks.length, 0));
	let isSearching = $state(false);

	// タイトル一致とコード一致を分けて保持
	let titleMatchSections = $state([]);
	let codeMatchSections = $state([]);
	let titleMatchCount = $state(0);
	let codeMatchCount = $state(0);

	// マッチしたcodeBlockのタイトルを保持（検索時のみ）
	const matchedCodeBlocks = new SvelteMap();

	// レンダリングキューとタスクID
	let renderQueue = $state([]);
	let renderTask = null;

	// 前回のクエリを追跡（空→空の無駄な再計算を防ぐ）
	let lastProcessedQuery = '';

	// 検索用インデックスを事前に作成（小文字化済み）
	const searchIndex = sections.map((section) => ({
		id: section.id,
		titleLower: section.title.toLowerCase(),
		descriptionLower: section.description.toLowerCase(),
		// キーワードがあれば結合して検索対象に
		keywordsLower: (section.keywords || []).join(' ').toLowerCase(),
		codeBlocks: section.codeBlocks.map((block) => ({
			titleLower: block.title.toLowerCase(),
			codeLower: block.code.toLowerCase(),
			keywordsLower: (block.keywords || []).join(' ').toLowerCase()
		}))
	}));

	// 単語境界を考慮した検索（英数字のみの場合）
	function matchesQuery(text, query) {
		// 英数字のみのクエリは単語境界で検索
		if (/^[a-zA-Z0-9]+$/.test(query)) {
			// 前が英数字・アンダースコアでない場合にマッチ（単語の先頭一致）
			const escapedQuery = escapeRegex(query);
			// 変更: 後ろの境界チェック(?!)を削除して、"前方一致"を許可する
			// これにより 'Col' で 'Color' がヒットするようになり、かつ 'int' で 'print' はヒットしない
			const regex = new RegExp(`(?<![a-zA-Z0-9_])${escapedQuery}`, 'i');
			return regex.test(text);
		}
		// それ以外（日本語など）は部分一致
		return text.includes(query);
	}

	// 検索処理を実行する関数
	function performSearch(query) {
		const trimmedQuery = query.trim();

		// 同じクエリなら再計算をスキップ
		if (trimmedQuery === lastProcessedQuery) {
			return;
		}
		lastProcessedQuery = trimmedQuery;

		// 進行中のレンダリングがあればキャンセル
		if (renderTask) {
			cancelAnimationFrame(renderTask);
			renderTask = null;
		}

		if (!trimmedQuery) {
			// クエリが空の場合も段階的に全表示（初期表示と同じ負荷分散）
			const allSections = sections;
			resultCount = allSections.reduce((acc, section) => acc + section.codeBlocks.length, 0);
			matchedCodeBlocks.clear();
			titleMatchSections = [];
			codeMatchSections = [];
			titleMatchCount = 0;
			codeMatchCount = 0;

			// 最初のチャンクを表示
			const INITIAL_CHUNK = 20;
			filteredSections = allSections.slice(0, INITIAL_CHUNK);

			// 残りをキューに入れる
			renderQueue = allSections.slice(INITIAL_CHUNK);
			processRenderQueue();
			return;
		}

		const lowerQuery = query.toLowerCase();
		matchedCodeBlocks.clear();

		// タイトル一致とコード一致を分けて収集
		const titleMatches = [];
		const codeMatches = [];
		const titleMatchedSectionIds = new SvelteSet();

		sections.forEach((section, sectionIndex) => {
			const index = searchIndex[sectionIndex];

			// セクションタイトル/説明/キーワードにマッチするか
			const sectionTitleMatches =
				matchesQuery(index.titleLower, lowerQuery) ||
				matchesQuery(index.descriptionLower, lowerQuery) ||
				matchesQuery(index.keywordsLower, lowerQuery);

			// codeBlockのタイトルまたはキーワードにマッチするものを収集（タイトル一致扱い）
			const titleMatchingBlocks = section.codeBlocks.filter((block, blockIndex) => {
				const blockIdx = index.codeBlocks[blockIndex];
				return (
					matchesQuery(blockIdx.titleLower, lowerQuery) ||
					matchesQuery(blockIdx.keywordsLower, lowerQuery)
				);
			});

			// codeBlockのコードにマッチするものを収集（タイトル/キーワード一致を除く）
			const codeMatchingBlocks = section.codeBlocks.filter((block, blockIndex) => {
				const blockIdx = index.codeBlocks[blockIndex];
				// タイトルにもキーワードにもマッチしていない && コードにマッチ
				return (
					!matchesQuery(blockIdx.titleLower, lowerQuery) &&
					!matchesQuery(blockIdx.keywordsLower, lowerQuery) &&
					matchesQuery(blockIdx.codeLower, lowerQuery)
				);
			});

			// セクションタイトル/説明またはcodeBlockタイトルにマッチ → タイトル一致
			if (sectionTitleMatches) {
				titleMatchedSectionIds.add(section.id);
				matchedCodeBlocks.set(section.id, section.codeBlocks.map((b) => b.title));
				titleMatches.push(section);
			} else if (titleMatchingBlocks.length > 0) {
				titleMatchedSectionIds.add(section.id);
				matchedCodeBlocks.set(
					section.id,
					titleMatchingBlocks.map((b) => b.title)
				);
				titleMatches.push({ ...section, codeBlocks: titleMatchingBlocks });
			}

			// コード一致（タイトル一致のセクションは除外）
			if (!titleMatchedSectionIds.has(section.id) && codeMatchingBlocks.length > 0) {
				matchedCodeBlocks.set(
					section.id,
					codeMatchingBlocks.map((b) => b.title)
				);
				codeMatches.push({ ...section, codeBlocks: codeMatchingBlocks });
			}
		});

		// ランキング並び替えロジック
		const calcScore = (text, query) => {
			const t = text.toLowerCase();
			const q = query;
			if (t === q) return 1000; // 完全一致
			if (t.startsWith(q)) return 500 - t.length; // 先頭一致（短い方優先）
			if (t.includes(' ' + q) || t.includes('.' + q) || t.includes('_' + q))
				return 300 - t.length; // 単語境界一致
			return 100 - t.length; // 部分一致
		};

		// タイトル一致のソート
		titleMatches.sort((a, b) => calcScore(a.title, lowerQuery) - calcScore(b.title, lowerQuery)).reverse();

		// コード一致のソート（マッチしたコードブロックの中で最高スコアを使う）
		codeMatches.sort((a, b) => {
			const maxScoreA = Math.max(...a.codeBlocks.map((blk) => calcScore(blk.title, lowerQuery)));
			const maxScoreB = Math.max(...b.codeBlocks.map((blk) => calcScore(blk.title, lowerQuery)));
			return maxScoreB - maxScoreA;
		});

		// 結果を設定
		titleMatchSections = titleMatches;
		codeMatchSections = codeMatches;
		titleMatchCount = titleMatches.reduce((acc, s) => acc + s.codeBlocks.length, 0);
		codeMatchCount = codeMatches.reduce((acc, s) => acc + s.codeBlocks.length, 0);

		// 後方互換性のためfilteredSectionsも更新（タイトル一致 + コード一致）
		const results = [...titleMatches, ...codeMatches];
		resultCount = titleMatchCount + codeMatchCount;

		// 最初のチャンクを表示して即座にレスポンスを返す
		const INITIAL_CHUNK = 10;
		filteredSections = results.slice(0, INITIAL_CHUNK);

		// 残りのアイテムをキューに入れる
		renderQueue = results.slice(INITIAL_CHUNK);

		// 少しずつ残りを表示
		processRenderQueue();
	}

	// キューにあるセクションを少しずつ表示する関数
	function processRenderQueue() {
		if (renderQueue.length === 0) return;

		renderTask = requestAnimationFrame(() => {
			const CHUNK_SIZE = 5; // 1フレームに追加するセクション数
			const nextChunk = renderQueue.slice(0, CHUNK_SIZE);
			renderQueue = renderQueue.slice(CHUNK_SIZE);

			// 配列に追加
			filteredSections = [...filteredSections, ...nextChunk];

			processRenderQueue();
		});
	}

	// 検索クエリの変更を監視（デバウンス + 非同期処理）
	$effect(() => {
		const query = searchQuery;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		// 入力中は検索中表示
		if (query !== debouncedQuery) {
			isSearching = true;
		}

		debounceTimer = setTimeout(() => {
			debouncedQuery = query;
			// 処理を次のマクロタスクに逃がす
			setTimeout(() => {
				performSearch(query);
				isSearching = false;
			}, 0);
		}, 150);

		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			if (renderTask) {
				cancelAnimationFrame(renderTask);
			}
		};
	});

	// 検索をクリア
	function clearSearch() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (renderTask) {
			cancelAnimationFrame(renderTask);
			renderTask = null;
		}

		searchQuery = '';
		debouncedQuery = '';
		isSearching = false;
		matchedCodeBlocks.clear();
		lastProcessedQuery = ''; // リセット時は再計算を許可

		// リセット時も段階表示
		performSearch('');
	}

	return {
		get searchQuery() {
			return searchQuery;
		},
		set searchQuery(value) {
			searchQuery = value;
		},
		get filteredSections() {
			return filteredSections;
		},
		get titleMatchSections() {
			return titleMatchSections;
		},
		get codeMatchSections() {
			return codeMatchSections;
		},
		get titleMatchCount() {
			return titleMatchCount;
		},
		get codeMatchCount() {
			return codeMatchCount;
		},
		get resultCount() {
			return resultCount;
		},
		get isSearching() {
			return isSearching;
		},
		get matchedCodeBlocks() {
			return matchedCodeBlocks;
		},
		clearSearch
	};
}

/**
 * codeBlockのタイトルをIDに変換（URLセーフに）
 * @param {string} sectionId - セクションID
 * @param {string} blockTitle - ブロックタイトル
 * @returns {string} URL安全なID
 */
export function toSafeId(sectionId, blockTitle) {
	const safeTitle = blockTitle
		.replace(/\s+/g, '-')
		.replace(/[()（）]/g, '')
		.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF-]/g, '');
	return `${sectionId}-${safeTitle}`;
}

/**
 * HTMLエスケープ（XSS対策）
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープ済み文字列
 */
function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/**
 * 検索クエリにマッチした部分をハイライト表示用のHTMLに変換
 * @param {string} text - 対象テキスト
 * @param {string} query - 検索クエリ
 * @returns {string} ハイライト付きHTML文字列
 */
export function highlightText(text, query) {
	if (!query || !query.trim()) {
		return escapeHtml(text);
	}

	const lowerQuery = query.toLowerCase();
	const lowerText = text.toLowerCase();
	const escapedText = escapeHtml(text);

	// マッチ箇所を探す
	const index = lowerText.indexOf(lowerQuery);
	if (index === -1) {
		return escapedText;
	}

	// マッチ部分を<mark>タグで囲む
	const before = escapeHtml(text.substring(0, index));
	const match = escapeHtml(text.substring(index, index + query.length));
	const after = highlightText(text.substring(index + query.length), query); // 再帰で複数マッチ対応

	return `${before}<mark class="bg-warning/50 rounded px-0.5">${match}</mark>${after}`;
}
