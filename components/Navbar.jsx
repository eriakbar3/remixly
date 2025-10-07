'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Coins,
  LogOut,
  User,
  Home,
  ChevronDown,
  ImageIcon,
  Wand2,
  Briefcase,
  LayoutTemplate,
  Workflow,
  BookOpen
} from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Remixly
          </Link>
          {session && (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Studio
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <Link href="/studio/photo-editor">
                    <DropdownMenuItem>
                      <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">AI Photo Editor</p>
                        <p className="text-xs text-muted-foreground">Enhance & retouch photos</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/studio/content-generator">
                    <DropdownMenuItem>
                      <Wand2 className="w-4 h-4 mr-2 text-purple-500" />
                      <div>
                        <p className="font-medium">AI Content Generator</p>
                        <p className="text-xs text-muted-foreground">Create transformative media</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/studio/professional">
                    <DropdownMenuItem>
                      <Briefcase className="w-4 h-4 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Professional Studio</p>
                        <p className="text-xs text-muted-foreground">Business solutions</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/workflows">
                <Button variant="ghost" size="sm">
                  <Workflow className="w-4 h-4 mr-2" />
                  Workflows
                </Button>
              </Link>

              <Link href="/templates">
                <Button variant="ghost" size="sm">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </Button>
              </Link>

              <Link href="/prompt-guides">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Prompt Guides
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <Badge variant="secondary">
                  {session.user.credits || 0} Credits
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user.name || session.user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
