import Image from 'next/image';

interface AffiliateAdProps {
  className?: string;
}

export default function AffiliateAd({ className = '' }: AffiliateAdProps) {
  // Affiliate link - replace with your actual Ground News affiliate URL
  const affiliateUrl = "https://ground.news/?utm_source=mirrorsource&utm_medium=affiliate";
  
  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block mt-6 rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex flex-col sm:flex-row bg-gradient-to-r from-slate-900 to-slate-800">
        {/* Left side - Image/Logo area */}
        <div className="sm:w-1/3 p-4 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-white tracking-tight">GROUND</div>
            <div className="text-lg text-blue-400">News</div>
          </div>
        </div>
        
        {/* Right side - Copy */}
        <div className="sm:w-2/3 p-4 text-white">
          <p className="font-semibold text-base mb-1">
            Cut through media bias with Ground News Pro
          </p>
          <p className="text-sm text-slate-300 mb-3">
            Compare coverage from 50,000+ sources in one dashboard and see every side of the story.
          </p>
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
            LEARN MORE
          </span>
        </div>
      </div>
    </a>
  );
}