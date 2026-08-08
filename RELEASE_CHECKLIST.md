# 公開までのタスクチェックリスト

「英語名言 日めくりカレンダー」をApp Storeに出すまでにやることの全体像と、それぞれの詳細手順。チェックが付いていない項目は全部未対応。

凡例：**[要ユーザー]** は開発者本人にしかできない作業（アカウント登録・支払い・実機での確認など）。**[Claude可]** はコードやドキュメントとして自分（Claude）が引き続き手伝える作業。

---

## 1. Apple Developer アカウント周り 【要ユーザー】

- [x] **Apple Developer Program に登録する**（個人登録、Active）
- [x] **Team ID を確認する**
- [x] **`app.json` の `ios.appleTeamId` に Team ID を追加する**
- [x] **`app.json` の `ios.bundleIdentifier` / `android.package` を本番用の値に変更する**
  - `com.gyudonmaru.engdaily` に決定・反映済み
  - この値は**あとから変更できない**（Bundle IDは一度公開すると変更不可）ので、App Store Connect でアプリを登録するときも同じ文字列を使うこと

## 2. アセット（アイコン・スプラッシュ・スクリーンショット）

- [x] **アプリアイコンをデザインする**
  - Modernist のトークン（紙の地 #f3f2f2・赤いマージン罫線 #ec3013）と Archivo ExtraBold の「A」を組み合わせたものを `assets/` に生成済み
  - `scripts/generate-icons.mjs` で再生成できる（デザインを変えたくなったらこのスクリプトを編集して再実行）。実行には `npm install --no-save sharp opentype.js` が必要
  - `icon.png` はアルファチャンネルなしで出力済み（Appleは透過を含むアイコンを弾く）。Android用のアダプティブアイコン各種・favicon も同時生成される
  - 60px まで縮めても赤い罫線と A が判別できることを確認済み
- [x] **スプラッシュ画面用の画像を差し替える**
  - `assets/splash-icon.png` を同じデザインで生成済み
  - [ ] 背景色や配置を細かく調整したい場合は `app.json` に `splash` 設定を追加する（今は `expo-splash-screen` のデフォルト＝中央にアイコン）
- [ ] **App Store 掲載用スクリーンショットを撮影する** **[要ユーザー]**
  - 6.9インチ（**1260 × 2736 px** 縦向き。iPhone 16/17 Pro Max、iPhone Air 等）が主要サイズ。これを出しておけば他サイズは自動で縮小されて使われる
  - 1〜10枚アップロード可能。**アルファチャンネル（透過）を含む画像は不可**
  - 実機か Xcode の iOS シミュレータで撮影（シミュレータなら `Cmd+S` でスクショ保存）。Mac がない場合は EAS Build → TestFlight → 実機インストール → 実機で直接スクリーンショットを撮る流れになる
  - 5〜10枚が目安。ホーム画面・アーカイブ・お気に入り・設定・シェアシートなど機能が伝わるものを選ぶ
- [ ] （任意）プレビュー動画を用意する。必須ではないので後回しでよい

## 3. 広告（AdMob） 【要ユーザー】

- [x] `react-native-google-mobile-ads` の組み込み・バナー広告の設置
- [x] **AdMob アカウントを作成し、アプリを登録してアプリID・広告ユニットIDを取得する**
- [x] **`app.json` の `iosAppId` を実IDに差し替える**（`ca-app-pub-8619552988214526~7688182625`）
- [x] **`src/utils/ads.native.ts` の `BANNER_AD_UNIT_ID` を実IDに差し替える**（`ca-app-pub-8619552988214526/8570019455`。開発ビルドでは `__DEV__` 判定で自動的にテストIDへフォールバックするので、開発中に実際の広告をクリックしてしまう心配はない）
- [ ] **AdMob管理画面でも「児童向けタグ」が付いていないか確認する**
  - コード側（`tagForChildDirectedTreatment: false`）は設定済み。管理画面のアプリ設定で「主に児童向けアプリですか？」に「いいえ」で回答されているか一度見ておくと確実
- [x] **SKAdNetworkItems のリストを最新版に差し替えた**（Google公式ドキュメントの50件を反映済み。次のビルドから有効）
  - リストは今後Googleが随時更新する可能性がある。数ヶ月に一度、[このページ](https://developers.google.com/admob/ios/privacy/strategies)と見比べておくと安心
- [ ] **プライバシーマニフェスト（`ios.privacyManifests`）を設定するか検討する** ⚠️ 未対応
  - Expo は `app.json` の `ios.privacyManifests` から `PrivacyInfo.xcprivacy` を生成できるが、今は未設定
  - 使用中のライブラリのうち、データに触れる `@react-native-async-storage/async-storage` と `react-native-view-shot` は**それぞれ自前のマニフェストを同梱している**ので、required-reason API 部分は概ねカバーされている見込み
  - 一方 **`NSPrivacyTracking` / `NSPrivacyTrackingDomains`（トラッキング申告）はアプリ側の責任**。ATT を使って広告を出す以上、ここの設定は検討が必要
  - ただし `NSPrivacyTrackingDomains` に挙げたドメインは、ATT拒否時に iOS が通信をブロックするため、**間違ったドメインを書くと広告配信が壊れる**。推測で書かず、Google のドキュメントを確認した上で設定すること
- [ ] ID差し替え後、**ネイティブビルドを作り直す**（JSだけの変更では反映されない。development/preview ビルドで自動的に反映される）
- [ ] 実機で広告が実際に表示されることを確認する

## 4. 法務（利用規約・プライバシーポリシー）

- [x] 利用規約・プライバシーポリシーの草案作成（アプリ内画面 + `docs/privacy.html`）
- [x] **内容をレビューして精度を上げた**
  - AdMobの実際のデータ収集内容の明記、「個人情報を収集しない」とAdMobのデータ処理の混同を分離、免責範囲を「法令上認められる範囲で」に限定、準拠法の見出し不整合を修正、子ども向けでない旨を明確化、公開ページから「草案です」の注記を削除、など
  - 専門家（弁護士等）による正式レビューはまだ。広告SDKを使うアプリとしては水準に達しているはずだが、心配なら念のため一度目を通してもらうと安心
- [x] **連絡先メールアドレスを専用のものに切り替えた**
  - `gyudonmaru.app@gmail.com`（アプリ公開用に新規取得）に統一。`src/screens/LegalScreen.tsx`・`docs/privacy.html`・`docs/support.html` すべて反映済み
  - 今後の他アプリでも使い回せる。ドメインを取って `contact@独自ドメイン` に発展させるのは、必要になってからでいい
- [x] **GitHub Pages で公開できる形に配置済み**
  - `docs/` に3ページ用意した（GitHub Pages の標準UIは「ブランチのルート」か「`/docs`」しか公開元に選べないため、`docs/` に置いてある）
    - `docs/index.html`：アプリ紹介（マーケティングURL用）
    - `docs/privacy.html`：利用規約・プライバシーポリシー（**プライバシーポリシーURL用**）
    - `docs/support.html`：サポート・FAQ・問い合わせ先（**サポートURL用**）
- [x] GitHub にプッシュ済み（`https://github.com/gyudonmaruapp-cpu/eng_daily`、Public）
- [x] **GitHub Pages を公開済み**（`main` / `/docs`、3ページとも200 OKで応答確認済み）
  - アプリ紹介: <https://gyudonmaruapp-cpu.github.io/eng_daily/>
  - プライバシーポリシー: <https://gyudonmaruapp-cpu.github.io/eng_daily/privacy.html>
  - サポート: <https://gyudonmaruapp-cpu.github.io/eng_daily/support.html>
- [ ] 上記URLを App Store Connect の「プライバシーポリシーURL」「サポートURL」欄に入力する（`STORE_LISTING.md` に反映済み）

## 5. iOS ウィジェット（WidgetKit）

- [x] ウィジェットのコード実装（`targets/widget/`、SwiftUI）
- [ ] **実際にビルドして初めて見た目を確認する** **[要ユーザー]**
  - **Macは無くても大丈夫**：EAS Build がクラウド上でネイティブビルド（ウィジェット込み）を行い、Xcodeなしで `.ipa` が生成できる
  - 流れ：`eas build -p ios --profile preview` → ビルド完了後 TestFlight（内部テスト）配布 → 自分のiPhoneにインストール → ホーム画面にウィジェットを追加して確認、という手順で完結する
  - Macを持っている／借りられる場合は `npx expo prebuild -p ios --clean` → `xed ios` で Xcode を開き、シミュレータで素早く確認・調整できる（開発サイクルが速い）
- [ ] レイアウト・文字サイズなど、実機で見た結果に応じて調整する（**Claude可**、フィードバックをもらえれば `targets/widget/widgets.swift` を修正する）

## 6. 実機テスト 【要ユーザー】

現状、動作確認は TypeScript の型チェックと Web バンドルのエクスポートのみ。実機・シミュレータでは一度も動かしていない。特に **AdMob・ウィジェット・通知の一部はネイティブコードを含むため Expo Go では動作せず、development build が必要。**

- [x] `expo-dev-client` を導入済み（development build に必須、これが無いとビルド自体が拒否される）
- [x] EAS の証明書・プロビジョニングプロファイルをセットアップ済み（本体・ウィジェット両方のBundle ID分。デバイス登録も完了）
- [x] `npm ci` がビルドサーバー上で失敗する問題を修正済み（`@expo/require-utils` のバージョン不整合が原因、`package.json` に `overrides` を追加して解決）
- [ ] **development build を作る**（Expo Go の代わりに、このアプリ専用のネイティブモジュール込みインストーラ）
  ```sh
  eas build -p ios --profile development
  ```
  `eas.json` の `development` プロファイルは既に用意済み（`developmentClient: true`）。前回の試行は上記の `npm ci` 問題で失敗しているので、**再実行が必要**
- [ ] ビルドしたdevelopment buildを実機にインストールし、`npx expo start --dev-client` でJS側をつないで開発・確認する（コード変更のたびにネイティブビルドし直さなくてよい）
- [ ] 全画面を一通り触る（ホーム/アーカイブ/お気に入り/設定/シェア）
- [ ] 通知：設定画面で時刻を変更 → 実際にその時刻に通知が届くか確認（許可ダイアログが出るはず）
- [ ] 名言カードの画像保存：シェアシート →「画像として保存」→ 写真アプリに保存されるか確認
- [ ] シェア機能：X / LINE / Instagram / その他 の各ボタンが実機で正しく起動するか確認（LINE/Xは対象アプリが端末に入っていないとブラウザにフォールバックする点も要確認）
- [ ] 広告バナーが表示されるか確認（テストID段階でも表示はされるはず）
- [ ] ウィジェットの追加・表示・日付が変わったときの更新を確認
- [ ] フォントサイズ（S/M/L）切り替えが全画面に反映されるか確認
- [ ] アーカイブが「実際に開いた日だけ」正しく積み上がるか、複数日にまたがって確認（日付を跨ぐ必要があるので数日がかりになる。急ぐ場合は端末の日付を手動で変えてテストする手もある）
- [ ] 友人・家族など数人に **TestFlight** で触ってもらう（内部テスト・外部テスト。App Store Connect側でテスターのメールアドレスを登録する）

## 7. App Store Connect 提出準備 【要ユーザー】

App Store Connect（[appstoreconnect.apple.com](https://appstoreconnect.apple.com)）でアプリを新規作成してから入力する項目。

- [x] **掲載文の下書きを用意した** → `STORE_LISTING.md`
  - アプリ名・サブタイトル・プロモーションテキスト・説明文・キーワード・カテゴリ・What's New まで、そのまま貼れる形。文字数はすべて上限内であることを実測確認済み
  - [ ] 内容を読んで、表現の好みを直す **[要ユーザー]**
- [x] サポートURL用のページを用意した（`docs/support.html`。FAQ＋問い合わせ先）
- [x] （任意）マーケティングURL用のページを用意した（`docs/index.html`）
- [ ] **年齢レーティング質問票に回答する**（Kids Categoryには申請しない前提。広告の有無・ユーザー生成コンテンツの有無などを問われる）
- [ ] **App Privacy（データ収集の申告＝プライバシーの「栄養成分表示」）に回答する**
  - AdMobが収集する「デバイス識別子（広告向け）」「使用状況データ」等を、Appleの分類に沿って正確に申告する必要がある。ここで実態と違う申告をすると審査で弾かれる、または後から指摘される
  - **申告内容の対応表を `STORE_LISTING.md` にまとめてある**（どの項目をどう答えるか）
  - 参考: [App Privacy Details on the App Store](https://developer.apple.com/app-store/app-privacy-details/)
- [ ] **IDFA（広告識別子）の使用を申告する**
  - 提出フォームに「このアプリは広告識別子（IDFA）を使用しますか？」という項目がある。AdMobを入れている以上 **「はい」** で、用途として「アプリ内で広告を配信する」にチェックする
  - ここを「いいえ」で出すと、SDKがIDFAに触れていることが検出されて**差し戻しの典型パターン**になる
- [ ] **コンテンツ権利（Content Rights）の申告に回答する**
  - 「第三者のコンテンツを含む/表示するか？」という質問がある。このアプリは実在の人物に帰属する名言を表示するため、**ここは正直に検討が必要**
  - 収録しているのはことわざ、および没後長期間経過した人物の言葉（パブリックドメイン想定）に絞ってある。この方針を説明できるようにしておくと、万一問い合わせが来ても対応しやすい（`src/data/quotes.ts` の事実確認の経緯は git log に残っている）
- [ ] 価格（無料想定）・対応国・対応言語を設定する
  - **プライマリ言語は日本語**。UIも名言の解説も日本語のみなので、英語ローカライズは今のところ無い
- [ ] **輸出コンプライアンス（暗号化）の申告**
  - [x] `app.json` に `ITSAppUsesNonExemptEncryption: false` を設定済み。標準のHTTPS通信しか使っていないため（独自の暗号化実装なし）
  - これを設定しておくと、TestFlight配信・提出のたびに毎回聞かれる質問を省略できる
- [ ] ビルドをアップロード後、そのビルドに紐づけて審査に提出する

## 8. ビルド・提出

```sh
npm install -g eas-cli
eas login
eas build:configure                     # 初回のみ（ios.appleTeamId 未設定なら先に app.json へ）
eas build -p ios --profile development  # 実機テスト用（Expo Goの代わり）
eas build -p ios --profile preview      # TestFlight内部配布・スクショ撮影用
eas build -p ios --profile production   # 本番提出用
eas submit -p ios                       # App Store Connect へアップロード
```

- [x] `eas login` / `eas init` / `eas build:configure` を実行済み（Expoプロジェクト作成・iOS証明書とプロビジョニングプロファイル生成・デバイス登録まで完了）
- [ ] development ビルドで実機テスト（セクション6）— 直近の試行は `npm ci` の失敗でエラー、原因は修正済みなので再実行が必要
- [ ] preview ビルドで TestFlight 内部配布・スクリーンショット撮影
- [ ] production ビルドを作成する（`eas.json` の `production` プロファイルは `autoIncrement: true` でビルド番号を自動採番する設定済み）
- [ ] `eas submit -p ios` で App Store Connect にアップロードする（Apple IDのApp用パスワード、またはApp Store Connect APIキーが必要になる場合あり）
- [ ] App Store Connect側でビルドを選択し、審査に提出する
- [ ] Apple の審査を通過する（通常1〜3日程度。広告・データ収集申告の不備で差し戻されることが多いので、7章を丁寧にやっておくと通りやすい）

## 9. 公開後（やらなくてもいいが検討事項）

- [ ] Android 対応の検討（企画書どおり、今回のスコープ外。Expo なので同一コードベースでほぼ対応可能。AdMobの `androidAppId` は既にプレースホルダーを用意済み）
- [ ] 名言データの追加・見直し（現状365件、月日固定で毎年循環。ユーザーからの指摘があれば `src/data/quotes.ts` を直して `npm run sync-widget-quotes` を忘れずに）
- [ ] 学校・塾向けB2Cライセンスなど、企画書にあったマネタイズ案の検証
- [x] リモートリポジトリ（GitHub）へのプッシュ
- [ ] クラッシュ・エラー監視の導入検討（Sentry等。今は何も入っていないので、審査後に問題があっても気づきにくい）

---

## まず何からやるべきか（優先順）

1. ~~Apple Developer Program 登録~~ 完了
2. ~~Team ID / Bundle ID 反映、AdMob ID 反映、EAS プロジェクト作成~~ 完了
3. ~~連絡先メールアドレス決定、GitHubへのプッシュ~~ 完了
4. **`eas build -p ios --profile development` を再実行する**（`npm ci` の失敗 → 修正済み、ウィジェットのSwiftコンパイルエラー → 修正済み。今度こそ通るはず）→ 実機にインストールして6章の項目を一通り確認
5. 並行して進められるもの：`STORE_LISTING.md` の掲載文レビュー、SKAdNetworkリストの更新
6. development build で見つかった問題を直しつつ、`preview` ビルドでスクリーンショット撮影・TestFlightで数人にテストしてもらう
7. App Store Connect のメタデータ（7章）を埋める
8. `production` ビルド → `eas submit` → 審査提出
