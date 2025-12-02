const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { authenticator } = require('otplib');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta 'build' (criada pelo 'vite build')
app.use(express.static(path.join(__dirname, 'build')));

// --- Lógica da API ---
const TOTP_SECRET = process.env.TOTP_SECRET || 'JBSWY3DPEHPK3PXP';

app.post('/api/validate-totp', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ valid: false, error: 'Token ausente' });
  }
  try {
    const valid = authenticator.check(token, TOTP_SECRET);
    res.json({ valid });
  } catch (err) {
    console.error("Erro na validação do TOTP:", err);
    res.status(500).json({ valid: false, error: 'Erro interno do servidor.' });
  }
});

// --- SPA fallback ---
app.get(/.*/, (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Falha ao servir 'index.html':", err);
      res.status(500).send('Erro no servidor: index.html não encontrado. Verifique se o build do frontend foi gerado.');
    }
  });
});

// Porta do Render
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  const indexPath = path.join(__dirname, 'build', 'index.html');
  console.log(`[Status] Verificando arquivo: ${indexPath}`);
  if (fs.existsSync(indexPath)) {
    console.log('[Status] SUCESSO: index.html encontrado.');
  } else {
    console.error('[Status] ERRO: index.html NÃO encontrado!');
  }
});
