import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { SidebarProvider } from '../contexts/SidebarContext'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Component {...pageProps} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default MyApp
