import Layout from '../components/Layout'
import GraphView from '../components/GraphView'
import { getAllPosts } from '../lib/mdxUtils'
import Link from 'next/link'

export default function Home({ posts }) {
  return (
    <Layout initialPosts={posts}>
      <h1 className="text-3xl font-bold mb-4 mt-4">Welcome to My Obsidian Blog</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Graph View</h2>
        <GraphView posts={posts} currentSlug="" />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-2">
              <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
                {post.frontMatter && post.frontMatter.title ? post.frontMatter.title : post.name.replace('.md', '')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  return { 
    props: { posts: JSON.parse(JSON.stringify(posts)) }
  }
}
