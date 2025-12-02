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
  try {
    const valid = authenticator.check(token, TOTP_SECRET);
    res.json({ valid });
  } catch (err) {
    console.error("Erro na validação do TOTP:", err);
    res.status(500).json({ valid: false, error: 'Erro interno do servidor.' });
  }
});

// --- Servir o Frontend ---
// Para qualquer outra rota não capturada acima (como /api), sirva o app React.
// Isso é essencial para Single-Page Applications (SPA) que usam roteamento no lado do cliente.
app.get(/.*/, (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Se o arquivo não for encontrado, envia uma mensagem de erro clara.
      // Isso geralmente acontece se o build do frontend (npm run build) falhou.
      console.error("Falha ao servir 'index.html':", err);
      res.status(500).send('Erro no servidor: index.html não encontrado. Verifique se o build do frontend foi concluído com sucesso.');
    }
  });
});

// Usa a porta fornecida pelo Render (process.env.PORT) ou 4000 como padrão
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  // ---- VERIFICAÇÃO INICIAL ----
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log(`[Status] Verificando o arquivo de entrada do frontend em: ${indexPath}`);
  if (fs.existsSync(indexPath)) {
    console.log('[Status] SUCESSO: index.html encontrado. O servidor está pronto para servir o frontend.');
  } else {
    console.error('[Status] ALERTA: index.html NÃO encontrado no caminho esperado. O servidor iniciou, mas não poderá servir o frontend até que o arquivo seja gerado pelo comando de build ("npm run build"). Verifique os logs de build do seu deploy.');
  }
  // ---- FIM DA VERIFICAÇÃO ----
});