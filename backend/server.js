const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.json());
app.use(express.static(frontendPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado.' });
});

app.listen(port, () => {
  console.log(`BarberFlow disponível em http://localhost:${port}`);
});
