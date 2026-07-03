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

    if (name.trim().length > 80) {
      return res.status(400).json({ message: 'O nome deve possuir no máximo 80 caracteres.' });
    }

    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return res.status(400).json({ message: 'Informe um telefone válido com DDD.' });
    }

    const normalizedEmail = email.trim();
    const emailIsInvalid = normalizedEmail
      && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 100);
    if (emailIsInvalid) {
      return res.status(400).json({ message: 'Informe um e-mail válido.' });
    }

    const database = readDatabase();
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
      email: normalizedEmail,
      createdAt: new Date().toISOString()
    };

    database.clients.push(client);
    writeDatabase(database);
    return res.status(201).json(client);
  } catch (error) {
    return next(error);
  }
}

function deleteClient(req, res, next) {
  try {
    const database = readDatabase();
    const id = Number(req.params.id);
    const index = database.clients.findIndex((client) => client.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const hasAppointments = database.appointments.some(
      (appointment) => appointment.clientId === id
    );

    if (hasAppointments) {
      return res.status(409).json({
        message: 'Este cliente possui agendamentos. Exclua os agendamentos antes de excluir o cliente.'
      });
    }

    database.clients.splice(index, 1);
    writeDatabase(database);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { listClients, createClient, deleteClient };
