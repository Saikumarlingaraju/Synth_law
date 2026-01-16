import { Scale } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Synth-Law</h1>
              <p className="text-xs text-slate-500">Leveling the Legal Playing Field</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-primary-600">15M+</p>
              <p className="text-slate-500 text-xs">Freelancers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-primary-600">72%</p>
              <p className="text-slate-500 text-xs">Contracts Misunderstood</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-primary-600">₹15K</p>
              <p className="text-slate-500 text-xs">Avg Legal Cost</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
