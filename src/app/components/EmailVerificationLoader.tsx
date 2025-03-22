/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Lock } from 'lucide-react'

export default function EmailVerificationLoader() {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState('.')
  
  // Animate the dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.')
    }, 500)
    
    return () => clearInterval(dotsInterval)
  }, [])
  
  // Progress through the steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % 3)
    }, 3000)
    
    return () => clearInterval(stepInterval)
  }, [])
  
  const steps = [
    {
      icon: Mail,
      text: "Sending verification email",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Lock,
      text: "Generating ZK proof",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: CheckCircle,
      text: "Verifying credentials",
      color: "text-green-500",
      bgColor: "bg-green-100"
    }
  ]
  
  const currentStep = steps[step]
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className={`${currentStep.bgColor} p-4 rounded-full mb-4 relative`}>
          <currentStep.icon className={`${currentStep.color} w-8 h-8`} />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
        </div>
        <p className={`font-medium ${currentStep.color}`}>
          {currentStep.text}{dots}
        </p>
      </div>
      
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 w-2 rounded-full ${index === step ? 'bg-purple-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      
      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600">
          We're verifying your email using zero-knowledge proofs.
          <br />
          This secure process protects your privacy.
        </p>
      </div>
    </div>
  )
}
