import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { MapLegend } from './MapLegend';
import { Indicators } from './Indicators';
import { AlertBanner } from './AlertBanner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ArrowLeft, Droplets } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

interface Sensor {
  id: number;
  nome: string;
  lat: number;
  lng: number;
  bairro: string;
  nivelAgua: number;
  temperatura: number;
  umidade: number;
  status: 'Normal' | 'Alerta' | 'Risco' | 'Crítico';
}

interface PublicDashboardProps {
  onBack: () => void;
}

const sensoresIniciais = [
  { id: 1, nome: "Parada Boa Viagem", lat: -8.117, lng: -34.894, bairro: "Boa Viagem" },
  { id: 2, nome: "Parada Derby", lat: -8.052, lng: -34.903, bairro: "Derby" },
  { id: 3, nome: "Parada Afogados", lat: -8.085, lng: -34.917, bairro: "Afogados" },
  { id: 4, nome: "Parada Santo Amaro", lat: -8.058, lng: -34.894, bairro: "Santo Amaro" },
  { id: 5, nome: "Parada Iputinga", lat: -8.062, lng: -34.925, bairro: "Iputinga" },
  { id: 6, nome: "Parada Cais do Porto", lat: -8.060, lng: -34.871, bairro: "Cais do Porto" },
  { id: 7, nome: "Parada Torre", lat: -8.046, lng: -34.894, bairro: "Torre" },
  { id: 8, nome: "Parada Casa Amarela", lat: -8.025, lng: -34.910, bairro: "Casa Amarela" },
  { id: 9, nome: "Parada Encruzilhada", lat: -8.068, lng: -34.895, bairro: "Encruzilhada" },
  { id: 10, nome: "Parada Piedade", lat: -8.075, lng: -34.905, bairro: "Piedade" },
  { id: 11, nome: "Parada Cordeiro", lat: -8.093, lng: -34.918, bairro: "Cordeiro" },
  { id: 12, nome: "Parada Madalena", lat: -8.065, lng: -34.908, bairro: "Madalena" },
  { id: 14, nome: "Parada Recife Antigo", lat: -8.063, lng: -34.880, bairro: "Recife Antigo" },
  { id: 15, nome: "Parada Boa Vista", lat: -8.056, lng: -34.893, bairro: "Boa Vista" }
];

const calcularStatus = (nivelAgua: number): 'Normal' | 'Alerta' | 'Risco' | 'Crítico' => {
  if (nivelAgua < 10) return 'Normal';
  if (nivelAgua < 20) return 'Alerta';
  if (nivelAgua < 30) return 'Risco';
  return 'Crítico';
};

const gerarDadosSimulados = (): Omit<Sensor, 'id' | 'nome' | 'lat' | 'lng' | 'bairro'> => {
  const nivelAgua = Math.floor(Math.random() * 40);
  const temperatura = 22 + Math.random() * 10;
  const umidade = 60 + Math.random() * 30;
  const status = calcularStatus(nivelAgua);
  
  return { nivelAgua, temperatura, umidade, status };
};

export function PublicDashboard({ onBack }: PublicDashboardProps) {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bairroFiltro, setBairroFiltro] = useState<string>('Todos');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');

  // Inicializar sensores
  useEffect(() => {
    const sensoresComDados = sensoresIniciais.map(s => ({
      ...s,
      ...gerarDadosSimulados()
    }));
    setSensores(sensoresComDados);
  }, []);

  // Simulação em tempo real (atualiza a cada 10 segundos)
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSensores(prev => 
        prev.map(s => ({
          ...s,
          ...gerarDadosSimulados()
        }))
      );
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const bairros = ['Todos', ...Array.from(new Set(sensores.map(s => s.bairro)))];
  
  // Aplicar filtros
  let sensoresFiltrados = sensores;
  
  if (bairroFiltro !== 'Todos') {
    sensoresFiltrados = sensoresFiltrados.filter(s => s.bairro === bairroFiltro);
  }
  
  if (statusFiltro !== 'Todos') {
    sensoresFiltrados = sensoresFiltrados.filter(s => s.status === statusFiltro);
  }
  
  if (searchTerm) {
    sensoresFiltrados = sensoresFiltrados.filter(s => 
      s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const temCriticos = sensores.some(s => s.status === 'Crítico');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Topbar Público */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">REDAP - Painel Público</h1>
                <p className="text-xs text-gray-400">Monitoramento de Alagamentos em Tempo Real</p>
              </div>
            </div>
            <Button
  onClick={onBack}
  variant="outline"
  className="bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center"
>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Voltar
</Button>


          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {temCriticos && <AlertBanner sensores={sensores} />}

      <div className="container mx-auto p-4 pb-8">
        {/* Filtros Simples */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Buscar parada ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Filtro por Bairro */}
          <Select value={bairroFiltro} onValueChange={setBairroFiltro}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filtrar por bairro" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {bairros.map(bairro => (
                <SelectItem key={bairro} value={bairro} className="text-white hover:bg-gray-800">
                  {bairro}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por Status */}
          <Select value={statusFiltro} onValueChange={setStatusFiltro}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="Todos" className="text-white hover:bg-gray-800">Todos</SelectItem>
              <SelectItem value="Normal" className="text-white hover:bg-gray-800">Normal</SelectItem>
              <SelectItem value="Alerta" className="text-white hover:bg-gray-800">Alerta</SelectItem>
              <SelectItem value="Risco" className="text-white hover:bg-gray-800">Risco</SelectItem>
              <SelectItem value="Crítico" className="text-white hover:bg-gray-800">Crítico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Mapa e Legenda */}
          <div className="lg:col-span-2 space-y-6">
            <Map sensores={sensoresFiltrados} />
            <MapLegend />
          </div>

          {/* Coluna Direita - Indicadores */}
          <div className="space-y-6">
            <Indicators 
              sensores={sensores}
              onStatusClick={(status) => {
                setStatusFiltro(status === statusFiltro ? 'Todos' : status);
              }}
              statusAtivo={statusFiltro}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm">© 2025 Sistema de Monitoramento – Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
