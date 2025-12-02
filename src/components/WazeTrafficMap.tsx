import React from 'react';
import { Card } from './ui/card';
import { Navigation } from 'lucide-react';

export function WazeTrafficMap() {
  // Coordenadas centralizadas no Recife
  const recifeLat = -8.0476;
  const recifeLng = -34.8770;
  const zoom = 13;

  return (
    <Card className="bg-gray-900 border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Navigation className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white">Trânsito ao Vivo</h3>
          <p className="text-xs text-gray-400">Dados do Waze em tempo real</p>
        </div>
      </div>
      
      <div className="relative w-full h-[400px] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <iframe
          src={`https://embed.waze.com/iframe?zoom=${zoom}&lat=${recifeLat}&lon=${recifeLng}&pin=1`}
          width="100%"
          height="100%"
          className="border-0"
          title="Waze Live Map - Trânsito Recife"
          allowFullScreen
        />
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Livre</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Moderado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Congestionado</span>
          </div>
        </div>
        <span className="text-gray-500">Powered by Waze</span>
      </div>
    </Card>
  );
}
