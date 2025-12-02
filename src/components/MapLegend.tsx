import React from 'react';
import { Card } from './ui/card';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

export function MapLegend() {
  return (
    <Card className="bg-gray-900 border-gray-800 p-5">
      <div className="flex flex-wrap items-center justify-center gap-8">
        {/* Normal */}
        <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-white">Normal</div>
            <div className="text-gray-400 text-xs">{'<'} 10 cm</div>
          </div>
        </div>

        {/* Alerta */}
        <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-white">Alerta</div>
            <div className="text-gray-400 text-xs">10-20 cm</div>
          </div>
        </div>

        {/* Risco */}
        <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-white">Risco</div>
            <div className="text-gray-400 text-xs">20-30 cm</div>
          </div>
        </div>

        {/* Crítico */}
        <div className="flex items-center gap-3 group hover:scale-105 transition-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-white">Crítico</div>
            <div className="text-gray-400 text-xs">{'>='} 30 cm</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
