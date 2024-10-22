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
import { inlineStylePlugin } from '../../lib/mdxPlugins'

const components = {
  span: ({ children, style, ...props }) => {
    let styleObject = style;
    if (typeof style === 'string') {
      try {
        styleObject = style.split(';').reduce((acc, item) => {
          const [key, value] = item.split(':');
          if (key && value) {
            const camelCaseKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            acc[camelCaseKey] = value.trim();
          }
          return acc;
        }, {});
      } catch (error) {
        console.error('Failed to parse style string:', style);
        styleObject = {};
      }
    }
    return <span style={styleObject} {...props}>{children}</span>;
  },
  mark: ({ children, style }) => {
    if (style && typeof style === 'string') {
      const styleObject = style.split(';').reduce((acc, item) => {
        const [key, value] = item.split(':');
        if (key && value) {
          const camelCaseKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          acc[camelCaseKey] = value.trim();
        }
        return acc;
      }, {});
      return <mark style={{...styleObject}}>{children}</mark>;
    }
    return <mark>{children}</mark>;
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

function preprocessContent(content) {
  return content.replace(
    /<span style="([^"]+)">([^<]+)<\/span>/g,
    (match, style, text) => {
      const styleObject = style.split(';').reduce((acc, item) => {
        const [key, value] = item.split(':');
        if (key && value) {
          const camelCaseKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          acc[camelCaseKey] = value.trim();
        }
        return acc;
      }, {});
      return `<span style={${JSON.stringify(styleObject)}}>${text}</span>`;
    }
  );
}

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

  const preprocessedContent = preprocessContent(post.content);

  const mdxSource = await serialize(preprocessedContent, {
    mdxOptions: {
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [],
    },
    scope: post.frontMatter,
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
