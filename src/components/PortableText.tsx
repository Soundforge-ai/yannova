import { PortableText as SanityPortableText, type PortableTextBlock } from '@portabletext/react'
import { urlFor } from '../lib/sanity/imageUrl'

interface PortableTextProps {
  value: PortableTextBlock[]
}

export default function PortableText({ value }: PortableTextProps) {
  if (!Array.isArray(value)) return null

  const components = {
    types: {
      image: ({ value }: any) => {
        const imageUrl = urlFor(value)?.width(800).url()
        if (!imageUrl) return null
        return (
          <img
            src={imageUrl}
            alt={value.alt || 'Image'}
            className="my-4 rounded-lg"
          />
        )
      },
    },
    marks: {
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
        return (
          <a href={value.href} rel={rel} className="text-brand-accent hover:underline">
            {children}
          </a>
        )
      },
    },
    block: {
      h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
      h4: ({ children }: any) => <h4 className="text-lg font-bold mt-3 mb-2">{children}</h4>,
      normal: ({ children }: any) => <p className="mb-4">{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-brand-accent pl-4 my-4 italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => <li>{children}</li>,
      number: ({ children }: any) => <li>{children}</li>,
    },
  }

  return <SanityPortableText value={value} components={components} />
}
