import { useState, useEffect, useRef } from 'react'
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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const mainContentRef = useRef(null)
  const leftSidebarRef = useRef(null)
  const rightSidebarRef = useRef(null)

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

  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
    }
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX
      handleSwipe()
    }
    
    const handleSwipe = () => {
      const swipeThreshold = 50
      if (touchEndX < touchStartX - swipeThreshold) {
        if (!rightSidebarOpen && !leftSidebarOpen) {
          setRightSidebarOpen(true)
        } else if (leftSidebarOpen) {
          setLeftSidebarOpen(false)
        }
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        if (!leftSidebarOpen && !rightSidebarOpen) {
          setLeftSidebarOpen(true)
        } else if (rightSidebarOpen) {
          setRightSidebarOpen(false)
        }
      }
    }
    
    const addSwipeListeners = (element) => {
      if (element) {
        element.addEventListener('touchstart', handleTouchStart)
        element.addEventListener('touchend', handleTouchEnd)
      }
    }
    
    const removeSwipeListeners = (element) => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchend', handleTouchEnd)
      }
    }
    
    addSwipeListeners(mainContentRef.current)
    addSwipeListeners(leftSidebarRef.current)
    addSwipeListeners(rightSidebarRef.current)
    
    return () => {
      removeSwipeListeners(mainContentRef.current)
      removeSwipeListeners(leftSidebarRef.current)
      removeSwipeListeners(rightSidebarRef.current)
    }
  }, [leftSidebarOpen, rightSidebarOpen])

  const closeAllSidebars = () => {
    setLeftSidebarOpen(false)
    setRightSidebarOpen(false)
  }

  // 사이드바 상태에 따라 본문 스크롤 제어
  useEffect(() => {
    if (leftSidebarOpen || rightSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [leftSidebarOpen, rightSidebarOpen])

  // Table of Contents 클릭 이벤트 핸들러
  const handleTocClick = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      closeAllSidebars()
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  // 페이지 변경 감지를 위한 useEffect
  useEffect(() => {
    // 페이지가 변경될 때마다 실행됩니다.
    console.log('Page changed:', router.asPath)
  }, [router.asPath])

  return (
    <div className={`${theme} min-h-screen flex flex-col md:flex-row relative`}>
      {/* Overlay with smooth transition and extended height */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 md:hidden ${
          leftSidebarOpen || rightSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`} 
        style={{ minHeight: '110vh' }}
        onClick={closeAllSidebars}
      ></div>
      
      <div ref={leftSidebarRef} className={`sidebar md:fixed md:left-0 md:top-0 md:h-screen md:w-64 overflow-y-auto pt-8 px-4 transition-transform duration-300 ease-in-out ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed top-0 left-0 h-full w-4/5 max-w-xs z-50 bg-white dark:bg-gray-800`}
           style={{ minHeight: '110vh' }}>
        <Sidebar onSearchClick={toggleSearch} posts={posts} />
      </div>
      <main ref={mainContentRef} className="main-content flex-1 overflow-y-auto px-4 md:px-6 py-8 md:ml-64 md:mr-64">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
      <div ref={rightSidebarRef} className={`sidebar md:fixed md:right-0 md:top-0 md:h-screen md:w-64 overflow-y-auto pt-8 flex flex-col px-4 transition-transform duration-300 ease-in-out ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 fixed top-0 right-0 h-full w-4/5 max-w-xs z-50 bg-white dark:bg-gray-800`}
           style={{ minHeight: '110vh' }}>
        {isPostPage && (
          <TableOfContents 
            key={router.asPath} 
            onLinkClick={handleTocClick} 
          />
        )}
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
