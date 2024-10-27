import { getAllPosts } from '../../lib/mdxUtils'
import RSS from 'rss'

export default async function handler(req, res) {
  const feed = new RSS({
    title: 'YDK의 기술 블로그',
    site_url: 'https://unknown97.pages.dev',
    feed_url: 'https://unknown97.pages.dev/api/feed',
  })

  const posts = getAllPosts()

  posts.forEach((post) => {
    feed.item({
      title: post.frontMatter.title,
      url: `https://unknown97.pages.dev/posts/${post.slug}`,
      date: post.frontMatter.date,
      description: post.frontMatter.description,
    })
  })

  res.setHeader('Content-Type', 'text/xml')
  res.write(feed.xml({ indent: true }))
  res.end()
}
