import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { projectId, dataset } from './client'

export const urlFor = (source: SanityImageSource) => {
  if (!projectId || !dataset) return null
  return imageUrlBuilder({ projectId, dataset }).image(source)
}
