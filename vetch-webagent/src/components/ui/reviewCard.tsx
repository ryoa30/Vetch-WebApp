import { Star } from "lucide-react"

export default function ReviewCard() {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow p-4 border">
      {/* Review Text */}
      <p className="text-gray-800 text-sm leading-relaxed">
        This vet very good wallaw we. very smart very concise. the diagnose very
        good i like her
      </p>

      {/* Footer: Name + Rating */}
      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-gray-900">Arya Prasetya</span>
        <div className="flex items-center gap-1 text-green-700">
          <Star className="w-4 h-4 fill-green-600 stroke-black" />
          <span className="font-medium">5</span>
        </div>
      </div>
    </div>
  )
}
