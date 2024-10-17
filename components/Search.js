import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'  // 테마 컨텍스트 import

export default function Search({ posts, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const searchRef = useRef(null)
  const router = useRouter()
  const { theme } = useTheme()  // 테마 정보 가져오기

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  useEffect(() => {
    const handleRouteChange = () => {
      onClose()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, onClose])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    const filtered = posts.filter(post => 
      post.frontMatter.title.toLowerCase().includes(term.toLowerCase()) ||
      post.content.toLowerCase().includes(term.toLowerCase())
    )

    setSearchResults(filtered)
    setSelectedPost(filtered.length > 0 ? filtered[0] : null)
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur ${theme}`}>
      <div 
        ref={searchRef} 
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#ffffff'
        }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          }}
          autoFocus
        />
        <div className="mt-4 flex">
          <ul className="w-1/2 pr-4 overflow-y-auto max-h-96">
            {searchResults.map(post => (
              <li key={post.slug} className="mb-2">
                <button
                  onClick={() => handlePostClick(post)}
                  className="text-blue-500 hover:underline text-left w-full dark:text-blue-400"
                >
                  {post.frontMatter.title}
                </button>
              </li>
            ))}
          </ul>
          {selectedPost && (
            <div className="w-1/2 pl-4 border-l border-gray-300 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-2 dark:text-white">{selectedPost.frontMatter.title}</h3>
              <p className="dark:text-gray-300">{selectedPost.content.substring(0, 300)}...</p>
              <Link href={`/posts/${selectedPost.slug}`} className="text-blue-500 hover:underline dark:text-blue-400">
                더 읽기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
