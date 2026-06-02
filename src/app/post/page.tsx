import { getCategories } from '@/lib/db'
import PostForm from './PostForm'

export default async function PostPage() {
  const categories = await getCategories()
  return <PostForm categories={categories} />
}
