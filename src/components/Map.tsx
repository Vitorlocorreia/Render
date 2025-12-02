import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import type { Sensor } from '../App';

interface MapProps {
  sensores?: Sensor[];
}

export function Map(props: MapProps) {
  const sensores = props?.sensores || [];
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<globalThis.Map<number, any>>(new globalThis.Map());
  const leafletRef = useRef<any>(null);

  // Inicializar mapa uma única vez
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      // @ts-ignore
      const L = await import('leaflet');
      leafletRef.current = L;
      
      // Adicionar CSS do Leaflet
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mapInstanceRef.current && mapRef.current) {
        // Criar mapa centrado no Recife
        mapInstanceRef.current = L.map(mapRef.current).setView([-8.063, -34.894], 12);
        
        // Adicionar tile layer dark
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap © CartoDB',
          maxZoom: 19
        }).addTo(mapInstanceRef.current);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current.clear();
    };
  }, []);

  // Atualizar marcadores quando sensores mudarem
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current || sensores.length === 0) return;

    const L = leafletRef.current;

    // Atualizar ou criar marcadores
    sensores.forEach(sensor => {
      const color = getStatusColor(sensor.status);
      const pulseClass = sensor.status === 'Crítico' ? 'animate-pulse' : '';
      const iconSvg = getStatusIcon(sensor.status, color);
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative ${pulseClass}">
            ${iconSvg}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const popupContent = `
        <div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
          <div class="mb-2">
            <strong class="text-lg">${sensor.nome}</strong>
          </div>
          <div class="space-y-1 text-sm">
            <div><span class="text-gray-400">Bairro:</span> ${sensor.bairro}</div>
            <div><span class="text-gray-400">Nível:</span> <span class="${getStatusTextClass(sensor.status)}">${sensor.nivelAgua.toFixed(1)} cm</span></div>
            <div><span class="text-gray-400">Temp:</span> ${sensor.temperatura.toFixed(1)}°C</div>
            <div><span class="text-gray-400">Umidade:</span> ${sensor.umidade.toFixed(1)}%</div>
            <div><span class="text-gray-400">Status:</span> <span class="${getStatusTextClass(sensor.status)}">${sensor.status}</span></div>
          </div>
        </div>
      `;

      const existingMarker = markersRef.current.get(sensor.id);

      if (existingMarker) {
        // Atualizar marcador existente
        existingMarker.setIcon(icon);
        existingMarker.getPopup()?.setContent(popupContent);
      } else {
        // Criar novo marcador
        const marker = L.marker([sensor.lat, sensor.lng], { icon })
          .bindPopup(popupContent)
          .addTo(mapInstanceRef.current);

        markersRef.current.set(sensor.id, marker);
      }
    });

    // Remover marcadores de sensores que não existem mais
    const currentSensorIds = new Set(sensores.map(s => s.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentSensorIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [sensores]);

  return (
    <Card className="bg-gray-900 border-gray-800 p-5 hover:border-gray-700 transition-all relative z-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-100">Mapa de Sensores</h2>
        <span className="text-sm text-gray-400">{sensores.length} parada{sensores.length !== 1 ? 's' : ''}</span>
      </div>
      <div ref={mapRef} className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg relative z-0" />
    </Card>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Normal': return '#22c55e';
    case 'Alerta': return '#eab308';
    case 'Risco': return '#f97316';
    case 'Crítico': return '#ef4444';
    default: return '#6b7280';
  }
}

function getStatusTextClass(status: string): string {
  switch (status) {
    case 'Normal': return 'text-green-400';
    case 'Alerta': return 'text-yellow-400';
    case 'Risco': return 'text-orange-400';
    case 'Crítico': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function getStatusIcon(status: string, color: string): string {
  switch (status) {
    case 'Normal':
      return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
          <path d="M12 18L16 22L24 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case 'Alerta':
      return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
          <circle cx="18" cy="18" r="3" fill="white"/>
          <circle cx="18" cy="18" r="9" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      `;
    case 'Risco':
      return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 3L33 30H3L18 3Z" fill="${color}" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M18 14v6M18 24h.01" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      `;
    case 'Crítico':
      return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="4" width="28" height="28" rx="3" fill="${color}" stroke="white" stroke-width="2.5"/>
          <path d="M12 12l12 12M24 12L12 24" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    default:
      return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
        </svg>
      `;
  }
}