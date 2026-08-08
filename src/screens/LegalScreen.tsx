import React from "react";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenContainer } from "../components/ScreenContainer";
import { color, fontFamily, space } from "../theme/tokens";

const LAST_UPDATED = "2026年8月9日";
const CONTACT_EMAIL = "gyudonmaru.app@gmail.com";
const APP_NAME = "英語名言 日めくりカレンダー";

export function LegalScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
        <ChevronRight size={16} color={color.text} style={styles.backIcon} />
        <Text style={styles.backText}>もどる</Text>
      </Pressable>

      <Text style={styles.title}>利用規約・プライバシーポリシー</Text>
      <Text style={styles.updated}>最終更新日：{LAST_UPDATED}</Text>

      <Section title="利用規約">
        <Paragraph>
          この利用規約（以下「本規約」）は、{APP_NAME}（以下「本アプリ」）の利用条件を定めるものです。本アプリをダウンロード・利用した時点で、本規約に同意したものとみなします。
        </Paragraph>
        <SubTitle>1. サービス内容</SubTitle>
        <Paragraph>
          本アプリは、日替わりの英語の名言・ことわざとその和訳・学習メモを表示するアプリです。名言の内容・著者表記については、公開されている資料をもとに可能な限り確認していますが、正確性・完全性を保証するものではありません。和訳および学習メモは本アプリのために作成したオリジナルの文章です。内容の誤りに気づいた場合は下記の連絡先までご連絡ください。
        </Paragraph>
        <SubTitle>2. 禁止事項</SubTitle>
        <Paragraph>
          本アプリの複製・改変・逆コンパイル・逆アセンブル、その他法令または公序良俗に反する利用を禁止します。
        </Paragraph>
        <SubTitle>3. 知的財産権</SubTitle>
        <Paragraph>
          本アプリのデザイン・プログラム等の知的財産権は開発者に帰属します。名言・ことわざ自体の多くはパブリックドメインまたは出典不明の伝承であり、権利の帰属を主張するものではありません。
        </Paragraph>
        <SubTitle>4. 免責事項</SubTitle>
        <Paragraph>
          本アプリは現状有姿で提供され、その完全性・正確性・特定目的への適合性についていかなる保証も行いません。本アプリの利用により利用者に生じた損害について、開発者は法令上認められる範囲で責任を負わないものとします。
        </Paragraph>
        <SubTitle>5. サービスの変更・終了</SubTitle>
        <Paragraph>
          開発者は、事前の通知なく本アプリの内容を変更し、または提供を終了することがあります。
        </Paragraph>
        <SubTitle>6. 準拠法</SubTitle>
        <Paragraph>本規約の解釈にあたっては日本法を準拠法とします。</Paragraph>
      </Section>

      <Section title="プライバシーポリシー">
        <Paragraph>
          {APP_NAME}（以下「本アプリ」）における利用者情報の取り扱いについて、以下のとおり定めます。本アプリ自身はアカウント機能を持ちませんが、広告配信のために組み込んでいる第三者SDK（Google
          AdMob）が情報を扱う場合があります。詳しくは「4. 広告について」をご覧ください。
        </Paragraph>
        <SubTitle>1. アカウント登録について</SubTitle>
        <Paragraph>
          本アプリはアカウント登録・ログインを必要とせず、氏名・メールアドレス等を取得する機能を提供していません。
        </Paragraph>
        <SubTitle>2. 端末内に保存するデータ</SubTitle>
        <Paragraph>
          お気に入り・アーカイブ（閲覧履歴）・通知やフォントサイズなど、本アプリが提供する設定・履歴情報は、すべてお使いの端末内にのみ保存されます。これらの情報を本アプリのサーバーへ送信することはありません。アプリを削除すると、これらのデータも端末から削除されます。
        </Paragraph>
        <SubTitle>3. 端末の権限について</SubTitle>
        <Paragraph>
          ・通知：設定した時刻に「今日の名言」をお知らせするために使用します（端末内で完結し、外部送信はありません）。{"\n"}
          ・写真ライブラリへの書き込み：シェア機能で名言カードを画像として保存する際にのみ使用します。本アプリが写真を読み取ることはありません。
        </Paragraph>
        <SubTitle>4. 広告について</SubTitle>
        <Paragraph>
          本アプリは、Google が提供する広告配信サービス（Google AdMob）を利用しています。広告配信にともない、Google
          AdMob SDK
          を通じて、端末の広告識別子、アプリのバージョン、大まかな地域、端末のメーカー・機種、OSのバージョンなどの情報が
          Google 等の第三者に送信・処理される場合があります。
        </Paragraph>
        <Paragraph>
          iOS では、パーソナライズ広告を表示する前に、トラッキングに関する同意（App Tracking
          Transparency）の状態を確認します。同意が得られていない場合、本アプリは広告リクエストに非パーソナライズ広告のみを要求する設定を行います。ただし、広告の表示内容や取り扱いは
          Google
          側の設定・お住まいの地域の法令にも依存するため、常に非パーソナライズ広告のみが表示されることを保証するものではありません。
        </Paragraph>
        <Paragraph>
          Google によるデータの取り扱いについては、Google
          のプライバシーポリシー（https://policies.google.com/privacy）をご確認ください。
        </Paragraph>
        <SubTitle>5. お子様のプライバシーについて</SubTitle>
        <Paragraph>
          本アプリは、特定の年齢層のお子様を対象として設計されたアプリではなく、英語学習者全般を対象としています。氏名やメールアドレスなどの個人情報を取得する機能もありません。保護者の方でご心配な点がある場合は、下記の連絡先までお問い合わせください。
        </Paragraph>
        <SubTitle>6. ポリシーの変更</SubTitle>
        <Paragraph>
          本ポリシーの内容は、必要に応じて変更することがあります。変更後の内容は本画面に反映し、冒頭の最終更新日を更新します。
        </Paragraph>
        <SubTitle>7. お問い合わせ</SubTitle>
        <Paragraph>
          本アプリに関するお問い合わせ（不具合の報告、名言の出典・著者表記に関するご指摘、プライバシーに関するご質問など）は、下記メールアドレスまでお願いいたします。
        </Paragraph>
        <Paragraph>{CONTACT_EMAIL}</Paragraph>
      </Section>
    </ScreenContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SubTitle({ children }: { children: string }) {
  return <Text style={styles.subTitle}>{children}</Text>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: space[8] },
  back: { flexDirection: "row", alignItems: "center", marginBottom: space[4] },
  backIcon: { transform: [{ rotate: "180deg" }] },
  backText: { fontFamily: fontFamily.bodyMedium, fontSize: 14, color: color.text, marginLeft: 2 },
  title: { fontFamily: fontFamily.headingBold, fontSize: 26, color: color.text },
  updated: { fontSize: 12, color: color.text, opacity: 0.55, marginTop: 4, marginBottom: space[4] },
  section: {
    borderTopWidth: 2,
    borderTopColor: color.divider,
    paddingTop: space[4],
    marginTop: space[4],
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 20,
    color: color.text,
    marginBottom: space[3],
  },
  subTitle: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    color: color.accent700,
    marginTop: space[3],
    marginBottom: 4,
  },
  paragraph: { fontSize: 13, lineHeight: 20, color: color.text, opacity: 0.85 },
});
