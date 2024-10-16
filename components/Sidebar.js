import Link from 'next/link'

export default function Sidebar({ onSearchClick, posts }) {
  return (
    <aside className="w-64 p-4 overflow-y-auto">
      <div className="mb-4">
        <Link href="/" className="text-xl font-bold">
          My Obsidian Blog
        </Link>
      </div>
      <div className="mb-4">
        <button onClick={onSearchClick} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
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
