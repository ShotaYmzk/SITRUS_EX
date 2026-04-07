# SITRUS EX

**Version 2.0.0**

芝浦工業大学の履修登録システム（SITRUS）の公式 UI は出来が悪く使いづらい——Chrome 拡張（Extension）で見た目と操作を底上げする「超 EX」版。**大学非公式。**

**リポジトリ:** [github.com/ShotaYmzk/SITRUS_EX](https://github.com/ShotaYmzk/SITRUS_EX)

## 機能

### ログイン画面

- **Glassmorphism** デザインのログインカード
- タイトル **SITRUS** に [Montserrat](https://fonts.google.com/specimen/Montserrat) Black（900）を適用
- 「認証開始」ボタンは**太字**＋ガラス質ピル型
- キャンパス写真の全画面背景スライドショー（5 秒ごと自動切替）
- 学生はワンクリックで認証開始（入力欄なし）
- 教職員用の学籍番号入力はトグルで折りたたみ

### ダッシュボード

- **テーマシステム** — Apple / Stripe / Linear の 3 テーマ
- ナビバーの歯車アイコンからテーマ選択、`chrome.storage.local` に保存
- ナビバーにグラス風ボタン、サイドバーに SVG アイコン
- ag-Grid・モーダル等をテーマ対応
- 右下にバージョンバッジ表示

## インストール（開発用）

1. [リポジトリを clone](https://github.com/ShotaYmzk/SITRUS_EX.git) または ZIP をダウンロード
2. Chrome で `chrome://extensions` を開く
3. **デベロッパーモード** を ON
4. **パッケージ化されていない拡張機能を読み込む** で、このフォルダ（`manifest.json` がある階層）を選択

## Chrome Web Store に公開する場合

1. **ZIP 作成** — プロジェクトルートの内容を ZIP にする（`manifest.json` が ZIP の直下にあること）。`.git` は含めない。
2. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) で新しいアイテムを作成し ZIP をアップロード。
3. **ストア掲載用アセット**
   - 説明文・短い概要（日本語可）
   - スクリーンショット（1280×800 または 640×400 推奨）を複数枚
   - 小プロモーション タイル（任意）
   - **プライバシーに関する取り扱い** — `storage` 用途は [PRIVACY.md](./PRIVACY.md) に記載。審査では「データの収集」で **ユーザーデータを収集しない** とし、必要なら GitHub 上の PRIVACY.md の URL を「プライバシーポリシーの URL」に設定（例: `https://github.com/ShotaYmzk/SITRUS_EX/blob/main/PRIVACY.md`）。
4. **アイコン** — `assets/icons/icon-128x128.png` をストア用に使用。512px 版は `icon-512x512.png`。
5. 審査通過後に公開。

詳細は [Chrome Web Store の公開ガイド](https://developer.chrome.com/docs/webstore/publish/) を参照。

## ファイル構成

```
SITRUS_EX2/
├── manifest.json
├── sitrus-login-inject.css / .js
├── sitrus-dashboard-inject.css / .js
├── PRIVACY.md              … ストア審査・ユーザー向けプライバシー
├── assets/icons/           … 拡張アイコン（16 / 48 / 128 / 512）
├── assets/images/          … ログイン背景スライドショー
├── README.md
└── LICENSE
```

## テーマの切り替え

ダッシュボードのナビバー右端の **歯車アイコン** からテーマを選ぶと、端末内に保存され次回も維持されます。

## 技術

- Manifest V3、`content_scripts`、`chrome.storage.local`
- CSS カスタムプロパティによるテーマ、Glassmorphism

## 注意事項

- **大学非公式**です。芝浦工業大学・情報システム部とは無関係です。
- SITRUS の仕様変更で動作しなくなる可能性があります。
- 認証・成績データには一切関与しません（見た目の変更のみ）。
- 利用に起因する問題について作者は責任を負いません。

## ライセンス

[MIT License](./LICENSE)
