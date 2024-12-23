import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'
import ReactMarkdown from 'react-markdown'

export default function Search({ posts, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const searchRef = useRef(null)
  const router = useRouter()
  const { theme } = useTheme()

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
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term) {
      const filtered = posts.filter(post => 
        post.frontMatter.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.frontMatter.tags?.some(tag => tag.toLowerCase().includes(term))
      )

      setSearchResults(filtered)
      setSelectedPost(filtered.length > 0 ? filtered[0] : null)
    } else {
      setSearchResults([])
      setSelectedPost(null)
    }
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleSelectedPostClick = () => {
    if (selectedPost) {
      router.push(`/posts/${selectedPost.slug}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 backdrop-blur ${theme} overflow-y-auto`}>
      <div 
        ref={searchRef} 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-4xl mt-20 flex flex-col"
        style={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#ffffff',
          maxHeight: searchTerm ? 'calc(100vh - 40px)' : 'auto'  // 검색어가 있을 때만 최대 높이 설정
        }}
      >
        <input
          type="text"
          placeholder="제목, 내용 또는 태그로 검색..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          }}
          autoFocus
        />
        {searchTerm && (
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            <div className="w-full lg:w-1/3 mb-4 lg:mb-0 lg:pr-4 overflow-x-auto lg:overflow-y-auto lg:border-r border-gray-300 dark:border-gray-600 scrollbar-hide">
              <div className="flex lg:flex-col">
                {searchResults.map(post => (
                  <div 
                    key={post.slug} 
                    className={`flex-shrink-0 w-48 flex flex-col justify-center items-start lg:w-auto py-1 px-2 mb-1 mr-2 lg:mr-0 cursor-pointer rounded`}
                    style={{
                      backgroundColor: selectedPost === post ? '#FD8B51' : theme === 'dark' ? '#171717' : '#FAF8F8',
                      color: theme === 'dark' ? '#000000' : '#ffffff',
                    }}
                    onClick={() => handlePostClick(post)}
                  >
                    <h3 className={`font-semibold mt-0 text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{post.frontMatter.title}</h3>
                    {post.frontMatter.tags && (
                      <div className="flex flex-wrap mt-1">
                        {post.frontMatter.tags.map(tag => (
                          <span key={tag} className="text-xs mr-1 mb-1 px-1 rounded"
                            style={{
                              backgroundColor: theme === 'dark' ? '#171750' : '#FAF8F8',
                              color: theme === 'dark' ? '#ffffff' : '#000000',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-2/3 lg:pl-4 overflow-y-auto" style={{ height: 'calc(100vh - 300px)' }}>
              {selectedPost && (
                <div 
                  className="cursor-pointer" 
                  onClick={handleSelectedPostClick}
                >
                  <h2 className="text-2xl font-bold mb-2 dark:text-white">{selectedPost.frontMatter.title}</h2>
                  <div className="prose dark:prose-invert max-w-none overflow-y-auto">
                    <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
