import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Droplets, Thermometer, Cloud, MapPin } from 'lucide-react';
import { Progress } from './ui/progress';
import type { Sensor } from '../App';

interface SensorCardsProps {
  sensores: Sensor[];
}

export function SensorCards({ sensores }: SensorCardsProps) {
  if (sensores.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-8 text-center">
        <p className="text-gray-400">Nenhuma parada encontrada</p>
        <p className="text-sm text-gray-500 mt-2">Tente ajustar os filtros</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-gray-100 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Paradas Monitoradas
        </h2>
        <span className="text-sm text-gray-400">{sensores.length} parada{sensores.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensores.map(sensor => (
          <Card 
            key={sensor.id} 
            className={`bg-gray-900 border-gray-800 p-5 hover:border-gray-700 hover:shadow-lg transition-all ${
              sensor.status === 'Crítico' ? 'border-red-500 shadow-red-500/20 animate-pulse' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-gray-100 mb-1">{sensor.nome}</h3>
                <p className="text-sm text-gray-400">{sensor.bairro}</p>
              </div>
              <Badge variant={getStatusVariant(sensor.status)} className={getStatusBadgeClass(sensor.status)}>
                {sensor.status}
              </Badge>
            </div>

            {/* Nível de Água com Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusBgClass(sensor.status)}`}>
                    <Droplets className={`w-4 h-4 ${getStatusTextClass(sensor.status)}`} />
                  </div>
                  <span className="text-sm text-gray-400">Nível da Água</span>
                </div>
                <span className={`${getStatusTextClass(sensor.status)}`}>
                  {sensor.nivelAgua.toFixed(1)} cm
                </span>
              </div>
              <Progress 
                value={(sensor.nivelAgua / 40) * 100} 
                className={`h-2 ${getProgressBgClass(sensor.status)}`}
              />
            </div>

            {/* Grid de Temperatura e Umidade */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-400">Temperatura</span>
                </div>
                <span className="text-gray-100">
                  {sensor.temperatura.toFixed(1)}°C
                </span>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Cloud className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-gray-400">Umidade</span>
                </div>
                <span className="text-gray-100">
                  {sensor.umidade.toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Normal': return 'default';
    case 'Alerta': return 'secondary';
    case 'Risco': return 'secondary';
    case 'Crítico': return 'destructive';
    default: return 'default';
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Normal': return 'bg-green-950 text-green-400 hover:bg-green-900';
    case 'Alerta': return 'bg-yellow-950 text-yellow-400 hover:bg-yellow-900';
    case 'Risco': return 'bg-orange-950 text-orange-400 hover:bg-orange-900';
    case 'Crítico': return 'bg-red-950 text-red-400 hover:bg-red-900';
    default: return '';
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

function getStatusBgClass(status: string): string {
  switch (status) {
    case 'Normal': return 'bg-green-950';
    case 'Alerta': return 'bg-yellow-950';
    case 'Risco': return 'bg-orange-950';
    case 'Crítico': return 'bg-red-950';
    default: return 'bg-gray-800';
  }
}

function getProgressBgClass(status: string): string {
  switch (status) {
    case 'Normal': return '[&>div]:bg-green-500';
    case 'Alerta': return '[&>div]:bg-yellow-500';
    case 'Risco': return '[&>div]:bg-orange-500';
    case 'Crítico': return '[&>div]:bg-red-500';
    default: return '[&>div]:bg-gray-500';
  }
}
