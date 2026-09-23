import { useState, useEffect } from 'react'
import HomePage from './components/home/HomePage'
import InteractiveMap from './components/InteractiveMap'

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'map'>('home')

  // Soporte para navegación con hash (#map o #inicio)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#mapa' || window.location.hash === '#map') {
        setCurrentView('map')
      } else {
        setCurrentView('home')
      }
    }

    // Comprobar estado inicial
    if (window.location.hash === '#mapa' || window.location.hash === '#map') {
      setCurrentView('map')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleOpenMap = () => {
    window.location.hash = 'mapa'
    setCurrentView('map')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToHome = () => {
    window.location.hash = ''
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentView === 'map') {
    return <InteractiveMap onBackToHome={handleBackToHome} />
  }

  return <HomePage onOpenMap={handleOpenMap} />
}
