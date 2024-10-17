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
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out"
      style={{ width: '40px', height: '40px', overflow: 'hidden' }}
    >
      <div className="relative w-full h-full">
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${isAnimating ? 'icon-exit' : ''}`}>
          {displayTheme === 'light' ? (
            <FaMoon className="text-gray-700" />
          ) : (
            <FaSun className="text-yellow-400" />
          )}
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${isAnimating ? 'icon-enter' : 'opacity-0 scale-0'}`}>
          {displayTheme === 'light' ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-700" />
          )}
        </div>
      </div>
    </button>
  )
}