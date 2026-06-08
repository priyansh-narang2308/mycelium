import { Leaf } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 border-4 border-brand-teal/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-teal rounded-full border-t-transparent animate-spin"></div>
          <Leaf className="w-6 h-6 text-brand-teal" />
        </div>
        <p className="text-ink font-medium tracking-tight animate-pulse">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}
