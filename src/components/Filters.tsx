import React from 'react'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

interface FiltersProps {
  zonaFiltro: string;
  onZonaChange: (zona: string) => void;
  bairroFiltro: string;
  onBairroChange: (bairro: string) => void;
  dashboardFiltro: string;
  onDashboardChange: (dashboard: string) => void;
}

const zonasBairros = {
  'Zona Sul': ['Boa Viagem', 'Pina'],
  'Zona Oeste': ['Afogados', 'Cordeiro', 'Iputinga', 'Torre'],
  'Zona Norte': ['Casa Amarela', 'Derby', 'Santo Amaro', 'Encruzilhada', 'Piedade', 'Madalena', 'Cais do Porto', 'Recife Antigo', 'Boa Vista']
};

export const getZonaPorBairro = (bairro: string): string => {
  for (const [zona, bairros] of Object.entries(zonasBairros)) {
    if (bairros.includes(bairro)) return zona;
  }
  return 'Zona Sul';
};

export function Filters({ 
  zonaFiltro, 
  onZonaChange, 
  bairroFiltro, 
  onBairroChange,
}: FiltersProps) {
  
  const bairrosDisponiveis = zonaFiltro && zonaFiltro !== 'Todas' 
    ? zonasBairros[zonaFiltro as keyof typeof zonasBairros] || []
    : Object.values(zonasBairros).flat();

  React.useEffect(() => {
    if (zonaFiltro !== 'Todas' && bairroFiltro !== 'Todos') {
      const bairrosZona = zonasBairros[zonaFiltro as keyof typeof zonasBairros] || [];
      if (!bairrosZona.includes(bairroFiltro)) {
        onBairroChange('Todos');
      }
    }
  }, [zonaFiltro, bairroFiltro, onBairroChange]);

  return (
    <Card className="bg-gray-900 border-gray-800 p-3 mb-4">
      
      {/* Horizontal layout fixo */}
      <div className="flex items-end gap-4">

        {/* Zona */}
<div className="flex-1">
  <label className="block text-white text-xs mb-1">Zona</label>
  <Select value={zonaFiltro} onValueChange={onZonaChange}>
    <SelectTrigger className="w-full h-9 bg-gray-800 border-gray-700 text-white text-sm">
      <SelectValue placeholder="Selecione a zona" />
    </SelectTrigger>

    <SelectContent className="bg-gray-800 border-gray-700 text-white">
      <SelectItem className="text-white" value="Todas">Todas as Zonas</SelectItem>
      <SelectItem className="text-white" value="Zona Sul">Zona Sul</SelectItem>
      <SelectItem className="text-white" value="Zona Oeste">Zona Oeste</SelectItem>
      <SelectItem className="text-white" value="Zona Norte">Zona Norte</SelectItem>
    </SelectContent>
  </Select>
</div>

{/* Bairro */}
<div className="flex-1">
  <label className="block text-white text-xs mb-1">Bairro</label>
  <Select value={bairroFiltro} onValueChange={onBairroChange}>
    <SelectTrigger className="w-full h-9 bg-gray-800 border-gray-700 text-white text-sm">
      <SelectValue placeholder="Selecione o bairro" />
    </SelectTrigger>

    <SelectContent className="bg-gray-800 border-gray-700 text-white">
      <SelectItem className="text-white" value="Todos">Todos os Bairros</SelectItem>

      {bairrosDisponiveis.sort().map(bairro => (
        <SelectItem className="text-white" key={bairro} value={bairro}>
          {bairro}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


      </div>
    </Card>
  );
}
