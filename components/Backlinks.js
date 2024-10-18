import Link from 'next/link'

export default function Backlinks({ currentSlug, posts }) {
  const flattenPosts = (posts) => {
    return posts.reduce((acc, post) => {
      if (post.type === 'file') {
        acc.push(post);
      } else if (post.type === 'directory' && post.children) {
        acc = acc.concat(flattenPosts(post.children));
      }
      return acc;
    }, []);
  };

  const flattenedPosts = flattenPosts(posts);

  const backlinks = flattenedPosts.filter(post => 
    post.content && post.content.includes(currentSlug) && post.slug !== currentSlug
  )

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Backlinks</h2>
      {backlinks.length > 0 ? (
        <ul>
          {backlinks.map(post => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
                {post.frontMatter.title || post.name.replace('.md', '')}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No backlinks found</p>
      )}
    </div>
  )
}
