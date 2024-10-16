import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [position, setPosition] = useState('right')

  useEffect(() => {
    setPosition(theme === 'dark' ? 'left' : 'right')
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out"
      style={{ width: '60px', height: '30px', overflow: 'hidden' }}
    >
      <div className={`flex items-center justify-between transition-transform duration-300 ease-in-out ${position === 'left' ? 'transform translate-x-0' : 'transform translate-x-[-30px]'}`}>
        <FaMoon className="text-gray-700 dark:text-yellow-300" />
        <FaSun className="text-yellow-500 dark:text-gray-400" />
      </div>
    </button>
  )
}
