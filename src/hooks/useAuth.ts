import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, signInWithPopup, signInWithRedirect, User } from 'firebase/auth'
import { getFirebaseAuth, googleProvider, firebaseInitError } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(firebaseInitError())
  const auth = getFirebaseAuth()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      if (!error) setError(new Error('Auth unavailable; missing Firebase config'))
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [auth, error])

  const signIn = async () => {
    if (!auth) return Promise.reject(new Error('Auth not initialized'))
    try {
      return await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed'
      // Popup can be blocked on some browsers/domains; fall back to redirect.
      if (/popup-closed|popup-blocked|blocked/.test(message) || /auth-domain-config-required/i.test(message)) {
        return signInWithRedirect(auth, googleProvider)
      }
      setError(err as Error)
      throw err
    }
  }

  const logOut = () => {
    if (!auth) return Promise.resolve()
    return signOut(auth)
  }

  return { user, loading, signIn, logOut, error }
}
