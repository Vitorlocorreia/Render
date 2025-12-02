const express = require('express');
const cors = require('cors');
const path = require('path');
const { authenticator } = require('otplib');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta 'dist' (criada pelo 'vite build')
app.use(express.static(path.join(__dirname, 'dist')));

// --- Lógica da API ---
// Segredo fixo (deve ser igual ao do frontend)
const FIXED_SECRET = 'JBSWY3DPEHPK3PXP';

app.post('/api/validate-totp', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, error: 'Token ausente' });
  }
  const valid = authenticator.check(token, FIXED_SECRET);
  res.json({ valid });
});

// --- Servir o Frontend ---
// Para qualquer outra rota, sirva o index.html do frontend
// Isso é essencial para Single-Page Applications (SPA) como o React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// Usa a porta fornecida pelo Render (process.env.PORT) ou 4000 como padrão
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
