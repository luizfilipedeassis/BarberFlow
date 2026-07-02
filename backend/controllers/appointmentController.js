const { readDatabase, writeDatabase, nextId } = require('./storage');

const allowedStatuses = ['Agendado', 'Concluído', 'Cancelado'];

function enrichAppointment(appointment, clients) {
  const client = clients.find((item) => item.id === appointment.clientId);
  return { ...appointment, client };
}

function listAppointments(req, res, next) {
  try {
    const database = readDatabase();
    const appointments = database.appointments
      .map((appointment) => enrichAppointment(appointment, database.clients))
      .sort((first, second) =>
        `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)
      );

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

function validateAppointment(body, database) {
  const { clientId, service, date, time, status = 'Agendado' } = body;

  if (!clientId || !service?.trim() || !date || !time) {
    return 'Preencha todos os campos obrigatórios.';
  }

  if (!database.clients.some((client) => client.id === Number(clientId))) {
    return 'Cliente não encontrado.';
  }

  if (!allowedStatuses.includes(status)) {
    return 'Status inválido.';
  }

  const scheduleConflict = database.appointments.some(
    (appointment) => appointment.date === date
      && appointment.time === time
      && appointment.status !== 'Cancelado'
  );

  if (scheduleConflict) {
    return 'Este horário já está ocupado.';
  }

  return null;
}

function createAppointment(req, res, next) {
  try {
    const database = readDatabase();
    const validationError = validateAppointment(req.body, database);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const appointment = {
      id: nextId(database.appointments),
      clientId: Number(req.body.clientId),
      service: req.body.service.trim(),
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || 'Agendado',
      notes: req.body.notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    database.appointments.push(appointment);
    writeDatabase(database);
    return res.status(201).json(enrichAppointment(appointment, database.clients));
  } catch (error) {
    return next(error);
  }
}

module.exports = { listAppointments, createAppointment };
