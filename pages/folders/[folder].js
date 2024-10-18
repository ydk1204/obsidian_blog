import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import FolderPage from '../../components/FolderPage'
import { getAllPosts } from '../../lib/mdxUtils'

export default function Folder({ posts }) {
  const router = useRouter()
  const { folder } = router.query

  const folderPosts = posts.filter(post => post.slug.startsWith(folder))

  return (
    <Layout>
      <FolderPage folderName={folder} posts={folderPosts} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const folders = [...new Set(posts.map(post => post.slug.split('/')[0]))]

  return {
    paths: folders.map(folder => ({ params: { folder } })),
    fallback: false
  }
}

export async function getStaticProps() {
  const posts = getAllPosts()
  return { props: { posts } }
}
