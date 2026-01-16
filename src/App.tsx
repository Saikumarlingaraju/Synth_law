import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ContractAnalyzer from './components/ContractAnalyzer'
import Features from './components/Features'
import Footer from './components/Footer'
import { AuthGate } from './components/AuthGate'

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
        <AuthGate>
          <ContractAnalyzer onBack={() => setShowAnalyzer(false)} />
        </AuthGate>
      )}
      
      <Footer />
    </div>
  )
}

export default App
