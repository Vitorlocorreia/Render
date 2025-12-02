import React from 'react';
import { Card } from './ui/card';
import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import type { AlertEvent } from '../App';
import { ScrollArea } from './ui/scroll-area';

interface AlertHistoryProps {
  alertas: AlertEvent[];
}

export function AlertHistory({ alertas }: AlertHistoryProps) {
  if (alertas.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-gray-800 rounded-full">
            <AlertCircle className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400">Nenhum alerta registrado</p>
          <p className="text-sm text-gray-500">
            Os alertas de risco e críticos aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-100">Histórico de Alertas</h3>
        <span className="text-sm text-gray-400">{alertas.length} alertas</span>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                alerta.status === 'Crítico'
                  ? 'bg-red-950 border-red-900'
                  : 'bg-orange-950 border-orange-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  alerta.status === 'Crítico' ? 'bg-red-900' : 'bg-orange-900'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    alerta.status === 'Crítico' ? 'text-red-400' : 'text-orange-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-100">{alerta.sensorNome}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alerta.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alerta.status === 'Crítico'
                        ? 'bg-red-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      {alerta.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300">{alerta.message}</p>
                  
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>Nível: {alerta.nivelAgua.toFixed(1)} cm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
