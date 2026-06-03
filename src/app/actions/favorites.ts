'use server'

import { getGamesByIds } from '@/lib/db'

export async function fetchFavoriteGames(ids: string[]) {
  return getGamesByIds(ids)
}
