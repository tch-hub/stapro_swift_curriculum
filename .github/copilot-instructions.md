# Copilot 指示書: 中学生向けswift学習用カリキュラム

## 【最重要】必ず従うべき指示

- コメントは日本語で記述すること
- 文字列は常にダブルクォートを使用すること

# 技術スタック

- SvelteKit 2.16.0
- svelte 5.0.0
- daisyUI

# Svelteの注意点

- `on:click`ではなく、`onclick`を使う
- `C:\svelte\compornent\.github\llms-full.txt`をもとにコードを生成する
- リアクティブな値の管理には`let`を使用する
- 不変の定数には`const`を使用する
- 複雑な状態管理が必要な場合はRunesを使用する
- GitHub Pagesでのデプロイを考慮して、ルーティングは`{base}/`から始めること
- 各ページの先頭に`<script>`タグを追加し、`import {base} from '$app/paths';`を記述すること
- 進捗機能は作らないでください
- アクセシビリティの警告は無視してください
