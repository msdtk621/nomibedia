export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  color: string
}

export type Tag = {
  id: string
  name: string
}

export type Game = {
  id: string
  title: string
  description: string
  rules: string
  tips?: string | null
  required_items?: string | null
  lose_condition?: string | null
  category_id?: string | null
  category_ids?: string[] | null
  category?: { name: string; icon: string; slug: string } | null
  tags: Tag[]
  thumbnail_url?: string | null
  author_id: string
  author_name?: string | null
  drink_level?: number
  player_count?: string[] | null
  game_flow?: string[] | null
  like_count: number
  comment_count: number
  view_count: number
  created_at: string
}

export type Comment = {
  id: string
  game_id: string
  author_name: string
  author_id: string
  content: string
  created_at: string
  reply_to?: number
  number: number
}
