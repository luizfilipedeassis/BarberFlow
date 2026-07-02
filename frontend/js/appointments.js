setupLayout('appointments');

let appointments = [];

function renderAppointments(items) {
  const container = document.querySelector('#appointmentList');
  document.querySelector('#appointmentSummary').textContent = `${appointments.length} agendamento(s) no total`;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><strong>Nenhum agendamento encontrado</strong>Cadastre um horário para começar.</div>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Horário</th><th>Status</th><th>Observação</th></tr></thead>
      <tbody>${items.map((appointment) => `
        <tr>
          <td><strong>${escapeHtml(appointment.client?.name || 'Cliente removido')}</strong></td>
          <td>${escapeHtml(appointment.service)}</td>
          <td>${formatDate(appointment.date)}</td>
          <td>${appointment.time}</td>
          <td><span class="badge badge-${appointment.status.toLowerCase()}">${appointment.status}</span></td>
          <td class="notes-preview" title="${escapeHtml(appointment.notes || '')}">${appointment.notes ? escapeHtml(appointment.notes) : '—'}</td>
        </tr>`).join('')}</tbody>
    </table>`;
}

async function loadAppointments() {
  try {
    appointments = await apiRequest('/appointments');
    renderAppointments(appointments);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.querySelector('#appointmentSearch').addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase();
  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.client?.name || ''} ${appointment.service} ${appointment.status}`
      .toLowerCase()
      .includes(term)
  );
  renderAppointments(filteredAppointments);
});

loadAppointments();
