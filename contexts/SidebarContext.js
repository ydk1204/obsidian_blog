import React, { createContext, useState, useContext, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [openFolders, setOpenFolders] = useState({})

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState')
    if (savedState) {
      setOpenFolders(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(openFolders))
  }, [openFolders])

  const toggleFolder = (folder) => {
    setOpenFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }))
  }

  return (
    <SidebarContext.Provider value={{ openFolders, toggleFolder }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
