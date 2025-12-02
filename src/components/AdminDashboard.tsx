import React, { useState, useEffect } from 'react';
import { Topbar } from './Topbar';
import { Map } from './Map';
import { MapLegend } from './MapLegend';
import { Filters, getZonaPorBairro } from './Filters';
import { SensorCards } from './SensorCards';
import { Indicators } from './Indicators';
import { Charts } from './Charts';
import { AlertBanner } from './AlertBanner';
import { AlertHistory } from './AlertHistory';
import { Statistics } from './Statistics';
import { WazeTrafficMap } from './WazeTrafficMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, LogOut } from 'lucide-react';

export interface Sensor {
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

export interface HistoricalData {
  timestamp: number;
  sensorId: number;
  nivelAgua: number;
  temperatura: number;
  umidade: number;
  status: string;
}

export interface AlertEvent {
  id: number;
  timestamp: number;
  sensorId: number;
  sensorNome: string;
  status: 'Crítico' | 'Risco';
  nivelAgua: number;
  message: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
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

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [historico, setHistorico] = useState<HistoricalData[]>([]);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [bairroFiltro, setBairroFiltro] = useState<string>('Todos');
  const [zonaFiltro, setZonaFiltro] = useState<string>('Todas');
  const [dashboardFiltro, setDashboardFiltro] = useState<string>('Geral');
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [alertas, setAlertas] = useState<AlertEvent[]>([]);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  // Inicializar sensores
  useEffect(() => {
    const sensoresComDados = sensoresIniciais.map(s => ({
      ...s,
      ...gerarDadosSimulados()
    }));
    setSensores(sensoresComDados);
    
    // Adicionar dados históricos iniciais
    const historicosIniciais: HistoricalData[] = [];
    sensoresComDados.forEach(sensor => {
      for (let i = 5; i >= 0; i--) {
        historicosIniciais.push({
          timestamp: Date.now() - i * 10000,
          sensorId: sensor.id,
          nivelAgua: sensor.nivelAgua + Math.random() * 5 - 2.5,
          temperatura: sensor.temperatura + Math.random() * 2 - 1,
          umidade: sensor.umidade + Math.random() * 5 - 2.5,
          status: sensor.status
        });
      }
    });
    setHistorico(historicosIniciais);
  }, []);

  // Simulação em tempo real
  useEffect(() => {
    if (!simulacaoAtiva) return;

    const intervalo = setInterval(() => {
      setSensores(prev => {
        const novos = prev.map(s => ({
          ...s,
          ...gerarDadosSimulados()
        }));
        
        // Adicionar ao histórico
        const timestamp = Date.now();
        const novosHistoricos = novos.map(sensor => ({
          timestamp,
          sensorId: sensor.id,
          nivelAgua: sensor.nivelAgua,
          temperatura: sensor.temperatura,
          umidade: sensor.umidade,
          status: sensor.status
        }));
        
        setHistorico(prev => [...prev, ...novosHistoricos].slice(-60));
        
        // Detectar novos alertas
        novos.forEach(sensor => {
          const anterior = prev.find(p => p.id === sensor.id);
          if (sensor.status === 'Crítico' || sensor.status === 'Risco') {
            if (!anterior || (anterior.status !== 'Crítico' && anterior.status !== 'Risco')) {
              const novoAlerta: AlertEvent = {
                id: Date.now() + sensor.id,
                timestamp,
                sensorId: sensor.id,
                sensorNome: sensor.nome,
                status: sensor.status,
                nivelAgua: sensor.nivelAgua,
                message: `${sensor.nome} entrou em estado ${sensor.status.toLowerCase()} com ${sensor.nivelAgua.toFixed(1)}cm`
              };
              setAlertas(prev => [novoAlerta, ...prev].slice(0, 20));
            }
          }
        });
        
        setUltimaAtualizacao(new Date());
        
        return novos;
      });
    }, 10000);

    return () => clearInterval(intervalo);
  }, [simulacaoAtiva]);

  const toggleSimulacao = () => {
    setSimulacaoAtiva(!simulacaoAtiva);
  };

  const exportarCSV = () => {
  const headers = [
    "Sensor",
    "Bairro",
    "Nível de Água (cm)",
    "Temperatura (°C)",
    "Umidade (%)",
    "Status",
    "Data/Hora"
  ];

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const escape = (value: any) => {
    if (value == null) return "";
    const v = String(value);
    // se tiver ; , " ou quebra de linha → coloca entre aspas
    if (/[;"\n]/.test(v)) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  const rows = sensores.map(s => [
    s.nome,
    s.bairro,
    s.nivelAgua.toFixed(1),
    s.temperatura.toFixed(1),
    s.umidade.toFixed(1),
    s.status,
    formatDate(),
  ]);

  // Montagem com ; e BOM UTF-8 (melhor no Excel)
  const csvContent =
    "\uFEFF" +
    [headers, ...rows]
      .map(row => row.map(escape).join(";"))
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `redap_dados_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

  
  // Aplicar filtros
  let sensoresFiltrados = sensores;
  
  if (zonaFiltro !== 'Todas') {
    sensoresFiltrados = sensoresFiltrados.filter(s => getZonaPorBairro(s.bairro) === zonaFiltro);
  }
  
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
  const mostrarCards = bairroFiltro !== 'Todos' || searchTerm !== '' || statusFiltro !== 'Todos' || zonaFiltro !== 'Todas';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Topbar Administrativo */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Topbar 
              simulacaoAtiva={simulacaoAtiva}
              onToggleSimulacao={toggleSimulacao}
              onExportarCSV={exportarCSV}
            />
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/20 ml-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
      
      {/* Badge Administrativo */}
      <div className="bg-blue-900/20 border-b border-blue-800/30">
        <div className="container mx-auto px-4 py-2">
          <p className="text-sm text-blue-400 text-center">
            🔐 <strong>Modo Administrativo</strong> - Acesso completo a todas as funcionalidades
          </p>
        </div>
      </div>

      {temCriticos && <AlertBanner sensores={sensores} />}
      
      <div className="container mx-auto p-4 pb-8">
        {/* Filtros Principais */}
        <Filters 
          zonaFiltro={zonaFiltro}
          onZonaChange={setZonaFiltro}
          bairroFiltro={bairroFiltro}
          onBairroChange={setBairroFiltro}
          dashboardFiltro={dashboardFiltro}
          onDashboardChange={setDashboardFiltro}
        />
        
        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Buscar parada ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <Map sensores={sensoresFiltrados} />
            <MapLegend />
            
            {mostrarCards && <SensorCards sensores={sensoresFiltrados} />}
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start">
                <TabsTrigger 
                  value="overview" 
                  className="text-white data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="charts"
                  className="text-white data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Gráficos
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="text-white data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Histórico de Alertas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <Statistics 
                  sensores={sensores} 
                  ultimaAtualizacao={ultimaAtualizacao}
                  simulacaoAtiva={simulacaoAtiva}
                />
              </TabsContent>
              
              <TabsContent value="charts" className="mt-4">
                <Charts sensores={sensores} historico={historico} />
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <AlertHistory alertas={alertas} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Coluna Direita - 1/3 */}
          <div className="space-y-6">
            <Indicators 
              sensores={sensores} 
              onStatusClick={(status) => {
                setStatusFiltro(status === statusFiltro ? 'Todos' : status);
                setBairroFiltro('Todos');
                setSearchTerm('');
              }}
              statusAtivo={statusFiltro}
            />
            
            <WazeTrafficMap />
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