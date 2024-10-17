import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { getAllPosts } from '../../lib/mdxUtils'
import { useTheme } from '@/contexts/ThemeContext'

export default function TagPage({ posts }) {
  const router = useRouter()
  const { tag } = router.query
  const [selectedTag, setSelectedTag] = useState(tag)
  const { theme } = useTheme()

  const filteredPosts = posts.filter(post => 
    post.frontMatter.tags && post.frontMatter.tags.includes(selectedTag)
  )

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">태그: {selectedTag}</h1>
      <ul>
        {filteredPosts.map(post => (
          <li key={post.slug} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <Link href={`/posts/${post.slug}`} className="text-xl font-semibold hover:underline">
              {post.frontMatter.title}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(post.frontMatter.date).toLocaleDateString('ko-KR')}
            </p>
            <div className="mt-2">
              {post.frontMatter.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block rounded-xl px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const tags = [...new Set(posts.flatMap(post => post.frontMatter.tags || []))]

  const paths = tags.map(tag => ({
    params: { tag }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const posts = getAllPosts()

  return {
    props: {
      posts
    }
  }
}
