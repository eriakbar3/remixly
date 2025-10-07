'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  ChevronUp,
  Info,
  Wand2,
  Sliders,
  Image as ImageIcon,
  Type
} from 'lucide-react'

export default function AdvancedParameters({ operation, parameters, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showHelp, setShowHelp] = useState({})

  // Default parameters based on operation
  const getDefaultParameters = () => {
    const defaults = {
      strength: 80,
      creativity: 70,
      quality: 'high',
      preserveDetails: true,
      seed: Math.floor(Math.random() * 1000000),
    }

    // Operation-specific defaults
    switch (operation) {
      case 'outfit_changer':
        return {
          ...defaults,
          outfit: parameters?.outfit || '',
          fitType: 'natural',
          textureDetail: 85,
        }
      case 'pose_generator':
        return {
          ...defaults,
          pose: parameters?.pose || '',
          smoothness: 90,
          maintainIdentity: true,
        }
      case 'expression_editor':
        return {
          ...defaults,
          expression: parameters?.expression || '',
          subtlety: 75,
          naturalness: 90,
        }
      case 'background_remover':
        return {
          ...defaults,
          newBackground: parameters?.newBackground || '',
          edgeSmoothing: 85,
          shadowPreservation: 70,
        }
      case 'image_enhancer':
        return {
          ...defaults,
          sharpness: 80,
          colorVibrance: 75,
          noiseReduction: 70,
          upscaleFactor: 2,
        }
      default:
        return defaults
    }
  }

  const [localParams, setLocalParams] = useState({
    ...getDefaultParameters(),
    ...parameters,
  })

  // Update local and parent state
  const updateParam = (key, value) => {
    const updated = { ...localParams, [key]: value }
    setLocalParams(updated)
    onChange(updated)
  }

  // Randomize seed
  const randomizeSeed = () => {
    updateParam('seed', Math.floor(Math.random() * 1000000))
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const defaults = getDefaultParameters()
    setLocalParams(defaults)
    onChange(defaults)
  }

  // Help tooltips
  const helpTexts = {
    strength: 'Controls how much the AI transforms the image (0-100)',
    creativity: 'Higher values allow more creative interpretation (0-100)',
    quality: 'Processing quality level - higher takes longer but better results',
    preserveDetails: 'Maintain fine details from the original image',
    seed: 'Reproducibility control - same seed gives same result',
    fitType: 'How clothing fits the body',
    textureDetail: 'Level of fabric texture and detail',
    smoothness: 'How smooth the pose transition appears',
    maintainIdentity: 'Keep facial features and identity intact',
    subtlety: 'How subtle the expression change is',
    naturalness: 'How natural the expression looks',
    edgeSmoothing: 'Smooth edges around removed areas',
    shadowPreservation: 'Keep shadows from original',
    sharpness: 'Image sharpness enhancement',
    colorVibrance: 'Color intensity and saturation',
    noiseReduction: 'Remove image noise and grain',
    upscaleFactor: 'Resolution increase multiplier',
  }

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          Advanced Parameters
          <Badge variant="secondary">{Object.keys(localParams).length} settings</Badge>
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {/* Parameters Panel */}
      {isExpanded && (
        <Card className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={randomizeSeed}>
              <Wand2 className="w-4 h-4 mr-2" />
              Randomize Seed
            </Button>
            <Button size="sm" variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>

          {/* Operation-specific Parameters */}
          {(operation === 'outfit_changer' ||
            operation === 'pose_generator' ||
            operation === 'expression_editor') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Type className="w-4 h-4" />
                Primary Input
              </div>

              {operation === 'outfit_changer' && (
                <div>
                  <Label htmlFor="outfit">Outfit Description</Label>
                  <Input
                    id="outfit"
                    placeholder="e.g., elegant black suit with tie"
                    value={localParams.outfit}
                    onChange={(e) => updateParam('outfit', e.target.value)}
                  />
                </div>
              )}

              {operation === 'pose_generator' && (
                <div>
                  <Label htmlFor="pose">Pose Description</Label>
                  <Input
                    id="pose"
                    placeholder="e.g., confident standing with arms crossed"
                    value={localParams.pose}
                    onChange={(e) => updateParam('pose', e.target.value)}
                  />
                </div>
              )}

              {operation === 'expression_editor' && (
                <div>
                  <Label htmlFor="expression">Expression</Label>
                  <Input
                    id="expression"
                    placeholder="e.g., warm genuine smile"
                    value={localParams.expression}
                    onChange={(e) => updateParam('expression', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {operation === 'background_remover' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="w-4 h-4" />
                Background Options
              </div>

              <div>
                <Label htmlFor="newBackground">New Background (Optional)</Label>
                <Input
                  id="newBackground"
                  placeholder="e.g., professional gray gradient, nature landscape"
                  value={localParams.newBackground}
                  onChange={(e) => updateParam('newBackground', e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="edgeSmoothing" className="flex items-center gap-2">
                    Edge Smoothing
                    <button
                      onClick={() =>
                        setShowHelp({ ...showHelp, edgeSmoothing: !showHelp.edgeSmoothing })
                      }
                    >
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </Label>
                  <span className="text-sm text-muted-foreground">{localParams.edgeSmoothing}%</span>
                </div>
                <input
                  type="range"
                  id="edgeSmoothing"
                  min="0"
                  max="100"
                  value={localParams.edgeSmoothing}
                  onChange={(e) => updateParam('edgeSmoothing', parseInt(e.target.value))}
                  className="w-full"
                />
                {showHelp.edgeSmoothing && (
                  <p className="text-xs text-muted-foreground mt-1">{helpTexts.edgeSmoothing}</p>
                )}
              </div>
            </div>
          )}

          {/* Common Parameters */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sliders className="w-4 h-4" />
              Common Parameters
            </div>

            {/* Strength */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="strength" className="flex items-center gap-2">
                  Transformation Strength
                  <button
                    onClick={() => setShowHelp({ ...showHelp, strength: !showHelp.strength })}
                  >
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </button>
                </Label>
                <span className="text-sm text-muted-foreground">{localParams.strength}%</span>
              </div>
              <input
                type="range"
                id="strength"
                min="0"
                max="100"
                value={localParams.strength}
                onChange={(e) => updateParam('strength', parseInt(e.target.value))}
                className="w-full"
              />
              {showHelp.strength && (
                <p className="text-xs text-muted-foreground mt-1">{helpTexts.strength}</p>
              )}
            </div>

            {/* Creativity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="creativity" className="flex items-center gap-2">
                  Creativity Level
                  <button
                    onClick={() => setShowHelp({ ...showHelp, creativity: !showHelp.creativity })}
                  >
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </button>
                </Label>
                <span className="text-sm text-muted-foreground">{localParams.creativity}%</span>
              </div>
              <input
                type="range"
                id="creativity"
                min="0"
                max="100"
                value={localParams.creativity}
                onChange={(e) => updateParam('creativity', parseInt(e.target.value))}
                className="w-full"
              />
              {showHelp.creativity && (
                <p className="text-xs text-muted-foreground mt-1">{helpTexts.creativity}</p>
              )}
            </div>

            {/* Quality */}
            <div>
              <Label htmlFor="quality">Quality Level</Label>
              <select
                id="quality"
                value={localParams.quality}
                onChange={(e) => updateParam('quality', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="draft">Draft (Fast, 2 credits)</option>
                <option value="standard">Standard (Balanced, 5 credits)</option>
                <option value="high">High (Best, 10 credits)</option>
              </select>
            </div>

            {/* Preserve Details */}
            <div className="flex items-center justify-between">
              <Label htmlFor="preserveDetails" className="flex items-center gap-2">
                Preserve Fine Details
                <button
                  onClick={() =>
                    setShowHelp({ ...showHelp, preserveDetails: !showHelp.preserveDetails })
                  }
                >
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
              </Label>
              <input
                type="checkbox"
                id="preserveDetails"
                checked={localParams.preserveDetails}
                onChange={(e) => updateParam('preserveDetails', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            {showHelp.preserveDetails && (
              <p className="text-xs text-muted-foreground">{helpTexts.preserveDetails}</p>
            )}

            {/* Seed */}
            <div>
              <Label htmlFor="seed" className="flex items-center gap-2">
                Seed (Reproducibility)
                <button onClick={() => setShowHelp({ ...showHelp, seed: !showHelp.seed })}>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </button>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="seed"
                  type="number"
                  value={localParams.seed}
                  onChange={(e) => updateParam('seed', parseInt(e.target.value))}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={randomizeSeed}>
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
              {showHelp.seed && (
                <p className="text-xs text-muted-foreground mt-1">{helpTexts.seed}</p>
              )}
            </div>
          </div>

          {/* Operation-specific advanced options */}
          {operation === 'image_enhancer' && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold">
                Enhancement Options
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="sharpness">Sharpness</Label>
                  <span className="text-sm text-muted-foreground">{localParams.sharpness}%</span>
                </div>
                <input
                  type="range"
                  id="sharpness"
                  min="0"
                  max="100"
                  value={localParams.sharpness}
                  onChange={(e) => updateParam('sharpness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="colorVibrance">Color Vibrance</Label>
                  <span className="text-sm text-muted-foreground">
                    {localParams.colorVibrance}%
                  </span>
                </div>
                <input
                  type="range"
                  id="colorVibrance"
                  min="0"
                  max="100"
                  value={localParams.colorVibrance}
                  onChange={(e) => updateParam('colorVibrance', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="upscaleFactor">Upscale Factor</Label>
                <select
                  id="upscaleFactor"
                  value={localParams.upscaleFactor}
                  onChange={(e) => updateParam('upscaleFactor', parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="1">1x (Original Size)</option>
                  <option value="2">2x (Double)</option>
                  <option value="4">4x (Quadruple)</option>
                </select>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Credits:</span>
              <Badge>
                {localParams.quality === 'draft'
                  ? 2
                  : localParams.quality === 'standard'
                  ? 5
                  : 10}{' '}
                credits
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
