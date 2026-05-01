import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-center px-4 md:px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-[#c8a97e] mb-3 md:mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 md:px-8 md:py-3 rounded-xl bg-gradient-to-r from-[#c8a97e] to-[#a8885e] text-white font-semibold hover:opacity-90 transition-all text-sm md:text-base"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
