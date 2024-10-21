import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { SidebarProvider } from '../contexts/SidebarContext'
import { getAllPosts, getFolderStructure } from '../lib/mdxUtils'

function MyApp({ Component, pageProps }) {
  // 서버 사이드에서만 실행되도록 합니다.
  if (typeof window === 'undefined' && !pageProps.folderStructure) {
    const posts = getAllPosts()
    const folderStructure = getFolderStructure(posts)
    pageProps.folderStructure = folderStructure
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Component {...pageProps} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default MyApp
