import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function FolderPage({ folderName, posts }) {
  const { theme } = useTheme()
  const [sortBy, setSortBy] = useState('name') // 'name' 또는 'date'

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.frontMatter.title.localeCompare(b.frontMatter.title)
    } else {
      return new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
    }
  })

  return (
    <div className={`${theme} p-4`}>
      <h1 className="text-2xl font-bold mb-4">{folderName}</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setSortBy('name')}
        >
          이름순
        </button>
        <button
          className={`px-2 py-1 rounded ${sortBy === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setSortBy('date')}
        >
          날짜순
        </button>
      </div>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.slug} className="mb-2">
            <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
              {post.frontMatter.title}
            </Link>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(post.frontMatter.date).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
