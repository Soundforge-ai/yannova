// GROQ queries for Sanity
export const postsQuery = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`

export const postQuery = `*[_type == "post" && slug.current == $slug][0]`
