// Historical record of the 2026-08 fact-check remediation pass over all 365
// quotes (see git log for the corresponding commits). Loads src/data/quotes.ts,
// applies the patch map below (partial field overrides by id), validates
// uniqueness/integrity, and rewrites the file in the same format. Already
// applied — re-running is a harmless no-op against the current data.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const dataPath = path.join(root, "src/data/quotes.ts");
const { QUOTES } = await import(dataPath);

// id -> partial patch. Only listed fields are overridden.
// `downgrade: true` is a marker (not a field) meaning "replace an
// unverifiable hyper-specific nation-proverb label with a generic one" —
// handled separately via DOWNGRADE_IDS below.
const PATCHES = {
  // --- Jul/Aug/Sep batch ---
  "07-02": {
    en: "The early bird catches the worm.",
    author: "English Proverb",
    ja: "早起きの鳥は虫を捕まえる。",
    note: "\"catch\" は「捕まえる」。過去形 caught と混同しないよう注意。",
  },
  "07-05": {
    en: "The best-laid schemes of mice and men often go awry.",
    author: "Robert Burns",
    ja: "ねずみや人間の最良の計画も、しばしば狂う。",
    note: "\"go awry\" は「予定通りにいかない、狂う」という意味の表現。",
  },
  "07-06": {
    en: "Vision is the art of seeing what is invisible to others.",
    author: "Jonathan Swift",
    ja: "先見の明とは、他人には見えないものを見抜く技術である。",
    note: "\"invisible to others\" は「他人には見えない」。to は「〜にとって」の意味。",
  },
  "08-02": {
    en: "Don't wait for inspiration; go after it with a club.",
    author: "Jack London",
    ja: "ひらめきを待つのではなく、棍棒を持って追いかけろ。",
    note: "\"go after X\" は「Xを追い求める」という意味の句動詞。",
  },
  "08-05": {
    en: "Little by little does the trick.",
    author: "English Proverb",
    ja: "少しずつの積み重ねが、事を成し遂げる。",
    note: "\"does the trick\" は「うまくいく、目的を達成する」という口語表現。",
  },
  "08-06": {
    en: "Don't count your chickens before they hatch.",
    author: "English Proverb",
    ja: "卵がかえる前からひよこの数を数えるな。（早合点するな）",
    note: "\"before they hatch\" は「それら（卵）がかえる前に」という時を表す節。",
  },
  "08-07": {
    en: "A man who does not think for himself does not think at all.",
    author: "English Proverb",
    ja: "自分の頭で考えない者は、まったく考えていないのと同じだ。",
    note: "\"think for himself\" は「自分自身のために（＝自分の頭で）考える」という意味。",
  },
  "08-08": {
    en: "Every wall is a door.",
    author: "Proverb",
    ja: "どんな壁も、扉になり得る。",
    note: "\"every X is Y\" は「あらゆるXはYだ」という一般化を表す構文。",
  },
  "08-10": {
    en: "What we learn with pleasure we never forget.",
    author: "English Proverb",
    ja: "楽しんで学んだことは、決して忘れない。",
    note: "\"what we learn with pleasure\" は関係代名詞 what を使った「〜すること」を表す節。",
  },
  "08-11": {
    en: "The squeaky wheel gets the grease.",
    author: "English Proverb",
    ja: "きしむ車輪ほど、油を差してもらえる。（声を上げる者が注目される）",
    note: "\"squeaky\" は「きしむ、キーキー音を立てる」という意味の形容詞。",
  },
  "08-12": {
    en: "Aim for the moon. If you miss, you may hit a star.",
    author: "English Proverb",
    ja: "月を目指せ。外れても、星に届くかもしれない。",
    note: "\"if you miss\" は「もし外しても」という条件を表す節。",
  },
  "08-19": {
    author: "English Proverb",
  },
  "09-01": {
    en: "He who conquers himself is the mightiest warrior.",
    author: "Proverb",
    ja: "自分自身に打ち勝つ者こそ、最強の戦士である。",
    note: "\"he who ~\" は「〜する人」という意味の古めかしい言い方。",
  },
  "09-03": {
    en: "Not till we are lost do we begin to find ourselves.",
    author: "Henry David Thoreau",
    ja: "道に迷って初めて、私たちは自分自身を見つけ始める。",
    note: "\"not till ~\" は「〜して初めて」という意味。till は until の口語的な形。",
  },
  "09-04": {
    en: "What lies behind us and what lies before us are small matters compared to what lies within us.",
    author: "Proverb",
    ja: "私たちの背後にあるものも前方にあるものも、内にあるものに比べれば小さなことだ。",
    note: "\"what lies within us\" は関係代名詞 what を使った「私たちの内にあるもの」という節。",
  },
  "09-08": {
    en: "Simplicity is the ultimate sophistication.",
    author: "Proverb",
    ja: "単純さこそ、究極の洗練である。",
    note: "\"ultimate\" は「究極の、最上の」という意味の形容詞。",
  },
  "09-09": {
    en: "Nothing ventured, nothing gained.",
    author: "English Proverb",
    ja: "何も賭けなければ、何も得られない。",
    note: "\"venture\" は「思い切って〜する、賭ける」という意味の動詞。過去分詞 ventured が使われている。",
  },
  "09-26": { author: "Proverb" },
  "09-27": { author: "Proverb" },
  "09-28": { author: "Proverb" },
  "09-29": { author: "Proverb" },
  "09-30": { author: "Proverb" },

  // --- Oct/Nov/Dec batch ---
  "10-01": {
    en: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
    ja: "活力と粘り強さは、あらゆることを成し遂げる。",
    note: "\"conquer\" は「征服する」が原義だが、ここでは「乗り越える、成し遂げる」という意味。",
  },
  "10-02": {
    en: "Nothing can stop the man with the right mental attitude from achieving his goal.",
    author: "Proverb",
    ja: "正しい心構えを持つ者を、その目標達成から止められるものは何もない。",
    note: "\"stop A from -ing\" は「Aが〜するのを止める」という意味の構文。",
  },
  "10-03": {
    en: "A house divided against itself cannot stand.",
    author: "Abraham Lincoln",
    ja: "内部で分裂した家は、立っていられない。",
    note: "\"divided against itself\" は「内部で対立している」という意味の表現。",
  },
  "10-04": {
    en: "Actions, not words, are the true criterion of attachment.",
    author: "George Washington",
    ja: "言葉ではなく行動こそが、真の愛着の証である。",
    note: "\"criterion\" は「基準、尺度」という意味の名詞。",
  },
  "10-06": { author: "Proverb" },
  "10-10": {
    en: "To play a wrong note is insignificant; to play without passion is inexcusable.",
    author: "Proverb",
    ja: "間違った音を弾くことはささいなことだが、情熱なく弾くことは許されない。",
    note: "\"insignificant\" は「取るに足らない」、\"inexcusable\" は「許されない」という意味の形容詞。",
  },
  "10-14": {
    en: "Children have more need of models than of critics.",
    author: "Joseph Joubert",
    ja: "子どもに必要なのは、批評家よりも手本となる存在だ。",
    note: "\"have need of X\" は「Xを必要とする」という意味のやや古風な表現。",
  },
  "11-02": {
    en: "Every great dream begins with a dreamer.",
    author: "Proverb",
    ja: "あらゆる偉大な夢は、一人の夢見る者から始まる。",
    note: "\"begin with X\" は「Xから始まる」という意味の句動詞。",
  },
  "11-03": {
    en: "The surest way not to fail is to determine to succeed.",
    author: "Richard Brinsley Sheridan",
    ja: "失敗しない最も確実な方法は、成功すると決意することだ。",
    note: "\"determine to ~\" は「〜すると決意する」という意味の表現。",
  },
  "11-05": {
    en: "The secret of success is constancy of purpose.",
    author: "Benjamin Disraeli",
    ja: "成功の秘訣は、目的の一貫性にある。",
    note: "\"constancy of purpose\" は「目的の一貫性、ぶれなさ」という意味の句。",
  },
  "11-07": { author: "Proverb" },
  "11-08": {
    en: "It is curious that physical courage should be so common and moral courage so rare.",
    author: "Proverb",
    ja: "肉体的な勇気はこれほど普通なのに、道徳的な勇気はこれほど稀なのは不思議だ。",
    note: "\"it is curious that ~\" は「〜とは不思議なことだ」という意味の構文。",
  },
  "11-12": {
    en: "It isn't what we say or think that defines us, but what we do.",
    author: "Proverb",
    ja: "私たちを定義するのは、言うことや考えることではなく、行うことだ。",
    note: "\"it isn't A but B that ~\" は「〜なのはAではなくBだ」という強調構文。",
  },
  "11-13": {
    en: "Nothing is stronger than an idea whose time has come.",
    author: "Proverb",
    ja: "時が来た考えほど、強いものはない。",
    note: "\"whose time has come\" は「その時が来た」という意味の関係代名詞節。",
  },
  "11-14": {
    en: "A watched pot never boils.",
    author: "English Proverb",
    ja: "見つめる鍋は煮えない。（待っていると余計に長く感じる）",
    note: "\"watched\" は watch の過去分詞。pot を後ろから修飾している。",
  },
  "11-16": {
    en: "He who moves not forward, goes backward.",
    author: "Johann Wolfgang von Goethe",
    ja: "前に進まない者は、後ろに下がっているのだ。",
    note: "\"he who ~\" は「〜する人」という意味の古めかしい言い方。",
  },
  "11-18": {
    en: "Make hay while the sun shines.",
    author: "English Proverb",
    ja: "日が照っているうちに干し草を作れ。（好機を逃すな）",
    note: "\"while ~\" は「〜している間に」という時を表す接続詞。",
  },
  "11-19": {
    en: "Don't cross the bridge until you come to it.",
    author: "English Proverb",
    ja: "その橋にたどり着くまでは、渡ろうとするな。（先のことを心配しすぎるな）",
    note: "\"until you come to it\" は「そこにたどり着くまで」という意味の時を表す節。",
  },
  "11-22": { author: "Proverb" },
  "12-31": {
    en: "An ounce of prevention is worth a pound of cure.",
    author: "Benjamin Franklin",
    ja: "一オンスの予防は、一ポンドの治療に値する。",
    note: "\"be worth X\" は「Xの価値がある」という意味の表現。ounce/poundは重さの単位。",
  },

  // --- Apr/May/Jun batch ---
  "04-02": {
    en: "A bird in the hand is worth two in the bush.",
    author: "English Proverb",
    ja: "手の中の一羽は、藪の中の二羽に値する。（確実なものは不確実なものに勝る）",
    note: "\"worth X\" は「Xの価値がある」という意味の形容詞。",
  },
  "04-05": {
    en: "God helps those who help themselves.",
    author: "English Proverb",
    ja: "天は自ら助くる者を助く。",
    note: "\"those who ~\" は「〜する人々」という意味のまとまり。",
  },
  "04-06": {
    en: "Waste not, want not.",
    author: "English Proverb",
    ja: "無駄をしなければ、不足することもない。",
    note: "否定の命令文を2つ並べた対句表現。want はここでは「欠乏する」という意味の動詞。",
  },
  "04-07": {
    en: "A rolling stone gathers no moss.",
    author: "English Proverb",
    ja: "転がる石には苔が生えぬ。",
    note: "\"gather no moss\" は「苔をまったく集めない」という否定表現。",
  },
  "04-09": {
    en: "Look before you leap.",
    author: "English Proverb",
    ja: "跳ぶ前に見よ。",
    note: "\"before you leap\" は「跳ぶ前に」という時を表す節。",
  },
  "04-10": {
    en: "In life, there is nothing to be feared, only understood.",
    author: "Marie Curie",
    ja: "人生において、恐れるべきものは何もない。理解すべきものがあるだけだ。",
    note: "\"there is nothing to be feared\" は be to 不定詞の受け身用法。「〜されるべきもの」という意味。",
  },
  "04-27": {
    en: "The pen is mightier than the sword.",
    author: "English Proverb",
    ja: "ペンは剣よりも強し。",
    note: "\"mightier than\" は mighty の比較級。「〜よりも強力な」という意味。",
  },
  "04-29": {
    en: "So long as there is life in the sick man, it is said that there is hope.",
    author: "Cicero",
    ja: "病人に命がある限り、望みもあると言われる。",
    note: "\"so long as ~\" は「〜する限り」という条件を表す表現。",
  },
  "05-01": {
    en: "When the going gets tough, the tough get going.",
    author: "English Proverb",
    ja: "状況が厳しくなったとき、強い者はますます奮起する。",
    note: "\"the tough\" は「the+形容詞」で「強い人々」という意味を表す用法。",
  },
  "05-02": {
    en: "You reap what you sow.",
    author: "English Proverb",
    ja: "蒔いた種は、自分で刈り取ることになる。",
    note: "\"reap\" は「収穫する」、\"sow\" は「種をまく」という意味の動詞。",
  },
  "05-03": {
    en: "Every dog has its day.",
    author: "English Proverb",
    ja: "どんな犬にも、その日が来る。（誰にでも活躍のときがある）",
    note: "\"have its day\" は「その時代・機会を得る」という意味の表現。",
  },
  "05-04": {
    en: "Birds of a feather flock together.",
    author: "English Proverb",
    ja: "類は友を呼ぶ。",
    note: "\"birds of a feather\" は「同じ羽を持つ鳥」から転じて「似た者同士」を表す比喩表現。",
  },
  "05-09": {
    en: "There's no place like home.",
    author: "English Proverb",
    ja: "家に勝る場所はない。",
    note: "\"no place like X\" は「Xのような場所はない」、つまり「Xが一番だ」という意味の比較表現。",
  },
  "05-11": {
    en: "Curiosity killed the cat.",
    author: "English Proverb",
    ja: "好奇心は猫をも殺す。（詮索好きは身を滅ぼす）",
    note: "猫は生命力が強いとされる動物。それさえ殺すという誇張表現で「詮索好きは危険だ」を伝える。",
  },
  "06-03": {
    en: "It is sometimes said that common sense is very rare.",
    author: "Voltaire",
    ja: "常識というものは、実はとても稀なものだとよく言われる。",
    note: "\"it is said that ~\" は「〜だと言われている」という意味の受け身構文。",
  },
  "06-04": {
    en: "Two wrongs don't make a right.",
    author: "English Proverb",
    ja: "二つの過ちは、一つの正しさにはならない。",
    note: "\"make a right\" は「正しいことになる」という意味の表現。",
  },
  "06-09": {
    en: "The grass is always greener on the other side.",
    author: "English Proverb",
    ja: "隣の芝生は青く見える。",
    note: "\"on the other side\" は「反対側では」という意味の前置詞句。",
  },
  "06-10": {
    en: "Out of sight, out of mind.",
    author: "English Proverb",
    ja: "去る者は日々に疎し。（見えなくなれば、忘れられていく）",
    note: "\"out of X\" は「Xの外に→Xでなくなると」という意味の表現。",
  },
  "06-12": {
    en: "All good things must come to an end.",
    author: "English Proverb",
    ja: "すべての良いことには、終わりが来る。",
    note: "\"come to an end\" は「終わりを迎える」という意味の熟語。",
  },
  "06-13": {
    en: "Don't put all your eggs in one basket.",
    author: "English Proverb",
    ja: "卵を一つのかごに全部盛るな。（危険は分散せよ）",
    note: "命令文の否定形。\"put ... in ~\" で「〜を…に入れる」という意味。",
  },
  "06-16": {
    author: "Robert Browning",
  },
  "06-17": {
    en: "Absence makes the heart grow fonder.",
    author: "English Proverb",
    ja: "離れていると、想いはより募る。",
    note: "\"make + O + 動詞の原形\" は「Oを〜させる」という使役表現。grow はここでは「〜になる」という意味の動詞。",
  },

  // --- Jan(1-20)/Feb/Mar batch ---
  "01-05": {
    en: "A leopard cannot change its spots.",
    author: "English Proverb",
    ja: "ヒョウは自分の斑点を変えられない。（生まれ持った性質は変わらない）",
    note: "\"cannot ~\" は不可能を表す表現。spots はヒョウの体の模様「斑点」のこと。",
  },
  "01-08": {
    en: "Forewarned is forearmed.",
    author: "English Proverb",
    ja: "前もって知っていれば、前もって備えられる。",
    note: "forewarned・forearmed はどちらも fore-（前もって）+ 過去分詞の形。",
  },
  "01-13": {
    en: "After a storm comes a calm.",
    author: "English Proverb",
    ja: "嵐のあとには、凪が来る。",
    note: "\"comes a calm\" は主語と動詞が倒置された形。通常語順は \"a calm comes\"。",
  },
  "01-14": { author: "Proverb" },
  "01-16": { author: "Proverb" },
  "01-19": { author: "Proverb" },
  "02-01": {
    author: "John Lubbock",
  },
  "02-02": { author: "Proverb" },
  "02-05": {
    en: "A friend in need is a friend indeed.",
    author: "English Proverb",
    ja: "困った時の友こそ、真の友。",
    note: "\"in need\" は「困っているときに」という意味の句。indeed は「本当に」を強調する副詞。",
  },
  "02-09": {
    en: "Charity begins at home.",
    author: "English Proverb",
    ja: "慈善はまず家庭から始まる。",
    note: "\"begin at X\" は「Xから始まる」という意味の表現。",
  },
  "02-10": { author: "Proverb" },
  "02-12": { author: "Proverb" },
  "02-17": { author: "Proverb" },
  "02-20": { author: "Proverb" },
  "02-21": {
    en: "Where there is unity, there is strength.",
    author: "English Proverb",
    ja: "団結あるところに、力あり。",
    note: "\"where there is A, there is B\" は「Aがある所には、Bがある」という構文。",
  },
  "02-22": {
    en: "It is never too late to learn.",
    author: "English Proverb",
    ja: "学ぶのに、遅すぎるということはない。",
    note: "\"it is never too late to ~\" は「〜するのに遅すぎることはない」という意味の構文。",
  },
  "02-23": {
    en: "The more you learn, the more you realize how much you don't know.",
    author: "Proverb",
    ja: "学べば学ぶほど、自分がいかに知らないかを思い知る。",
    note: "\"the more A, the more B\" は「Aすればするほど、ますますB」という比例を表す構文。",
  },
  "02-25": {
    en: "A good name is better than riches.",
    author: "English Proverb",
    ja: "良い評判は、富にまさる。",
    note: "\"better than X\" は「Xより良い」という意味の比較表現。",
  },
  "02-27": {
    en: "Philosophy begins in wonder.",
    author: "Socrates",
    ja: "哲学は、驚きの中から始まる。",
    note: "\"begin in X\" は「Xの中から始まる」という意味の表現。プラトン『テアイテトス』でソクラテスが語った言葉として知られる。",
  },
  "03-05": {
    en: "Better safe than sorry.",
    author: "English Proverb",
    ja: "後で後悔するより、安全を取れ。",
    note: "\"better A than B\" は「BよりAの方が良い」という比較表現。",
  },
  "03-07": { author: "Proverb" },
  "03-08": {
    en: "There is no royal road to learning.",
    author: "English Proverb",
    ja: "学問に王道なし。",
    note: "\"royal road\" は「王だけが通れる楽な道」から転じて「近道、楽な方法」を意味する比喩表現。",
  },
  "03-11": { author: "Proverb" },
  "03-15": {
    en: "The darkest hour is just before the dawn.",
    author: "English Proverb",
    ja: "夜明け前が、一番暗い。",
    note: "\"just before X\" は「Xの直前に」という意味の表現。",
  },
  "03-18": {
    en: "All that glitters is not gold.",
    author: "English Proverb",
    ja: "光るものすべてが、金とは限らない。",
    note: "\"all that glitters\" は「輝くものすべて」。関係代名詞 that を使った表現。",
  },
  "03-19": {
    en: "Great oaks from little acorns grow.",
    author: "English Proverb",
    ja: "大きな樫の木も、小さなどんぐりから育つ。",
    note: "\"grow\" は自動詞で「育つ」という意味。ここでは倒置により文末に置かれている。",
  },
  "03-25": {
    en: "Beauty is in the eye of the beholder.",
    author: "English Proverb",
    ja: "美は、見る人の目の中にある。（美的感覚は人それぞれ）",
    note: "\"beholder\" は「見る人」という意味の名詞。behold（じっと見る）から派生。",
  },
  "03-27": { author: "Proverb" },
  "03-28": { author: "Proverb" },
  "03-29": { author: "Proverb" },
  "03-30": { author: "Proverb" },
};

// Ids whose author is an unverifiable hyper-specific "[Nation] Proverb" label
// (no fetch path found by the research pass, and the pattern — a generic,
// widely cross-cultural saying tagged with one specific small nation — is a
// known signature of fabricated attribution) but where the wisdom content
// itself isn't specifically disputed. Downgrade to a generic, defensible
// "Proverb" label rather than claim unverifiable cultural specificity.
const DOWNGRADE_IDS = [
  "07-11","07-12","07-14","07-15","07-16","07-17","07-18","07-19","07-20",
  "07-21","07-22","07-23","07-24","07-25","07-26","07-27","07-28","07-29","07-30","07-31",
  "08-15","08-16","08-17","08-18","08-20","08-21","08-22","08-23","08-24",
  "08-25","08-26","08-27","08-28","08-29","08-30",
  "10-19","10-20","10-21","10-23","10-24","10-25","10-26","10-27","10-28","10-29","10-30","10-31",
  "11-20","11-21","11-23","11-24","11-25","11-26","11-27","11-28","11-29","11-30",
  "12-01","12-03","12-04","12-05","12-06","12-07","12-08","12-09","12-10",
  "12-11","12-12","12-13","12-14","12-15","12-16","12-17","12-18","12-19","12-20",
  "12-21","12-22","12-23","12-24","12-25","12-26","12-27","12-28","12-29","12-30",

  // --- Apr/May/Jun batch (kept: Chinese/Japanese/English/French/German/
  // Spanish/Italian/Russian/Arabic/Latin as established proverb-book
  // categories; downgraded everything narrower with no fetch path) ---
  "04-11","04-12","04-13","04-14","04-16","04-17","04-18","04-19","04-20",
  "04-21","04-22","04-23","04-24","04-25",
  "05-13","05-14","05-15","05-16","05-17","05-20","05-21","05-22","05-23",
  "05-24","05-25","05-26","05-27","05-28","05-29","05-30","05-31",
  "06-23",
];

let changed = 0;
for (const q of QUOTES) {
  if (PATCHES[q.id]) {
    Object.assign(q, PATCHES[q.id]);
    changed++;
  }
  if (DOWNGRADE_IDS.includes(q.id) && q.author !== "Proverb") {
    q.author = "Proverb";
    changed++;
  }
}

// Integrity checks
const ids = new Set(QUOTES.map((q) => q.id));
if (ids.size !== QUOTES.length) throw new Error("duplicate ids after patch");
const ens = new Map();
for (const q of QUOTES) {
  if (q.en.includes("__DUPLICATE_SKIP__") || q.author === "__DUPLICATE_SKIP__") {
    throw new Error(`unresolved placeholder left in ${q.id}`);
  }
  if (ens.has(q.en)) throw new Error(`duplicate en text: ${q.id} and ${ens.get(q.en)}`);
  ens.set(q.en, q.id);
}
for (const q of QUOTES) {
  const expected = String(q.month).padStart(2, "0") + "-" + String(q.day).padStart(2, "0");
  if (q.id !== expected) throw new Error(`id/month/day mismatch: ${q.id}`);
}

console.log(`Applied patches, ${changed} fields/entries touched. Integrity OK. Writing file...`);

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const header = `import type { Quote } from "./types";\n\nexport const QUOTES: Quote[] = [\n`;
const body = QUOTES.map(
  (q) =>
    `  {\n` +
    `    id: "${q.id}",\n` +
    `    month: ${q.month},\n` +
    `    day: ${q.day},\n` +
    `    en: "${esc(q.en)}",\n` +
    `    author: "${esc(q.author)}",\n` +
    `    ja: "${esc(q.ja)}",\n` +
    `    note: "${esc(q.note)}",\n` +
    `  },`
).join("\n");
const footer = `\n];\n`;

await writeFile(dataPath, header + body + footer, "utf8");
console.log(`Wrote ${QUOTES.length} entries to src/data/quotes.ts`);
