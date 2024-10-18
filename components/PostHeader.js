import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'

export default function PostHeader({ title, date, slug, tags }) {
  const { theme } = useTheme()
  const folderStructure = slug ? slug.split('/').slice(0, -1) : []
  
  return (
    <div className="mb-8">
      <div className="text-sm text-gray-500 mb-2">
        {folderStructure.length > 0 ? (
          <>
            {folderStructure.map((folder, index) => (
              <span key={folder}>
                <Link href={`/folders/${folderStructure.slice(0, index + 1).join('/')}`} className="hover:underline">
                  {folder}
                </Link>
                {index < folderStructure.length - 1 && ' / '}
              </span>
            ))}
            <span> / {title}</span>
          </>
        ) : (
          <>
            <Link href="/" className="hover:underline">Home</Link> / {title}
          </>
        )}
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {date && <p className="text-gray-500 mt-2">{new Date(date).toLocaleDateString()}</p>}
      {tags && tags.length > 0 && (
        <div className="mt-4">
          {tags.map(tag => (
            <Link key={tag} href={`/tags/${tag}`}>
              <span 
                className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                style={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
                  color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
                }}
              >
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
