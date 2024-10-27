import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayTheme, setDisplayTheme] = useState(theme)

  useEffect(() => {
    if (!isAnimating) {
      setDisplayTheme(theme)
    }
  }, [theme, isAnimating])

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 p-2 rounded-full transition-all duration-300 ease-in-out"
      style={{ width: '40px', height: '40px', overflow: 'hidden', backgroundColor: '#1F2937' }}
      aria-label="테마 변경"
    >
      <div className="relative w-full h-full">
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${isAnimating ? 'icon-exit' : ''}`}>
          {displayTheme === 'light' ? (
            <FaMoon className="text-yellow-200" />
          ) : (
            <FaSun className="text-yellow-400" />
          )}
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${isAnimating ? 'icon-enter' : 'opacity-0 scale-0'}`}>
          {displayTheme === 'light' ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-yellow-200" />
          )}
        </div>
      </div>
    </button>
  )
}
