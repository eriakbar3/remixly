'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Wand2,
  Camera,
  Smile,
  RotateCw,
  Palette,
  Lightbulb,
  Loader2,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import Link from 'next/link'

const promptLibrary = {
  outfit_changer: {
    name: 'Outfit Changer',
    icon: Wand2,
    color: 'text-purple-500',
    examples: [
      {
        category: 'Professional',
        prompts: [
          'professional business suit with white shirt and navy blue tie',
          'elegant blazer with tailored pants, modern office style',
          'corporate casual: polo shirt with khaki pants'
        ]
      },
      {
        category: 'Casual',
        prompts: [
          'casual denim jacket with white t-shirt',
          'summer floral dress with light fabric',
          'comfortable hoodie with relaxed fit jeans'
        ]
      },
      {
        category: 'Formal',
        prompts: [
          'black evening gown with elegant draping',
          'classic tuxedo with bow tie',
          'cocktail dress with sequin details'
        ]
      }
    ],
    tips: [
      'Be specific about colors, materials, and style',
      'Mention fit type (slim, relaxed, oversized)',
      'Include texture details (leather, cotton, silk)',
      'Describe the occasion or context'
    ]
  },
  pose_generator: {
    name: 'Pose Generator',
    icon: Camera,
    color: 'text-pink-500',
    examples: [
      {
        category: 'Standing',
        prompts: [
          'confident standing pose with arms crossed',
          'relaxed standing with hands in pockets',
          'professional standing with one hand on hip'
        ]
      },
      {
        category: 'Sitting',
        prompts: [
          'sitting relaxed with legs crossed',
          'sitting upright on chair, hands on lap',
          'casual sitting on floor with legs folded'
        ]
      },
      {
        category: 'Action',
        prompts: [
          'walking forward confidently',
          'leaning against wall with casual pose',
          'dynamic jumping pose with arms up'
        ]
      }
    ],
    tips: [
      'Describe body position clearly',
      'Mention arm and leg placement',
      'Specify head tilt or direction',
      'Include energy level (relaxed, dynamic, confident)'
    ]
  },
  expression_editor: {
    name: 'Expression Editor',
    icon: Smile,
    color: 'text-pink-500',
    examples: [
      {
        category: 'Happy',
        prompts: [
          'natural warm smile with genuine joy',
          'bright cheerful smile showing teeth',
          'subtle smile with friendly expression'
        ]
      },
      {
        category: 'Professional',
        prompts: [
          'serious professional expression',
          'confident neutral expression',
          'approachable professional demeanor'
        ]
      },
      {
        category: 'Emotional',
        prompts: [
          'surprised expression with raised eyebrows',
          'thoughtful contemplative look',
          'calm peaceful expression'
        ]
      }
    ],
    tips: [
      'Describe the emotion clearly',
      'Mention intensity (subtle, moderate, strong)',
      'Specify facial features (eyes, mouth, eyebrows)',
      'Keep it natural and authentic'
    ]
  },
  angle_shift: {
    name: 'Angle & Perspective',
    icon: RotateCw,
    color: 'text-cyan-500',
    examples: [
      {
        category: 'Camera Angles',
        prompts: [
          'low angle shot looking up, dramatic perspective',
          'high angle shot looking down from above',
          'side view from the right at 45 degrees'
        ]
      },
      {
        category: 'Perspectives',
        prompts: [
          'top-down bird eye view directly above',
          'three-quarter view showing depth',
          'view from opposite side maintaining composition'
        ]
      }
    ],
    tips: [
      'Specify camera height (low, eye-level, high)',
      'Mention angle degree when specific',
      'Describe perspective type clearly',
      'Include composition notes if needed'
    ]
  },
  background_remover: {
    name: 'Background Replacer',
    icon: Palette,
    color: 'text-indigo-500',
    examples: [
      {
        category: 'Nature',
        prompts: [
          'sunset beach with palm trees and golden sky',
          'mountain landscape with snow peaks and blue sky',
          'lush green forest with sunlight filtering through'
        ]
      },
      {
        category: 'Urban',
        prompts: [
          'modern office with glass windows and city view',
          'urban street with brick walls and graffiti art',
          'minimalist white studio with soft lighting'
        ]
      },
      {
        category: 'Professional',
        prompts: [
          'professional gray gradient studio background',
          'blurred office environment with warm tones',
          'clean white background with subtle shadow'
        ]
      }
    ],
    tips: [
      'Describe the scene in detail',
      'Mention lighting conditions',
      'Include color palette',
      'Specify mood or atmosphere'
    ]
  }
}

export default function PromptGuidesPage() {
  const { data: session } = useSession()
  const [selectedOperation, setSelectedOperation] = useState('outfit_changer')
  const [copiedPrompt, setCopiedPrompt] = useState(null)
  const [userPrompt, setUserPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [enhancing, setEnhancing] = useState(false)

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(prompt)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const handleEnhancePrompt = async () => {
    if (!userPrompt.trim()) return

    setEnhancing(true)
    setEnhancedPrompt('')

    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          operation: selectedOperation
        })
      })

      const data = await res.json()

      if (res.ok) {
        setEnhancedPrompt(data.enhancedPrompt)
      } else {
        alert(data.error || 'Failed to enhance prompt')
      }
    } catch (error) {
      alert('An error occurred while enhancing prompt')
    } finally {
      setEnhancing(false)
    }
  }

  const currentLibrary = promptLibrary[selectedOperation]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Prompt Guides</h1>
            <p className="text-muted-foreground">Learn to write effective prompts for better results</p>
          </div>
        </div>
      </div>

      {/* Operation Selector */}
      <Tabs value={selectedOperation} onValueChange={setSelectedOperation} className="mb-6">
        <TabsList className="w-full justify-start flex-wrap h-auto">
          {Object.entries(promptLibrary).map(([key, lib]) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              <lib.icon className={`w-4 h-4 ${lib.color}`} />
              {lib.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content */}
        {Object.entries(promptLibrary).map(([key, lib]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Prompt Library */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <lib.icon className={`w-5 h-5 ${lib.color}`} />
                      Prompt Examples
                    </CardTitle>
                    <CardDescription>
                      Copy and use these proven prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lib.examples.map((example, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold mb-2">{example.category}</h4>
                        <div className="space-y-2">
                          {example.prompts.map((prompt, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-start gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
                            >
                              <p className="flex-1 text-sm">{prompt}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyPrompt(prompt)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedPrompt === prompt ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {lib.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Prompt Enhancer */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Prompt Enhancer
                    </CardTitle>
                    <CardDescription>
                      Transform your basic prompt into a detailed, effective one
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Prompt</label>
                      <Textarea
                        placeholder={`e.g., ${lib.examples[0].prompts[0].split(',')[0]}`}
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleEnhancePrompt}
                      disabled={enhancing || !userPrompt.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {enhancing ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 w-4 h-4" />
                          Enhance Prompt
                        </>
                      )}
                    </Button>

                    {enhancedPrompt && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Enhanced Prompt</label>
                        <div className="relative">
                          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                            <p className="text-sm">{enhancedPrompt}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyPrompt(enhancedPrompt)}
                            className="absolute top-2 right-2"
                          >
                            {copiedPrompt === enhancedPrompt ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Was this helpful?</span>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 The AI enhancer adds specific details, context, and clarity to your prompt for better results
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Best Practices */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Be Specific</p>
                        <p className="text-xs text-muted-foreground">
                          Include colors, materials, styles, and context
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Use Descriptive Language</p>
                        <p className="text-xs text-muted-foreground">
                          Paint a clear picture with adjectives and details
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Test & Iterate</p>
                        <p className="text-xs text-muted-foreground">
                          Try variations and refine based on results
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
