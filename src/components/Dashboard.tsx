import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle2, BarChart3, Users, Shield, Calendar, TrendingUp, Archive, Plus, Activity } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">
                    Welcome back, {getDisplayName()}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                    Your digital legacy is secure and protected
                  </p>
                </div>
                <div className="hidden sm:block ml-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Status Alert */}
          {status === 'triggered' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 sm:mb-8 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-1">
                    Dead Man's Switch Triggered
                  </h3>
                  <p className="text-sm sm:text-base text-red-700">
                    Your digital legacy protocol has been activated. Review the execution summary.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExecution(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  View Execution
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Total Assets Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Assets</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{totalAssets}</p>
                <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500">
                  <span>{platformAssets} platforms</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>{fileAssets} files</span>
                </div>
              </div>
            </motion.div>

            {/* Switch Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border hover:shadow-md transition-shadow ${
                status === 'alive' ? 'border-green-100' : 
                status === 'triggered' ? 'border-red-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 ${
                  status === 'alive' ? 'bg-green-50' : 
                  status === 'triggered' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">{getStatusIcon()}</div>
                </div>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  status === 'alive' ? 'bg-green-400 animate-pulse' : 
                  status === 'triggered' ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Switch Status</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 ${getStatusColor()}`}>{getStatusText()}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {daysSinceLastCheckin !== null 
                    ? `${daysSinceLastCheckin} days ago`
                    : 'Never checked in'
                  }
                </p>
              </div>
            </motion.div>

            {/* Delete Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="bg-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  DELETE
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Delete Actions</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mb-1 sm:mb-2">{assetsByAction.Delete || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Assets to be deleted</p>
              </div>
            </motion.div>

            {/* Transfer Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  TRANSFER
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Transfer Actions</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{assetsByAction.Transfer || 0}</p>
                <p className="text-xs sm:text-sm text-gray-500">Assets to be transferred</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Quick Actions Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-4 sm:p-6 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckin}
                  className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors ${
                    status === 'alive' 
                      ? 'bg-green-50 hover:bg-green-100 border border-green-200' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    status === 'alive' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      status === 'alive' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Check In</p>
                    <p className="text-xs sm:text-sm text-gray-500">Confirm you're active</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-purple-100 flex-shrink-0">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Add Asset</p>
                    <p className="text-xs sm:text-sm text-gray-500">Protect new digital asset</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-yellow-100 flex-shrink-0">
                    <Archive className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Archive Settings</p>
                    <p className="text-xs sm:text-sm text-gray-500">Configure legacy options</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              
              <div className="flex-1 p-4 sm:p-6 pt-3 sm:pt-4">
                {assetsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-2">No digital assets yet</p>
                    <p className="text-sm text-gray-400">
                      Start protecting your digital legacy by adding your first asset
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                    {assets.slice(0, 10).map((asset, index) => (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          asset.action === 'Delete' ? 'bg-red-100' :
                          asset.action === 'Transfer' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            asset.action === 'Delete' ? 'bg-red-500' :
                            asset.action === 'Transfer' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{asset.platform_name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {asset.action} • {new Date(asset.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                          asset.action === 'Delete' ? 'bg-red-100 text-red-700' :
                          asset.action === 'Transfer' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {asset.action}
                        </span>
                      </motion.div>
                    ))}
                    
                    {assets.length > 10 && (
                      <div className="text-center pt-3 sm:pt-4 border-t border-gray-100 mt-3 sm:mt-4">
                        <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                          View {assets.length - 10} more assets
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* System Status Footer */}
          {checkin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-gray-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">System Status</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      Last check-in: {new Date(checkin.last_checkin_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
            </motion.div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}