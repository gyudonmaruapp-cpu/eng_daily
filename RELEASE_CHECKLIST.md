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

- [ ] **アプリアイコンをデザインする** **[要ユーザー or Claude可]**
  - 今は `assets/icon.png` が Expo のデフォルトプレースホルダーのまま
  - Expo は 1024×1024px の PNG 1枚（`icon.png`）を渡せば、iOS向けの各サイズに自動生成してくれる（透過なし推奨、Appleが背景を要求）
  - Modernist のトークン（`--color-bg` #f3f2f2、`--color-accent` #ec3013、Archivo フォント）に合わせたシンプルな案なら、SVG/HTMLベースでこちらでも下書き可能。手描き感を出すなら Kalam を使ったロゴマーク案もあり
  - `android-icon-foreground.png` / `android-icon-background.png` / `android-icon-monochrome.png` も同様に差し替えが必要（Android対応は将来分だが、ファイル自体は今の構成に含まれている）
- [ ] **スプラッシュ画面をデザインする**
  - `assets/splash-icon.png` が対象。Expo の splash screen 設定は `app.json` に無いため、`expo-splash-screen` のデフォルト（中央にアイコン）のままになっている。背景色や配置を変えたい場合は `app.json` に `splash` 設定を追加する必要がある
- [ ] **App Store 掲載用スクリーンショットを撮影する** **[要ユーザー]**
  - 最低1サイズ（6.9インチ相当 = iPhone 16 Pro Max 等の最新大画面）の提出が必須。複数サイズ用意すると古い端末所有者にも見た目が伝わりやすい
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
- [ ] ID差し替え後、**ネイティブビルドを作り直す**（JSだけの変更では反映されない。EAS Build 必須）
- [ ] 実機で広告が実際に表示されることを確認する（テストIDのままだと収益は発生しない）

## 4. 法務（利用規約・プライバシーポリシー）

- [x] 利用規約・プライバシーポリシーの草案作成（アプリ内画面 + `legal/index.html`）— **未レビューのテンプレート草案**
- [ ] **内容を確認する** **[要ユーザー]**
  - 可能なら専門家（弁護士等）にレビューしてもらう。特に「広告配信」「未成年を含む利用者層」の2点は、指摘が入りやすいポイント
- [ ] **連絡先メールアドレスを実際に使うものに更新する**
  - 今は `tujuliangtai@gmail.com` のプレースホルダー。`src/screens/LegalScreen.tsx` と `legal/index.html` の両方に同じ文字列が入っているので、両方直す
- [ ] **`legal/index.html` を公開してURLを確定する**
  - GitHub Pages を使う場合、標準のUIでは「リポジトリの `main` ブランチのルート」か「`/docs` フォルダ」しか公開元に選べない。今のファイルは `legal/index.html` にあるため、そのままではGitHub Pagesの標準設定では拾えない。**`legal/` を `docs/` にリネームするか、コピーを `docs/index.html` として置く**のが一番簡単
  - あるいは [Netlify Drop](https://app.netlify.com/drop) に `legal` フォルダをドラッグ＆ドロップするだけでも、設定不要で即座に公開URLが発行される（一番手軽）
- [ ] 確定したURLを以下の2箇所に反映する
  - `legal/index.html`（または `docs/index.html`）内の連絡先・自己参照リンクがあれば更新
  - App Store Connect の「App プライバシー」→「プライバシーポリシーURL」欄

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

- [ ] アプリ名を決める（30文字以内。例:「英語名言 日めくりカレンダー」で問題なければそのまま）
- [ ] サブタイトルを決める（30文字以内、検索にも影響する短いキャッチコピー）
- [ ] プロモーション文（170文字以内）・詳細説明（4000文字以内）を書く（**Claude可**、下書きは手伝える）
- [ ] キーワードを決める（100文字以内、カンマ区切り。例: 英語,名言,勉強,中学生,高校生,日めくり,ことわざ）
- [ ] カテゴリを選ぶ（プライマリ: 教育 / セカンダリ: ライフスタイル など）
- [ ] サポートURLを用意する（問い合わせ先ページ。今は何もない。簡易的にはGitHubリポジトリのIssueページやメールへのmailtoリンクでも可）
- [ ] （任意）マーケティングURLを用意する
- [ ] **年齢レーティング質問票に回答する**（Kids Categoryには申請しない前提。広告の有無・ユーザー生成コンテンツの有無などを問われる）
- [ ] **App Privacy（データ収集の申告＝プライバシーの「栄養成分表示」）に回答する**
  - AdMobが収集する「デバイス識別子（広告向け）」「使用状況データ」等を、Appleの分類に沿って正確に申告する必要がある。ここで実態と違う申告をすると審査で弾かれる、または後から指摘される
  - 参考: [App Privacy Details on the App Store](https://developer.apple.com/app-store/app-privacy-details/)
- [ ] 価格（無料想定）・対応国・対応言語（日本語のみ、または英語も追加するか）を設定する
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
2. 登録完了を待つ間に並行して進められるもの：AdMobアカウント作成、アイコン/スプラッシュのデザイン、説明文・キーワードの下書き、`legal/`→`docs/`へのリネームとホスティング
3. Team ID が手に入ったら `app.json` を更新 → `eas build:configure`
4. `eas build -p ios --profile development` で development build を作り、実機で一通り動作確認（6章）
5. 問題を直しつつ `preview` ビルドでスクリーンショット撮影・TestFlightで数人にテストしてもらう
6. App Store Connect のメタデータ（7章）を埋める
7. `production` ビルド → `eas submit` → 審査提出
