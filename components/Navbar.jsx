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
  BookOpen,
  Grid3x3,
  Sparkles,
  Images
} from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="font-bold text-lg md:text-xl">
            Remixly
          </Link>
          {session && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Tools
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <Link href="/history">
                      <DropdownMenuItem>
                        <Images className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <p className="font-medium">Gallery</p>
                          <p className="text-xs text-muted-foreground">View your images</p>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/prompt-guides">
                      <DropdownMenuItem>
                        <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                        <div>
                          <p className="font-medium">Prompt Guides</p>
                          <p className="text-xs text-muted-foreground">Learn prompting</p>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/tools/image-composer">
                      <DropdownMenuItem>
                        <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                        <div>
                          <p className="font-medium">AI Composer</p>
                          <p className="text-xs text-muted-foreground">20 credits</p>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <>
              {/* Credits Badge - Always visible, clickable to buy more */}
              <Link href="/credits">
                <div className="flex items-center gap-1 md:gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Coins className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                  <Badge variant="secondary" className="text-xs">
                    {session.user.credits || 0}
                  </Badge>
                </div>
              </Link>

              {/* User info - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user.name || session.user.email}</span>
              </div>

              {/* Logout button - Hidden on mobile, use dropdown instead */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden md:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>

              {/* Mobile user menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {session.user.name || session.user.email}
                  </div>
                  <Link href="/credits">
                    <DropdownMenuItem>
                      <Coins className="w-4 h-4 mr-2 text-yellow-500" />
                      Buy Credits
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="w-4 h-4 mr-2 text-red-500" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="text-xs md:text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {session && mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <div className="pl-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Studio</p>
              <Link href="/studio/photo-editor" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <ImageIcon className="w-3 h-3 mr-2" />
                  AI Photo Editor
                </Button>
              </Link>
              <Link href="/studio/content-generator" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <Wand2 className="w-3 h-3 mr-2" />
                  AI Content Generator
                </Button>
              </Link>
              <Link href="/studio/professional" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <Briefcase className="w-3 h-3 mr-2" />
                  Professional Studio
                </Button>
              </Link>
            </div>

            <div className="pl-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Tools</p>
              <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <Images className="w-3 h-3 mr-2" />
                  Gallery
                </Button>
              </Link>
              <Link href="/prompt-guides" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <BookOpen className="w-3 h-3 mr-2" />
                  Prompt Guides
                </Button>
              </Link>
              <Link href="/tools/image-composer" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  <Sparkles className="w-3 h-3 mr-2" />
                  AI Composer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
