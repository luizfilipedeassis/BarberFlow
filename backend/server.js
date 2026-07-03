const express = require('express');
const path = require('path');
const clientRoutes = require('./routes/clientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use(express.static(frontendPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'O JSON enviado é inválido.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
});

app.listen(port, () => {
  console.log(`BarberFlow disponível em http://localhost:${port}`);
});
