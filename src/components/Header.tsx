import { Scale, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user, signIn, logOut, loading } = useAuth()

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

          {/* Auth actions */}
          <div className="flex items-center">
            {loading ? (
              <span className="text-xs text-slate-500">Checking auth...</span>
            ) : user ? (
              <button
                onClick={logOut}
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign out
              </button>
            ) : (
              <button
                onClick={signIn}
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg shadow hover:from-primary-700 hover:to-primary-600"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
