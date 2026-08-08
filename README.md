# 英語名言 日めくりカレンダー

英語を手軽に学びたい人向けの、英語名言・日めくりカレンダーアプリ。中高生の学習習慣づくりを軸にしつつ、英語学習者全般をターゲットにしている。Claude Design で作成したモックアップ（Modernist デザインシステム + メモ帳モチーフ）を Expo（React Native）で実装したもの。

Mac なしで iOS アプリ化する方針（企画書参照）に合わせて、EAS Build（クラウドビルド）で iOS 向けにビルドする前提の構成になっている。

## できること

- **今日の名言（ホーム）**: 日付から自動的にその日の名言を1件表示。先の日付は見られない（めくる・戻る操作なし）。開くとその日がアーカイブに記録される。
- **アーカイブ**: 実際に開いた日ぶんだけが記録され、検索して振り返れる。
- **お気に入り**: ハートで保存した名言の一覧。
- **設定**: 通知のON/OFFと時刻、フォントサイズ（S/M/L、アプリ全体に反映）。
- **シェア**: 名言カードを画像として保存、テキストコピー、X/LINE/Instagram/その他への共有。
- **ホーム画面ウィジェット**: 「今日の名言」を表示する iOS ウィジェット（WidgetKit）。アプリと同じ日付→名言の対応表をウィジェット側にも埋め込んであるので、アプリを開いていなくても正しい日の名言が出る。

見た目は Modernist デザインシステムのトークン（`_ds/modernist-.../styles.css` で定義されていたもの）を `src/theme/tokens.ts` に移植し、React Native の StyleSheet で再現している。フォントは Archivo（見出し・本文）と Kalam（名言本文、手書き風 — チャットで決まった 1e 案）。

## セットアップ

```sh
npm install
npm run start      # Expo Dev Server（実機は Expo Go アプリ、または web で確認）
npm run web        # ブラウザでざっくり確認したいとき
npm run typecheck  # tsc --noEmit
```

Mac がなくても `npm run web` や Expo Go（実機にアプリをインストールして QR 読み取り）で、ウィジェット以外のほぼ全画面が確認できる。

### 通知・写真保存・共有まわり

- 通知（`expo-notifications`）・写真保存（`expo-media-library`）は実機での動作確認が必要。Expo Go では通知の一部機能に制限があるので、最終確認は later の development build か EAS Build 経由でのインストールを推奨。

## iOS ウィジェット（WidgetKit）について

`targets/widget/` に SwiftUI 製のホーム画面ウィジェットのソースがある（`@bacons/apple-targets` という Expo Config Plugin 経由で Xcode プロジェクトに合成される）。

**この環境には Xcode がないため、ウィジェットは未ビルド・未検証。** ロジック（今日の日付→名言の対応、レイアウト）は書けているが、実際にホーム画面に並べて見た目を確認する作業は Mac か EAS Build が必要。

ビルド前にやること:

1. `app.json` の `expo.ios.appleTeamId` に Apple Developer アカウントの Team ID を追加する（Xcode の Signing & Capabilities タブ、または developer.apple.com で確認できる）。
2. `app.json` の `ios.bundleIdentifier` / `android.package` は仮で `com.engdaily.app` にしてあるので、自分の Apple Developer アカウントに合わせて変更する。
3. Mac があれば `npx expo prebuild -p ios --clean` → `xed ios` で Xcode を開いて実機/シミュレータでウィジェットの見た目を確認できる。Mac がなければ EAS Build がプロジェクトを生成してビルドする（後述）。

名言データを編集したら、ウィジェット側の Swift データも再生成すること:

```sh
npm run sync-widget-quotes   # src/data/quotes.ts → targets/widget/QuoteData.swift
```

（アプリ本体は JS からいつでも 365 件を参照できるが、ウィジェットは別プロセスで動くネイティブコードなので JS を読み込めない。そのため同じ月日→名言の対応表を Swift 側にも複製してある。）

## EAS Build（クラウドで iOS ビルド）

```sh
npm install -g eas-cli
eas login
eas build:configure      # 初回のみ。ios.appleTeamId 未設定なら先に app.json に追加
eas build -p ios --profile preview   # TestFlight配布前の内部確認用
eas build -p ios --profile production
eas submit -p ios         # App Store Connect への提出
```

`eas.json` はビルドプロファイル（development / preview / production）だけ用意してある。Apple Developer Program（年$99）への登録が必要。

## 名言データ

`src/data/quotes.ts` に 365 日ぶん（`MM-DD` で年をまたいで毎年循環）を、`{ id, month, day, en, author, ja, note }` の形で保持している。著作権に配慮し、ことわざ・格言と、没後長く経った人物の言葉のみを収録（企画書の方針どおり）。

内容を差し替えたい場合はこのファイルを直接編集し、`npm run sync-widget-quotes` を忘れずに実行すること。

## プロジェクト構成

```
App.tsx                  フォント読み込み・プロバイダ・ナビゲーションのルート
src/
  theme/tokens.ts         Modernist のデザイントークン（色・余白・フォント）
  data/                   名言データと型
  context/                お気に入り・アーカイブ・設定（AsyncStorage永続化）
  utils/                  日付ロジック・通知・ストレージ
  components/             Button, QuoteMemoCard（メモ帳カード）など共通UI
  navigation/              タブ（今日/アーカイブ/お気に入り/設定）+ Share/QuoteDetail
  screens/                 各画面
targets/widget/            iOS ホーム画面ウィジェット（Swift）
scripts/sync-widget-quotes.mjs   名言データをウィジェット用Swiftに変換
```

## デザイン元

Claude Design で作った HTML/CSS モックアップ（Modernist デザインシステム + メモ帳モチーフ、6画面）とそのやり取りの経緯をもとに実装した。モックアップ自体のファイルはこのリポジトリには含まれていない（Claude Design 側のプロジェクトを参照）。
