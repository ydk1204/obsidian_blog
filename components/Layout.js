import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import Search from './Search'
import GraphView from './GraphView'
import Backlinks from './Backlinks'
import dynamic from 'next/dynamic'
import { getAllPosts } from '../lib/mdxUtils'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'

const TableOfContents = dynamic(() => import('./TableOfContents'), { ssr: false })

export default function Layout({ children, initialPosts }) {
  const { theme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [posts, setPosts] = useState(initialPosts || [])
  const router = useRouter()
  const currentSlug = router.query.slug || ''
  const isPostPage = router.pathname === '/posts/[slug]'

  useEffect(() => {
    if (!initialPosts) {
      const fetchPosts = async () => {
        const allPosts = getAllPosts()
        setPosts(allPosts)
      }
      fetchPosts()
    }
  }, [initialPosts])

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <div className={`${theme} min-h-screen flex flex-col md:flex-row`}>
      <div className="sidebar md:fixed md:left-0 md:top-0 md:h-screen md:w-64 overflow-y-auto pt-8 px-4">
        <Sidebar onSearchClick={toggleSearch} posts={posts} />
      </div>
      <main className="main-content flex-1 overflow-y-auto px-4 md:px-6 py-8 md:ml-64 md:mr-64">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
      <div className="sidebar md:fixed md:right-0 md:top-0 md:h-screen md:w-64 overflow-y-auto pt-8 flex flex-col px-4">
        {isPostPage && <TableOfContents />}
        <div className="flex-grow">
          <GraphView posts={posts} currentSlug={currentSlug} />
        </div>
        <Backlinks currentSlug={currentSlug} posts={posts} />
      </div>
      <ThemeToggle />
      <Search posts={posts} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
