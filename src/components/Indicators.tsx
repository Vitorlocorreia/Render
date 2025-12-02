import React from 'react';
import { Card } from './ui/card';
import { AlertTriangle, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { Sensor } from '../App';

interface IndicatorsProps {
  sensores: Sensor[];
  onStatusClick?: (status: string) => void;
  statusAtivo?: string;
}

export function Indicators({ sensores, onStatusClick, statusAtivo = 'Todos' }: IndicatorsProps) {
  const contagem = {
    Normal: sensores.filter(s => s.status === 'Normal').length,
    Alerta: sensores.filter(s => s.status === 'Alerta').length,
    Risco: sensores.filter(s => s.status === 'Risco').length,
    Crítico: sensores.filter(s => s.status === 'Crítico').length,
  };

  const percentual = (valor: number) => ((valor / sensores.length) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 p-5">
        <h2 className="mb-5 text-gray-100">Indicadores Globais</h2>
        
        <div className="space-y-3">
          <button 
            onClick={() => onStatusClick?.('Normal')}
            className={`w-full group hover:scale-[1.02] transition-transform ${
              statusAtivo === 'Normal' ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900' : ''
            }`}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-950 to-gray-900 rounded-lg border border-green-900 shadow-sm cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-900 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-100">Normal</p>
                  <p className="text-xs text-gray-400">{percentual(contagem.Normal)}% do total</p>
                </div>
              </div>
              <span className="text-green-400">{contagem.Normal}</span>
            </div>
          </button>

          <button 
            onClick={() => onStatusClick?.('Alerta')}
            className={`w-full group hover:scale-[1.02] transition-transform ${
              statusAtivo === 'Alerta' ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : ''
            }`}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-950 to-gray-900 rounded-lg border border-yellow-900 shadow-sm cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-900 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-100">Alerta</p>
                  <p className="text-xs text-gray-400">{percentual(contagem.Alerta)}% do total</p>
                </div>
              </div>
              <span className="text-yellow-400">{contagem.Alerta}</span>
            </div>
          </button>

          <button 
            onClick={() => onStatusClick?.('Risco')}
            className={`w-full group hover:scale-[1.02] transition-transform ${
              statusAtivo === 'Risco' ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900' : ''
            }`}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-950 to-gray-900 rounded-lg border border-orange-900 shadow-sm cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-100">Risco</p>
                  <p className="text-xs text-gray-400">{percentual(contagem.Risco)}% do total</p>
                </div>
              </div>
              <span className="text-orange-400">{contagem.Risco}</span>
            </div>
          </button>

          <button 
            onClick={() => onStatusClick?.('Crítico')}
            className={`w-full group hover:scale-[1.02] transition-transform ${
              statusAtivo === 'Crítico' ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900' : ''
            }`}
          >
            <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-red-950 to-gray-900 rounded-lg border border-red-900 shadow-sm cursor-pointer ${
              contagem.Crítico > 0 ? 'animate-pulse' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-900 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-gray-100">Crítico</p>
                  <p className="text-xs text-gray-400">{percentual(contagem.Crítico)}% do total</p>
                </div>
              </div>
              <span className="text-red-400">{contagem.Crítico}</span>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total de Sensores</span>
            <span className="text-gray-100 text-lg">{sensores.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}