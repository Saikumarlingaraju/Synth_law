import { useState } from 'react'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import ContractUpload from './ContractUpload'
import AnalysisResults from './AnalysisResults'

interface ContractAnalyzerProps {
  onBack: () => void
}

export interface AnalysisData {
  fileName: string
  riskScore: number
  risks: Array<{
    clause: string
    severity: 'high' | 'medium' | 'low'
    explanation: string
    legalReference: string
    snippet?: string
    summary?: {
      en: string
      hi: string
      te: string
    }
    negotiation?: {
      goal: string
      proposal: string
      issue: string
    }
  }>
  simplification: {
    originalText: string
    simplifiedText: string
    translations: { [key: string]: string }
  }
  negotiation: {
    issues: string[]
    draftEmail: string
    userGoals: string[]
  }
  ragInsights?: {
    legalGrounding: {
      relevantSections: string[]
      precedents: string[]
      standardPractices: string[]
    }
    alternativeLanguage: {
      hindi: string
      telugu: string
    }
    negotiationStrategy: {
      tone: 'assertive' | 'collaborative' | 'defensive'
      priority: number
      emailTemplate: string
    }
  } | null
}

export default function ContractAnalyzer({ onBack }: ContractAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Default to same-origin so Vite dev server proxy can forward /api to backend
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    setAnalysisData(null)
    setErrorMessage(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('contract', file)

      const response = await fetch(`${apiBaseUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const details = await response.json().catch(() => null)
        const message = details?.error || details?.details || 'Analysis failed'
        throw new Error(message)
      }

      const data = await response.json()
      setAnalysisData(data)
      setErrorMessage(null)
    } catch (error) {
      console.error('Analysis error:', error)
      const fallback = error instanceof Error ? error.message : 'Failed to analyze contract. Please try again.'
      setErrorMessage(fallback)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Contract Analyzer</span>
          </h1>
          <p className="text-slate-600">
            Upload your contract and let AI analyze it for risks, translate complex terms, and help you negotiate.
          </p>
        </div>

        {/* Main Content */}
        {!analysisData ? (
          <div className="max-w-2xl mx-auto">
            <ContractUpload
              onFileSelect={handleFileSelect}
              selectedFile={file}
            />

            {file && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Contract...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Analyze Contract
                    </>
                  )}
                </button>

                {analyzing && (
                  <div className="mt-6 glass-card p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Detecting risks...</span>
                        <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Deciphering legal jargon...</span>
                        <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Preparing negotiation strategy...</span>
                        <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && !analyzing && (
                  <div className="mt-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg px-4 py-3 text-sm">
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <AnalysisResults
            data={analysisData}
            onNewAnalysis={() => {
              setFile(null)
              setAnalysisData(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
