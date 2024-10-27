import { getAllPosts } from '../../lib/mdxUtils'
import { generateSiteMap } from '../../scripts/generate-sitemap'

export default function handler(req, res) {
  const posts = getAllPosts()
  const sitemap = generateSiteMap(posts)
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
}
