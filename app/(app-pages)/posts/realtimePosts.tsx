'use client'

import { useEffect, useState } from 'react'
import supabase from 'utils/supabase/client'

type Post = {
  id: number
  title: string
  test: boolean
}

type TestProps = {
  serverPosts: Post[]
}

export function RealtimePosts({ serverPosts }: TestProps) {
  const [posts, setPosts] = useState<Post[]>(serverPosts)

  useEffect(() => {
    const channelA = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          setPosts((prev) => [...prev, payload.new as Post])
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          const deletedPost = payload.old as Post
          setPosts((prev) => prev.filter((el) => el.id !== deletedPost.id))
        },
      )
      .subscribe()

    return () => {
      channelA.unsubscribe()
    }
  }, [])

  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
