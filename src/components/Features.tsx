import { Shield, Languages, Mail, FileSearch, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'DETECT',
      subtitle: 'Instant Risk Analysis',
      color: 'danger',
      description: 'High-speed audit of red-flagged clauses including IP rights, payment schedules, and liability terms.',
      capabilities: [
        'Visual risk heatmap (Red/Orange/Green)',
        'Detects unlimited liability clauses',
        'Identifies perpetual rights transfers',
        'Flags predatory Net-90 payment terms'
      ]
    },
    {
      icon: Languages,
      title: 'DECIPHER',
      subtitle: 'Plain Language Translation',
      color: 'warning',
      description: 'Converts complex legal jargon into simple, understandable language in your preferred regional language.',
      capabilities: [
        'Real-time jargon simplification',
        'Hindi, Telugu & more languages',
        'Context-preserving translation',
        'Split-screen PDF comparison'
      ]
    },
    {
      icon: Mail,
      title: 'DEFEND',
      subtitle: 'Autonomous Negotiation Agent',
      color: 'success',
      description: 'AI agent that drafts professional negotiation emails and sends them directly to clients on your behalf.',
      capabilities: [
        'Goal-based negotiation drafting',
        'Agentic redlining suggestions',
        'Gmail integration for auto-send',
        'Calendar follow-up reminders'
      ]
    }
  ]

  const colorClasses = {
    danger: {
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      icon: 'text-danger-500',
      gradient: 'from-danger-500 to-danger-600'
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      icon: 'text-warning-500',
      gradient: 'from-warning-500 to-warning-600'
    },
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      icon: 'text-success-500',
      gradient: 'from-success-500 to-success-600'
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How <span className="gradient-text">Synth-Law</span> Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Three powerful AI agents working together to protect your rights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className={`${colors.bg} border-b-2 ${colors.border} p-6`}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors.gradient} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className={`text-sm font-medium ${colors.icon}`}>{feature.subtitle}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, capIdx) => (
                      <li key={capIdx} className="flex items-start">
                        <CheckCircle className={`w-5 h-5 ${colors.icon} mr-2 flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-slate-700">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <div className="flex items-start">
              <FileSearch className="w-10 h-10 text-primary-500 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold mb-2">Legal Grounding with RAG</h4>
                <p className="text-slate-600">
                  Every analysis is backed by actual Indian laws: Contract Act 1872, Copyright Act 1957, IT Act 2000.
                  All responses include direct citations to specific legal sections.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-10 h-10 text-warning-500 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold mb-2">Enterprise-Grade Privacy</h4>
                <p className="text-slate-600">
                  Automatic PII masking for Aadhaar and bank details. Dual-agent verification prevents AI hallucinations.
                  Your sensitive data is protected at every step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
