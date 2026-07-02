setupLayout('dashboard');

async function loadDashboard() {
  try {
    const [clients, appointments] = await Promise.all([
      apiRequest('/clients'),
      apiRequest('/appointments')
    ]);
    const today = new Date().toLocaleDateString('en-CA');
    const upcoming = appointments.filter(
      (appointment) => appointment.date >= today && appointment.status === 'Agendado'
    );

    document.querySelector('#clientCount').textContent = clients.length;
    document.querySelector('#todayCount').textContent = appointments.filter(
      (appointment) => appointment.date === today && appointment.status !== 'Cancelado'
    ).length;
    document.querySelector('#upcomingCount').textContent = upcoming.length;

    const container = document.querySelector('#dashboardAppointments');
    if (!upcoming.length) {
      container.innerHTML = '<div class="empty-state"><strong>Nenhum horário próximo</strong>Cadastre um novo agendamento para começar.</div>';
      return;
    }

    container.innerHTML = `
      <table>
        <thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Horário</th></tr></thead>
        <tbody>${upcoming.slice(0, 5).map((appointment) => `
          <tr>
            <td>${escapeHtml(appointment.client?.name || 'Cliente removido')}</td>
            <td>${escapeHtml(appointment.service)}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
          </tr>`).join('')}</tbody>
      </table>`;
  } catch (error) {
    showToast(error.message, 'error');
  }
}

loadDashboard();
