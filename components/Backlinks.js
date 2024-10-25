import Link from 'next/link'

export default function Backlinks({ currentSlug, posts }) {
  // 현재 포스트를 찾습니다
  const currentPost = posts.find(post => post.slug === currentSlug)

  if (!currentPost || !currentPost.content) {
    return null
  }

  // 본문에서 [[파일이름]] 형식의 링크를 찾습니다
  const linkRegex = /\[\[(.*?)\]\]/g
  const links = [...currentPost.content.matchAll(linkRegex)].map(match => match[1])

  // 링크에 해당하는 포스트를 찾습니다
  const linkedPosts = posts.filter(post => 
    links.includes(post.slug) || links.includes(post.frontMatter.title)
  )

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Backlinks</h2>
      {linkedPosts.length > 0 ? (
        <ul>
          {linkedPosts.map(post => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="text-gray-500 hover:underline">
                {post.frontMatter.title || post.slug}
              </Link>
              {/* {post.frontMatter.tags && (
                <span className="ml-2 text-sm text-gray-500">
                  {post.frontMatter.tags.map(tag => `#${tag}`).join(', ')}
                </span>
              )} */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No backlinks found</p>
      )}
    </div>
  )
}
