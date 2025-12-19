import {client} from './client'
import {postsQuery} from './queries'

export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
}

export async function getAllPosts(): Promise<Post[]> {
  return await client.fetch<Post[]>(postsQuery)
}
