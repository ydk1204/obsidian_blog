import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'

export default function Sidebar({ onSearchClick, posts }) {
  const { theme } = useTheme()

  return (
    <aside className="w-64 p-4 overflow-y-auto">
      <div className="mb-4">
        <Link href="/" className="text-xl font-bold">
          My Obsidian Blog
        </Link>
      </div>
      <div className="mb-4">
        <button onClick={onSearchClick} className="w-full p-2 rounded"
          style={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          }}
        >
          검색
        </button>
      </div>
      <nav>
        <h2 className="text-lg font-semibold mb-2">페이지</h2>
        <ul>
          <li><Link href="/" className="hover:underline">홈</Link></li>
          {posts.map(post => (
            <li key={post.slug} className="mt-2">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                {post.frontMatter.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
