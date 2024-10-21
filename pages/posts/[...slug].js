import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Layout from '../../components/Layout'
import PostHeader from '../../components/PostHeader'
import DisqusComments from '../../components/DisqusComments'
import { getPostBySlug, getAllPosts, getFolderStructure } from '../../lib/mdxUtils'
import Callout from '../../components/Callout'
import { useEffect, useRef, useMemo } from 'react'
import Prism from 'prismjs'
import { FaCopy } from 'react-icons/fa'
import remarkCallouts from 'remark-callouts'
import slugify from 'slugify'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContext'

const components = {
  span: ({ children, style, className }) => {
    if (style) {
      const styleObject = typeof style === 'string' 
        ? style.split(';').reduce((acc, item) => {
            const [key, value] = item.split(':');
            if (key && value) {
              const camelCaseKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
              acc[camelCaseKey] = value.trim();
            }
            return acc;
          }, {})
        : style;
      return <span style={styleObject}>{children}</span>;
    }
    return className ? <span className={className}>{children}</span> : <span>{children}</span>;
  },
  mark: ({ children, style }) => {
    const className = style && style.background === '#FF5582A6' ? 'bg-red-200' : 'bg-yellow-200';
    return <span className={className}>{children}</span>;
  },
  pre: ({ children }) => (
    <pre>
      {children}
      <button className="copy-button" onClick={() => navigator.clipboard.writeText(children.props.children)}>
        <FaCopy />
      </button>
    </pre>
  ),
  Callout,
  DisqusComments: () => {
    console.log('DisqusComments rendered from MDX')
    return null // 임시로 null을 반환
  },
};

export default function Post({ source, frontMatter, posts, slug, folderStructure }) {
  const contentRef = useRef(null);
  const { theme } = useTheme();

  const folderPath = useMemo(() => slug.split('/').slice(0, -1), [slug]);
  const breadcrumbs = useMemo(() => [
    { name: 'Home', href: '/' },
    ...folderPath.map((folder, index) => ({
      name: folder,
      href: `/folders/${folderPath.slice(0, index + 1).join('/')}`,
    })),
  ], [folderPath]);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout initialPosts={posts} folderStructure={folderStructure}>
      <div className="mb-2 mt-4">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href}>
            <Link href={crumb.href} className="text-gray-500 hover:underline">
              {crumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && <span className="mx-1 text-gray-500">/</span>}
          </span>
        ))}
      </div>
      <div ref={contentRef}>
        <article className="prose dark:prose-dark max-w-none">
          <h1 className="text-3xl font-bold mb-4 mt-0">{frontMatter.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            {new Date(frontMatter.date).toLocaleDateString('ko-KR')}
          </div>
          <div className="mb-4">
            {frontMatter.tags && frontMatter.tags.map(tag => (
              <Link key={tag} href={`/tags/${tag}`}>
                <span 
                  className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                  style={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
                    color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
                  }}
                >
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
          <MDXRemote {...source} components={components} />
        </article>
      </div>
      {frontMatter.disqus && (
        <DisqusComments key={slug} slug={slug} title={frontMatter.title} />
      )}
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const post = getPostBySlug(slug)
  if (!post) {
    return { notFound: true }
  }

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [],
    },
  })
  const posts = getAllPosts()
  const folderStructure = getFolderStructure(posts)

  return {
    props: {
      source: mdxSource,
      frontMatter: post.frontMatter,
      posts,
      slug,
      folderStructure,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug.split('/') },
    })),
    fallback: false,
  }
}
