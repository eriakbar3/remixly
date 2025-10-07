'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  History,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Loader2,
  Calendar,
  Coins,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchJobs()
    }
  }, [status, router])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()

      if (res.ok) {
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setJobs(jobs.filter(job => job.id !== jobId))
      } else {
        alert('Failed to delete')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete')
    }
  }

  const handlePreview = (job) => {
    setSelectedJob(job)
    setShowPreview(true)
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

  const getJobTypeLabel = (type) => {
    const labels = {
      outfit_changer: 'Outfit Changer',
      pose_generator: 'Pose Generator',
      expression_editor: 'Expression Editor',
      angle_shift: 'Angle Shift',
      photo_restoration: 'Photo Restoration',
      headshot_generator: 'Headshot Generator',
      photobooth: 'Photobooth AI',
      product_studio: 'Product Studio',
      background_remover: 'Background Remover',
      image_enhancer: 'Image Enhancer',
      image_composition: 'AI Image Composer'
    }
    return labels[type] || type
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      getJobTypeLabel(job.jobType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.id && job.id.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      filterStatus === 'all' || job.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const groupedByDate = filteredJobs.reduce((groups, job) => {
    const date = new Date(job.createdAt).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(job)
    return groups
  }, {})

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    creditsUsed: jobs.reduce((sum, j) => sum + (j.creditsCost || 0), 0)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                <History className="w-6 h-6 md:w-8 md:h-8" />
                <span className="hidden sm:inline">Generation History</span>
                <span className="sm:hidden">History</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
                View and manage all your AI-generated images
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
                </div>
                <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Done</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Failed</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.failed}</p>
                </div>
                <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Used</p>
                  <p className="text-xl md:text-2xl font-bold">{stats.creditsUsed}</p>
                </div>
                <Coins className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No history found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterStatus !== 'all'
                  ? 'No results match your filters'
                  : 'Start creating AI images to see your history'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link href="/dashboard">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, dateJobs]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">{date}</h3>
                  <Badge variant="outline">{dateJobs.length} items</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {dateJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square relative bg-muted">
                        {job.status === 'completed' && job.outputUrl ? (
                          <img
                            src={job.outputUrl}
                            alt={getJobTypeLabel(job.jobType)}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handlePreview(job)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getStatusIcon(job.status)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="backdrop-blur-sm">
                            {getJobTypeLabel(job.jobType)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 md:gap-2">
                            {getStatusIcon(job.status)}
                            <span className="text-xs md:text-sm font-medium capitalize">{job.status}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {job.creditsCost || 0}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 md:mb-3">
                          {new Date(job.createdAt).toLocaleTimeString()}
                        </p>

                        <div className="flex gap-1 md:gap-2">
                          {job.status === 'completed' && job.outputUrl && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handlePreview(job)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <a href={job.outputUrl} download>
                                  <Download className="w-4 h-4" />
                                </a>
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{getJobTypeLabel(selectedJob?.jobType)}</DialogTitle>
            <DialogDescription>
              Created on {selectedJob && new Date(selectedJob.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              <img
                src={selectedJob.outputUrl}
                alt="Preview"
                className="w-full rounded-lg"
              />

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={selectedJob.outputUrl} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>

              {selectedJob.parameters && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                      {JSON.stringify(JSON.parse(selectedJob.parameters), null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
