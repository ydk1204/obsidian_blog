import path from 'path'
import matter from 'gray-matter'

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
    if (data.date instanceof Date) {
      data.date = data.date.toISOString()
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
      .sort((post1, post2) => (post1.frontMatter.date > post2.frontMatter.date ? -1 : 1))
    return posts
  }
  return []
}
