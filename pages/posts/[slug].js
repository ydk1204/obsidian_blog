import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Layout from '../../components/Layout'
import PostHeader from '../../components/PostHeader'
import DisqusComments from '../../components/DisqusComments'
import { getPostBySlug, getAllPosts } from '../../lib/mdxUtils'
import Callout from '../../components/Callout'
import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import { FaCopy } from 'react-icons/fa'
import remarkCallouts from 'remark-callouts'
import slugify from 'slugify'

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
};

export default function Post({ source, frontMatter, posts }) {
  const contentRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();

    if (contentRef.current) {
      const articleElement = contentRef.current.querySelector('article');
      if (articleElement) {
        const headings = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          const text = heading.textContent;
          const id = `heading-${index}-${slugify(text, { lower: true, strict: true })}`;
          heading.id = id;
        });
      }
    }
  }, [source]);

  return (
    <Layout initialPosts={posts}>
      <div ref={contentRef}>
        <article className="prose lg:prose-xl">
          <PostHeader 
            title={frontMatter.title} 
            date={frontMatter.date} 
            tags={frontMatter.tags || []} 
          />
          <MDXRemote {...source} components={components} />
          <DisqusComments slug={frontMatter.slug} title={frontMatter.title} />
        </article>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug)
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [
        [remarkCallouts, { 
          titleTagName: 'strong',
          classPrefix: 'callout-',
          customTypes: {
            faq: { title: 'FAQ', icon: 'question-circle' },
            info: { title: 'Info', icon: 'info-circle' },
            warning: { title: 'Warning', icon: 'exclamation-triangle' },
            success: { title: 'Success', icon: 'check-circle' }
          }
        }]
      ],
    },
  })
  const posts = getAllPosts()

  return {
    props: {
      source: mdxSource,
      frontMatter: post.frontMatter,
      posts,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  }
}
