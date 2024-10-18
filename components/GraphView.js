import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'

export default function GraphView({ posts, currentSlug }) {
  const ref = useRef(null)
  const router = useRouter()
  const { theme } = useTheme()
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    if (!posts || posts.length === 0 || !ref.current) return

    // currentSlug를 문자열로 변환
    const normalizedCurrentSlug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug

    console.log('Current slug:', normalizedCurrentSlug) // 디버깅용 로그
    console.log('Posts:', posts) // 디버깅용 로그

    const width = 270
    const height = 200
    const nodeRadius = 5

    const svg = d3.select(ref.current)
      .html("")
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')

    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoomLevel(Math.round(event.transform.k * 100))
        updateNodeLabels(event.transform.k)
      })

    svg.call(zoom)

    const isMainPage = normalizedCurrentSlug === ""
    let relatedPosts, relatedTags

    if (isMainPage) {
      relatedPosts = posts
      relatedTags = [...new Set(posts.flatMap(post => post.frontMatter?.tags || []))]
    } else {
      const currentPost = posts.find(post => post.slug === normalizedCurrentSlug)
      console.log('Current post:', currentPost) // 디버깅용 로그
      relatedPosts = findRelatedPosts(posts, currentPost)
      relatedTags = currentPost?.frontMatter?.tags || []
    }

    console.log('Related posts:', relatedPosts) // 디버깅용 로그
    console.log('Related tags:', relatedTags) // 디버깅용 로그

    // 현재 페이지가 관련 포스트에 없다면 추가
    if (!isMainPage && !relatedPosts.some(post => post.slug === normalizedCurrentSlug)) {
      const currentPost = posts.find(post => post.slug === normalizedCurrentSlug)
      if (currentPost) {
        relatedPosts.push(currentPost)
      }
    }

    const nodes = [
      ...relatedPosts.map(post => ({ id: post.slug, type: 'post', ...post })),
      ...relatedTags.map(tag => ({ id: tag, type: 'tag', label: tag }))
    ]

    const links = createLinks(relatedPosts, relatedTags)

    console.log('Nodes:', nodes) // 디버깅용 로그
    console.log('Links:', links) // 디버깅용 로그

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(nodeRadius * 2.5))

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.preventDefault()
        event.stopPropagation()
        if (d.type === 'post') {
          router.push(`/posts/${d.id}`)
        } else if (d.type === 'tag') {
          router.push(`/tags/${d.id}`)
        }
      })

    node.append('circle')
      .attr('r', d => d.type === 'tag' ? nodeRadius * 1.5 : nodeRadius)
      .attr('fill', d => getNodeColor(d, theme, normalizedCurrentSlug))

    const labels = node.append('text')
      .text(d => d.type === 'post' ? d.frontMatter?.title || d.slug : d.label)
      .attr('x', 8)
      .attr('y', '0.31em')
      .style('font-size', '10px')
      .attr('fill', theme === 'dark' ? '#e2e8f0' : '#4a5568')

    function updateNodeLabels(scale) {
      labels.attr('display', scale > 0.5 ? null : 'none')
    }

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [posts, currentSlug, router, theme])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Graph View</h2>
      <div ref={ref} className="w-full h-full" style={{ minHeight: '200px' }}></div>
      <div className="text-xs text-gray-400 mt-2">Zoom: {zoomLevel}%</div>
    </div>
  )
}

function findRelatedPosts(posts, currentPost) {
  if (!currentPost) return []

  return posts.filter(post => {
    if (post.slug === currentPost.slug) return true

    const hasCommonTags = currentPost.frontMatter?.tags?.some(tag => 
      post.frontMatter?.tags?.includes(tag)
    )

    const isBacklinked = (currentPost.content && post.slug && currentPost.content.includes(post.slug)) || 
                         (post.content && currentPost.slug && post.content.includes(currentPost.slug))

    return hasCommonTags || isBacklinked
  })
}

function createLinks(posts, tags) {
  const links = []
  posts.forEach(post => {
    post.frontMatter?.tags?.forEach(tag => {
      if (tags.includes(tag)) {
        links.push({ source: post.slug, target: tag })
      }
    })

    posts.forEach(otherPost => {
      if (post.slug === otherPost.slug) return

      const hasCommonTags = post.frontMatter?.tags?.some(tag => 
        otherPost.frontMatter?.tags?.includes(tag)
      )
      const isBacklinked = (post.content && otherPost.slug && post.content.includes(otherPost.slug)) || 
                           (otherPost.content && post.slug && otherPost.content.includes(post.slug))

      if (hasCommonTags || isBacklinked) {
        links.push({ source: post.slug, target: otherPost.slug })
      }
    })
  })
  return links
}

function getNodeColor(node, theme, currentSlug) {
  if (node.type === 'tag') {
    return theme === 'dark' ? '#4B5563' : '#C7D9B7'
  }
  if (node.id === currentSlug) {
    return theme === 'dark' ? '#111827' : '#A7C28F'
  }
  return theme === 'dark' ? '#1F2937' : '#DEE5D4'
}
