const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://unknown97.pages.dev'
const postsDirectory = path.join(process.cwd(), 'content')

function getAllPosts() {
  const files = getFiles(postsDirectory)
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, `${file}`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      frontMatter: {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : null,
      }
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

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE_URL}</loc>
      </url>
      ${posts
        .map(({ slug }) => {
          return `
        <url>
          <loc>${`${SITE_URL}/posts/${slug}`}</loc>
        </url>
      `
        })
        .join('')}
    </urlset>
  `
}

function generateAndSaveSitemap() {
  const posts = getAllPosts()
  const sitemap = generateSiteMap(posts)
  fs.writeFileSync(path.join(process.cwd(), 'out', 'sitemap.xml'), sitemap)
  console.log('Sitemap generated successfully')
}

generateAndSaveSitemap()
