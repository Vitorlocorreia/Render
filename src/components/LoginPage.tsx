import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, Shield, Lock, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulação de autenticação (credenciais de exemplo)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Usuário ou senha incorretos. Tente: admin / admin123');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAzLTRzMyAyIDMgNGMwIDItMiA0LTMgNHMtMy0yLTMtNHptLTYtNmMwLTIgMi00IDMtNHMzIDIgMyA0YzAgMi0yIDQtMyA0cy0zLTItMy00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-2">Área Administrativa</h1>
          <p className="text-gray-400">Acesse o painel completo de gerenciamento</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-gray-300">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Autenticando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Acessar Painel Administrativo
                </>
              )}
            </Button>

            {/* Back Button */}
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </form>
        </Card>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Esta é uma área restrita. Acesso apenas para administradores autorizados.
        </p>
      </div>
    </div>
  );
}
