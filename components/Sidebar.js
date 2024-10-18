import Link from 'next/link'
import { useSidebar } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Sidebar({ onSearchClick, posts }) {
  const { openFolders, toggleFolder } = useSidebar()
  const { theme } = useTheme()

  const folderStructure = posts.reduce((acc, post) => {
    const parts = post.slug.split('/')
    let current = acc
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? post : {}
      }
      current = current[part]
    })
    return acc
  }, {})

  const renderFolder = (folder, path = []) => {
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
      <Link href="/" className="block mb-4">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
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
      <h2 className="text-lg font-semibold mb-2">Pages</h2>
      {renderFolder(folderStructure)}
    </div>
  )
}
