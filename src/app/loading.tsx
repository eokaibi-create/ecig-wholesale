export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#c8a97e]/30 border-t-[#c8a97e] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
