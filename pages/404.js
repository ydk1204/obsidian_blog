import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

export default function Custom404() {
  const { theme } = useTheme()
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-6xl font-bold mb-4">후진</h1>
        <h2 className="text-2xl mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8">요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.</p>
        <div className="mb-8">
          <Image 
            src="/404pageImage.png"
            alt="404 이미지" 
            width={300} 
            height={300}
            priority
          />
        </div>
        <Link 
          href="/" 
          className="px-6 py-3 rounded-lg"
          style={{
            backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </Layout>
  )
}
