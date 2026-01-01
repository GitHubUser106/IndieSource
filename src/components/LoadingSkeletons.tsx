export function SummarySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-blue-100 rounded w-full"></div>
      <div className="h-4 bg-blue-100 rounded w-full"></div>
      <div className="h-4 bg-blue-100 rounded w-11/12"></div>
      <div className="h-4 bg-blue-100 rounded w-full"></div>
      <div className="h-4 bg-blue-100 rounded w-4/5"></div>
    </div>
  );
}

export function SourcesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-blue-100 rounded-xl p-4 bg-blue-50/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-md"></div>
            <div className="h-4 bg-blue-100 rounded w-24"></div>
            <div className="h-5 bg-blue-100 rounded w-16"></div>
          </div>
          <div className="h-5 bg-blue-100 rounded w-full mb-2"></div>
          <div className="h-5 bg-blue-100 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}
