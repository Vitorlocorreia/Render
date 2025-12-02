import React from 'react';
import { Button } from './ui/button';
import { Shield, MapPin, Droplets, Activity } from 'lucide-react';
import { Card } from './ui/card';

interface HomePageProps {
  onNavigateToPublic: () => void;
  onNavigateToLogin: () => void;
}

export function HomePage({ onNavigateToPublic, onNavigateToLogin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Topbar */}
      <div className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl">REDAP</h1>
              <p className="text-xs text-gray-400">Sistema de Monitoramento</p>
            </div>
          </div>
          <Button 
            onClick={onNavigateToLogin}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Título Principal */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Sistema em Tempo Real</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl text-white">
              Monitoramento de <br />
              <span className="text-blue-500">Alagamentos</span> no Recife
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sistema inteligente de detecção e alerta de alagamentos em paradas de ônibus, 
              fornecendo dados em tempo real para a população e gestores públicos.
            </p>
          </div>

          {/* Botão de Ação Principal */}
          <div className="flex justify-center items-center pt-8">
            <Button 
              onClick={onNavigateToPublic}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg w-full sm:w-auto"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Acessar Painel Público
            </Button>
          </div>

          {/* Cards de Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
              <div className="bg-blue-600/10 p-3 rounded-lg w-fit mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white mb-2">Cobertura Estratégica</h3>
              <p className="text-sm text-gray-400">
                Pontos críticos de alagamento monitorados em toda a cidade do Recife
              </p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
              <div className="bg-green-600/10 p-3 rounded-lg w-fit mb-4">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white mb-2">Atualização a cada 10s</h3>
              <p className="text-sm text-gray-400">
                Dados em tempo real com simulação contínua de sensores
              </p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6 backdrop-blur-sm">
              <div className="bg-orange-600/10 p-3 rounded-lg w-fit mb-4">
                <Droplets className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white mb-2">Alertas Inteligentes</h3>
              <p className="text-sm text-gray-400">
                Sistema de classificação por níveis de criticidade
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Seção de Informações */}
      <div className="bg-gray-900/30 border-y border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl text-white">Como Funciona?</h2>
            <p className="text-gray-400">
              O REDAP utiliza sensores instalados em paradas de ônibus para monitorar em tempo real 
              o nível de água, temperatura e umidade. Os dados são processados e exibidos em um mapa 
              interativo com alertas automáticos para situações de risco.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 bg-green-600/10 border border-green-600/20 rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Normal (0-10cm)</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-600/10 border border-yellow-600/20 rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Alerta (10-20cm)</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Risco (20-30cm)</span>
              </div>
              <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Crítico ({'>'}30cm)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 REDAP - Sistema de Monitoramento de Alagamentos · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
