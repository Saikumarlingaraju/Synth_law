import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Loader2, LogOut, LogIn, AlertTriangle } from 'lucide-react'

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading, signIn, logOut, error } = useAuth()

  // If auth failed to init, allow read-only access and show banner
  if (!loading && !user && error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 pt-12">
          <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-xl text-warning-800 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication not configured</p>
              <p className="text-sm">Firebase credentials are missing; continuing without sign-in.</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking auth...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-4 border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in to analyze contracts</h2>
          <p className="text-slate-600 text-sm">
            Use your Google account to securely access Synth-Law.
          </p>
          <button
            onClick={signIn}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={logOut}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Sign out ({user.email})
        </button>
      </div>
      {children}
    </div>
  )
}
