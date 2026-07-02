const { readDatabase, writeDatabase, nextId } = require('./storage');

function listClients(req, res, next) {
  try {
    const clients = readDatabase().clients.sort((a, b) => a.name.localeCompare(b.name));
    res.json(clients);
  } catch (error) {
    next(error);
  }
}

function createClient(req, res, next) {
  try {
    const { name, phone, email = '' } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios.' });
    }

    const database = readDatabase();
    const normalizedPhone = phone.replace(/\D/g, '');
    const phoneAlreadyExists = database.clients.some(
      (client) => client.phone.replace(/\D/g, '') === normalizedPhone
    );

    if (phoneAlreadyExists) {
      return res.status(409).json({ message: 'Já existe um cliente com este telefone.' });
    }

    const client = {
      id: nextId(database.clients),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString()
    };

    database.clients.push(client);
    writeDatabase(database);
    return res.status(201).json(client);
  } catch (error) {
    return next(error);
  }
}

module.exports = { listClients, createClient };
