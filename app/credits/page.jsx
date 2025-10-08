'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Coins,
  Zap,
  Crown,
  Sparkles,
  Check,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Gift
} from 'lucide-react'
import Link from 'next/link'

const creditPackages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    price: 50000,
    pricePerCredit: 500,
    icon: Zap,
    color: 'bg-blue-500',
    popular: false,
    features: [
      'Perfect for trying out',
      '10-20 AI generations',
      'All features included',
      'No expiration'
    ]
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 500,
    price: 200000,
    pricePerCredit: 400,
    savings: 20,
    icon: Sparkles,
    color: 'bg-purple-500',
    popular: true,
    features: [
      'Most popular choice',
      '50-100 AI generations',
      'All features included',
      'No expiration',
      'Save 20%'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 1000,
    price: 350000,
    pricePerCredit: 350,
    savings: 30,
    icon: Crown,
    color: 'bg-yellow-500',
    popular: false,
    features: [
      'For power users',
      '100-200 AI generations',
      'All features included',
      'No expiration',
      'Save 30%',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 5000,
    price: 1500000,
    pricePerCredit: 300,
    savings: 40,
    icon: TrendingUp,
    color: 'bg-green-500',
    popular: false,
    features: [
      'For businesses',
      '500+ AI generations',
      'All features included',
      'No expiration',
      'Save 40%',
      'Priority support',
      'Bulk processing'
    ]
  }
]

export default function CreditsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handlePurchase = async (pkg) => {
    setLoading(true)
    setSelectedPackage(pkg.id)

    try {
      // Get Midtrans Snap token
      const response = await fetch('/api/credits/midtrans-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: pkg.id,
          credits: pkg.credits,
          amount: pkg.price,
        }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        // Load Midtrans Snap script if not already loaded
        if (!window.snap) {
          const script = document.createElement('script')
          script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
          document.head.appendChild(script)

          // Wait for script to load
          await new Promise((resolve) => {
            script.onload = resolve
          })
        }

        // Open Midtrans Snap payment popup
        window.snap.pay(data.token, {
          onSuccess: async function(result) {
            console.log('Payment success:', result)

            // Update session to reflect new credit balance
            await update()

            // Show success message
            alert(`Successfully purchased ${pkg.credits} credits!`)

            // Redirect to dashboard
            router.push('/dashboard')
          },
          onPending: function(result) {
            console.log('Payment pending:', result)
            alert('Payment is pending. Please complete the payment.')
          },
          onError: function(result) {
            console.log('Payment error:', result)
            alert('Payment failed. Please try again.')
          },
          onClose: function() {
            console.log('Payment popup closed')
            setLoading(false)
            setSelectedPackage(null)
          }
        })
      } else {
        alert(data.error || 'Failed to initialize payment')
        setLoading(false)
        setSelectedPackage(null)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to initialize payment. Please try again.')
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-500" />
                Buy Credits
              </h1>
              <p className="text-muted-foreground mt-2">
                Choose a credit package to power your AI transformations
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold text-yellow-500">
                {session?.user?.credits || 0}
              </p>
              <p className="text-xs text-muted-foreground">credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Gift className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Special Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Save up to 40% with larger packages! Credits never expire and can be used for any AI transformation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden hover:shadow-xl transition-all ${
                pkg.popular ? 'border-2 border-purple-500 shadow-lg' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="bg-purple-500 text-white rounded-none rounded-bl-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className={`p-3 ${pkg.color} rounded-lg inline-block mb-3`}>
                  <pkg.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="mt-4 space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      Rp{pkg.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <Badge variant="secondary" className="font-normal">
                      {pkg.credits} credits
                    </Badge>
                    {pkg.savings && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                        Save {pkg.savings}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rp{pkg.pricePerCredit.toLocaleString('id-ID')} per credit
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  {loading && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">How do credits work?</h4>
              <p className="text-sm text-muted-foreground">
                Each AI transformation costs credits based on its complexity. Simple operations like background removal cost 5 credits, while complex transformations like outfit changes cost 15 credits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Do credits expire?</h4>
              <p className="text-sm text-muted-foreground">
                No! Your credits never expire. Use them whenever you need them.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and various local payment methods through our secure payment processor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Can I get a refund?</h4>
              <p className="text-sm text-muted-foreground">
                Unused credits can be refunded within 30 days of purchase. Contact our support team for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
