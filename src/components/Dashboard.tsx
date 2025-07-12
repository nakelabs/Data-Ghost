import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle2, BarChart3, Users, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDigitalAssets } from '../hooks/useDigitalAssets'
import { useCheckins } from '../hooks/useCheckins'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ExecutionSummary } from './ExecutionSummary'

export function Dashboard() {
  const { userProfile } = useAuth()
  const { assets, loading: assetsLoading } = useDigitalAssets()
  const { checkin, performCheckin, getStatus } = useCheckins()
  const [showExecution, setShowExecution] = useState(false)

  const status = getStatus()

  const handleCheckin = async () => {
    try {
      await performCheckin()
    } catch (error) {
      console.error('Checkin failed:', error)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'alive': return 'text-green-600'
      case 'triggered': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'alive': return <CheckCircle2 className="w-5 h-5" />
      case 'triggered': return <AlertTriangle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'alive': return 'Active'
      case 'triggered': return 'Triggered'
      default: return 'Never checked in'
    }
  }

  const getDisplayName = () => {
    return userProfile?.username || 'User'
  }

  // Calculate analytics
  const totalAssets = assets.length
  const assetsByAction = assets.reduce((acc, asset) => {
    acc[asset.action] = (acc[asset.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const fileAssets = assets.filter(asset => asset.file_name).length
  const platformAssets = assets.filter(asset => !asset.file_name).length

  const daysSinceLastCheckin = checkin 
    ? Math.floor((new Date().getTime() - new Date(checkin.last_checkin_at).getTime()) / (1000 * 60 * 60 * 24))
    : null

  if (showExecution) {
    return <ExecutionSummary assets={assets} onBack={() => setShowExecution(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {getDisplayName()}
            </h1>
            <p className="text-gray-600">
              Manage your digital legacy with confidence and control.
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAssets}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {platformAssets} platforms, {fileAssets} files
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Switch Status</p>
                  <p className={`text-2xl font-bold ${getStatusColor()}`}>{getStatusText()}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  status === 'alive' ? 'bg-green-100' : status === 'triggered' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {getStatusIcon()}
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {daysSinceLastCheckin !== null 
                    ? `${daysSinceLastCheckin} days since last check-in`
                    : 'No check-ins yet'
                  }
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delete Actions</p>
                  <p className="text-3xl font-bold text-red-600">{assetsByAction.Delete || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  Assets to be deleted
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transfer Actions</p>
                  <p className="text-3xl font-bold text-blue-600">{assetsByAction.Transfer || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  Assets to be transferred
                </span>
              </div>
            </motion.div>
          </div>

          {/* Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Dead Man's Switch Status
                </h2>
                <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="font-medium">{getStatusText()}</span>
                </div>
                {checkin && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last check-in: {new Date(checkin.last_checkin_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckin}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Check In
                </motion.button>
                {status === 'triggered' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowExecution(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    View Execution
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            
            {assetsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No digital assets added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Use the sidebar to add your first digital asset
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assets.slice(0, 5).map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        asset.action === 'Delete' ? 'bg-red-500' :
                        asset.action === 'Transfer' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{asset.platform_name}</p>
                        <p className="text-sm text-gray-500">
                          {asset.action} • Added {new Date(asset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      asset.action === 'Delete' ? 'bg-red-100 text-red-700' :
                      asset.action === 'Transfer' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {asset.action}
                    </span>
                  </motion.div>
                ))}
                
                {assets.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    And {assets.length - 5} more assets...
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}