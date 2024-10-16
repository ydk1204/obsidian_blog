import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-800 p-2 rounded-full"
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  )
}
