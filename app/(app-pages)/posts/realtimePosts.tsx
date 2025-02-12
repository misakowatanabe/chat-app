'use client'

import { useEffect, useState } from 'react'
import supabase from 'utils/supabase/client'
import { format, parseISO } from 'date-fns'
import { Input } from 'components/ui/input'
import { SubmitButton } from 'components/submit-button'
import { writeAction } from '@/app/actions'

type Post = {
  id: number
  post: string
  created_at: string
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
      supabase.removeChannel(channelA)
    }
  }, [])

  return (
    <>
      <div>
        {posts.map((el) => (
          <div key={el.id} className="flex flex-col">
            <div>{el.post}</div>
            <div>{format(parseISO(el.created_at), 'HH:mm:ss eeee do MMM, yyyy')}</div>
          </div>
        ))}
      </div>
      <form className="flex-1 flex flex-col min-w-64">
        <Input name="post" placeholder="Write here..." />
        <SubmitButton pendingText="Writing..." formAction={writeAction}>
          Write
        </SubmitButton>
      </form>
    </>
  )
}
