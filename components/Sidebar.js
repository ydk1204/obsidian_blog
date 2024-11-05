import Link from 'next/link'
import { useSidebar } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'
import Image from 'next/image'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

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
      <ul className={`${depth === 0 ? '' : 'pl-4'} relative`}>
        {entries.map(([key, value], index) => {
          const newPath = [...path, key]
          const isOpen = openFolders[newPath.join('/')]
          
          if (typeof value === 'object' && !value.slug) {
            return (
              <li key={key} className="mb-0 relative">
                {depth > 0 && Array.from({ length: depth }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute border-l-2 border-gray-300 dark:border-gray-600"
                    style={{
                      left: `${-0.7 - i}rem`,
                      top: 0,
                      height: '100%'
                    }}
                  />
                ))}
                <div className="flex items-center">
                  <button
                    onClick={() => toggleFolder(newPath.join('/'))}
                    className="flex items-center text-left w-full mb-1"
                    aria-label={`${key} 폴더 열기/닫기`}
                  >
                    <span className={`mr-1 transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''}`}>▶</span>
                    {key}
                  </button>
                </div>
                <div className={`overflow-hidden transition-max-h-screen transition-opacity duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  {renderFolder(value, newPath, depth + 1)}
                </div>
              </li>
            )
          } else {
            return (
              <li key={key} className="mb-0 relative">
                {depth > 0 && Array.from({ length: depth }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute border-l-2 border-gray-300 dark:border-gray-600"
                    style={{
                      left: `${-0.7 - i}rem`,
                      top: 0,
                      height: '100%'
                    }}
                  />
                ))}
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
      <Link href="/" className="my-4 group h-10 flex items-center hover:justify-end duration-300 ease-in-out">
        <h1 className="text-2xl font-bold mt-4 group-hover:text-3xl group-hover:text-[#FE640C] duration-100"><span className="group-hover:hidden">From</span><span className="hidden nameLogo group-hover:inline-block">To</span>  Wor<span className="hidden nameLogo2 group-hover:inline-block text-3xl text-[#FE640C]">l</span>d</h1>
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
      <h2 className="text-lg font-semibold mb-2">탐색기</h2>
      {folderStructure ? (
        renderFolder(folderStructure)
      ) : (
        <p>폴더 구조를 불러오는 중입니다...</p>
      )}
    </div>
  )
}
