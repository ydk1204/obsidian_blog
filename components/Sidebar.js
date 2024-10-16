import Link from 'next/link'
import Search from './Search'

export default function Sidebar({ onSearchClick }) {
  return (
    <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <div className="mb-4">
        <Link href="/" className="text-xl font-bold">
          My Obsidian Blog
        </Link>
      </div>
      <div className="mb-4">
        <button onClick={onSearchClick} className="w-full p-2 bg-gray-200 rounded">
          Search
        </button>
      </div>
      <nav>
        <h2 className="text-lg font-semibold mb-2">Pages</h2>
        <ul>
          <li><Link href="/">Home</Link></li>
          {/* 여기에 더 많은 페이지 링크를 추가할 수 있습니다 */}
        </ul>
      </nav>
    </aside>
  )
}
