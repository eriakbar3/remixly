'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Briefcase,
  LayoutTemplate,
  TrendingUp,
  ArrowRight,
  Plus,
  Star,
  Zap,
  Grid3x3
} from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  {
    title: 'AI Photo Editor',
    description: 'Enhance and retouch existing photos',
    icon: ImageIcon,
    color: 'bg-blue-500',
    href: '/studio/photo-editor',
    tools: ['Image Enhancer', 'Background Remover', 'Photo Restoration']
  },
  {
    title: 'AI Content Generator',
    description: 'Create new and transformative media',
    icon: Wand2,
    color: 'bg-purple-500',
    href: '/studio/content-generator',
    tools: ['Outfit Changer', 'Pose Generator', 'Background Replacer']
  },
  {
    title: 'Professional Studio',
    description: 'High-value business solutions',
    icon: Briefcase,
    color: 'bg-green-500',
    href: '/studio/professional',
    tools: ['Headshot Generator', 'Product Studio', 'Photobooth AI']
  },
  {
    title: 'Templates & Resources',
    description: 'Start with pre-built workflows',
    icon: LayoutTemplate,
    color: 'bg-orange-500',
    href: '/templates',
    tools: ['Browse Templates', 'Prompt Guides', 'Tutorials']
  },
  {
    title: 'Image Combiner',
    description: 'Combine multiple images - no credits',
    icon: Grid3x3,
    color: 'bg-cyan-500',
    href: '/tools/image-combiner',
    tools: ['Grid Layouts', 'Collage', 'Free Tool'],
    badge: 'FREE'
  }
]

const suggestedTemplates = [
  { name: 'LinkedIn Profile Photo', icon: '💼', credits: 25, popular: true },
  { name: 'Instagram Post', icon: '📱', credits: 15, popular: true },
  { name: 'E-commerce Product', icon: '🛍️', credits: 20, popular: true },
  { name: 'Business Card Photo', icon: '👤', credits: 15, popular: false }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [jobsRes, transactionsRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/transactions')
      ])

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        setJobs(jobsData.jobs || [])
      }

      if (transactionsRes.ok) {
        const transData = await transactionsRes.json()
        setTransactions(transData.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const statsData = {
    totalJobs: jobs.length,
    creditsUsed: jobs.reduce((sum, job) => sum + (job.creditsCost || 0), 0),
    thisMonth: jobs.filter(j => {
      const jobDate = new Date(j.createdAt)
      const now = new Date()
      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear()
    }).length
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session.user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Your AI-powered visual studio dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Credits Available</p>
              <p className="text-3xl font-bold">{session.user.credits || 100}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-3xl font-bold">{statsData.totalJobs}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-full">
              <ImageIcon className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">{statsData.thisMonth}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Credits Used</p>
              <p className="text-3xl font-bold">{statsData.creditsUsed}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-full">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  {action.badge && (
                    <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {action.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {action.tools.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects & Suggested Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Projects
            </h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {jobs.length === 0 ? (
            <Card className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first AI transformation
              </p>
              <Link href="/studio">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {getStatusIcon(job.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 capitalize">
                        {job.type.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()} • {job.creditsCost} credits
                      </p>
                    </div>
                    <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Suggested Templates
            </h2>
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                Browse All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {suggestedTemplates.map((template) => (
              <Card
                key={template.name}
                className="p-4 hover:border-primary transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {template.credits} credits
                  </Badge>
                  {template.popular && (
                    <Badge className="ml-1 text-xs bg-yellow-500">
                      Popular
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
