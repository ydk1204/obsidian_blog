import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { SidebarProvider } from '../contexts/SidebarContext'
import { getAllPosts, getFolderStructure } from '../lib/mdxUtils'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="YDK의 기술 블로그" />
        <meta name="keywords" content="기술, 프로그래밍, 웹 개발" />
        <meta name="author" content="YDK" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unknown97.pages.dev" />
        <meta property="og:title" content="YDK의 기술 블로그" />
        <meta property="og:description" content="프로그래밍과 웹 개발에 대한 인사이트" />
        <meta property="og:image" content="https://unknown97.pages.dev/og-image.jpg" />
        <link rel="canonical" href="https://unknown97.pages.dev" />
      </Head>
      <ThemeProvider>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp
