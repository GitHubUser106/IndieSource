import { Search, FileText, ExternalLink, Shield } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Shield size={16} className="text-blue-600" />
        How MirrorSource Works
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Search size={12} className="text-blue-600" />
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Public search only.</span> We search the open web for coverage of your story.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText size={12} className="text-blue-600" />
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Original summary.</span> Our summary is created from public sources, not copied from any article.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ExternalLink size={12} className="text-blue-600" />
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Direct links.</span> We link you directly to free news sources—you read the full story on their site.
          </p>
        </div>
      </div>
    </div>
  );
}