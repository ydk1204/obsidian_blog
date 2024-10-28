import Layout from '../components/Layout'
import GraphView from '../components/GraphView'
import { getAllPosts, getFolderStructure } from '../lib/mdxUtils'
import Link from 'next/link'
import Head from 'next/head'

export default function Home({ posts, folderStructure }) {
  const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "My Obsidian Blog",
    "url": canonicalUrl,
    "@id": canonicalUrl,
    "description": "블로그 홈페이지"
  };

  return (
    <Layout initialPosts={posts} folderStructure={folderStructure}>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="블로그 홈페이지" />
        <link 
          rel="canonical" 
          href={canonicalUrl}
        />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
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
  const folderStructure = getFolderStructure(posts)
  return {
    props: {
      posts,
      folderStructure
    }
  }
}
