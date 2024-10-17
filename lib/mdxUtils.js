import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkCallouts from 'remark-callouts'

const postsDirectory = path.join(process.cwd(), 'content')

let fs
if (typeof window === 'undefined') {
  fs = require('fs')
}

export function getPostSlugs() {
  if (typeof window === 'undefined') {
    return fs.readdirSync(postsDirectory)
  }
  return []
}

export function getPostBySlug(slug) {
  if (typeof window === 'undefined') {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, `${realSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // date를 문자열로 변환
    if (data.date) {
      data.date = new Date(data.date).toISOString()
    }
    
    return { slug: realSlug, frontMatter: data, content }
  }
  return null
}

export function getAllPosts() {
  if (typeof window === 'undefined') {
    const slugs = getPostSlugs()
    const posts = slugs
      .map((slug) => getPostBySlug(slug))
      .filter(post => post && post.frontMatter && post.frontMatter.date) // null 체크 및 date 존재 여부 확인
      .sort((post1, post2) => (new Date(post1.frontMatter.date) > new Date(post2.frontMatter.date) ? -1 : 1))
    return posts
  }
  return []
}

export async function getSerializedPost(slug) {
  const post = getPostBySlug(slug)
  if (!post) return null

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [],
    },
    scope: post.frontMatter,
  })

  return { ...post, mdxSource }
}
