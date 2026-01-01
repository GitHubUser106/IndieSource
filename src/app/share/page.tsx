"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ShareHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get shared URL from various possible parameters
    const sharedUrl = searchParams.get('url') || searchParams.get('text') || '';
    
    // Extract URL if text contains one
    let urlToSearch = sharedUrl;
    if (sharedUrl && !sharedUrl.startsWith('http')) {
      const urlMatch = sharedUrl.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        urlToSearch = urlMatch[0];
      }
    }

    // Redirect to home page with the URL
    if (urlToSearch) {
      router.replace(`/?url=${encodeURIComponent(urlToSearch)}`);
    } else {
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading article...</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ShareHandler />
    </Suspense>
  );
}