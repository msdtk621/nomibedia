export const categoryImages: Record<string, string> = {
  karaoke: '/mic.jpeg',
  dice: '/dice.jpeg',
  darts: '/darts.jpeg',
  trump: '/cards.jpeg',
  drinking: '/beer.jpeg',
  other: '/star.jpeg',
}

export function getCategoryImage(slug?: string | null): string {
  return slug ? (categoryImages[slug] ?? '/star.jpeg') : '/star.jpeg'
}
