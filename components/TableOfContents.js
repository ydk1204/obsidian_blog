import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'

function TableOfContents() {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const router = useRouter()
  const observerRef = useRef(null)

  const getHeadings = useCallback(() => {
    const article = document.querySelector('article')
    if (!article) return []

    return Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(element => ({
      id: element.id,
      text: element.textContent,
      level: Number(element.tagName.substring(1))
    }))
  }, [])

  useEffect(() => {
    const updateHeadings = () => {
      const newHeadings = getHeadings()
      setHeadings(newHeadings)
    }

    updateHeadings()
    router.events.on('routeChangeComplete', updateHeadings)

    return () => {
      router.events.off('routeChangeComplete', updateHeadings)
    }
  }, [getHeadings, router.events])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observerRef.current.observe(element)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings])

  const scrollToHeading = useCallback((id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      history.pushState(null, null, `#${id}`)
    }
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="sticky top-0 max-h-screen overflow-y-auto">
      <ul>
        {headings.map(heading => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
            <a 
              href={`#${heading.id}`} 
              className={`hover:underline cursor-pointer transition-colors duration-200 ${
                activeId === heading.id ? 'text-orange-500 font-bold' : 'text-gray-500'
              }`}
              onClick={(e) => {
                e.preventDefault()
                scrollToHeading(heading.id)
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
