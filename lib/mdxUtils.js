import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkCallouts from 'remark-callouts'

const postsDirectory = path.join(process.cwd(), 'content')

let fs
if (typeof window === 'undefined') {
  fs = require('fs')
}

export function getAllPosts() {
  if (typeof window !== 'undefined') return []

  const files = getFiles(postsDirectory)
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, `${file}`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontMatter: {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : null,
        tags: data.tags || []
      },
      content
    }
  })

  return posts.sort((a, b) => {
    if (a.frontMatter.date && b.frontMatter.date) {
      return new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
    }
    return 0
  })
}

function getFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir)

  items.forEach(item => {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFiles(fullPath).map(file => `${item}/${file}`))
    } else if (path.extname(item) === '.md') {
      files.push(item)
    }
  })

  return files
}

export function getDirectoryStructure(dir = postsDirectory) {
  if (typeof window !== 'undefined') return []

  const files = fs.readdirSync(dir)
  const structure = []

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      structure.push({
        name: file,
        type: 'directory',
        children: getDirectoryStructure(filePath)
      })
    } else if (path.extname(file) === '.md') {
      const slug = path.relative(postsDirectory, filePath).replace(/\.md$/, '')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      if (data.date && data.date instanceof Date) {
        data.date = data.date.toISOString()
      }
      
      structure.push({
        name: file,
        type: 'file',
        slug: slug,
        frontMatter: data,
        content: content
      })
    }
  })

  return structure
}

function flattenStructure(structure, prefix = '') {
  return structure.reduce((acc, item) => {
    if (item.type === 'directory') {
      return [...acc, ...flattenStructure(item.children, `${prefix}${item.name}/`)]
    } else {
      return [...acc, { ...item, slug: `${prefix}${item.slug}` }]
    }
  }, [])
}

export function getPostBySlug(slug) {
  const posts = getAllPosts()
  const normalizedSlug = slug.replace(/\.md$/, '').replace(/\\/g, '/')
  const post = posts.find(post => post.slug === normalizedSlug)
  
  if (!post) {
    console.error(`Post not found for slug: ${normalizedSlug}`)
    return null
  }

  return post
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

export function getFolderStructure(posts) {
  const structure = {}
  posts.forEach(post => {
    const parts = post.slug.split('/')
    let current = structure
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? post : {}
      }
      current = current[part]
    })
  })
  return structure
}
