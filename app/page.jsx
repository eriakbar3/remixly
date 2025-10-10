'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DemoGenerator } from '@/components/DemoGenerator'
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header - Enhanced with glass morphism */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/20 dark:border-gray-800/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-950/70">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Remixly
                </span>
              </Link>
              <nav className="hidden lg:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
                <a href="#demo" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Try Demo</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="default" className="hidden sm:flex font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="default" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned with modern spacing */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.1),transparent_50%)]" />

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="px-5 py-2.5 text-sm font-semibold bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-2 border-white shadow-xl">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                Powered by Google Gemini 2.0 Flash
              </Badge>
            </div>

            {/* Heading with enhanced typography */}
            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Stunning Visuals
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                with AI — No Design
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Skills Needed
              </span>
            </h1>

            {/* Subheading with better contrast */}
            <p className="text-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Transform any image in seconds. From selfies to studio shots, product photos to professional headshots — all powered by cutting-edge AI.
            </p>

            {/* CTA Buttons - Enhanced design */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 font-bold rounded-2xl transform hover:scale-105 transition-all"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Get 100 Free Credits
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
              <a href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-10 py-7 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 font-bold rounded-2xl hover:shadow-xl transition-all"
                >
                  Watch Demo
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            {/* Trust indicators with icons */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-800/50">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">No credit card required</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-800/50">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">100% secure uploads</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-800/50">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Join 1,000+ creators</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Enhanced gallery */}
          <div className="mt-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {showcaseImages.map((img, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - Redesigned */}
      <section id="demo" className="py-24 md:py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                <Zap className="w-3 h-3 mr-1 dark:text-green-400" />
                Try It Free - No Login Required
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Experience AI Magic Yourself
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-3 font-medium">
                Generate your first AI image right now - completely free!
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Get 3 free tries, then sign up for 100 free credits
              </p>
            </div>

            {/* Demo Generator Component */}
            <DemoGenerator />

            {/* Example Gallery */}
            <div className="mt-24">
              <div className="text-center mb-12">
                <Badge className="mb-6 bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-2 border-white shadow-xl inline-flex">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Powered by Google Gemini 2.0 Flash
                </Badge>
                <h3 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white">
                  See What Others Have Created
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Real examples from our AI-powered platform
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {beforeAfterExamples.map((example, index) => (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 transform hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      <Image
                        src={example.image}
                        alt={example.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white">
                        {example.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {example.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section - Redesigned */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Problem Side */}
              <div className="space-y-8">
                <div>
                  <Badge className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                    The Problem
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
                    Professional Visuals Shouldn't Cost a Fortune
                  </h2>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="w-8 h-8 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Professional photoshoots cost $200-500+ per session
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="w-8 h-8 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Photo editing software requires months to master
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="w-8 h-8 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Manual editing takes hours for single images
                    </p>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="w-8 h-8 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      Limited creative options without expensive equipment
                    </p>
                  </div>
                </div>
              </div>

              {/* Solution Side */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-10 blur-2xl" />
                <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 rounded-3xl p-10 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <Badge className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    The Solution
                  </Badge>
                  <h3 className="text-3xl font-black mb-6 text-gray-900 dark:text-white">
                    Remixly Makes It Effortless
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                        Transform images in 60 seconds with AI
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                        Zero design skills required
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                        Professional quality guaranteed
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                        Start free with 100 credits
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section - Redesigned */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                Why Choose Remixly
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Why Thousands Choose Remixly
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                The fastest, most affordable way to create professional-quality visuals
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transform hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black mb-4 text-center text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed font-medium">
                      {benefit.description}
                    </p>

                    {/* Metric Badge */}
                    <div className="flex justify-center">
                      <Badge className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800">
                        {benefit.metric}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section - Redesigned */}
      <section id="features" className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Everything You Need to Create Stunning Visuals
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                Professional-grade tools powered by Google Gemini 2.0 Flash
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transform hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black mb-4 text-center text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-16">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/30 font-bold rounded-2xl transform hover:scale-105 transition-all"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try All Features Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Redesigned */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                Perfect For Everyone
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Built for Every Creator
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                Whether you're building a career, business, or brand
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transform hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                      <useCase.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black mb-3 text-gray-900 dark:text-white">
                      {useCase.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {useCase.description}
                    </p>

                    {/* Benefit Badge */}
                    <Badge className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-xs font-bold">
                      {useCase.benefit}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Redesigned */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                <Star className="w-3 h-3 mr-1 fill-yellow-600 dark:fill-yellow-400" />
                Trusted by Creators
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Real Results from Real Users
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                Join thousands transforming their visual content
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-yellow-200 dark:hover:border-yellow-800 transform hover:-translate-y-2"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 dark:text-gray-200 mb-8 italic text-lg leading-relaxed font-medium">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                        {testimonial.image}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{testimonial.role}</p>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-bold">
                          {testimonial.metric}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Redesigned */}
      <section id="pricing" className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                <DollarSign className="w-3 h-3 mr-1" />
                Flexible Pricing
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                Start free, upgrade when you need more — no subscriptions
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`group relative rounded-3xl p-10 transition-all duration-500 transform ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-purple-500/30 scale-105 border-4 border-purple-400 dark:border-purple-600'
                      : 'bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-800 hover:-translate-y-2'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.highlighted && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-400 text-gray-900 border-yellow-500 px-6 py-2 text-sm font-black shadow-lg">
                        <Star className="w-4 h-4 mr-1 fill-yellow-600" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`relative ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {/* Plan Name */}
                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-5xl font-black">{plan.price}</span>
                    </div>

                    {/* Credits & Savings */}
                    <div className="flex items-center gap-2 mb-8">
                      <Badge
                        className={`${
                          plan.highlighted
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        } font-bold`}
                      >
                        {plan.credits} credits
                      </Badge>
                      {plan.savings && (
                        <Badge className="bg-green-500 text-white border-green-600 font-bold">
                          Save {plan.savings}
                        </Badge>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              plan.highlighted ? 'text-white' : 'text-green-600 dark:text-green-400'
                            }`}
                          />
                          <span className="leading-relaxed font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href="/credits">
                      <Button
                        className={`w-full text-lg py-7 font-bold rounded-2xl transform hover:scale-105 transition-all shadow-lg ${
                          plan.highlighted
                            ? 'bg-white text-purple-600 hover:bg-gray-100'
                            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-purple-500/30'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner - Redesigned */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Get 100 Free Credits Today
            </h2>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-12 opacity-95 font-medium max-w-2xl mx-auto">
              Transform your first image in 60 seconds. No credit card required.
            </p>

            {/* CTA Button */}
            <Link href="/auth/register">
              <Button
                size="lg"
                className="text-lg px-12 py-8 bg-white text-purple-600 hover:bg-gray-100 font-black rounded-2xl shadow-2xl transform hover:scale-105 transition-all"
              >
                <Rocket className="w-6 h-6 mr-2" />
                Register Now - It's Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">100% secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Start instantly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned */}
      <footer className="py-16 bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Footer Grid */}
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand Column */}
              <div>
                <Link href="/" className="flex items-center gap-2 mb-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Remixly
                  </span>
                </Link>
                <p className="text-sm text-gray-400 leading-relaxed">
                  AI-powered visual creation platform for everyone. Transform images in seconds.
                </p>
              </div>

              {/* Product Column */}
              <div>
                <h4 className="font-black text-white mb-4">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link href="/templates" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="/workflows" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Workflows
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="font-black text-white mb-4">Support</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="mailto:support@remixly.app" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h4 className="font-black text-white mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400">
                  © 2025 Remixly. All rights reserved. Powered by Google Gemini 2.0 Flash.
                </p>
                <div className="flex items-center gap-6">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium">
                    Discord
                  </a>
                  <a
                    href="mailto:support@remixly.app"
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    support@remixly.app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
