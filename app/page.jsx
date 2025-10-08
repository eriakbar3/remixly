'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  ImageIcon,
  Wand2,
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  Target,
  Rocket
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: ImageIcon,
      title: 'AI Photo Editor',
      description: 'Enhance, restore, and perfect images in seconds with intelligent AI processing.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Wand2,
      title: 'AI Content Generator',
      description: 'Change outfits, poses, expressions, and backgrounds with a single click.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Briefcase,
      title: 'Professional Studio',
      description: 'Create business-ready headshots, product photos, and marketing visuals.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ]

  const benefits = [
    {
      icon: DollarSign,
      title: 'Save Money',
      description: 'Cut photo studio costs by 80%. No expensive equipment or software needed.',
      metric: '80% Cost Savings'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Transform images in seconds, not hours. 10x faster than manual editing.',
      metric: '90% Time Saved'
    },
    {
      icon: Zap,
      title: 'No Skills Required',
      description: 'Professional results without Photoshop expertise. AI does the heavy lifting.',
      metric: 'Zero Learning Curve'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Manager',
      company: 'TechStart Inc',
      image: '👩‍💼',
      quote: 'Remixly transformed our product photography workflow. We cut costs by 75% and increased conversion rates by 35%.',
      metric: '+35% Conversions',
      rating: 5
    },
    {
      name: 'Budi Santoso',
      role: 'Content Creator',
      company: '@BudiCreates',
      image: '👨‍🎨',
      quote: 'I generate 10x more content variations in a fraction of the time. My engagement doubled since using Remixly.',
      metric: '2x Engagement',
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      role: 'Job Seeker',
      company: 'LinkedIn Professional',
      image: '👩‍💻',
      quote: 'Got my dream job interview thanks to my AI-enhanced professional headshot. Worth every credit!',
      metric: 'Dream Job Landed',
      rating: 5
    }
  ]

  const useCases = [
    {
      title: 'Professionals & Job Seekers',
      description: 'LinkedIn headshots that stand out',
      benefit: 'Save $200+ vs studio photoshoots',
      icon: Target
    },
    {
      title: 'E-commerce Businesses',
      description: 'Product photos without expensive studios',
      benefit: 'Boost conversions by 35%',
      icon: TrendingUp
    },
    {
      title: 'Content Creators',
      description: 'Endless content variations instantly',
      benefit: '10x output, 90% less time',
      icon: Rocket
    },
    {
      title: 'Designers & Creatives',
      description: 'Rapid prototyping and experimentation',
      benefit: 'Unlimited creative possibilities',
      icon: Award
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter Pack',
      price: 'Rp50.000',
      credits: '100',
      savings: null,
      features: [
        'Perfect for trying out',
        '10-20 AI generations',
        'All features included',
        'No expiration'
      ],
      cta: 'Buy Now',
      highlighted: false
    },
    {
      name: 'Popular Pack',
      price: 'Rp200.000',
      credits: '500',
      savings: '20%',
      features: [
        'Most popular choice',
        '50-100 AI generations',
        'All features included',
        'No expiration',
        'Save 20%'
      ],
      cta: 'Buy Now',
      highlighted: true
    },
    {
      name: 'Pro Pack',
      price: 'Rp350.000',
      credits: '1000',
      savings: '30%',
      features: [
        'For power users',
        '100-200 AI generations',
        'All features included',
        'No expiration',
        'Save 30%',
        'Priority support'
      ],
      cta: 'Buy Now',
      highlighted: false
    }
  ]

  const beforeAfterExamples = [
    {
      title: 'LinkedIn Headshot',
      image: '/asset/linkedin-shot.png',
      description: 'Transform casual photos into career-boosting headshots'
    },
    {
      title: 'Product Photography',
      image: '/asset/product-photography.png',
      description: 'Elevate product images with AI-powered enhancements'
    },
    {
      title: 'Content Creation',
      image: '/asset/content-creation.png',
      description: 'Generate unlimited content variations from one photo'
    }
  ]

  const showcaseImages = [
    { src: '/asset/asset-1.png', alt: 'AI Generated Image 1' },
    { src: '/asset/asset-2.png', alt: 'AI Generated Image 2' },
    { src: '/asset/asset-3.png', alt: 'AI Generated Image 3' },
    { src: '/asset/asset-4.png', alt: 'AI Generated Image 4' },
    { src: '/asset/asset-5.png', alt: 'AI Generated Image 5' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              Remixly
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-4 py-1.5" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Powered by Google Gemini
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Stunning Visuals with AI — No Design Skills Needed
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform any image in seconds. From selfies to studio shots, product photos to professional headshots — all powered by cutting-edge AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  Get 100 Free Credits
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  See Examples
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% secure uploads
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Join 1,000+ creators
              </div>
            </div>
          </div>

          {/* Hero Visual - Image Showcase */}
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {showcaseImages.map((img, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative aspect-square">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={85}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Professional Visuals Shouldn't Cost a Fortune
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Professional photoshoots cost $200-500+ per session</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Photo editing software requires months to master</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Manual editing takes hours for single images</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Limited creative options without expensive equipment</span>
                  </p>
                </div>
              </div>
              <div>
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-8">
                    <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Remixly Makes It Effortless</h3>
                    <div className="space-y-3">
                      <p className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Transform images in 60 seconds with AI</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Zero design skills required</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Professional quality guaranteed</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Start free with 100 credits</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Thousands Choose Remixly
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The fastest, most affordable way to create professional-quality visuals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-4">{benefit.description}</p>
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {benefit.metric}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              Powered by AI
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Create Stunning Visuals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools powered by Google Gemini 2.0 Flash
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all group">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Try All Features Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Before/After Gallery Section */}
      <section id="demo" className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See the AI Magic in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real transformations in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {beforeAfterExamples.map((example, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all group">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Every Creator
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're building a career, business, or brand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <useCase.icon className="w-10 h-10 text-blue-500 mb-4" />
                  <h3 className="font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {useCase.benefit}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
              Trusted by Creators
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Real Users
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands transforming their visual content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {testimonial.metric}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-all ${plan.highlighted ? 'border-2 border-purple-500 shadow-lg scale-105' : ''}`}
              >
                <CardContent className="p-8">
                  {plan.highlighted && (
                    <Badge className="mb-4 bg-purple-500">Most Popular</Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  <div className="mb-6">
                    <Badge variant="outline" className="text-sm font-normal">
                      {plan.credits} credits
                    </Badge>
                    {plan.savings && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                        Save {plan.savings}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/credits">
                    <Button
                      className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get 100 Free Credits Today
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Transform your first image in 60 seconds. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  <Rocket className="w-5 h-5 mr-2" />
                  Register Now - It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-75">
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 100% secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Remixly</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered visual creation platform for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                <li><Link href="/templates" className="hover:text-primary">Templates</Link></li>
                <li><Link href="/workflows" className="hover:text-primary">Workflows</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="mailto:support@remixly.app" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Remixly. All rights reserved. Powered by Google Gemini 2.0 Flash.</p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <a href="#" className="hover:text-primary">Twitter</a>
              <a href="#" className="hover:text-primary">Discord</a>
              <a href="mailto:support@remixly.app" className="hover:text-primary">support@remixly.app</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
