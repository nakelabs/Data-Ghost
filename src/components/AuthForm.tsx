import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AuthForm() {
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const { signIn, signUp } = useAuth()

  // Check if we should start in signup mode
  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false)
    }
  }, [location.state])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (!isLogin) {
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long.')
        setLoading(false)
        return
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        setError('Username can only contain letters, numbers, and underscores.')
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        await signIn(email.trim().toLowerCase(), password)
      } else {
        await signUp(email.trim().toLowerCase(), password, username.trim())
        setShowEmailConfirmation(true)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setEmail('')
    setPassword('')
    setUsername('')
    setShowEmailConfirmation(false)
  }

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-32 px-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-4">
              Check your inbox
            </h1>
            <p className="text-zinc-500 font-light leading-relaxed">
              We've sent a confirmation link to <strong className="font-medium">{email}</strong>. 
              Please verify your address to continue.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowEmailConfirmation(false)}
              className="w-full py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
            >
              Back to Sign In
            </button>
            
            <Link
              to="/"
              className="w-full py-3 text-center text-zinc-900 bg-transparent border border-zinc-200 rounded-full font-medium hover:border-zinc-300 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-zinc-900 font-sans">
      <div className="px-6 py-8 flex justify-start w-full max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors tracking-tight"
        >
          DataGhost
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm w-full mx-auto"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-medium tracking-tight mb-2">
              {isLogin ? 'Sign in' : 'Create an account'}
            </h1>
            <p className="text-zinc-500 font-light hidden sm:block">
              {isLogin ? 'Enter your details to proceed.' : 'Set up your credentials below.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors placeholder:text-zinc-400"
                  placeholder="data_ghost"
                  required={!isLogin}
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  title="Username can only contain letters, numbers, and underscores"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors placeholder:text-zinc-400"
                placeholder="address@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors placeholder:text-zinc-400"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-medium tracking-tight"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-3 border border-transparent rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-100 pt-8">
            <button
              onClick={switchMode}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up." : 'Already have an account? Sign in.'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}