import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import FolderPage from '../../components/FolderPage'
import { getAllPosts, getFolderStructure } from '../../lib/mdxUtils'

export default function Folder({ posts, folderStructure }) {
  const router = useRouter()
  const { folder } = router.query

  const folderPath = Array.isArray(folder) ? folder.join('/') : folder
  const folderPosts = posts.filter(post => post.slug.startsWith(folderPath))

  return (
    <Layout 
      initialPosts={posts} 
      folderStructure={folderStructure}
      filteredPosts={folderPosts}  // 이 줄을 추가합니다
    >
      <FolderPage folderName={folderPath} posts={folderPosts} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const folders = [...new Set(posts.flatMap(post => {
    const parts = post.slug.split('/')
    return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1))
  }))]

  return {
    paths: folders.map(folder => ({ params: { folder } })),
    fallback: false
  }
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const folderStructure = getFolderStructure(posts)
  return { props: { posts, folderStructure } }
}
