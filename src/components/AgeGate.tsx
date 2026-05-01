'use client'

import { useState, useEffect } from 'react'

export default function AgeGate() {
  const [show, setShow] = useState(false)
  const [declined, setDeclined] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem('age_verified')
    if (!verified) {
      setShow(true)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleYes = () => {
    localStorage.setItem('age_verified', 'true')
    setShow(false)
    document.body.style.overflow = ''
  }

  const handleNo = () => {
    setDeclined(true)
  }

  if (!show) return null

  if (declined) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-red-500/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
          <p className="text-gray-300 mb-2">
            You must be 21 years or older to access this website.
          </p>
          <p className="text-gray-400 text-sm">
            Please come back when you meet the age requirement.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-[#c8a97e]/30">
        {/* 21+ Logo */}
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c8a97e] to-[#a8885e] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">21+</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Age Verification
        </h2>
        <p className="text-gray-300 mb-1">
          Welcome to <span className="text-[#c8a97e] font-semibold">VaporX</span>
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Please confirm you are 21 years of age or older to enter.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleYes}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#c8a97e] to-[#a8885e] text-white font-bold text-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#c8a97e]/20"
          >
            Yes, I am 21 or older
          </button>
          <button
            onClick={handleNo}
            className="w-full py-3 px-6 rounded-xl border border-gray-600 text-gray-300 font-medium hover:bg-white/5 transition-all duration-200"
          >
            No, I am under 21
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-4">
          By entering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
