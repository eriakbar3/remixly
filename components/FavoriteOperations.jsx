'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, StarOff, TrendingUp } from 'lucide-react'

const allOperations = [
  { id: 'outfit_changer', name: 'Outfit Changer', icon: '👔', credits: 15 },
  { id: 'pose_generator', name: 'Pose Generator', icon: '🧍', credits: 10 },
  { id: 'expression_editor', name: 'Expression Editor', icon: '😊', credits: 10 },
  { id: 'angle_shift', name: 'Angle Shift', icon: '📐', credits: 10 },
  { id: 'photo_restoration', name: 'Photo Restoration', icon: '🖼️', credits: 15 },
  { id: 'headshot_generator', name: 'Headshot Generator', icon: '👤', credits: 10 },
  { id: 'photobooth', name: 'Photobooth AI', icon: '📸', credits: 10 },
  { id: 'product_studio', name: 'Product Studio', icon: '📦', credits: 10 },
  { id: 'background_remover', name: 'Background Remover', icon: '🎨', credits: 5 },
  { id: 'image_enhancer', name: 'Image Enhancer', icon: '✨', credits: 5 },
]

export default function FavoriteOperations({ onSelectOperation }) {
  const [favorites, setFavorites] = useState([])
  const [usageStats, setUsageStats] = useState({})

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favoriteOperations')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }

    // Load usage stats
    const stats = localStorage.getItem('operationUsageStats')
    if (stats) {
      setUsageStats(JSON.parse(stats))
    }
  }, [])

  const toggleFavorite = (operationId) => {
    const newFavorites = favorites.includes(operationId)
      ? favorites.filter(id => id !== operationId)
      : [...favorites, operationId]

    setFavorites(newFavorites)
    localStorage.setItem('favoriteOperations', JSON.stringify(newFavorites))
  }

  const recordUsage = (operationId) => {
    const newStats = {
      ...usageStats,
      [operationId]: (usageStats[operationId] || 0) + 1
    }
    setUsageStats(newStats)
    localStorage.setItem('operationUsageStats', JSON.stringify(newStats))
  }

  const handleSelectOperation = (operation) => {
    recordUsage(operation.id)
    onSelectOperation(operation)
  }

  const favoriteOps = allOperations.filter(op => favorites.includes(op.id))
  const mostUsed = Object.entries(usageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => allOperations.find(op => op.id === id))
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Favorites Section */}
      {favoriteOps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="font-semibold">Favorite Operations</h3>
            <Badge variant="secondary">{favoriteOps.length}</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {favoriteOps.map((operation) => (
              <Card
                key={operation.id}
                className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group relative"
                onClick={() => handleSelectOperation(operation)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(operation.id)
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </button>

                <div className="text-center">
                  <div className="text-3xl mb-2">{operation.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{operation.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {operation.credits} credits
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Most Used Section */}
      {mostUsed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Most Used</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mostUsed.map((operation) => (
              <Card
                key={operation.id}
                className="p-4 cursor-pointer hover:border-primary transition-all"
                onClick={() => handleSelectOperation(operation)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{operation.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{operation.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Used {usageStats[operation.id]} times
                    </p>
                  </div>
                  <Badge variant="secondary">{operation.credits}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Operations */}
      <div>
        <h3 className="font-semibold mb-3">All Operations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {allOperations.map((operation) => {
            const isFavorite = favorites.includes(operation.id)

            return (
              <Card
                key={operation.id}
                className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all group relative"
                onClick={() => handleSelectOperation(operation)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(operation.id)
                  }}
                  className={`absolute top-2 right-2 transition-all ${
                    isFavorite
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isFavorite ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <div className="text-center">
                  <div className="text-3xl mb-2">{operation.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{operation.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {operation.credits} credits
                  </Badge>
                  {usageStats[operation.id] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {usageStats[operation.id]}× used
                    </p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Empty State */}
      {favoriteOps.length === 0 && mostUsed.length === 0 && (
        <Card className="p-8 text-center border-dashed border-2">
          <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click the star icon on any operation to add it to your favorites
          </p>
        </Card>
      )}
    </div>
  )
}

// Hook for recording usage
export function useOperationTracking() {
  const recordUsage = (operationId) => {
    const stats = JSON.parse(localStorage.getItem('operationUsageStats') || '{}')
    stats[operationId] = (stats[operationId] || 0) + 1
    localStorage.setItem('operationUsageStats', JSON.stringify(stats))
  }

  return { recordUsage }
}
