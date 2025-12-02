// server.js
const express = require('express');
const cors = require('cors');
const { authenticator } = require('otplib');

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend TOTP rodando em http://localhost:${PORT}`);
});
