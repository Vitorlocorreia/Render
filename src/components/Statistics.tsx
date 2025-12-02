import React from 'react';
import { Card } from './ui/card';
import { Droplets, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import type { Sensor } from '../App';

interface StatisticsProps {
  sensores: Sensor[];
  ultimaAtualizacao: Date;
  simulacaoAtiva: boolean;
}

export function Statistics({ sensores, ultimaAtualizacao, simulacaoAtiva }: StatisticsProps) {
  if (sensores.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-8 text-center">
        <p className="text-gray-400">Nenhum dado disponível</p>
        <p className="text-sm text-gray-500 mt-2">Aguardando inicialização dos sensores...</p>
      </Card>
    );
  }

  const mediaAgua = sensores.reduce((acc, s) => acc + s.nivelAgua, 0) / sensores.length;
  const mediaTemp = sensores.reduce((acc, s) => acc + s.temperatura, 0) / sensores.length;
  const mediaUmidade = sensores.reduce((acc, s) => acc + s.umidade, 0) / sensores.length;
  
  const maxAgua = Math.max(...sensores.map(s => s.nivelAgua));
  const minAgua = Math.min(...sensores.map(s => s.nivelAgua));

  return (
    <div className="space-y-6">
      {/* Status de Atualização */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${simulacaoAtiva ? 'bg-green-950 animate-pulse' : 'bg-gray-800'}`}>
              <Activity className={`w-5 h-5 ${simulacaoAtiva ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Status do Sistema</p>
              <p className="text-gray-100">
                {simulacaoAtiva ? 'Monitoramento Ativo' : 'Monitoramento Pausado'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Última atualização
            </p>
            <p className="text-gray-100">
              {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800 p-5 hover:border-gray-700 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-blue-950 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Nível Médio de Água</p>
          <p className="text-gray-100">{mediaAgua.toFixed(1)} cm</p>
          <p className="text-xs text-gray-500 mt-2">
            Min: {minAgua.toFixed(1)} cm • Max: {maxAgua.toFixed(1)} cm
          </p>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-5 hover:border-gray-700 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-orange-950 rounded-lg">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Temperatura Média</p>
          <p className="text-gray-100">{mediaTemp.toFixed(1)}°C</p>
          <p className="text-xs text-gray-500 mt-2">
            Variação térmica monitorada
          </p>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-5 hover:border-gray-700 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-cyan-950 rounded-lg">
              <Droplets className="w-6 h-6 text-cyan-400" />
            </div>
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Umidade Média</p>
          <p className="text-gray-100">{mediaUmidade.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2">
            Condições atmosféricas
          </p>
        </Card>
      </div>
    </div>
  );
}
