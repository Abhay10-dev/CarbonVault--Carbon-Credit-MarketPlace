import React, { useState } from 'react';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MockMapProps {
  latitude: number;
  longitude: number;
  projectArea: number;
  surveyNumber?: string;
  projectName?: string;
  className?: string;
}

export function MockMap({
  latitude,
  longitude,
  projectArea,
  surveyNumber = '124/2',
  projectName = 'Project Boundary',
  className,
}: MockMapProps) {
  const [mapType, setMapType] = useState<'satellite' | 'terrain'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(15);

  return (
    <div className={cn('relative rounded-xl overflow-hidden border border-gray-200 bg-slate-900', className)}>
      {/* Map Background representation */}
      <div
        className={cn(
          'w-full h-80 relative flex items-center justify-center transition-all duration-300',
          mapType === 'satellite'
            ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-stone-900'
            : 'bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-100'
        )}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Contour lines / simulated terrain */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="90" fill="none" stroke={mapType === 'satellite' ? '#34d399' : '#059669'} strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="140" fill="none" stroke={mapType === 'satellite' ? '#059669' : '#10b981'} strokeWidth="1" />
        </svg>

        {/* Boundary Polygon */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="border-2 border-dashed border-emerald-400 bg-emerald-500/20 backdrop-blur-xs rounded-xl p-8 flex flex-col items-center shadow-lg transition-transform" style={{ transform: `scale(${zoomLevel / 15})` }}>
            <div className="flex items-center gap-1.5 bg-black/60 text-emerald-300 text-xs px-2.5 py-1 rounded-full mb-2 font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Boundary #Gat-{surveyNumber}</span>
            </div>
            <span className="text-white text-xs font-semibold text-center drop-shadow">
              {projectName}
            </span>
            <span className="text-emerald-200 text-[11px] font-mono mt-0.5">
              {projectArea} Hectares Mapped
            </span>
          </div>
        </div>

        {/* Coordinates Banner */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-3 font-mono border border-white/10">
          <span className="flex items-center gap-1">
            <span className="text-gray-400">LAT:</span> {latitude.toFixed(4)}° N
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">LON:</span> {longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Status Chip */}
        <div className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Coordinates & Area Validated</span>
        </div>

        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={() => setMapType(m => m === 'satellite' ? 'terrain' : 'satellite')}
            className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-sm text-xs font-medium flex items-center gap-1 transition-colors"
            title="Toggle Map View"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span className="capitalize">{mapType}</span>
          </button>

          <div className="flex flex-col bg-white/90 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setZoomLevel(z => Math.min(z + 1, 18))}
              className="p-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-px bg-gray-200" />
            <button
              type="button"
              onClick={() => setZoomLevel(z => Math.max(z - 1, 12))}
              className="p-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-white/50 text-[10px] flex items-center gap-1">
          <Compass className="w-3 h-3 text-white/70" /> North Up
        </div>
      </div>
    </div>
  );
}
