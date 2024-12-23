import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import Search from './Search'
import GraphView from './GraphView'
import Backlinks from './Backlinks'
import FullGraphView from './FullGraphView'
import dynamic from 'next/dynamic'
import { getAllPosts } from '../lib/mdxUtils'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Footer from "../components/Footer";

const TableOfContents = dynamic(() => import('./TableOfContents'), { 
  ssr: false,
  loading: () => <p>목차를 불러오는 중...</p>
})

export default function Layout({ children, initialPosts, folderStructure, filteredPosts }) {
  const { theme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [posts, setPosts] = useState(initialPosts || [])
  const router = useRouter()
  const currentSlug = router.query.slug ? router.query.slug.join('/') : ''
  const isPostPage = router.pathname === '/posts/[slug]'
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const mainContentRef = useRef(null)
  const leftSidebarRef = useRef(null)
  const rightSidebarRef = useRef(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFullGraphViewOpen, setIsFullGraphViewOpen] = useState(false)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe && leftSidebarOpen) {
      closeSidebar('left')
    } else if (isRightSwipe && !leftSidebarOpen && !rightSidebarOpen) {
      openSidebar('left')
    } else if (isRightSwipe && rightSidebarOpen) {
      closeSidebar('right')
    } else if (isLeftSwipe && !rightSidebarOpen && !leftSidebarOpen) {
      openSidebar('right')
    }
  }

  const openSidebar = (side) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    if (side === 'left') {
      setLeftSidebarOpen(true)
      setRightSidebarOpen(false)
    } else {
      setRightSidebarOpen(true)
      setLeftSidebarOpen(false)
    }
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const closeSidebar = (side) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    if (side === 'left') {
      setLeftSidebarOpen(false)
    } else {
      setRightSidebarOpen(false)
    }
    setTimeout(() => setIsTransitioning(false), 300)
  }

  useEffect(() => {
    if (!initialPosts) {
      const fetchPosts = async () => {
        const allPosts = getAllPosts()
        setPosts(allPosts)
      }
      fetchPosts()
    } else {
      setPosts(initialPosts)
    }
  }, [initialPosts])

  const closeAllSidebars = useCallback(() => {
    setLeftSidebarOpen(false)
    setRightSidebarOpen(false)
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev)
  }, [])

  const handleTocClick = useCallback((e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      closeAllSidebars()
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' })
        document.body.style.overflow = 'auto'
      }, 300)
    }
  }, [closeAllSidebars])

  useEffect(() => {
    const handleRouteChange = () => {
      closeAllSidebars()
      setIsSearchOpen(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, closeAllSidebars])

  useEffect(() => {
    const handleBodyScroll = () => {
      if (leftSidebarOpen || rightSidebarOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }

    handleBodyScroll()

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [leftSidebarOpen, rightSidebarOpen])

  const openFullGraphView = useCallback(() => {
    setIsFullGraphViewOpen(true)
  }, [])

  const closeFullGraphView = useCallback(() => {
    setIsFullGraphViewOpen(false)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className={`${theme} flex-grow flex justify-center`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-7xl flex flex-col lg:flex-row relative">
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 lg:hidden ${
              leftSidebarOpen || rightSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`} 
            style={{ minHeight: '110vh' }}
            onClick={closeAllSidebars}
          ></div>
          
          {/* Left Sidebar */}
          <div ref={leftSidebarRef} className={`sidebar rounded-r-2xl lg:rounded-none lg:sticky lg:top-0 lg:h-screen lg:w-64 w-4/5  overflow-y-auto pt-8 px-4 transition-transform duration-300 ease-in-out ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed top-0 left-0 h-full z-50`}
               style={{ minHeight: '110vh' }}>
            <Sidebar onSearchClick={toggleSearch} posts={posts} folderStructure={folderStructure} />
          </div>

          {/* Main Content */}
          <main ref={mainContentRef} className="main-content flex-1 overflow-y-auto px-4 lg:px-6 py-8">
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
          </main>

          {/* Right Sidebar */}
          <div ref={rightSidebarRef} className={`sidebar rounded-l-2xl lg:rounded-none lg:sticky lg:top-0 lg:h-screen lg:w-64 w-4/5 pt-8 flex flex-col px-4 transition-transform duration-300 ease-in-out ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed top-0 right-0 h-full z-50`}
               style={{ minHeight: '110vh' }}>
            <div className="flex flex-col h-full">
              {!router.pathname.startsWith('/tags/') && router.pathname !== '/' && (
                <>
                  <h2 className="text-lg font-semibold mb-2 mt-4">Table of Contents</h2>
                  <div className="mb-4 flex-shrink-0 overflow-y-auto max-h-[30vh]">
                    <TableOfContents 
                      key={router.asPath} 
                      onLinkClick={handleTocClick} 
                    />
                  </div>
                </>
              )}
              <div className="flex-grow flex flex-col min-h-0">
                <div className="w-full max-h-max" style={{ minHeight: '150px', maxHeight: '50vh' }}>
                  <GraphView 
                    posts={posts} 
                    currentSlug={currentSlug} 
                    onOpenFullView={openFullGraphView}
                    filteredPosts={filteredPosts}
                  />
                </div>
                <div className="mt-4 flex-shrink-0 overflow-y-auto flex-grow">
                  <Backlinks currentSlug={currentSlug} posts={posts} />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="fixed bottom-4 right-4 z-50">
            <ThemeToggle />
          </div>

          {/* Search Component */}
          <Search posts={posts} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          {/* Full Graph View */}
          <FullGraphView
            posts={posts}
            isOpen={isFullGraphViewOpen}
            onClose={closeFullGraphView}
          />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
