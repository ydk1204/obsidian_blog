import React, { useEffect, useState, useCallback } from 'react'
import slugify from 'slugify'

function TableOfContents() {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

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
    const newHeadings = getHeadings()
    setHeadings(newHeadings)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -40% 0px' }
    )

    newHeadings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [getHeadings])

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
      <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
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

export default React.memo(TableOfContents)
