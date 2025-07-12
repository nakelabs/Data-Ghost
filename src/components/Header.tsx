import { motion } from 'framer-motion'
import { Shield, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { userProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const getDisplayName = () => {
    return userProfile?.username || 'User'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DataGhost</h1>
              <p className="text-xs text-gray-500">Digital Legacy Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {getDisplayName()}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}