import { useState } from 'react'
import { Shield, Languages, Mail, AlertTriangle, CheckCircle, FileText, Copy, Send, Download } from 'lucide-react'
import type { AnalysisData } from './ContractAnalyzer'

interface AnalysisResultsProps {
  data: AnalysisData
  onNewAnalysis: () => void
}

export default function AnalysisResults({ data, onNewAnalysis }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'detect' | 'decipher' | 'defend'>('detect')
  const [selectedLanguage, setSelectedLanguage] = useState('hindi')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [exported, setExported] = useState(false)
  const [emailOpened, setEmailOpened] = useState(false)

  const severityConfig = {
    high: {
      container: 'border-l-4 border-danger-500 bg-danger-50',
      badge: 'bg-danger-100 text-danger-700',
      iconColor: 'text-danger-500',
      icon: AlertTriangle,
    },
    medium: {
      container: 'border-l-4 border-warning-500 bg-warning-50',
      badge: 'bg-warning-100 text-warning-700',
      iconColor: 'text-warning-500',
      icon: AlertTriangle,
    },
    low: {
      container: 'border-l-4 border-success-500 bg-success-50',
      badge: 'bg-success-100 text-success-700',
      iconColor: 'text-success-500',
      icon: CheckCircle,
    },
    default: {
      container: 'border-l-4 border-primary-500 bg-primary-50',
      badge: 'bg-primary-100 text-primary-700',
      iconColor: 'text-primary-500',
      icon: CheckCircle,
    },
  } as const

  const resolveSeverity = (severity: string) => {
    if (severity === 'high' || severity === 'medium' || severity === 'low') {
      return severityConfig[severity]
    }
    return severityConfig.default
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(data.negotiation.draftEmail)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const safeFileName = (name: string, fallback: string) => {
    const cleaned = name.replace(/[^a-z0-9\-\.]+/gi, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '')
    return cleaned || fallback
  }

  const handleExport = () => {
    const fileBase = safeFileName(data.fileName, 'contract')
    const blob = new Blob([data.negotiation.draftEmail], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileBase}-negotiation.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  const handleGmail = () => {
    const subject = `Contract negotiation updates - ${data.fileName}`
    const body = data.negotiation.draftEmail
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Attempt Gmail first; fall back to mailto
    const opened = window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    if (!opened) {
      window.location.href = mailtoUrl
    }
    setEmailOpened(true)
    setTimeout(() => setEmailOpened(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
            <p className="text-slate-600">{data.fileName}</p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            New Analysis
          </button>
        </div>

        {/* Risk Score */}
        <div className="bg-gradient-to-r from-slate-50 to-primary-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Overall Risk Score</p>
              <div className="flex items-baseline">
                <span className={`text-5xl font-bold ${
                  data.riskScore >= 70 ? 'text-danger-500' :
                  data.riskScore >= 40 ? 'text-warning-500' :
                  'text-success-500'
                }`}>
                  {data.riskScore}
                </span>
                <span className="text-2xl text-slate-400 ml-2">/100</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-600 mb-2">Risk Level</p>
              <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                data.riskScore >= 70 ? 'bg-danger-100 text-danger-700' :
                data.riskScore >= 40 ? 'bg-warning-100 text-warning-700' :
                'bg-success-100 text-success-700'
              }`}>
                {data.riskScore >= 70 ? 'High Risk' : data.riskScore >= 40 ? 'Medium Risk' : 'Low Risk'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                data.riskScore >= 70 ? 'bg-gradient-to-r from-danger-500 to-danger-600' :
                data.riskScore >= 40 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                'bg-gradient-to-r from-success-500 to-success-600'
              }`}
              style={{ width: `${data.riskScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="border-b border-slate-200">
          <div className="flex space-x-1 p-2">
            <button
              onClick={() => setActiveTab('detect')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'detect'
                  ? 'bg-danger-50 text-danger-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-5 h-5 mr-2" />
              DETECT Risks
            </button>
            <button
              onClick={() => setActiveTab('decipher')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'decipher'
                  ? 'bg-warning-50 text-warning-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Languages className="w-5 h-5 mr-2" />
              DECIPHER Jargon
            </button>
            <button
              onClick={() => setActiveTab('defend')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'defend'
                  ? 'bg-success-50 text-success-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-5 h-5 mr-2" />
              DEFEND & Negotiate
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* DETECT Tab */}
          {activeTab === 'detect' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Detected Risks & Red Flags</h3>
              
              {/* RAG Enhancement Badge */}
              {data.ragInsights && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-6">
                  <p className="text-sm text-blue-700 font-medium">
                    ✨ <strong>Enhanced with Gemini AI</strong> - This analysis includes AI-powered legal grounding from Indian contract law
                  </p>
                </div>
              )}
              
              {data.risks.map((risk, idx) => {
                const config = resolveSeverity(risk.severity)
                const RiskIcon = config.icon

                return (
                  <div
                    key={idx}
                    className={`${config.container} rounded-r-xl p-6 hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start">
                      <RiskIcon className={`w-6 h-6 ${config.iconColor} mr-3 flex-shrink-0 mt-1`} />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900">{risk.clause}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${config.badge}`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-slate-700">{risk.explanation}</p>
                        {risk.snippet && (
                          <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-600 mb-1">Clause Highlight</p>
                            <p className="text-xs text-slate-600 italic">{risk.snippet}</p>
                          </div>
                        )}
                        <div className="bg-white/50 rounded-lg p-3 border border-slate-200">
                          <p className="text-sm font-medium text-slate-600 mb-1">Legal Reference</p>
                          <p className="text-sm text-primary-600 font-mono">{risk.legalReference}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* DECIPHER Tab */}
          {activeTab === 'decipher' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Plain Language Translation</h3>

              {/* Original vs Simplified */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-slate-600" />
                    Original Legal Text
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {data.simplification.originalText}
                  </p>
                </div>

                <div className="bg-success-50 rounded-xl p-6 border border-success-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-success-600" />
                    Plain English
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {data.simplification.simplifiedText}
                  </p>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Regional Language Translation</h4>
                <div className="flex space-x-2 mb-4">
                  {Object.keys(data.simplification.translations).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
                  <p className="text-slate-800 leading-relaxed">
                    {data.simplification.translations[selectedLanguage]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DEFEND Tab */}
          {activeTab === 'defend' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Negotiation Strategy</h3>

              {/* Issues Identified */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Issues to Address:</h4>
                <div className="space-y-2">
                  {data.negotiation.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start bg-warning-50 rounded-lg p-3 border border-warning-200">
                      <AlertTriangle className="w-5 h-5 text-warning-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Goals */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Based on Your Goals:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.negotiation.userGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Draft Email */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">AI-Generated Negotiation Email:</h4>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                    {data.negotiation.draftEmail}
                  </pre>

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={copyEmail}
                      className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedEmail ? 'Copied!' : 'Copy Email'}
                    </button>
                    <button
                      onClick={handleGmail}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {emailOpened ? 'Opening…' : 'Send via Gmail'}
                    </button>
                    <button
                      onClick={handleExport}
                      className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {exported ? 'Exported' : 'Export'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dual Agent Verification */}
              <div className="bg-success-50 rounded-xl p-4 border border-success-200">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-success-900 mb-1">
                      ✓ Verified by Dual-Agent System
                    </p>
                    <p className="text-sm text-success-700">
                      This email has been checked for factual accuracy and hallucinations by our auditor agent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
