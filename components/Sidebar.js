import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

function FileExplorer({ posts }) {
  const [expandedFolders, setExpandedFolders] = useState({})

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }))
  }

  const groupPostsByPath = (posts) => {
    const structure = {}
    posts.forEach(post => {
      if (!post.slug) return // slug가 없는 경우 건너뛰기
      const parts = post.slug.split('/')
      let current = structure
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = post
        } else {
          current[part] = current[part] || {}
          current = current[part]
        }
      })
    })
    return structure
  }

  const renderStructure = (structure, basePath = '') => {
    return (
      <ul className="pl-4">
        {Object.entries(structure).map(([key, value]) => {
          const currentPath = `${basePath}/${key}`
          if (typeof value === 'object' && !value.slug) {
            return (
              <li key={currentPath}>
                <span 
                  className="cursor-pointer font-semibold"
                  onClick={() => toggleFolder(currentPath)}
                >
                  {expandedFolders[currentPath] ? '▼' : '▶'} {key}
                </span>
                {expandedFolders[currentPath] && renderStructure(value, currentPath)}
              </li>
            )
          } else {
            return (
              <li key={currentPath}>
                <Link href={`/posts/${value.slug}`} className="hover:underline">
                  {value.frontMatter && value.frontMatter.title ? value.frontMatter.title : key.replace('.md', '')}
                </Link>
              </li>
            )
          }
        })}
      </ul>
    )
  }

  const groupedPosts = groupPostsByPath(posts)
  return renderStructure(groupedPosts)
}

export default function Sidebar({ onSearchClick, posts }) {
  const { theme } = useTheme()

  return (
    <aside className="w-64 p-4 overflow-y-auto">
      <div className="mb-4">
        <Link href="/" className="text-xl font-bold">
          My Obsidian Blog
        </Link>
      </div>
      <div className="mb-4">
        <button onClick={onSearchClick} className="w-full p-2 rounded"
          style={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          }}
        >
          검색
        </button>
      </div>
      <nav>
        <h2 className="text-lg font-semibold mb-2">페이지</h2>
        <FileExplorer posts={posts} />
      </nav>
    </aside>
  )
}
