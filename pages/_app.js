import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { SidebarProvider } from '../contexts/SidebarContext'
import { getAllPosts, getFolderStructure } from '../lib/mdxUtils'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      // 페이지 변경 시 스크롤을 맨 위로 이동
      window.scrollTo(0, 0)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // 서버 사이드에서만 실행되도록 합니다.
  if (typeof window === 'undefined' && !pageProps.folderStructure) {
    const posts = getAllPosts()
    const folderStructure = getFolderStructure(posts)
    pageProps.folderStructure = folderStructure
  }

  useEffect(() => {
    // 웹폰트 최적화를 위한 코드
    if (typeof window !== 'undefined') {
      const WebFont = require('webfontloader');
      WebFont.load({
        google: {
          families: ['Roboto:400,700', 'Open Sans:400,700']
        }
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Component {...pageProps} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default MyApp
