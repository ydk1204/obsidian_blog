import Link from 'next/link'
import { useSidebar } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'
import Image from 'next/image'

export default function Sidebar({ onSearchClick, posts, folderStructure }) {
  const { openFolders, toggleFolder } = useSidebar()
  const { theme } = useTheme()

  const renderFolder = (folder, path = []) => {
    if (!folder || typeof folder !== 'object') {
      console.error('Invalid folder structure:', folder)
      return null
    }

    const entries = Object.entries(folder)
    return (
      <ul className="pl-4">
        {entries.map(([key, value]) => {
          const newPath = [...path, key]
          const isOpen = openFolders[newPath.join('/')]
          if (typeof value === 'object' && !value.slug) {
            return (
              <li key={key} className="my-1">
                <button
                  onClick={() => toggleFolder(newPath.join('/'))}
                  className="flex items-center text-left w-full"
                >
                  <span className={`mr-1 ${isOpen ? 'transform rotate-90' : ''}`}>▶</span>
                  {key}
                </button>
                {isOpen && renderFolder(value, newPath)}
              </li>
            )
          } else {
            return (
              <li key={key} className="my-1 pl-4">
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
      <Link href="/" className="mb-4 group h-10 flex items-center">
        <h1 className="text-3xl font-bold mt-4 group-hover:text-2xl">공<span className="hidden nameLogo group-hover:inline-block group-hover:text-3xl">?</span>부</h1>
      </Link>
      <button 
        onClick={onSearchClick} 
        className="w-full p-2 rounded mb-4 transition-colors"
        style={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
        }}
      >
        Search
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
