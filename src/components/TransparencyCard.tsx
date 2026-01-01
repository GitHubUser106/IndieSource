// =============================================================================
// TransparencyCard.tsx - MirrorSource 3.0
// =============================================================================
// A tooltip/popover component that displays ownership and funding information
// for a news source. Can be triggered on hover or click.
//
// Usage:
//   <TransparencyCard 
//     source={sourceData} 
//     trigger={<SourceBadge />}
//   />
// =============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Building2, Wallet, Info, X } from 'lucide-react';

// --- Types ---
type OwnershipType = 'private' | 'public_traded' | 'nonprofit' | 'public_media' | 'state_owned' | 'cooperative' | 'trust';

interface OwnershipInfo {
  owner: string;
  parent?: string;
  type: OwnershipType;
  note?: string;
}

interface FundingInfo {
  model: string;
  note?: string;
}

interface TransparencySource {
  displayName: string;
  domain: string;
  ownership?: OwnershipInfo;
  funding?: FundingInfo;
}

interface TransparencyCardProps {
  source: TransparencySource;
  trigger: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// --- Helper Functions ---
function getOwnershipLabel(type: OwnershipType): string {
  const labels: Record<OwnershipType, string> = {
    'private': 'Private',
    'public_traded': 'Public (Traded)',
    'nonprofit': 'Non-Profit',
    'public_media': 'Public Media',
    'state_owned': 'State-Owned',
    'cooperative': 'Cooperative',
    'trust': 'Trust',
  };
  return labels[type] || type;
}

function getOwnershipColor(type: OwnershipType): string {
  const colors: Record<OwnershipType, string> = {
    'private': 'bg-slate-100 text-slate-700',
    'public_traded': 'bg-blue-100 text-blue-700',
    'nonprofit': 'bg-green-100 text-green-700',
    'public_media': 'bg-emerald-100 text-emerald-700',
    'state_owned': 'bg-amber-100 text-amber-700',
    'cooperative': 'bg-teal-100 text-teal-700',
    'trust': 'bg-purple-100 text-purple-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
}

function getOwnershipIcon(type: OwnershipType): string {
  const icons: Record<OwnershipType, string> = {
    'private': '👤',
    'public_traded': '📈',
    'nonprofit': '🤝',
    'public_media': '📺',
    'state_owned': '🏛️',
    'cooperative': '👥',
    'trust': '🛡️',
  };
  return icons[type] || '🏢';
}

// --- Component ---
export default function TransparencyCard({ source, trigger, position = 'bottom' }: TransparencyCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // No transparency data available
  const hasData = source.ownership || source.funding;

  // Position classes
  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => isMobile && setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Card */}
      {isOpen && (
        <div
          ref={cardRef}
          className={`
            absolute z-50 w-72 sm:w-80
            bg-white rounded-xl shadow-xl border border-slate-200
            ${isMobile ? 'fixed inset-x-4 bottom-4 w-auto' : positionClasses[position]}
            animate-in fade-in zoom-in-95 duration-150
          `}
          onMouseEnter={() => !isMobile && setIsOpen(true)}
          onMouseLeave={() => !isMobile && setIsOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Source Transparency
              </span>
            </div>
            {isMobile && (
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Source Name */}
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">{source.displayName}</h3>
            <p className="text-xs text-slate-400">{source.domain}</p>
          </div>

          {/* Content */}
          {hasData ? (
            <div className="p-4 space-y-4">
              {/* Ownership */}
              {source.ownership && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Ownership
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getOwnershipIcon(source.ownership.type)}</span>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">{source.ownership.owner}</p>
                        {source.ownership.parent && (
                          <p className="text-xs text-slate-500">via {source.ownership.parent}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getOwnershipColor(source.ownership.type)}`}>
                      {getOwnershipLabel(source.ownership.type)}
                    </span>
                    {source.ownership.note && (
                      <p className="text-xs text-slate-500 italic">{source.ownership.note}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Funding */}
              {source.funding && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Funding Model
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{source.funding.model}</p>
                  {source.funding.note && (
                    <p className="text-xs text-slate-500 italic mt-1">{source.funding.note}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-slate-500">No transparency data available for this source.</p>
              <p className="text-xs text-slate-400 mt-1">Exercise independent judgment.</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 rounded-b-xl border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              Data from public records • Updated quarterly
            </p>
          </div>
        </div>
      )}

      {/* Mobile overlay backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// =============================================================================
// EXAMPLE: Inline Transparency Indicator (simpler version)
// =============================================================================
// Use this for a quick inline badge next to source names

export function TransparencyBadge({ ownershipType }: { ownershipType?: OwnershipType }) {
  if (!ownershipType) return null;
  
  return (
    <span 
      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${getOwnershipColor(ownershipType)}`}
      title={getOwnershipLabel(ownershipType)}
    >
      <span>{getOwnershipIcon(ownershipType)}</span>
      <span className="hidden sm:inline">{getOwnershipLabel(ownershipType)}</span>
    </span>
  );
}