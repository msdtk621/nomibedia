export const categoryImages: Record<string, string> = {
  karaoke: '/mic.jpeg',
  dice: '/dice.jpeg',
  darts: '/darts.jpeg',
  trump: '/cards.jpeg',
  drinking: '/beer.jpeg',
  other: '/star.jpeg',
}

import { asset } from './asset'

export function getCategoryImage(slug?: string | null): string {
  const path = slug ? (categoryImages[slug] ?? '/star.jpeg') : '/star.jpeg'
  return asset(path)
}
