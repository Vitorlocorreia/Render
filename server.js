const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { authenticator } = require('otplib');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta 'dist' (criada pelo 'vite build')
app.use(express.static(path.join(__dirname, 'dist')));

// --- Lógica da API ---
// Segredo vem das Variáveis de Ambiente ou usa um valor padrão (NÃO USE O PADRÃO EM PRODUÇÃO)
const TOTP_SECRET = process.env.TOTP_SECRET || 'JBSWY3DPEHPK3PXP';

app.post('/api/validate-totp', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, error: 'Token ausente' });
  }
  const valid = authenticator.check(token, TOTP_SECRET);
  res.json({ valid });
});

// --- Servir o Frontend ---
// Para qualquer outra rota, sirva o index.html do frontend
// Isso é essencial para Single-Page Applications (SPA) como o React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Usa a porta fornecida pelo Render (process.env.PORT) ou 4000 como padrão
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  // ---- DIAGNÓSTICO PARA RENDER ----
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log(`[Diagnóstico] Verificando se o arquivo existe em: ${indexPath}`);
  if (fs.existsSync(indexPath)) {
    console.log('[Diagnóstico] SUCESSO: Arquivo index.html encontrado. O frontend foi construído corretamente.');
  } else {
    console.error('[Diagnóstico] ERRO CRÍTICO: Arquivo index.html NÃO encontrado. O build do frontend falhou. Verifique o log de BUILD no Render para encontrar o erro no comando "npm run build".');
  }
  // ---- FIM DO DIAGNÓSTICO ----
});
