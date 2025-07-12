import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  File, 
  Archive, 
  Trash, 
  Share,
  Search,
  Filter
} from 'lucide-react'
import { useDigitalAssets } from '../hooks/useDigitalAssets'
import { AssetModal } from './AssetModal'
import { FileUploadModal } from './FileUploadModal'
import { UserProfileModal } from './UserProfileModal'
import { AssetCard } from './AssetCard'
import { generateDigitalWillPDF } from '../utils/pdfGenerator'
import { useAuth } from '../hooks/useAuth'

export function Sidebar() {
  const { userProfile } = useAuth()
  const { assets, loading, addAsset, updateAsset, deleteAsset } = useDigitalAssets()
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [editingAsset, setEditingAsset] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  const handleDownloadWill = async () => {
    setDownloadingPDF(true)
    try {
      await generateDigitalWillPDF(assets, userProfile?.username || 'User')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setDownloadingPDF(false)
    }
  }

  // Filter assets based on search and filter
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.platform_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.recipient_email && asset.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterAction === 'all' || asset.action === filterAction
    return matchesSearch && matchesFilter
  })

  const assetCounts = {
    all: assets.length,
    Delete: assets.filter(a => a.action === 'Delete').length,
    Transfer: assets.filter(a => a.action === 'Transfer').length,
    Archive: assets.filter(a => a.action === 'Archive').length
  }

  return (
    <>
      <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Digital Assets</h2>
              <p className="text-sm text-gray-500">{assets.length} total assets</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAssetModal(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFileUpload(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadWill}
              disabled={downloadingPDF || assets.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloadingPDF ? 'Generating...' : 'Download Will'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserProfile(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </motion.button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Actions ({assetCounts.all})</option>
              <option value="Delete">Delete ({assetCounts.Delete})</option>
              <option value="Transfer">Transfer ({assetCounts.Transfer})</option>
              <option value="Archive">Archive ({assetCounts.Archive})</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <Trash className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-red-700">{assetCounts.Delete}</p>
              <p className="text-xs text-red-600">Delete</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <Share className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-blue-700">{assetCounts.Transfer}</p>
              <p className="text-xs text-blue-600">Transfer</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <Archive className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-yellow-700">{assetCounts.Archive}</p>
              <p className="text-xs text-yellow-600">Archive</p>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchTerm || filterAction !== 'all' ? 'No matching assets' : 'No assets yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || filterAction !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'Add your first digital asset to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssets.map((asset, index) => (
                <div key={asset.id} className="transform scale-90 origin-top">
                  <AssetCard
                    asset={asset}
                    index={index}
                    onEdit={(id) => {
                      setEditingAsset(id)
                      setShowAssetModal(true)
                    }}
                    onDelete={deleteAsset}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssetModal
        isOpen={showAssetModal}
        onClose={() => {
          setShowAssetModal(false)
          setEditingAsset(null)
        }}
        onSave={editingAsset ? updateAsset : addAsset}
        asset={editingAsset ? assets.find(a => a.id === editingAsset) : undefined}
      />

      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onSave={addAsset}
      />

      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  )
}