export default function Loading() {
  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 min-w-0 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-64 shrink-0 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
