'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coins, Check } from 'lucide-react'

export default function CreditsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const packages = [
    { credits: 100, price: 50000, popular: false },
    { credits: 250, price: 100000, popular: true },
    { credits: 500, price: 175000, popular: false },
    { credits: 1000, price: 300000, popular: false },
  ]

  const handlePurchase = async (credits, price) => {
    setLoading(true)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits, amount: price })
      })

      const data = await res.json()

      if (res.ok && data.token) {
        // Redirect to Midtrans payment page
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            alert('Payment successful!')
            window.location.href = '/dashboard'
          },
          onPending: function(result) {
            alert('Payment pending. Please complete your payment.')
          },
          onError: function(result) {
            alert('Payment failed. Please try again.')
          },
          onClose: function() {
            console.log('Payment popup closed')
          }
        })
      } else {
        alert(data.error || 'Failed to create payment')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Buy Credits</h1>
          <p className="text-muted-foreground">Choose a package that fits your needs</p>
        </div>

        {session && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-bold">{session.user.credits || 0}</span>
                <span className="text-muted-foreground">Available Credits</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <Card key={index} className={pkg.popular ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                {pkg.popular && (
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                )}
                <CardTitle className="text-3xl">{pkg.credits}</CardTitle>
                <CardDescription>Credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-2xl font-bold">Rp {pkg.price.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => handlePurchase(pkg.credits, pkg.price)}
                  disabled={loading}
                  className="w-full"
                  variant={pkg.popular ? 'default' : 'outline'}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Midtrans Snap Script */}
      <script
        type="text/javascript"
        src={`https://app.${process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' ? '' : 'sandbox.'}midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
    </div>
  )
}
