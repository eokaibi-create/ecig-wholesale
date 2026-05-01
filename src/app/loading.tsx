export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-center px-4">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#c8a97e]/30 border-t-[#c8a97e] rounded-full animate-spin mx-auto mb-3 md:mb-4" />
        <p className="text-sm md:text-base text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
