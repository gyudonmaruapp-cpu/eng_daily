# 公開までのタスクチェックリスト

「英語名言 日めくりカレンダー」をApp Storeに出すまでにやることの全体像と、それぞれの詳細手順。チェックが付いていない項目は全部未対応。

凡例：**[要ユーザー]** は開発者本人にしかできない作業（アカウント登録・支払い・実機での確認など）。**[Claude可]** はコードやドキュメントとして自分（Claude）が引き続き手伝える作業。

---

## 1. Apple Developer アカウント周り 【要ユーザー】

- [ ] **Apple Developer Program に登録する**
  - [https://developer.apple.com/programs/enroll/](https://developer.apple.com/programs/enroll/) から申し込む
  - 年 $99（自動更新）。支払いはクレジットカード
  - 個人（Individual）として登録する場合は Apple ID があればOK。屋号・法人（Organization）で登録する場合は D-U-N-S番号の取得が別途必要になり、審査に数日〜数週間かかることがある → 個人利用なら Individual 登録が圧倒的に早い
  - 審査には通常 24〜48時間程度かかる（長引くこともある）ので、他の作業より先に着手しておく
- [ ] **Team ID を確認する**
  - 登録完了後、[developer.apple.com/account](https://developer.apple.com/account) → Membership details に表示される（英数10桁）
  - もしくは Mac があれば Xcode → Settings → Accounts → 該当Appleアカウントを選択 → Team ID が表示される
- [ ] **`app.json` の `expo.ios.appleTeamId` に Team ID を追加する**
  - 今は未設定。ウィジェット（`@bacons/apple-targets`）のビルドに必須で、これがないと `expo prebuild` / EAS Build の iOS ビルドが失敗する
- [ ] **`app.json` の `ios.bundleIdentifier` / `android.package` を本番用の値に変更する**
  - 今は仮の `com.engdaily.app`。逆ドメイン形式（例: `com.あなたのドメインやアカウント名.engdaily`）で、App Store Connect に登録するBundle IDと一致させる必要がある
  - この値は**あとから変更できない**（Bundle IDは一度公開すると変更不可）ので、最終的に使いたい値をここで確定させる

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
- [ ] （任意）プレビュー動画を用意する — 必須ではないので後回しでよい

## 3. 広告（AdMob） 【要ユーザー】

- [x] `react-native-google-mobile-ads` の組み込み・バナー広告の設置（実装済み、テストID）
- [ ] **AdMob アカウントを作成する**
  - [https://admob.google.com/](https://admob.google.com/) から Google アカウントで登録
- [ ] **アプリを登録してアプリID・広告ユニットIDを取得する**
  - AdMob管理画面 → アプリ → 「アプリを追加」→ プラットフォーム: iOS → 「はい、App Storeに公開済みです」or「いいえ、まだです」（未公開でもアプリID発行は可能）
  - 取得できるアプリID形式: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
  - 続けて「広告ユニット」→「バナー」を作成し、広告ユニットIDを取得: `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ`
- [ ] **`app.json` の `iosAppId` を取得したアプリIDに差し替える**
  - `plugins` 内の `react-native-google-mobile-ads` 設定ブロック
- [ ] **`src/utils/ads.native.ts` の `BANNER_AD_UNIT_ID` を取得した広告ユニットIDに差し替える**
  - 今は `TestIds.BANNER`（Google公式のテストID）になっている
- [ ] **AdMob側で「児童向けタグ」を付けないことを確認する**
  - アプリ登録時の質問「このアプリは主に児童向けですか？」で「いいえ」を選択（README・企画書の方針どおり、英語学習者全般がターゲットのため）
- [ ] **SKAdNetworkItems のリストを最新版に差し替える** ⚠️ 未対応
  - `app.json` の `skAdNetworkItems` には今 Google 自身のID（`cstr6suwn9.skadnetwork`）**1件しか入っていない**
  - Google は自社IDに加えて「参加する third-party buyers」のIDを全部載せることを推奨している。ここが不足していると iOS 上での広告のアトリビューションが取れず、**広告単価・収益に直接影響する**
  - 最新の一覧は [Google公式ドキュメント](https://developers.google.com/admob/ios/privacy/strategies) からコピーする（リストは随時更新されるため、ここには転記していない。提出直前に取得するのが確実）
- [ ] **プライバシーマニフェスト（`ios.privacyManifests`）を設定するか検討する** ⚠️ 未対応
  - Expo は `app.json` の `ios.privacyManifests` から `PrivacyInfo.xcprivacy` を生成できるが、今は未設定
  - 使用中のライブラリのうち、データに触れる `@react-native-async-storage/async-storage` と `react-native-view-shot` は**それぞれ自前のマニフェストを同梱している**ので、required-reason API 部分は概ねカバーされている見込み
  - 一方 **`NSPrivacyTracking` / `NSPrivacyTrackingDomains`（トラッキング申告）はアプリ側の責任**。ATT を使って広告を出す以上、ここの設定は検討が必要
  - ただし `NSPrivacyTrackingDomains` に挙げたドメインは、ATT拒否時に iOS が通信をブロックするため、**間違ったドメインを書くと広告配信が壊れる**。推測で書かず、Google のドキュメントを確認した上で設定すること
- [ ] ID差し替え後、**ネイティブビルドを作り直す**（JSだけの変更では反映されない。EAS Build 必須）
- [ ] 実機で広告が実際に表示されることを確認する（テストIDのままだと収益は発生しない）

## 4. 法務（利用規約・プライバシーポリシー）

- [x] 利用規約・プライバシーポリシーの草案作成（アプリ内画面 + `docs/privacy.html`）— **未レビューのテンプレート草案**
- [ ] **内容を確認する** **[要ユーザー]**
  - 可能なら専門家（弁護士等）にレビューしてもらう。特に「広告配信」「未成年を含む利用者層」の2点は、指摘が入りやすいポイント
- [ ] **連絡先メールアドレスをどうするか決める**
  - 今は `tujuliangtai@gmail.com`（このセッションで参照できたアドレス）が `src/screens/LegalScreen.tsx` と `docs/privacy.html`・`docs/support.html` に入っている
  - ⚠️ このアドレスは**アプリ内とストア掲載ページの両方で誰でも見られる状態になる**。個人のGmailをそのまま公開したくない場合は、アプリ専用のアドレスを別途用意して差し替えること（後から変えるより最初に決めた方が楽）
- [x] **GitHub Pages で公開できる形に配置済み**
  - `docs/` に3ページ用意した（GitHub Pages の標準UIは「ブランチのルート」か「`/docs`」しか公開元に選べないため、`docs/` に置いてある）
    - `docs/index.html` — アプリ紹介（マーケティングURL用）
    - `docs/privacy.html` — 利用規約・プライバシーポリシー（**プライバシーポリシーURL用**）
    - `docs/support.html` — サポート・FAQ・問い合わせ先（**サポートURL用**）
- [ ] **公開設定をONにしてURLを確定する** **[要ユーザー]**
  - GitHub にプッシュ後、リポジトリの Settings → Pages → Source で「Deploy from a branch」→ ブランチ `main` / フォルダ `/docs` を選ぶ
  - GitHub を使わない場合は [Netlify Drop](https://app.netlify.com/drop) に `docs` フォルダをドラッグ＆ドロップするだけでも即座に公開URLが出る
- [ ] 確定したURLを App Store Connect の「プライバシーポリシーURL」「サポートURL」欄に入力する（`STORE_LISTING.md` にURLの雛形あり）

## 5. iOS ウィジェット（WidgetKit）

- [x] ウィジェットのコード実装（`targets/widget/`、SwiftUI）
- [ ] **実際にビルドして初めて見た目を確認する** **[要ユーザー]**
  - **Macは無くても大丈夫**：EAS Build がクラウド上でネイティブビルド（ウィジェット込み）を行い、Xcodeなしで `.ipa` が生成できる
  - 流れ：`eas build -p ios --profile preview` → ビルド完了後 TestFlight（内部テスト）配布 → 自分のiPhoneにインストール → ホーム画面にウィジェットを追加して確認、という手順で完結する
  - Macを持っている／借りられる場合は `npx expo prebuild -p ios --clean` → `xed ios` で Xcode を開き、シミュレータで素早く確認・調整できる（開発サイクルが速い）
- [ ] レイアウト・文字サイズなど、実機で見た結果に応じて調整する（**Claude可**、フィードバックをもらえれば `targets/widget/widgets.swift` を修正する）

## 6. 実機テスト 【要ユーザー】

現状、動作確認は TypeScript の型チェックと Web バンドルのエクスポートのみ。実機・シミュレータでは一度も動かしていない。特に **AdMob・ウィジェット・通知の一部はネイティブコードを含むため Expo Go では動作せず、development build が必要。**

- [ ] **development build を作る**（Expo Go の代わりに、このアプリ専用のネイティブモジュール込みインストーラ）
  ```sh
  eas build -p ios --profile development
  ```
  `eas.json` の `development` プロファイルは既に用意済み（`developmentClient: true`）
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

- [ ] `eas build:configure` を実行する（Apple IDでのログイン・証明書自動生成が走る。初回は対話式でいくつか質問される）
- [ ] development ビルドで実機テスト（セクション6）
- [ ] preview ビルドで TestFlight 内部配布・スクリーンショット撮影
- [ ] production ビルドを作成する（`eas.json` の `production` プロファイルは `autoIncrement: true` でビルド番号を自動採番する設定済み）
- [ ] `eas submit -p ios` で App Store Connect にアップロードする（Apple IDのApp用パスワード、またはApp Store Connect APIキーが必要になる場合あり）
- [ ] App Store Connect側でビルドを選択し、審査に提出する
- [ ] Apple の審査を通過する（通常1〜3日程度。広告・データ収集申告の不備で差し戻されることが多いので、7章を丁寧にやっておくと通りやすい）

## 9. 公開後（やらなくてもいいが検討事項）

- [ ] Android 対応の検討（企画書どおり、今回のスコープ外。Expo なので同一コードベースでほぼ対応可能。AdMobの `androidAppId` は既にプレースホルダーを用意済み）
- [ ] 名言データの追加・見直し（現状365件、月日固定で毎年循環。ユーザーからの指摘があれば `src/data/quotes.ts` を直して `npm run sync-widget-quotes` を忘れずに）
- [ ] 学校・塾向けB2Cライセンスなど、企画書にあったマネタイズ案の検証
- [ ] リモートリポジトリ（GitHub等）へのプッシュ（現状ローカルのみ。バックアップ・共同作業のため推奨。EAS Buildもリポジトリ連携すると自動ビルドなどが組みやすくなる）
- [ ] クラッシュ・エラー監視の導入検討（Sentry等。今は何も入っていないので、審査後に問題があっても気づきにくい）

---

## まず何からやるべきか（優先順）

1. **Apple Developer Program 登録**（審査に1〜2日かかるので最優先で着手）
2. 登録完了を待つ間に並行して進められるもの：AdMobアカウント作成、`docs/` を GitHub Pages で公開してURL確定、`STORE_LISTING.md` の掲載文レビュー
3. Team ID が手に入ったら `app.json` を更新 → `eas build:configure`
4. `eas build -p ios --profile development` で development build を作り、実機で一通り動作確認（6章）
5. 問題を直しつつ `preview` ビルドでスクリーンショット撮影・TestFlightで数人にテストしてもらう
6. App Store Connect のメタデータ（7章）を埋める
7. `production` ビルド → `eas submit` → 審査提出
