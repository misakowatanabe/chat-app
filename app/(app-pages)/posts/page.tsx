import { createClient as createServerClient } from '@/utils/supabase/server'
import { RealtimePosts } from './realtimePosts'

export default async function Posts() {
  const supabase = createServerClient()
  const { data: serverPosts } = await supabase.from('posts').select()

  return <RealtimePosts serverPosts={serverPosts ?? []} />
}
