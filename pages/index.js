import Layout from '../components/Layout'
import GraphView from '../components/GraphView'
import { getAllPosts, getFolderStructure } from '../lib/mdxUtils'
import Link from 'next/link'
import Head from 'next/head'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/router'

export default function Home({ posts, folderStructure }) {
  const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { theme } = useTheme()
  const router = useRouter()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "My Obsidian Blog",
    "url": canonicalUrl,
    "@id": canonicalUrl,
    "description": "블로그 홈페이지"
  };

  const handleTagClick = (tag) => {
    router.push(`/tags/${tag}`)
  }

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
      <h1 className="text-3xl font-bold mb-4 mt-4">From Word to World</h1>
      <div className="mb-8">
        <h2 className="">Prologue</h2>
        <h3>내가 바라는 것</h3>
        <p>나의 작은 <span className="font-bold">단어(word)</span>가 <span className="font-bold">세상(World)</span>을 변화 시키길 바랍니다.</p>
        <p>전부터 <span className="font-bold">세상을 놀라게 하고 싶다</span>라는 생각을 가지고 있었습니다.</p>
        <h3>이 생각을 실현시키기 위해</h3>
        <p>좀 더 유익하거나 재미있는 세상을 만들고 싶은 개발자로서 하나씩 배워가는 길입니다.</p>
        <p>더 많은 것을 얻기 위해 더 많은 것을 배웁니다. 그리고 더 많은 것을 줄 수 있을 것이라 생각합니다.</p>
        <p>잘못 된 정보도 많을 수 있지만 하나씩 고치고 쌓아가며 더 나은 내일을 만들려 합니다.</p>
        <hr></hr>
        <h2>모바일 화면 사용방법</h2>
        <p>모바일 화면에서는 모바일 화면에 맞게 최적화된 화면을 표시합니다.</p>
        <p>데스크톱 화면에 존재하는 좌-우 사이드바(패널)의 경우 모바일 화면에서는 좌-우 스와이프 제스처를 통해 열고 닫을 수 있습니다.</p>
        <h3>사용 예시</h3>
        <p className="font-bold">좌측 사이드바</p>
        <li>열기: 좌측에서 우측으로 화면을 스와이프(스크롤) 하면 좌측 사이드바가 열립니다.</li>
        <li>닫기: 반대로 우측에서 좍측으로 스와이프(스크롤) 하거나 사이드바 영역 밖을 터치하면 좌측 사이드바가 닫힙니다.</li>
        <p className="font-bold">우측 사이드바</p>
        <li>열기: 우측에서 좌측으로 화면을 스와이프(스크롤) 하면 우측 사이드바가 열립니다.</li>
        <li>닫기: 반대로 좌측에서 우측으로 스와이프(스크롤) 하거나 사이드바 영역 밖을 터치하면 우측 사이드바가 닫힙니다.</li>
        {/* <GraphView posts={posts} currentSlug="" /> */}
        <hr></hr>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        <ul>
          {posts.slice(0, 4).map((post) => (
            <li key={post.slug} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <Link href={`/posts/${post.slug}`} className="text-xl font-semibold hover:underline">
                {post.frontMatter.title}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(post.frontMatter.date).toLocaleDateString('ko-KR')}
              </p>
              <div className="mt-2">
                {post.frontMatter.tags && post.frontMatter.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block rounded-xl px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                    style={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
