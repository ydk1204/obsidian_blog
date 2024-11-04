import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'

export default function FolderPage({ folderName, posts }) {
  const { theme } = useTheme()
  const router = useRouter()
  
  const [sortBy, setSortBy] = useState('name')

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.frontMatter.title.localeCompare(b.frontMatter.title)
    } else {
      return new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
    }
  })

  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
    color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
  }

  const handleTagClick = (tag) => {
    router.push(`/tags/${tag}`)
  }

  return (
    <div className={`${theme} p-4`}>
      <h1 className="text-3xl font-bold mb-4 mt-0">폴더: {folderName}</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded ${sortBy === 'name' ? 'font-bold' : ''}`}
          onClick={() => setSortBy('name')}
          style={sortBy === 'name' ? buttonStyle : {}}
          aria-label="이름순"
        >
          이름순
        </button>
        <button
          className={`px-3 py-1 rounded ${sortBy === 'date' ? 'font-bold' : ''}`}
          onClick={() => setSortBy('date')}
          style={sortBy === 'date' ? buttonStyle : {}} 
          aria-label="날자순" 
        >
          날짜순
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <ul>
        {sortedPosts.map((post) => (
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
      </div>
    </div>
  )
}
