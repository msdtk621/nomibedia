'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function reportGame(gameId: string, reason: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('reports').insert({ game_id: gameId, reason })
}
