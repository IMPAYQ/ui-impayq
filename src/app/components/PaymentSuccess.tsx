/* eslint-disable react/no-unescaped-entities */
"use client"

import { CheckCircle, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect, useState } from "react"

interface PaymentSuccessProps {
  amount: string
  username: string
  onClose: () => void
}

export default function PaymentSuccess({ amount, username, onClose }: PaymentSuccessProps) {
  const [countdown, setCountdown] = useState(5)

  // Trigger confetti effect when component mounts
  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Auto-close after countdown
  useEffect(() => {
    if (countdown <= 0) {
      onClose()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
    >
      <div className="bg-white w-full h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Private Payment Successful!</h2>
          <p className="text-gray-500 text-center mb-8">
            You've received ${amount} from {username} securely
          </p>

          <div className="card w-full mb-6">
            <div className="card-content">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-gray-500 text-sm">Amount Received</h4>
                  <p className="text-2xl font-bold">${amount}</p>
                </div>
                <div className="badge badge-green px-3 py-1">
                  <span className="font-medium">+{Math.floor(Number.parseFloat(amount))} tokens</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 w-full">
            <p className="text-sm text-center text-purple-700">
              Transaction has been recorded privately on the Aztec Network with zero-knowledge security.
            </p>
          </div>
        </div>

        <div className="p-4">
          <button onClick={onClose} className="btn btn-primary btn-full">
            Done <ArrowRight size={16} className="ml-2" />
            <span className="ml-2 text-sm opacity-80">({countdown})</span>
          </button>
        </div>
      </div>
    </div>
  )
}

