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
    <div className={`${theme} min-h-screen flex`}>
      <div className="fixed left-0 top-0 h-screen w-64 overflow-y-auto pt-8">
        <Sidebar onSearchClick={toggleSearch} />
      </div>
      <main className="flex-1 overflow-y-auto ml-20 mr-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <div className="fixed right-0 top-0 h-screen w-64 overflow-y-auto pt-8 flex flex-col">
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
