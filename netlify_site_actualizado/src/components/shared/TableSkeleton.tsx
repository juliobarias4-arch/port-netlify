import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border p-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="size-11 rounded-full" />
          <Skeleton className="mt-4 h-3 w-20" />
          <Skeleton className="mt-2 h-8 w-36" />
        </Card>
      ))}
    </div>
  );
}
