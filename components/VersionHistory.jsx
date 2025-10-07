'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Clock,
  RotateCcw,
  Trash2,
  MessageSquare,
  Calendar,
  GitBranch,
  Download
} from 'lucide-react'
import Image from 'next/image'

export default function VersionHistory({ jobId, currentVersion }) {
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareWith, setCompareWith] = useState(null)
  const [noteInput, setNoteInput] = useState({})
  const [loading, setLoading] = useState(true)

  // Load versions
  useEffect(() => {
    loadVersions()
  }, [jobId])

  const loadVersions = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/versions`)
      const data = await response.json()
      if (data.success) {
        setVersions(data.versions)
      }
    } catch (error) {
      console.error('Failed to load versions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Restore version
  const restoreVersion = async (version) => {
    if (!confirm(`Restore to version ${version}? This will create a new version.`)) {
      return
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/versions/${version}/restore`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        alert('Version restored successfully!')
        loadVersions()
        window.location.reload()
      }
    } catch (error) {
      alert('Failed to restore version')
      console.error(error)
    }
  }

  // Delete version
  const deleteVersion = async (version) => {
    if (!confirm(`Delete version ${version}? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/versions/${version}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        loadVersions()
      }
    } catch (error) {
      alert('Failed to delete version')
      console.error(error)
    }
  }

  // Add note
  const saveNote = async (version) => {
    const note = noteInput[version]
    if (!note?.trim()) return

    try {
      const response = await fetch(`/api/jobs/${jobId}/versions/${version}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      })

      if (response.ok) {
        loadVersions()
        setNoteInput({ ...noteInput, [version]: '' })
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  // Download version
  const downloadVersion = async (outputUrl, version) => {
    const link = document.createElement('a')
    link.href = outputUrl
    link.download = `version-${version}-${Date.now()}.png`
    link.click()
  }

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (loading) {
    return <div className="text-center py-8">Loading version history...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Version History
          </h3>
          <p className="text-sm text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? 'Exit Compare' : 'Compare Versions'}
        </Button>
      </div>

      {/* Compare View */}
      {compareMode && compareWith && selectedVersion && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge className="mb-2">Version {selectedVersion.version}</Badge>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={selectedVersion.outputUrl}
                  alt={`Version ${selectedVersion.version}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(selectedVersion.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Badge className="mb-2">Version {compareWith.version}</Badge>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <Image
                  src={compareWith.outputUrl}
                  alt={`Version ${compareWith.version}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(compareWith.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Version Timeline */}
      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card
            key={version.id}
            className={`p-4 ${
              compareMode && selectedVersion?.version === version.version
                ? 'border-primary'
                : ''
            }`}
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div
                className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => {
                  if (compareMode) {
                    if (!selectedVersion) {
                      setSelectedVersion(version)
                    } else if (selectedVersion.version !== version.version) {
                      setCompareWith(version)
                    }
                  }
                }}
              >
                <Image
                  src={version.outputUrl}
                  alt={`Version ${version.version}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    Current
                  </Badge>
                )}
                {compareMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                    Click to compare
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Version {version.version}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(version.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadVersion(version.outputUrl, version.version)}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {index !== 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => restoreVersion(version.version)}
                          title="Restore this version"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteVersion(version.version)}
                          title="Delete version"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Parameters */}
                {version.parameters && (
                  <div className="mb-2">
                    <div className="text-xs text-muted-foreground mb-1">Parameters:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(JSON.parse(version.parameters)).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                {version.note && (
                  <div className="mb-2 p-2 bg-muted rounded text-sm flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{version.note}</span>
                  </div>
                )}

                {/* Add Note */}
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a note to this version..."
                    value={noteInput[version.version] || ''}
                    onChange={(e) =>
                      setNoteInput({ ...noteInput, [version.version]: e.target.value })
                    }
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => saveNote(version.version)}
                    disabled={!noteInput[version.version]?.trim()}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {versions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No version history available</p>
        </Card>
      )}
    </div>
  )
}
