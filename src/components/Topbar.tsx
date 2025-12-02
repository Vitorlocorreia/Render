import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, FileDown, LogOut } from 'lucide-react';

interface TopbarProps {
  simulacaoAtiva: boolean;
  onToggleSimulacao: () => void;
  onExportarCSV: () => void;
  onLogout: () => void;   // ← ADICIONAR
}

export function Topbar({ simulacaoAtiva, onToggleSimulacao, onExportarCSV, onLogout }: TopbarProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-6 py-5 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h1 className="text-gray-100">REDAP – Monitoramento de Alagamentos</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Paradas de Ônibus do Recife
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onToggleSimulacao}
            variant={simulacaoAtiva ? "destructive" : "default"}
            className={`gap-2 shadow-md transition-all ${
              simulacaoAtiva ? 'hover:scale-105' : 'hover:scale-105 bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {simulacaoAtiva ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">Parar Simulação</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Iniciar Simulação</span>
              </>
            )}
          </Button>

          <Button
            onClick={onExportarCSV}
            variant="outline"
            className="gap-2 bg-gray-800 border-gray-600 hover:bg-gray-700 shadow-md hover:scale-105 transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
