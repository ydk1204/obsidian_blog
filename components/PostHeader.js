import Link from 'next/link'

export default function PostHeader({ title, date, tags }) {
  return (
    <header className="mb-8">
      <nav className="text-sm breadcrumbs">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li>{title}</li>
        </ul>
      </nav>
      <h1 className="text-4xl font-bold mt-4 mb-2">{title}</h1>
      <div className="text-gray-600 mb-2">{new Date(date).toLocaleDateString()}</div>
      <div className="flex flex-wrap">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2">
            {tag}
          </span>
        ))}
      </div>
    </header>
  )
}
