import { Category, Game, Comment } from './types'

export const categories: Category[] = [
  { id: '1', name: 'すべてのゲーム', slug: 'all', icon: '🎮', color: 'text-gray-600' },
  { id: '2', name: 'サイコロ・ダイス', slug: 'dice', icon: '🎲', color: 'text-purple-600' },
  { id: '3', name: 'トランプ', slug: 'trump', icon: '🃏', color: 'text-red-600' },
  { id: '4', name: 'カラオケ', slug: 'karaoke', icon: '🎤', color: 'text-pink-600' },
  { id: '5', name: '言葉・しりとり', slug: 'word', icon: '💬', color: 'text-green-600' },
  { id: '6', name: '山手線ゲーム系', slug: 'yamanote', icon: '🚃', color: 'text-emerald-600' },
  { id: '7', name: '罰ゲーム・飲みゲーム', slug: 'penalty', icon: '🍺', color: 'text-yellow-600' },
  { id: '8', name: 'その他', slug: 'other', icon: '⭐', color: 'text-gray-500' },
]

export const games: Game[] = [
  {
    id: '1',
    title: '酔っ払いサイコロバトル',
    description: 'サイコロを振って出た目で相手とバトル！簡単で盛り上がる鉄板ゲーム！',
    rules: `1. プレイヤーは順番にサイコロを1つ振る
2. 出た目が相手より大きければ相手に1杯飲ませる
3. 出た目が小さければ自分が1杯飲む
4. 同じ目が出たら「乾杯！」してお互い1杯ずつ飲む
5. 5回戦やって、最も多く飲んだ人の負け！`,
    tips: '5が出たら自分が2杯飲むルールを追加するとさらに盛り上がる！',
    required_items: 'サイコロ1個、お酒',
    category_id: '2',
    category: categories[1],
    tags: [{ id: '1', name: 'サイコロ' }, { id: '2', name: 'バトル' }, { id: '3', name: '飲みゲーム' }, { id: '4', name: '盛り上がる' }],
    author_id: 'a1b2c3d4',
    author_name: '匿名',
    like_count: 128,
    comment_count: 45,
    view_count: 3256,
    created_at: '2024-05-20T23:15:00',
  },
  {
    id: '2',
    title: '神経衰弱バババ抜き',
    description: '神経衰弱とばば抜きを組み合わせた新感覚カードゲーム！',
    rules: `1. トランプをシャッフルして全員に配る
2. 神経衰弱のルールでペアを作っていく
3. ペアが作れない場合はばば抜きルールで隣から1枚引く
4. 最後まで残った人が負け`,
    category_id: '3',
    category: categories[2],
    tags: [{ id: '5', name: 'トランプ' }, { id: '6', name: '神経衰弱' }],
    author_id: 'b2c3d4e5',
    author_name: '匿名',
    like_count: 96,
    comment_count: 32,
    view_count: 2100,
    created_at: '2024-05-19T20:00:00',
  },
  {
    id: '3',
    title: 'カラオケ採点バトル',
    description: 'カラオケの採点機能を使って対決！点数が低いほど飲む量が増える！',
    rules: `1. 1人ずつ好きな曲を歌う
2. 採点機能で点数を出す
3. 100点から自分の点数を引いた数だけ飲む（例：70点なら30口）
4. 最高点を出した人はその回パスできる`,
    category_id: '4',
    category: categories[3],
    tags: [{ id: '7', name: 'カラオケ' }, { id: '8', name: '採点' }],
    author_id: 'c3d4e5f6',
    author_name: '匿名',
    like_count: 88,
    comment_count: 27,
    view_count: 1890,
    created_at: '2024-05-18T18:30:00',
  },
  {
    id: '4',
    title: '進化版！山手線ゲーム',
    description: '山手線ゲームをベースに様々な縛りを追加した進化版！',
    rules: `1. テーマを決める（例：動物、食べ物など）
2. リズムに合わせてテーマに沿った言葉を言っていく
3. 言えなかった人、かぶった人、リズムを外した人が飲む
4. テーマは毎ラウンド変わる`,
    category_id: '6',
    category: categories[5],
    tags: [{ id: '9', name: '山手線' }, { id: '10', name: 'リズム' }],
    author_id: 'd4e5f6g7',
    author_name: '匿名',
    like_count: 75,
    comment_count: 18,
    view_count: 1540,
    created_at: '2024-05-17T22:00:00',
  },
  {
    id: '5',
    title: '大富豪で罰ゲーム',
    description: '大富豪の負けた順番で罰ゲームが決まる！',
    rules: `1. 通常通り大富豪をプレイ
2. 大貧民になった人から罰ゲームを引く
3. 罰ゲームカードの内容を実行する
4. 3回大貧民になった人は特別罰ゲーム`,
    category_id: '3',
    category: categories[2],
    tags: [{ id: '11', name: '大富豪' }, { id: '12', name: '罰ゲーム' }],
    author_id: 'e5f6g7h8',
    author_name: '匿名',
    like_count: 61,
    comment_count: 14,
    view_count: 1200,
    created_at: '2024-05-16T21:00:00',
  },
  {
    id: '6',
    title: 'ワードウルフ飲みアレンジ',
    description: '人狼ゲームのワードウルフを飲みゲーにアレンジ！',
    rules: `1. 1人だけ違うお題を与えられたウルフが混じる
2. 会話してウルフを見つける
3. 多数決で指名、ウルフが当たれば全員1杯、外れればウルフ以外が1杯
4. ウルフはバレても自分のワードを当てれば無罪放免`,
    category_id: '5',
    category: categories[4],
    tags: [{ id: '13', name: '人狼' }, { id: '14', name: '心理戦' }],
    author_id: 'f6g7h8i9',
    author_name: '匿名',
    like_count: 54,
    comment_count: 21,
    view_count: 980,
    created_at: '2024-05-15T20:00:00',
  },
]

export const comments: Comment[] = [
  {
    id: '1', game_id: '1', number: 1,
    author_name: '名無しさん@〜ぽん', author_id: 'ZxCvB7eF',
    content: 'シンプルだけどめっちゃ盛り上がるw',
    created_at: '2024-05-20T23:20:15',
  },
  {
    id: '2', game_id: '1', number: 2,
    author_name: '名無しさん@〜ぽん', author_id: 'QweRtYu1',
    content: 'これ罰ゲームにアレンジしてもおもろい\n5が出たら自分が2杯とかにしてるわ',
    created_at: '2024-05-20T23:21:03',
  },
  {
    id: '3', game_id: '1', number: 3,
    author_name: '名無しさん@〜ぽん', author_id: 'LkJH9mN2',
    content: '上司とやったら普通に潰れたww',
    created_at: '2024-05-20T23:22:45',
  },
  {
    id: '4', game_id: '1', number: 4,
    author_name: '名無しさん@〜ぽん', author_id: 'PqRsT3uV',
    content: '>>2 それいいな、次やってみる',
    created_at: '2024-05-20T23:25:00',
    reply_to: 2,
  },
  {
    id: '5', game_id: '1', number: 5,
    author_name: '名無しさん@〜ぽん', author_id: 'WxYz4Ab5',
    content: '昨日やったけど最高に楽しかった！！友達みんなにおすすめした',
    created_at: '2024-05-20T23:30:00',
  },
]

export const popularTags = ['盛り上がる', '簡単', '大人数向け', '罰ゲーム', 'カラオケ', 'サイコロ', 'トランプ', '飲み会']
