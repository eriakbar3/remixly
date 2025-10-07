'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Keyboard, X } from 'lucide-react'

const shortcuts = [
  {
    category: 'General',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette', action: 'command-palette' },
      { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', action: 'show-shortcuts' },
      { keys: ['Ctrl', 'B'], description: 'Toggle sidebar', action: 'toggle-sidebar' },
    ]
  },
  {
    category: 'Studio',
    items: [
      { keys: ['Ctrl', 'U'], description: 'Upload image', action: 'upload' },
      { keys: ['Ctrl', 'Enter'], description: 'Process image', action: 'process' },
      { keys: ['Ctrl', 'D'], description: 'Download result', action: 'download' },
      { keys: ['Ctrl', 'N'], description: 'New job', action: 'new-job' },
      { keys: ['Ctrl', 'Z'], description: 'Undo (restore previous version)', action: 'undo' },
    ]
  },
  {
    category: 'Workflows',
    items: [
      { keys: ['Ctrl', 'Shift', 'W'], description: 'Create workflow', action: 'create-workflow' },
      { keys: ['Ctrl', 'Shift', 'E'], description: 'Execute workflow', action: 'execute-workflow' },
      { keys: ['Ctrl', 'S'], description: 'Save workflow', action: 'save-workflow' },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['Alt', '1'], description: 'Go to Dashboard', action: 'nav-dashboard' },
      { keys: ['Alt', '2'], description: 'Go to Studio', action: 'nav-studio' },
      { keys: ['Alt', '3'], description: 'Go to Workflows', action: 'nav-workflows' },
      { keys: ['Alt', '4'], description: 'Go to History', action: 'nav-history' },
    ]
  },
  {
    category: 'View',
    items: [
      { keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle dark mode', action: 'toggle-dark' },
      { keys: ['F11'], description: 'Fullscreen', action: 'fullscreen' },
      { keys: ['Esc'], description: 'Close modal/Cancel', action: 'escape' },
    ]
  }
]

export function useKeyboardShortcuts(callbacks = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { ctrlKey, metaKey, altKey, shiftKey, key } = e

      // Command key for Mac, Ctrl for Windows/Linux
      const cmdOrCtrl = ctrlKey || metaKey

      // General shortcuts
      if (cmdOrCtrl && key === 'k') {
        e.preventDefault()
        callbacks.onCommandPalette?.()
      }
      if (cmdOrCtrl && key === '/') {
        e.preventDefault()
        callbacks.onShowShortcuts?.()
      }
      if (cmdOrCtrl && key === 'b') {
        e.preventDefault()
        callbacks.onToggleSidebar?.()
      }

      // Studio shortcuts
      if (cmdOrCtrl && key === 'u') {
        e.preventDefault()
        callbacks.onUpload?.()
      }
      if (cmdOrCtrl && key === 'Enter') {
        e.preventDefault()
        callbacks.onProcess?.()
      }
      if (cmdOrCtrl && key === 'd') {
        e.preventDefault()
        callbacks.onDownload?.()
      }
      if (cmdOrCtrl && key === 'n') {
        e.preventDefault()
        callbacks.onNewJob?.()
      }
      if (cmdOrCtrl && key === 'z') {
        e.preventDefault()
        callbacks.onUndo?.()
      }

      // Workflow shortcuts
      if (cmdOrCtrl && shiftKey && key === 'W') {
        e.preventDefault()
        callbacks.onCreateWorkflow?.()
      }
      if (cmdOrCtrl && shiftKey && key === 'E') {
        e.preventDefault()
        callbacks.onExecuteWorkflow?.()
      }
      if (cmdOrCtrl && key === 's') {
        e.preventDefault()
        callbacks.onSaveWorkflow?.()
      }

      // Navigation shortcuts
      if (altKey && key === '1') {
        e.preventDefault()
        callbacks.onNavDashboard?.()
      }
      if (altKey && key === '2') {
        e.preventDefault()
        callbacks.onNavStudio?.()
      }
      if (altKey && key === '3') {
        e.preventDefault()
        callbacks.onNavWorkflows?.()
      }
      if (altKey && key === '4') {
        e.preventDefault()
        callbacks.onNavHistory?.()
      }

      // View shortcuts
      if (cmdOrCtrl && shiftKey && key === 'D') {
        e.preventDefault()
        callbacks.onToggleDark?.()
      }
      if (key === 'F11') {
        e.preventDefault()
        callbacks.onFullscreen?.()
      }
      if (key === 'Escape') {
        callbacks.onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Keyboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <p className="text-sm text-muted-foreground">
                Speed up your workflow with keyboard shortcuts
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <Badge variant="outline" className="font-mono">
                            {key === 'Ctrl' && isMac ? '⌘' : key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span>Press <Badge variant="outline" className="mx-1">Ctrl + /</Badge> to toggle this panel</span>
          <span>Press <Badge variant="outline" className="mx-1">Esc</Badge> to close</span>
        </div>
      </Card>
    </div>
  )
}
