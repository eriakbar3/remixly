import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Wand2, Camera, Image as ImageIcon, Video, Zap } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Wand2, title: 'AI Outfit Changer', description: 'Transform clothing with realistic AI-generated outfits' },
    { icon: Camera, title: 'Pose Generator', description: 'Change body poses according to your creative vision' },
    { icon: ImageIcon, title: 'Expression Editor', description: 'Adjust facial expressions naturally and smoothly' },
    { icon: Sparkles, title: 'Photo Restoration', description: 'Restore old photos to crystal-clear quality' },
    { icon: Camera, title: 'Headshot Generator', description: 'Create professional headshots for LinkedIn & CV' },
    { icon: Video, title: 'B-Roll Generator', description: 'Generate cinematic video clips for social media' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Visual Studio
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your photos and videos with cutting-edge AI technology.
            Professional results in seconds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                <Zap className="mr-2 w-5 h-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/studio">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Try Studio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful AI Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="text-3xl">Start Creating Today</CardTitle>
            <CardDescription className="text-lg">
              Get 100 free credits when you sign up. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-12">
                Sign Up Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
