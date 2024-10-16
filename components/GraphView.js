import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function GraphView({ posts, currentSlug }) {
  const svgRef = useRef()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!posts || posts.length === 0 || !svgRef.current) {
      console.log('No posts data available or SVG not ready')
      return
    }

    setIsReady(true)
  }, [posts])

  useEffect(() => {
    if (!isReady) return

    try {
      const width = 600
      const height = 400
      const nodeRadius = 5

      const svg = d3.select(svgRef.current)
        .attr('viewBox', [0, 0, width, height])
        .attr('width', '100%')
        .attr('height', '100%')

      svg.selectAll('*').remove()

      const g = svg.append('g')

      const relatedPosts = findRelatedPosts(posts, currentSlug)
      const nodes = relatedPosts.map((post, index) => ({ id: post.slug, ...post, index }))
      const links = createLinks(relatedPosts)

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(nodeRadius * 2))

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
        .attr('r', d => d.id === currentSlug ? nodeRadius * 1.5 : nodeRadius)
        .attr('fill', d => d.id === currentSlug ? 'red' : 'steelblue')

      const label = g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => d.frontMatter?.title || '')
        .attr('font-size', '8px')
        .attr('dx', 8)
        .attr('dy', 3)

      node.append('title')
        .text(d => d.frontMatter?.title || '')

      simulation.on('tick', () => {
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

      // 줌 기능 추가
      const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })

      svg.call(zoom)

      // 현재 노드를 중앙으로 이동
      const currentNode = nodes.find(node => node.id === currentSlug)
      if (currentNode) {
        simulation.stop()
        
        const scale = 1
        const x = width / 2 - currentNode.x * scale
        const y = height / 2 - currentNode.y * scale

        g.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale))
      }

      // 클릭 이벤트 추가
      node.on('click', (event, d) => {
        if (d && d.id) {
          window.location.href = `/posts/${d.id}`
        }
      })

      return () => {
        simulation.stop()
      }
    } catch (error) {
      console.error('Error in GraphView:', error)
    }
  }, [isReady, posts, currentSlug])

  return <svg ref={svgRef} style={{width: '100%', height: '400px'}}></svg>
}

function findRelatedPosts(posts, currentSlug) {
  const currentPost = posts.find(post => post.slug === currentSlug)
  if (!currentPost) return posts

  return posts.filter(post => {
    // 현재 포스트 포함
    if (post.slug === currentSlug) return true

    // 태그 기반 관련성 확인
    const hasCommonTags = currentPost.frontMatter.tags?.some(tag => 
      post.frontMatter.tags?.includes(tag)
    )

    // 백링크 확인
    const isBacklinked = currentPost.content.includes(post.slug)

    return hasCommonTags || isBacklinked
  })
}

function createLinks(posts) {
  const links = []
  posts.forEach((post, i) => {
    posts.slice(i + 1).forEach(otherPost => {
      // 태그 기반 링크
      const hasCommonTags = post.frontMatter.tags?.some(tag => 
        otherPost.frontMatter.tags?.includes(tag)
      )

      // 백링크 기반 링크
      const isBacklinked = post.content.includes(otherPost.slug) || 
                           otherPost.content.includes(post.slug)

      if (hasCommonTags || isBacklinked) {
        links.push({ source: post.slug, target: otherPost.slug })
      }
    })
  })
  return links
}
