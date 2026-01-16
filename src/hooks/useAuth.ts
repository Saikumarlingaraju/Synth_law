import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, signInWithPopup, User } from 'firebase/auth'
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

  const signIn = () => {
    if (!auth) return Promise.reject(new Error('Auth not initialized'))
    return signInWithPopup(auth, googleProvider)
  }

  const logOut = () => {
    if (!auth) return Promise.resolve()
    return signOut(auth)
  }

  return { user, loading, signIn, logOut, error }
}
