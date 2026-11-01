# 宇邇宮人物事典 — Wikipedia風 Vector 2022 デザイン版

このサイトは独立した創作人物事典です。Wikipedia や Wikimedia Foundation とは関係ありません。

## GitHub Pagesで公開する

1. 本ZIPを解凍し、`index.html` と `assets/` などの**中身全部**をリポジトリ直下にアップロードしてください。
2. GitHub の Settings → Pages → Deploy from a branch → `main` / `(root)` を指定します。
3. 公開先：https://uni-tadayasu.github.io/uninomiyatadayasushinnou.github.io/

## 内容

- 日本語版Wikipediaの現行Vector 2022風UIを参照した独自実装（Wikipediaのプログラムやロゴは使用していません）
- 全10記事、人物情報欄、左目次、記事検索、表示設定、印刷、共有、関連項目
- PCとスマートフォンのレスポンシブ対応
- クリエイティブな人物設定とユーザー指定の生年月日（1996-01-28）
- 宇邇三つ葉の黒色・背景透過PNG
- SEO：各記事のcanonical、JSON-LD、Open Graph、サイトマップ、robots.txt
- 「編集」リンクはGitHubに移動します。ブラウザ上で直接編集・アカウント作成できるWikipedia本体の機能はありません。

## SEOについて

サイトマップ：https://uni-tadayasu.github.io/uninomiyatadayasushinnou.github.io/sitemap.xml
検索エンジンへの表示・上位表示は保証できません。

## 公開と画像の取り扱い

Wikipediaのロゴ、商標、公式文言を装いません。家紋「宇邇三つ葉」はご提供画像の黄色部分を透明化し、黒色部分の形状を維持しています。

## ファイル構成

`index.html` が入口。記事ページは同じ階層、共有資源は`assets/`フォルダーです。

## 宇邇三つ葉について

- 元画像：ユーザー提供の1254×1254ピクセル（黒＋黄）
- 加工版：黄色領域を透明化、黒色の意匠を保持（PNG、アルファ付き）
- `assets/uni-mitsuba-transparent.png`：フル解像度の透過版
- 情報欄、検索ページ、家紋解説、共有画像、サイトアイコンに反映済み
