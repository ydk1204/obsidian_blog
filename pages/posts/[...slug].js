import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Layout from '../../components/Layout'
import PostHeader from '../../components/PostHeader'
import DisqusComments from '../../components/DisqusComments'
import Callout from '../../components/Callout'
import { getPostBySlug, getAllPosts, getFolderStructure } from '../../lib/mdxUtils'
import { useEffect, useRef, useMemo, useState } from 'react'
import Prism from 'prismjs'
import { FaCopy } from 'react-icons/fa'
import slugify from 'slugify'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContext'
import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'

// Prism 언어 지원을 위한 import
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markdown'

const PreComponent = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);
  const code = children.props.children.trim();
  const language = children.props.className ? children.props.className.replace('language-', '') : '';
  const lines = code.split('\n');
  
  useEffect(() => {
    setIsMounted(true);
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // 2초 후에 메시지 숨김
  };

  if (!isMounted) {
    return <pre className={`language-${language}`}><code>{code}</code></pre>;
  }

  return (
    <pre className={`language-${language} relative`}>
      <code ref={codeRef} className={`language-${language}`}>
        {lines.map((line, index) => (
          <div key={index} className="table-row">
            <span className="table-cell text-right pr-4 select-none text-gray-500 dark:text-gray-400" style={{userSelect: 'none', width: '2em'}}>{index + 1}</span>
            <span className="table-cell" dangerouslySetInnerHTML={{ __html: Prism.highlight(line, Prism.languages[language], language) }} />
          </div>
        ))}
      </code>
      <button className="copy-button absolute top-2 right-2" onClick={handleCopy} aria-label="코드 복사">
        <FaCopy />
      </button>
      {isCopied && (
        <span className="absolute top-10 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
          Copy!
        </span>
      )}
    </pre>
  );
};

const createComponents = (posts) => ({
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
  mark: ({ children, style, ...props }) => {
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
    return <mark style={styleObject} {...props}>{children}</mark>;
  },
  pre: PreComponent,
  Callout: Callout,
  DisqusComments: () => {
    console.log('DisqusComments rendered from MDX')
    return null // 임시로 null을 반환
  },
  a: ({ href, children }) => {
    if (href.startsWith('[[') && href.endsWith(']]')) {
      const fileName = href.slice(2, -2)
      return (
        <ul className="mb-4">
          <li>
            <Link href={`/posts/${fileName}`} className="text-gray-500 no-underline">
              {children}
            </Link>
          </li>
        </ul>
      )
    }
    if (href.startsWith('http') || href.startsWith('https')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
          {children}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )
    }
    return <a href={href}>{children}</a>
  },
  p: ({ children }) => {
    if (Array.isArray(children)) {
      return (
        <p className="mb-4">
          {children.map((child, index) => {
            if (typeof child === 'string' && child.match(/\[\[.*?\]\]/)) {
              const links = child.match(/\[\[.*?\]\]/g);
              const parts = child.split(/\[\[.*?\]\]/);
              return (
                <React.Fragment key={index}>
                  {parts.map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {links[i] && (
                        <Link href={`/posts/${links[i].slice(2, -2)}`} className="text-gray-500 no-underline">
                          {links[i].slice(2, -2)}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            }
            return child;
          })}
        </p>
      );
    }
    return <p>{children}</p>;
  },
  ul: ({ children }) => {
    return (
      <ul className="mb-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === 'li') {
            const liChildren = React.Children.toArray(child.props.children);
            return (
              <li>
                {liChildren.map((liChild, index) => {
                  if (typeof liChild === 'string' && liChild.match(/\[\[.*?\]\]/)) {
                    const links = liChild.match(/\[\[.*?\]\]/g);
                    const parts = liChild.split(/\[\[.*?\]\]/);
                    return (
                      <React.Fragment key={index}>
                        {parts.map((part, i) => (
                          <React.Fragment key={i}>
                            {part}
                            {links[i] && (() => {
                              const linkText = links[i].slice(2, -2);
                              const linkedPost = posts.find(post => 
                                post.frontMatter.title === linkText || 
                                post.slug === linkText ||
                                post.slug.endsWith(linkText)
                              );
                              if (linkedPost) {
                                return (
                                  <Link href={`/posts/${linkedPost.slug}`} className="text-gray-500 no-underline">
                                    {linkText}
                                  </Link>
                                );
                              }
                              return linkText;
                            })()}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    );
                  } else if (React.isValidElement(liChild) && liChild.type === 'a' && (liChild.props.href.startsWith('http') || liChild.props.href.startsWith('https'))) {
                    return React.cloneElement(liChild, {
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center",
                      children: (
                        <>
                          {liChild.props.children}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </>
                      )
                    });
                  }
                  return liChild;
                })}
              </li>
            );
          }
          return child;
        })}
      </ul>
    );
  },
});

function preprocessContent(content) {
  // 기존의 span과 mark 처리 로직 유지
  content = content.replace(
    /<(span|mark) style="([^"]+)">([^<]+)<\/(span|mark)>/g,
    (match, tag, style, text) => {
      const styleObject = style.split(';').reduce((acc, item) => {
        const [key, value] = item.split(':');
        if (key && value) {
          const camelCaseKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          acc[camelCaseKey] = value.trim();
        }
        return acc;
      }, {});
      return `<${tag} style={${JSON.stringify(styleObject)}}>${text}</${tag}>`;
    }
  );

  // 콜아웃 처리 로직 수정
  content = content.replace(
    /^>\s*\[!(note|abstract|info|tip|success|question|warning|fail|error|bug|example|quote|faq)\](\+|-|)\s*(.*)\n((?:>\s*.*(?:\n|$))*)/gm,
    (match, type, collapsibleState, title, content) => {
      const processedContent = content.replace(/^>\s?/gm, '').trim();
      const isCollapsible = collapsibleState === '+' || collapsibleState === '-';
      const isInitiallyOpen = collapsibleState === '+' || collapsibleState === '';
      const finalTitle = title.trim() || type;
      return `<Callout type="${type}" title="${finalTitle}" isCollapsible={${isCollapsible}} isInitiallyOpen={${isInitiallyOpen}}>${processedContent}</Callout>`;
    }
  );

  return content;
}

export default function Post({ source, frontMatter, posts, slug, folderStructure }) {
  const components = useMemo(() => createComponents(posts), [posts])
  const router = useRouter()
  const { theme } = useTheme()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const folderPath = slug.split('/').slice(0, -1)

  return (
    <Layout initialPosts={posts} folderStructure={folderStructure}>
      <Head>
        <title>{frontMatter.title}</title>
        <meta name="description" content={frontMatter.description || '포스트 내용'} />
      </Head>
      <article className="prose dark:prose-invert max-w-none">
        <div className="my-4 text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder}>
              {' / '}
              <Link href={`/folders/${folderPath.slice(0, index + 1).join('/')}`} className="hover:underline">
                {folder}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-4 mt-0">{frontMatter.title}</h1>
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          {new Date(frontMatter.date).toLocaleDateString()}
        </div>
        {frontMatter.tags && (
          <div className="mb-4">
            {frontMatter.tags.map(tag => (
              <Link key={tag} href={`/tags/${tag}`} className="mr-2 px-2 py-1 rounded-full text-sm" style={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#DEE5D4',
                color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
              }}>
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <MDXRemote {...source} components={components} />
      </article>
      <DisqusComments slug={slug} title={frontMatter.title} />
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug
  const post = getPostBySlug(slug)
  if (!post) {
    return { notFound: true }
  }

  const preprocessedContent = preprocessContent(post.content)

  const mdxSource = await serialize(preprocessedContent, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: post.frontMatter,
  })
  const posts = getAllPosts().map(post => ({
    ...post,
    content: post.content
  }))
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
