import { ThemeProvider } from '../contexts/ThemeContext'
import "@/styles/globals.css";
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} suppressHydrationWarning />
    </ThemeProvider>
  )
}

export default MyApp
