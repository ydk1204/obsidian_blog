import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function GraphView({ posts, currentSlug }) {
  const ref = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateDimensions() {
      if (ref.current) {
        const { width } = ref.current.getBoundingClientRect()
        setDimensions({
          width: width,
          height: Math.floor(width * 0.66)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!posts || posts.length === 0 || !ref.current || dimensions.width === 0) return

    const { width, height } = dimensions
    const nodeRadius = 5

    const svg = d3.select(ref.current)
      .html("")
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')

    const relatedPosts = findRelatedPosts(posts, currentSlug)
    const tags = [...new Set(relatedPosts.flatMap(post => post.frontMatter.tags || []))]
    const nodes = [
      ...relatedPosts.map((post, index) => ({ id: post.slug, type: 'post', ...post, index })),
      ...tags.map((tag, index) => ({ id: tag, type: 'tag', index: relatedPosts.length + index }))
    ]
    const links = createLinks(relatedPosts, tags)

    // 현재 노드를 찾습니다
    const currentNode = currentSlug ? nodes.find(node => node.id === currentSlug) : null

    // 방사형 레이아웃을 위한 힘 설정
    const radialForce = d3.forceRadial(100, width / 2, height / 2)
      .strength(node => currentNode && node === currentNode ? 0 : 0.3)

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('radial', radialForce)
      .force('collision', d3.forceCollide().radius(nodeRadius * 4))

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)

    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.type === 'tag' ? nodeRadius * 1.5 : (d.id === currentSlug ? nodeRadius * 2 : nodeRadius))
      .attr('fill', d => d.type === 'tag' ? '#4CAF50' : (d.id === currentSlug ? 'red' : 'steelblue'))

    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.type === 'tag' ? d.id : (d.frontMatter?.title || ''))
      .attr('font-size', '8px')
      .attr('dx', 8)
      .attr('dy', 3)
      .attr('fill', 'var(--foreground)')

    node.append('title')
      .text(d => d.type === 'tag' ? `Tag: ${d.id}` : (d.frontMatter?.title || ''))

    simulation.on('tick', () => {
      // 현재 노드를 중앙에 고정 (현재 노드가 있을 경우에만)
      if (currentNode) {
        currentNode.fx = width / 2
        currentNode.fy = height / 2
      }

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y)
    })

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // 초기 줌 레벨 설정
    const initialScale = 0.8
    const initialTranslateX = (width - width * initialScale) / 2
    const initialTranslateY = (height - height * initialScale) / 2

    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale))

    node.on('click', (event, d) => {
      if (d.type === 'post' && d.id) {
        window.location.href = `/posts/${d.id}`
      } else if (d.type === 'tag') {
        window.location.href = `/tags/${d.id}`
      }
    })

    return () => {
      simulation.stop()
    }
  }, [posts, currentSlug, dimensions])

  return (
    <div className="w-full h-full" style={{ minHeight: '300px' }}>
      <h2 className="text-lg font-semibold mb-2">Graph View</h2>
      <div ref={ref} className="w-full h-full">
        {dimensions.width === 0 && <p>Loading graph...</p>}
      </div>
    </div>
  )
}

function findRelatedPosts(posts, currentSlug) {
  const currentPost = posts.find(post => post.slug === currentSlug)
  if (!currentPost) return posts

  return posts.filter(post => {
    if (post.slug === currentSlug) return true

    // 태그 기반 관련성
    const hasCommonTags = currentPost.frontMatter.tags?.some(tag => 
      post.frontMatter.tags?.includes(tag)
    )

    // 백링크 기반 관련성
    const isBacklinked = currentPost.content.includes(post.slug) || 
                         post.content.includes(currentSlug)

    return hasCommonTags || isBacklinked
  })
}

function createLinks(posts, tags) {
  const links = []
  posts.forEach((post, i) => {
    // 포스트 간 링크
    posts.slice(i + 1).forEach(otherPost => {
      const hasCommonTags = post.frontMatter.tags?.some(tag => 
        otherPost.frontMatter.tags?.includes(tag)
      )
      const isBacklinked = post.content.includes(otherPost.slug) || 
                           otherPost.content.includes(post.slug)

      if (hasCommonTags || isBacklinked) {
        links.push({ source: post.slug, target: otherPost.slug })
      }
    })

    // 포스트와 태그 간 링크
    post.frontMatter.tags?.forEach(tag => {
      if (tags.includes(tag)) {
        links.push({ source: post.slug, target: tag })
      }
    })
  })
  return links
}
