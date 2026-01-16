import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let initError: Error | null = null

function hasConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

export function getFirebaseApp(): FirebaseApp | null {
  if (app || initError) return app
  if (!hasConfig()) {
    initError = new Error('Firebase config missing; check .env VITE_FIREBASE_* values')
    console.warn(initError.message)
    return null
  }
  try {
    app = initializeApp(firebaseConfig)
    if (typeof window !== 'undefined') {
      isSupported().then((ok) => {
        if (ok && app) getAnalytics(app)
      }).catch(() => {})
    }
  } catch (error) {
    initError = error as Error
    console.error('Firebase init failed:', error)
    app = null
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  if (auth || initError) return auth
  const appInstance = getFirebaseApp()
  if (!appInstance) return null
  try {
    auth = getAuth(appInstance)
  } catch (error) {
    initError = error as Error
    console.error('Firebase auth init failed:', error)
    auth = null
  }
  return auth
}

export const googleProvider = new GoogleAuthProvider()
export const firebaseInitError = () => initError
