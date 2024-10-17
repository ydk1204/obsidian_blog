import { MDXComponents } from './MDXComponents'

export default function PostHeader({ title, date, tags }) {
  return (
    <div className="mt-4">
      <h1 className="text-3xl font-bold mt-0">{title}</h1>
      <p className="text-gray-500 mt-2">{new Date(date).toLocaleDateString('ko-KR')}</p>
      <div className="mt-4">
        {tags.map(tag => (
          <MDXComponents.Tag key={tag}>{tag}</MDXComponents.Tag>
        ))}
      </div>
    </div>
  )
}
