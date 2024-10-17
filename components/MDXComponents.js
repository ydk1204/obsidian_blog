import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'

const Tag = ({ children }) => {
  const { theme } = useTheme()

  return (
    <Link href={`/tags/${encodeURIComponent(children)}`} passHref>
      <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        style={{
          backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
        }}
      >
        {children}
      </span>
    </Link>
  )
}

const TagList = ({ tags }) => (
  <div className="mt-4">
    {tags.map(tag => (
      <Tag key={tag}>{tag}</Tag>
    ))}
  </div>
)

export const MDXComponents = {
  Tag,
  TagList,
}
