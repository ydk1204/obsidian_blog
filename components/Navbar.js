import Link from 'next/link'

export default function Navbar({ onSearchClick }) {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My Obsidian Blog
        </Link>
        <div>
          <button onClick={onSearchClick} className="ml-4">
            Search
          </button>
        </div>
      </div>
    </nav>
  )
}
