import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'
import FullGraphView from './FullGraphView'

export default function GraphView({ posts, currentSlug, onOpenFullView, filteredPosts }) {
  const ref = useRef(null)
  const router = useRouter()
  const { theme } = useTheme()
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullViewOpen, setIsFullViewOpen] = useState(false)
  const simulationRef = useRef(null)

  useEffect(() => {
    if (!posts || posts.length === 0 || !ref.current) return

    const updateDimensions = () => {
      const container = ref.current
      const width = container.clientWidth
      const height = Math.min(200, width * 0.8)

      d3.select(ref.current)
        .select('svg')
        .attr('width', width)
        .attr('height', height)

      if (simulationRef.current) {
        simulationRef.current.force('center', d3.forceCenter(width / 2, height / 2))
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const normalizedCurrentSlug = Array.isArray(currentSlug) ? currentSlug.join('/') : currentSlug

    const width = ref.current.clientWidth
    const height = Math.min(200, width * 0.8)
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

    let nodes = []
    let links = []

    // 페이지 타입에 따라 노드와 링크 생성
    if (router.pathname === '/') {
      // 메인 페이지: FullGraphView와 유사한 방식으로 모든 노드와 링크 표시
      nodes = [
        ...posts.map(post => ({ id: post.slug, type: 'post', ...post })),
        ...Array.from(new Set(posts.flatMap(post => post.frontMatter?.tags || []))).map(tag => ({ id: tag, type: 'tag', label: tag }))
      ]
      links = createFullLinks(posts)
    } else if (router.pathname === '/tags/[tag]') {
      // 태그 페이지: 해당 태그를 가진 페이지와 그 태그들 표시
      const tag = router.query.tag
      const postsWithTag = posts.filter(post => post.frontMatter?.tags?.includes(tag))
      nodes = [
        ...postsWithTag.map(post => ({ id: post.slug, type: 'post', ...post })),
        ...Array.from(new Set(postsWithTag.flatMap(post => post.frontMatter?.tags || []))).map(tag => ({ id: tag, type: 'tag', label: tag }))
      ]
      links = createLinks(postsWithTag)
    } else if (router.pathname === '/folders/[...folder]') {
      // 폴더 페이지: 해당 폴더 내의 페이지와 그 태그들 표시
      const folderPath = router.query.folder.join('/')
      const postsInFolder = posts.filter(post => post.slug.startsWith(folderPath))
      nodes = [
        ...postsInFolder.map(post => ({ id: post.slug, type: 'post', ...post })),
        ...Array.from(new Set(postsInFolder.flatMap(post => post.frontMatter?.tags || []))).map(tag => ({ id: tag, type: 'tag', label: tag }))
      ]
      links = createLinks(postsInFolder)
    } else {
      // 일반 페이지: 현재 페이지, 관련 태그, 백링크, 공통 태그를 가진 페이지 표시
      const currentPost = posts.find(post => post.slug === normalizedCurrentSlug)
      let relatedPosts = currentPost ? [currentPost] : []
      let relatedTags = new Set(currentPost?.frontMatter?.tags || [])

      if (currentPost && currentPost.content) {
        const backlinkedPosts = posts.filter(post => 
          currentPost.content.includes(`[[${post.slug}]]`)
        )
        relatedPosts = [...relatedPosts, ...backlinkedPosts]
      }

      if (currentPost && currentPost.frontMatter && currentPost.frontMatter.tags) {
        posts.forEach(post => {
          if (post.frontMatter?.tags) {
            const hasCommonTag = post.frontMatter.tags.some(tag => relatedTags.has(tag))
            if (hasCommonTag) {
              relatedPosts.push(post)
            }
          }
        })
      }

      relatedPosts = Array.from(new Set(relatedPosts))

      relatedPosts.forEach(post => {
        post.frontMatter?.tags?.forEach(tag => relatedTags.add(tag))
      })

      nodes = [
        ...relatedPosts.map(post => ({ id: post.slug, type: 'post', ...post })),
        ...Array.from(relatedTags).map(tag => ({ id: tag, type: 'tag', label: tag }))
      ]

      links = createLinks(relatedPosts, Array.from(relatedTags), normalizedCurrentSlug)
    }

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(40))
      .force('charge', d3.forceManyBody().strength(150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .force('circular', function(alpha) {
        const center = {x: width / 2, y: height / 2};
        
        nodes.forEach(node => {
          if (node.type === 'post') {
            // 각 페이지 노드를 중심으로 하는 원자 모양 배치
            const relatedTags = nodes.filter(n => 
              n.type === 'tag' && 
              links.some(l => 
                (l.source.id === node.id && l.target.id === n.id) ||
                (l.source.id === n.id && l.target.id === node.id)
              )
            );
            
            const angleStep = (2 * Math.PI) / relatedTags.length;
            relatedTags.forEach((tagNode, index) => {
              const angle = angleStep * index;
              const radius = 22;
              
              // 현재 페이지 노드가 아닌 경우에만 위치 조정
              if (node.id !== normalizedCurrentSlug) {
                const dx = node.x + radius * Math.cos(angle) - tagNode.x;
                const dy = node.y + radius * Math.sin(angle) - tagNode.y;
                tagNode.x += dx * alpha;
                tagNode.y += dy * alpha;
              }
            });
          }
        });
      })

    // 초기 위치만 중앙에 설정하고, fx, fy는 설정하지 않음
    nodes.forEach(node => {
      if (node.id === normalizedCurrentSlug) {
        node.x = width / 2;
        node.y = height / 2;
      }
    })

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
      })
      .on('mouseover', function(event, d) {
        const connectedNodeIds = new Set()
        connectedNodeIds.add(d.id)
        
        // d3 transition을 사용하여 하이라이팅 효과 적용
        link
          .transition()
          .duration(300)
          .style('stroke-opacity', l => {
            if (l.source.id === d.id || l.target.id === d.id) {
              connectedNodeIds.add(l.source.id)
              connectedNodeIds.add(l.target.id)
              return 1
            }
            return 0.1
          })
          .style('stroke-width', l => 
            (l.source.id === d.id || l.target.id === d.id) ? 2 : 1
          )

        node
          .transition()
          .duration(300)
          .style('opacity', n => 
            connectedNodeIds.has(n.id) ? 1 : 0.1
          )
      })
      .on('mouseout', function(event, d) {
        // d3 transition을 사용하여 원래 상태로 복구
        link
          .transition()
          .duration(300)
          .style('stroke-opacity', 0.6)
          .style('stroke-width', 1)
        
        node
          .transition()
          .duration(300)
          .style('opacity', 1)
      })

    node.append('circle')
      .attr('r', d => d.type === 'tag' ? 5 : 7)
      .attr('fill', d => getNodeColor(d, theme, normalizedCurrentSlug))

    const labels = node.append('text')
      .text(d => d.frontMatter?.title || d.label || d.slug)
      .attr('x', d => d.type === 'tag' ? 8 : 10)
      .attr('y', 3)
      .attr('fill', theme === 'dark' ? '#e2e8f0' : '#4a5568')
      .style('font-size', '10px')

    function updateNodeLabels(k) {
      labels.attr('display', k > 0.5 ? 'block' : 'none')
    }

    // tick 이벤트에서 중앙 노드 위치 고정 제거
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

    simulationRef.current = simulation

    return () => {
      window.removeEventListener('resize', updateDimensions)
      simulation.stop()
    }
  }, [posts, currentSlug, router, theme, filteredPosts])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 mt-4">Graph View</h2>
      <div ref={ref} className="w-full" style={{ minHeight: '150px' }}></div>
      <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
        <span>Zoom: {zoomLevel}%</span>
        <button onClick={onOpenFullView} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="전체 그래프 뷰">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <FullGraphView
        posts={posts}
        isOpen={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
      />
    </div>
  )
}

function createLinks(posts, tags = [], currentSlug = '') {
  const links = []
  const currentPost = posts.find(post => post.slug === currentSlug)

  posts.forEach(post => {
    // 포스트와 태그 사이의 링크
    post.frontMatter?.tags?.forEach(tag => {
      links.push({ source: post.slug, target: tag })
    })

    // 백링크로 참조된 페이지들 간의 직접 연결
    if (currentPost && currentPost.content) {
      if (currentPost.content.includes(`[[${post.slug}]]`) || 
          currentPost.content.includes(`[[${post.frontMatter.title}]]`)) {
        links.push({ source: currentSlug, target: post.slug })
      }
    }
  })

  return links
}

function createFullLinks(posts) {
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

function getNodeColor(node, theme, currentSlug) {
  if (node.type === 'tag') {
    return theme === 'dark' ? '#4B5563' : '#C7D9B7'
  }
  if (node.id === currentSlug) {
    return theme === 'dark' ? '#111827' : '#A7C28F'
  }
  return theme === 'dark' ? '#1F2937' : '#DEE5D4'
}
