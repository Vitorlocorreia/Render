import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { PublicDashboard } from './components/PublicDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AdminMfaPage } from './components/AdminMfaPage';

// Gera um segredo TOTP compatível com browser (base32, 20 caracteres)
function generateBrowserTotpSecret() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 20; i++) {
    secret += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return secret;
}

type Screen = 'home' | 'public' | 'login' | 'mfa' | 'admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMfaValidated, setIsMfaValidated] = useState(false);
  // Substitui authenticator.generateSecret() por função compatível com browser
  const [adminSecret] = useState(() => generateBrowserTotpSecret());
  const adminEmail = 'admin';

  // Funções de navegação
  const navigateToHome = () => {
    setCurrentScreen('home');
    setIsAuthenticated(false);
    setIsMfaValidated(false);
  };

  const navigateToPublic = () => {
    setCurrentScreen('public');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setCurrentScreen('mfa');
  };

  const handleMfaSuccess = () => {
    setIsAuthenticated(true);
    setIsMfaValidated(true);
    setCurrentScreen('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMfaValidated(false);
    setCurrentScreen('home');
  };

  // Renderizar a tela apropriada
  switch (currentScreen) {
    case 'home':
      return (
        <HomePage 
          onNavigateToPublic={navigateToPublic}
          onNavigateToLogin={navigateToLogin}
        />
      );

    case 'public':
      return (
        <PublicDashboard 
          onBack={navigateToHome}
        />
      );

    case 'login':
      return (
        <LoginPage 
          onLogin={handleLogin}
          onBack={navigateToHome}
        />
      );

    case 'mfa':
      return (
        <AdminMfaPage
          onMfaSuccess={handleMfaSuccess}
          secret={adminSecret}
          email={adminEmail}
        />
      );

    case 'admin':
      if (!isAuthenticated || !isMfaValidated) {
        setCurrentScreen('home');
        return null;
      }
      return (
        <AdminDashboard 
          onLogout={handleLogout}
        />
      );

    default:
      return (
        <HomePage 
          onNavigateToPublic={navigateToPublic}
          onNavigateToLogin={navigateToLogin}
        />
      );
  }
}
