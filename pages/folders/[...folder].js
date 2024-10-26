import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import FolderPage from '../../components/FolderPage'
import { getAllPosts, getFolderStructure } from '../../lib/mdxUtils'
import { useState, useEffect } from 'react'

export default function Folder({ posts, folderStructure }) {
  const router = useRouter()
  const [folderPosts, setFolderPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (router.query.folder) {
      const folderPath = Array.isArray(router.query.folder) ? router.query.folder.join('/') : router.query.folder
      const filteredPosts = posts.filter(post => post.slug.startsWith(folderPath))
      setFolderPosts(filteredPosts)
      setIsLoading(false)
    }
  }, [router.query.folder, posts])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found</div>
  }

  return (
    <Layout 
      initialPosts={posts} 
      folderStructure={folderStructure}
      filteredPosts={folderPosts}
    >
      <FolderPage folderName={Array.isArray(router.query.folder) ? router.query.folder.join('/') : router.query.folder} posts={folderPosts} />
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const folders = [...new Set(posts.flatMap(post => {
    const parts = post.slug.split('/')
    return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1))
  }))]

  const paths = folders.map(folder => ({
    params: { folder }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const posts = getAllPosts()
  const folderStructure = getFolderStructure(posts)
  return { 
    props: { 
      posts, 
      folderStructure,
      initialFolder: params.folder
    } 
  }
}
