import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, QrCode, AlertCircle, KeyRound } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from './ui/input';

interface AdminMfaPageProps {
  onMfaSuccess: () => void;
  secret: string;
  email: string;
}

// Gera segredo TOTP dinâmico (base32, 16 caracteres)
function generateTotpSecret() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return secret;
}

async function validateTotpBackend(token: string, secret: string): Promise<boolean> {
  try {
    const res = await fetch('/api/validate-totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, secret }),
    });

    const data = await res.json();
    return !!data.valid;
  } catch (err) {
    console.error("Erro no fetch:", err);
    return false;
  }
}


// SEGREDO FIXO PARA TESTE (deve ser igual ao backend)
const FIXED_SECRET = 'JBSWY3DPEHPK3PXP';

export function AdminMfaPage({ onMfaSuccess, secret, email }: AdminMfaPageProps) {
  // Usa sempre o segredo fixo
  const usedSecret = FIXED_SECRET;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const otpauth = `otpauth://totp/Redapstyle-Admin:${email}?secret=${usedSecret}&issuer=Redapstyle-Admin`;

  const handleCopy = () => {
    navigator.clipboard.writeText(usedSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (otp.length !== 6) {
      setError('Digite os 6 dígitos do código.');
      setLoading(false);
      return;
    }
    const valid = await validateTotpBackend(otp, usedSecret);
    setLoading(false);
    if (valid) {
      setError('');
      onMfaSuccess();
    } else {
      setError('Código inválido. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-2">Autenticação em 2 Fatores</h1>
          <p className="text-gray-400">Proteja o acesso ao painel administrativo</p>
        </div>
        <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <QRCodeCanvas value={otpauth} size={180} bgColor="#fff" fgColor="#2563eb" includeMargin={true} />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <QrCode className="w-4 h-4" />
                Escaneie o QR code no seu aplicativo autenticador
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <KeyRound className="w-4 h-4" />
                Código secreto:
                <span className="font-mono text-blue-400 break-all select-all cursor-pointer" onClick={handleCopy} title="Clique para copiar">{usedSecret}</span>
                <Button size="icon" variant="ghost" onClick={handleCopy} className="p-1 ml-1" tabIndex={-1}>
                  {copied ? <span className="text-green-400 text-xs">Copiado!</span> : <span className="text-blue-400 text-xs">Copiar</span>}
                </Button>
              </div>
              <Button type="button" variant="link" className="text-xs text-blue-400" onClick={() => setShowInstructions(!showInstructions)}>
                Como configurar?
              </Button>
            </div>
            {showInstructions && (
              <Alert className="bg-blue-900/20 border-blue-800 text-blue-400">
                <AlertDescription>
                  1. Abra o Google Authenticator, Authy ou similar no seu celular.<br />
                  2. Toque em "+" e escolha "Escanear código QR".<br />
                  3. Escaneie o QR code acima ou digite o código secreto.<br />
                  4. Digite o código de 6 dígitos gerado abaixo.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2 mt-2 w-full flex flex-col items-center">
              <label htmlFor="otp" className="text-sm text-gray-300 mb-2">Código do autenticador</label>
              <div className="flex justify-center w-full">
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-lg tracking-widest text-center bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600 py-4"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>
            </div>
            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" disabled={otp.length !== 6 || loading}>
              {loading ? 'Validando...' : 'Validar Código'}
            </Button>
          </form>
        </Card>
        <p className="text-center text-xs text-gray-500 mt-6">
          Use um aplicativo autenticador para gerar o código temporário.
        </p>
      </div>
    </div>
  );
}