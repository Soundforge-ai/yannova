import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug, type PostDetail } from '../lib/sanity/post'
import { urlFor } from '../lib/sanity/imageUrl'
import PortableText from '../components/PortableText'

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError('No slug provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const fetchedPost = await getPostBySlug(slug)
        if (!fetchedPost) {
          setError('Post not found')
        } else {
          setPost(fetchedPost)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen max-w-3xl p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto min-h-screen max-w-3xl p-8">
        <div className="text-center text-red-600">
          <p>Error: {error || 'Post not found'}</p>
          <Link to="/posts" className="text-brand-accent hover:underline mt-4 inline-block">
            ← Back to posts
          </Link>
        </div>
      </div>
    )
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link to="/posts" className="hover:underline text-brand-accent">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl object-cover w-full"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          Published: {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  )
}
