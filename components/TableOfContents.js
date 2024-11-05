import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import slugify from 'slugify'

function TableOfContents() {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const router = useRouter()
  const observerRef = useRef(null)
  const headingsRef = useRef([])

  const getHeadings = useCallback(() => {
    const article = document.querySelector('article')
    if (!article) return []

    return Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((element, index) => {
      const id = element.id || `heading-${index}-${slugify(element.textContent, { lower: true, strict: true })}`
      element.id = id
      return {
        id,
        text: element.textContent,
        level: Number(element.tagName.substring(1))
      }
    })
  }, [])

  const updateHeadings = useCallback(() => {
    const newHeadings = getHeadings()
    setHeadings(newHeadings)
    headingsRef.current = newHeadings
  }, [getHeadings])

  useEffect(() => {
    updateHeadings()
    router.events.on('routeChangeComplete', updateHeadings)

    return () => {
      router.events.off('routeChangeComplete', updateHeadings)
    }
  }, [updateHeadings, router.events])

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

    headingsRef.current.forEach(heading => {
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
    <nav 
      className="sticky top-0 overflow-y-auto scrollbar-hide" 
      style={{ height: '100%' }}
    >
      <ul className="relative">
        {headings.map((heading, index) => {
          const depth = heading.level - 1;
          return (
            <li 
              key={heading.id} 
              className="relative"
              style={{ 
                paddingLeft: depth > 0 ? `${depth * 0.9}rem` : '0',
                marginBottom: '0'
              }}
            >
              {depth > 0 && (
                <>
                  {Array.from({ length: depth }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute border-l-2 border-gray-500 dark:border-gray-500"
                      style={{
                        left: `${i * 0.9}rem`,
                        top: 0,
                        bottom: 0,
                      }}
                    />
                  ))}
                </>
              )}
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
          );
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
