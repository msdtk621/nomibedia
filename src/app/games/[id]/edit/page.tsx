import { getGame } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getCategories } from '@/lib/db'
import EditForm from './EditForm'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [game, categories] = await Promise.all([getGame(id), getCategories()])
  if (!game) notFound()

  return <EditForm game={game} categories={categories} />
}
