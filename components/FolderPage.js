import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function FolderPage({ folderName, posts }) {
  const { theme } = useTheme()
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

  return (
    <div className={`${theme} p-4`}>
      <h1 className="text-2xl font-bold mb-4">{folderName}</h1>
      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded ${sortBy === 'name' ? 'font-bold' : ''}`}
          onClick={() => setSortBy('name')}
          style={sortBy === 'name' ? buttonStyle : {}}
        >
          이름순
        </button>
        <button
          className={`px-3 py-1 rounded ${sortBy === 'date' ? 'font-bold' : ''}`}
          onClick={() => setSortBy('date')}
          style={sortBy === 'date' ? buttonStyle : {}}
        >
          날짜순
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {sortedPosts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold mb-2">{post.frontMatter.title}</h2>
                {post.frontMatter.description && (
                  <p className="text-sm text-gray-500 mb-2">{post.frontMatter.description}</p>
                )}
                {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                  <div className="flex flex-wrap">
                    {post.frontMatter.tags.map(tag => (
                      <span key={tag} className="text-xs mr-2 mb-1 px-2 py-1 rounded-full" style={buttonStyle}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 ml-4">
                {new Date(post.frontMatter.date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
