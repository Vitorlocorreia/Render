import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Sensor } from '../App';

interface AlertBannerProps {
  sensores: Sensor[];
}

export function AlertBanner({ sensores }: AlertBannerProps) {
  const sensoresCriticos = sensores.filter(s => s.status === 'Crítico');

  if (sensoresCriticos.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pt-4">
      <Alert className="bg-red-950 border-red-900 text-red-100 animate-pulse">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <AlertTitle className="text-red-100">Alerta Crítico de Alagamento!</AlertTitle>
        <AlertDescription className="text-red-200">
          {sensoresCriticos.length === 1 ? (
            <>
              O sensor <strong>{sensoresCriticos[0].nome}</strong> está em situação crítica com{' '}
              <strong>{sensoresCriticos[0].nivelAgua.toFixed(1)} cm</strong> de água.
            </>
          ) : (
            <>
              <strong>{sensoresCriticos.length} sensores</strong> estão em situação crítica:{' '}
              {sensoresCriticos.map(s => s.nome).join(', ')}.
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
