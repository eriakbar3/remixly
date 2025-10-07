'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  ShoppingBag,
  Instagram,
  Linkedin,
  Camera,
  Users,
  Star,
  Sparkles
} from 'lucide-react'

const presets = [
  {
    id: 'linkedin_profile',
    name: 'LinkedIn Profile Photo',
    icon: Linkedin,
    description: 'Professional headshot optimized for LinkedIn',
    category: 'Professional',
    operations: ['background_remover', 'headshot_generator', 'image_enhancer'],
    parameters: {
      background_remover: { newBackground: 'professional gray gradient' },
      headshot_generator: {},
      image_enhancer: { sharpness: 90 }
    },
    credits: 25,
    aspectRatio: '1:1',
    outputSize: '400x400',
    popular: true
  },
  {
    id: 'instagram_post',
    name: 'Instagram Post',
    icon: Instagram,
    description: 'Vibrant photo ready for Instagram feed',
    category: 'Social Media',
    operations: ['image_enhancer', 'photobooth'],
    parameters: {
      image_enhancer: { colorVibrance: 90, sharpness: 85 },
      photobooth: { style: 'vibrant modern aesthetic' }
    },
    credits: 15,
    aspectRatio: '1:1',
    outputSize: '1080x1080',
    popular: true
  },
  {
    id: 'ecommerce_product',
    name: 'E-commerce Product',
    icon: ShoppingBag,
    description: 'Professional product photo for online stores',
    category: 'Business',
    operations: ['background_remover', 'product_studio', 'image_enhancer'],
    parameters: {
      background_remover: { newBackground: 'pure white background' },
      product_studio: { setting: 'optimal studio lighting' },
      image_enhancer: { sharpness: 95 }
    },
    credits: 20,
    aspectRatio: '1:1',
    outputSize: '2000x2000',
    popular: true
  },
  {
    id: 'business_card',
    name: 'Business Card Photo',
    icon: Briefcase,
    description: 'Clean professional photo for business cards',
    category: 'Professional',
    operations: ['background_remover', 'headshot_generator'],
    parameters: {
      background_remover: { newBackground: 'solid white' },
      headshot_generator: {}
    },
    credits: 15,
    aspectRatio: '2:3',
    outputSize: '600x900'
  },
  {
    id: 'team_photo',
    name: 'Team Photo',
    icon: Users,
    description: 'Unified team photo with consistent background',
    category: 'Professional',
    operations: ['background_remover', 'image_enhancer'],
    parameters: {
      background_remover: { newBackground: 'corporate blue gradient' },
      image_enhancer: { sharpness: 85 }
    },
    credits: 10,
    aspectRatio: '1:1',
    outputSize: '800x800'
  },
  {
    id: 'portfolio_showcase',
    name: 'Portfolio Showcase',
    icon: Camera,
    description: 'High-quality image for creative portfolios',
    category: 'Creative',
    operations: ['image_enhancer'],
    parameters: {
      image_enhancer: {
        sharpness: 100,
        colorVibrance: 85,
        upscaleFactor: 2
      }
    },
    credits: 8,
    aspectRatio: '16:9',
    outputSize: '1920x1080'
  },
  {
    id: 'dating_profile',
    name: 'Dating Profile',
    icon: Star,
    description: 'Natural and attractive profile photo',
    category: 'Personal',
    operations: ['expression_editor', 'image_enhancer'],
    parameters: {
      expression_editor: { expression: 'warm genuine smile' },
      image_enhancer: { sharpness: 80, colorVibrance: 75 }
    },
    credits: 15,
    aspectRatio: '4:5',
    outputSize: '1080x1350'
  },
  {
    id: 'vintage_restoration',
    name: 'Vintage Photo',
    icon: Sparkles,
    description: 'Restore old photos to pristine condition',
    category: 'Restoration',
    operations: ['photo_restoration', 'image_enhancer'],
    parameters: {
      photo_restoration: {},
      image_enhancer: { noiseReduction: 90 }
    },
    credits: 20,
    aspectRatio: 'original',
    outputSize: 'original',
    popular: true
  }
]

export default function ImagePresets({ onSelectPreset }) {
  const categories = [...new Set(presets.map(p => p.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Image Presets</h3>
        <p className="text-sm text-muted-foreground">
          Quick start with optimized settings for common use cases
        </p>
      </div>

      {/* Popular Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <h4 className="font-semibold">Popular Presets</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.filter(p => p.popular).map((preset) => (
            <Card
              key={preset.id}
              className="p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => onSelectPreset(preset)}
            >
              <div className="flex gap-4">
                <div className="p-3 bg-primary/10 rounded-lg self-start">
                  <preset.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-semibold">{preset.name}</h5>
                    <Badge variant="secondary">{preset.credits} credits</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {preset.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {preset.aspectRatio}
                    </Badge>
                    <span>•</span>
                    <span>{preset.operations.length} steps</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Presets by Category */}
      {categories.map((category) => (
        <div key={category}>
          <h4 className="font-semibold mb-3">{category}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presets.filter(p => p.category === category).map((preset) => (
              <Card
                key={preset.id}
                className="p-4 cursor-pointer hover:border-primary transition-all group"
                onClick={() => onSelectPreset(preset)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <preset.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm mb-1">{preset.name}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {preset.aspectRatio}
                    </Badge>
                    <span>{preset.operations.length} steps</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {preset.credits} credits
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Custom Preset */}
      <Card className="p-6 border-dashed border-2 text-center">
        <h5 className="font-semibold mb-2">Need a custom preset?</h5>
        <p className="text-sm text-muted-foreground mb-4">
          Create your own workflow with our workflow builder
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/workflows'}>
          Create Custom Workflow
        </Button>
      </Card>
    </div>
  )
}

// Export presets data for use in other components
export { presets }
