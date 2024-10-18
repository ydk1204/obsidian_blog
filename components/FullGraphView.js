import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'

export default function FullGraphView({ posts, isOpen, onClose }) {
  const ref = useRef(null)
  const { theme } = useTheme()
  const router = useRouter()
  const [zoomLevel, setZoomLevel] = useState(100)

  useEffect(() => {
    if (!isOpen || !posts || posts.length === 0 || !ref.current) return

    const container = ref.current
    const width = container.clientWidth
    const height = container.clientHeight

    const svg = d3.select(container)
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

    // 모든 노드와 링크 생성
    const nodes = [
      ...posts.map(post => ({ id: post.slug, type: 'post', ...post })),
      ...Array.from(new Set(posts.flatMap(post => post.frontMatter?.tags || []))).map(tag => ({ id: tag, type: 'tag', label: tag }))
    ]
    const links = createLinks(posts)

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

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
          router.push(`/posts/${d.slug}`)
        } else if (d.type === 'tag') {
          router.push(`/tags/${d.id}`)
        }
        onClose()
      })

    node.append('circle')
      .attr('r', d => d.type === 'tag' ? 15 : 20)
      .attr('fill', d => getNodeColor(d, theme))

    const labels = node.append('text')
      .text(d => d.frontMatter?.title || d.label || d.slug)
      .attr('x', d => d.type === 'tag' ? 20 : 25)
      .attr('y', 5)
      .attr('fill', theme === 'dark' ? '#e2e8f0' : '#4a5568')
      .style('font-size', '12px')

    function updateNodeLabels(k) {
      labels.attr('display', k > 0.5 ? 'block' : 'none')
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
  }, [isOpen, posts, theme, router])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-4/5 h-4/5 rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div ref={ref} className="w-full h-full"></div>
        <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
          Zoom: {zoomLevel}%
        </div>
      </div>
    </div>
  )
}

function createLinks(posts) {
  const links = []
  posts.forEach(post => {
    // 포스트와 태그 사이의 링크
    post.frontMatter?.tags?.forEach(tag => {
      links.push({ source: post.slug, target: tag })
    })

    // 포스트 간의 링크
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

function getNodeColor(node, theme) {
  if (node.type === 'tag') {
    return theme === 'dark' ? '#4B5563' : '#C7D9B7'
  }
  return theme === 'dark' ? '#1F2937' : '#DEE5D4'
}