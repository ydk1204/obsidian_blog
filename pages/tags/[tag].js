import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { getAllPosts, getFolderStructure } from '../../lib/mdxUtils'
import { useTheme } from '@/contexts/ThemeContext'

export default function TagPage({ posts, folderStructure, initialTag }) {
  const router = useRouter()
  const { theme } = useTheme()
  const [selectedTag, setSelectedTag] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (router.query.tag) {
      setSelectedTag(router.query.tag)
      setIsLoading(false)
    }
  }, [router.query.tag])

  useEffect(() => {
    if (posts && posts.length > 0 && selectedTag) {
      setFilteredPosts(posts.filter(post => 
        post.frontMatter && post.frontMatter.tags && post.frontMatter.tags.includes(selectedTag)
      ))
    }
  }, [selectedTag, posts])

  const handleTagClick = (tag) => {
    router.push(`/tags/${tag}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found</div>
  }

  return (
    <Layout 
      initialPosts={posts} 
      folderStructure={folderStructure}
      filteredPosts={filteredPosts}
    >
      <h1 className="text-3xl font-bold mb-6 mt-4">태그: {selectedTag}</h1>
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
              {post.frontMatter.tags && post.frontMatter.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block rounded-xl px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
                  onClick={() => handleTagClick(tag)}
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
  const folderStructure = getFolderStructure(posts)

  return {
    props: {
      posts,
      folderStructure,
      initialTag: params.tag
    }
  }
}
