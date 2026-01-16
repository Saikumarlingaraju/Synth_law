import { ArrowRight, Shield, Languages, Mail } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fadeIn">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
            World's First Agentic Legal Assistant for Indian Freelancers
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fadeIn">
            <span className="gradient-text">From "I Agree"</span>
            <br />
            <span className="text-slate-900">to "I Understand"</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Protect yourself from unfair contracts. Understand legal jargon. Negotiate like a pro.
            <span className="block mt-2 font-semibold text-slate-900">
              All powered by AI. Built for the 15 million Indian freelancers.
            </span>
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl animate-fadeIn"
            style={{ animationDelay: '0.2s' }}
          >
            Analyze Your Contract Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center px-4 py-2 glass-card">
              <Shield className="w-5 h-5 text-danger-500 mr-2" />
              <span className="text-sm font-medium">DETECT Risks</span>
            </div>
            <div className="flex items-center px-4 py-2 glass-card">
              <Languages className="w-5 h-5 text-warning-500 mr-2" />
              <span className="text-sm font-medium">DECIPHER Jargon</span>
            </div>
            <div className="flex items-center px-4 py-2 glass-card">
              <Mail className="w-5 h-5 text-success-500 mr-2" />
              <span className="text-sm font-medium">DEFEND Automatically</span>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mt-16 p-8 glass-card max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold mb-6 text-slate-900">The Problem We're Solving</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-danger-500 mb-2">72%</div>
                <p className="text-slate-600">Freelancers sign contracts they don't understand</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-warning-500 mb-2">9.2%</div>
                <p className="text-slate-600">Annual revenue lost to unfavorable terms</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-500 mb-2">₹15K</div>
                <p className="text-slate-600">Average cost for simple contract review</p>
              </div>
            </div>
            <p className="mt-6 text-lg italic text-slate-700 border-l-4 border-primary-500 pl-4">
              "Legalese is a barrier to entry. For small creators, a signature is a leap of faith, not a calculated risk."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
