import { client } from './client'
import { postQuery } from './queries'

export interface PostDetail {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  image?: {
    asset: {
      _ref: string
      _type: string
    }
  }
  body?: any[]
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return await client.fetch<PostDetail | null>(postQuery, { slug })
}
