import { useEffect, useState } from 'react'
import slugify from 'slugify'

export default function TableOfContents() {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const getHeadings = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const elements = Array.from(article.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      const headingElements = elements.map(element => {
        const text = element.textContent
        const id = element.id || slugify(text, { lower: true, strict: true })
        if (!element.id) {
          element.id = id
        }
        return {
          id: id,
          text: text,
          level: Number(element.tagName.substring(1))
        }
      })
      setHeadings(headingElements)
    }

    getHeadings()

    const observer = new MutationObserver(getHeadings)
    observer.observe(document.querySelector('article'), { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // 헤더의 높이를 고려하여 조정
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      })

      // URL 해시 업데이트
      history.pushState(null, null, `#${id}`)
    } else {
      console.warn(`Element with id "${id}" not found`)
    }
  }

  return (
    <nav className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
      <ul>
        {headings.map(heading => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
            <a 
              href={`#${heading.id}`} 
              className="text-blue-500 hover:underline cursor-pointer"
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
