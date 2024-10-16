import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Search({ posts, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      setSearchResults([])
      setSelectedPost(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    const filteredResults = posts.filter(post =>
      post && post.frontMatter && post.content && (
        post.frontMatter.title.toLowerCase().includes(term.toLowerCase()) ||
        post.content.toLowerCase().includes(term.toLowerCase())
      )
    )

    setSearchResults(filteredResults)
  }

  const handlePostClick = (post) => {
    if (selectedPost && selectedPost.slug === post.slug) {
      window.location.href = `/posts/${post.slug}`
    } else {
      setSelectedPost(post)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur">
      <div ref={searchRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          autoFocus
        />
        <div className="mt-4 flex">
          <ul className="w-1/2 pr-4 overflow-y-auto max-h-96">
            {searchResults.map(post => (
              <li key={post.slug} className="mb-2">
                <button
                  onClick={() => handlePostClick(post)}
                  className="text-blue-500 hover:underline text-left w-full"
                >
                  {post.frontMatter.title}
                </button>
              </li>
            ))}
          </ul>
          {selectedPost && (
            <div className="w-1/2 pl-4 border-l border-gray-300 dark:border-gray-600">
              <h3 className="text-xl font-bold mb-2">{selectedPost.frontMatter.title}</h3>
              <p>{selectedPost.content.substring(0, 300)}...</p>
              <Link href={`/posts/${selectedPost.slug}`} className="text-blue-500 hover:underline">
                더 읽기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
