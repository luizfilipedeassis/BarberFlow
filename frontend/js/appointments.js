setupLayout('appointments');

let appointments = [];
let selectedId = null;

function renderAppointments(items) {
  const container = document.querySelector('#appointmentList');
  document.querySelector('#appointmentSummary').textContent = `${appointments.length} agendamento(s) no total`;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><strong>Nenhum agendamento encontrado</strong>Cadastre um horário para começar.</div>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Horário</th><th>Status</th><th>Observação</th><th>Ações</th></tr></thead>
      <tbody>${items.map((appointment) => `
        <tr>
          <td><strong>${escapeHtml(appointment.client?.name || 'Cliente removido')}</strong></td>
          <td>${escapeHtml(appointment.service)}</td>
          <td>${formatDate(appointment.date)}</td>
          <td>${appointment.time}</td>
          <td><span class="badge badge-${appointment.status.toLowerCase()}">${appointment.status}</span></td>
          <td class="notes-preview" title="${escapeHtml(appointment.notes || '')}">${appointment.notes ? escapeHtml(appointment.notes) : '—'}</td>
          <td class="actions">
            <a class="btn btn-secondary btn-sm" href="appointment-form.html?id=${appointment.id}">Editar</a>
            <button class="btn btn-danger btn-sm" data-delete="${appointment.id}">Excluir</button>
          </td>
        </tr>`).join('')}</tbody>
    </table>`;

  container.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => openDeleteModal(Number(button.dataset.delete)));
  });
}

function openDeleteModal(id) {
  selectedId = id;
  document.querySelector('#deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  selectedId = null;
  document.querySelector('#deleteModal').classList.add('hidden');
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

document.querySelector('#cancelDelete').addEventListener('click', closeDeleteModal);

document.querySelector('#deleteModal').addEventListener('click', (event) => {
  if (event.target.id === 'deleteModal') {
    closeDeleteModal();
  }
});

document.querySelector('#confirmDelete').addEventListener('click', async () => {
  if (!selectedId) return;

  try {
    await apiRequest(`/appointments/${selectedId}`, { method: 'DELETE' });
    closeDeleteModal();
    showToast('Agendamento excluído com sucesso!');
    await loadAppointments();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

loadAppointments();
