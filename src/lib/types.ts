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
  tips?: string
  required_items?: string
  category_id: string
  category?: Category
  tags?: Tag[]
  thumbnail_url?: string
  author_id: string
  author_name: string
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
