import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ContractAnalyzer from './components/ContractAnalyzer'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      
      {!showAnalyzer ? (
        <>
          <Hero onGetStarted={() => setShowAnalyzer(true)} />
          <Features />
        </>
      ) : (
        <ContractAnalyzer onBack={() => setShowAnalyzer(false)} />
      )}
      
      <Footer />
    </div>
  )
}

export default App
