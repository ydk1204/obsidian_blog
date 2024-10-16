import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import Search from './Search'
import GraphView from './GraphView'
import TableOfContents from './TableOfContents'
import Backlinks from './Backlinks'
import { getAllPosts } from '../lib/mdxUtils'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'

export default function Layout({ children, initialPosts }) {
  const { theme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [posts, setPosts] = useState(initialPosts || [])
  const router = useRouter()
  const currentSlug = router.query.slug || ''

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
      <main className="flex-grow overflow-y-auto ml-64 mr-64 pt-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <div className="fixed right-0 top-0 h-screen w-64 overflow-y-auto pt-8">
        <GraphView posts={posts} currentSlug={currentSlug} />
        <TableOfContents />
        <Backlinks currentSlug={currentSlug} posts={posts} />
      </div>
      <ThemeToggle />
      <Search posts={posts} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
