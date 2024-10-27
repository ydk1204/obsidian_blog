import Link from 'next/link'
import { useSidebar } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'
import Image from 'next/image'
import { useState } from 'react'
import { FaRss, FaSearch } from 'react-icons/fa'

export default function Sidebar({ onSearchClick, posts, folderStructure }) {
  const { openFolders, toggleFolder } = useSidebar()
  const { theme } = useTheme()

  const renderFolder = (folder, path = [], depth = 0) => {
    if (!folder || typeof folder !== 'object') {
      console.error('Invalid folder structure:', folder)
      return null
    }

    const entries = Object.entries(folder)
    return (
      <ul className={`${depth === 0 ? '' : 'pl-4'}`}>
        {entries.map(([key, value]) => {
          const newPath = [...path, key]
          const isOpen = openFolders[newPath.join('/')]
          if (typeof value === 'object' && !value.slug) {
            return (
              <li key={key} className="my-1">
                <button
                  onClick={() => toggleFolder(newPath.join('/'))}
                  className="flex items-center text-left w-full"
                  aria-label={`${key} 폴더 열기/닫기`}
                >
                  <span className={`mr-1 transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''}`}>▶</span>
                  {key}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  {renderFolder(value, newPath, depth + 1)}
                </div>
              </li>
            )
          } else {
            return (
              <li key={key} className="my-1">
                <Link href={`/posts/${value.slug}`} className="hover:underline">
                  {value.frontMatter.title}
                </Link>
              </li>
            )
          }
        })}
      </ul>
    )
  }

  return (
    <div>
      <Link href="/" className="my-4 group h-10 flex items-center">
        <h1 className="text-3xl font-bold mt-4 group-hover:text-2xl group-hover:text-[#EA9900] duration-100">공<span className="hidden nameLogo group-hover:inline-block text-4xl text-[#EA9900]">?</span>부</h1>
      </Link>
      <button 
        onClick={onSearchClick} 
        className="w-full p-2 rounded mb-2 transition-colors flex items-center justify-center"
        style={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
        }}
        aria-label="검색"
      >
        <FaSearch className="mr-2" /> Search
      </button>
      <Link 
        href="/api/feed" 
        className="w-full p-2 rounded mb-4 transition-colors flex items-center justify-center"
        style={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
        }}
        aria-label="RSS 피드"
      >
        <FaRss className="mr-2" /> RSS Feed
      </Link>
      <h2 className="text-lg font-semibold mb-2">탐색기</h2>
      {folderStructure ? (
        renderFolder(folderStructure)
      ) : (
        <p>폴더 구조를 불러오는 중입니다...</p>
      )}
    </div>
  )
}
