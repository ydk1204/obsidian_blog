import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Layout from '../../components/Layout'
import PostHeader from '../../components/PostHeader'
import DisqusComments from '../../components/DisqusComments'
import Callout from '../../components/Callout'  // Callout 컴포넌트 import
import { getPostBySlug, getAllPosts, getFolderStructure } from '../../lib/mdxUtils'
import { useEffect, useRef, useMemo, useState } from 'react'
import Prism from 'prismjs'
import { FaCopy } from 'react-icons/fa'
import slugify from 'slugify'
import Link from 'next/link'
import { useTheme } from '../../contexts/ThemeContext'
import { inlineStylePlugin } from '../../lib/mdxPlugins'
import { useRouter } from 'next/router'
import React from 'react'
import Backlinks from '../../components/Backlinks'

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
      <button className="copy-button absolute top-2 right-2" onClick={handleCopy}>
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
  Callout: Callout,  // Callout 컴포넌트 추가
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
};

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
  const contentRef = useRef(null);
  const { theme } = useTheme();
  const router = useRouter();

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
  }, [source]);

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
      <Backlinks currentSlug={slug} posts={posts} />
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
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: post.frontMatter,
  })
  const posts = getAllPosts().map(post => ({
    ...post,
    content: post.content // 여기서 content를 포함시킵니다
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
