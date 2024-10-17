import Link from 'next/link'

const Tag = ({ children }) => (
  <Link href={`/tags/${encodeURIComponent(children)}`} passHref>
    <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
      {children}
    </span>
  </Link>
)

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
