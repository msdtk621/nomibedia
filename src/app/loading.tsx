import { asset } from '@/lib/asset'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset('/logo.jpeg')}
        alt="読み込み中"
        className="w-16 h-16 rounded-full object-cover animate-bounce"
      />
      <div className="flex items-center gap-1 text-gray-400 text-sm">
        <span>読み込み中</span>
        <span className="inline-flex">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse [animation-delay:150ms]">.</span>
          <span className="animate-pulse [animation-delay:300ms]">.</span>
        </span>
      </div>
    </div>
  )
}
