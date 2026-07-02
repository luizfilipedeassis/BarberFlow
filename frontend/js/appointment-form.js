setupLayout('appointments');

const form = document.querySelector('#appointmentForm');
const dateInput = document.querySelector('#date');
const params = new URLSearchParams(window.location.search);
const appointmentId = params.get('id');

async function initializeForm() {
  try {
    const clients = await apiRequest('/clients');
    const clientSelect = document.querySelector('#clientId');

    if (!clients.length) {
      clientSelect.innerHTML = '<option value="">Nenhum cliente cadastrado</option>';
      document.querySelector('#saveButton').disabled = true;
      showToast('Cadastre um cliente antes de criar o agendamento.', 'error');
      return false;
    }

    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>'
      + clients.map((client) => `
        <option value="${client.id}">${escapeHtml(client.name)} — ${escapeHtml(client.phone)}</option>
      `).join('');

    if (appointmentId) {
      const appointment = await apiRequest(`/appointments/${appointmentId}`);
      document.querySelector('#formTitle').textContent = 'Editar agendamento';
      document.querySelector('#formSubtitle').textContent = 'Atualize as informações do horário.';
      document.querySelector('#saveButton').textContent = 'Salvar alterações';

      ['clientId', 'service', 'date', 'time', 'status', 'notes'].forEach((field) => {
        document.querySelector(`#${field}`).value = appointment[field] ?? '';
      });
    } else {
      dateInput.min = new Date().toLocaleDateString('en-CA');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const saveButton = document.querySelector('#saveButton');
  const originalLabel = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = 'Salvando...';

  try {
    await apiRequest(appointmentId ? `/appointments/${appointmentId}` : '/appointments', {
      method: appointmentId ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });
    sessionStorage.setItem(
      'barberflow_message',
      appointmentId ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!'
    );
    window.location.href = 'appointments.html';
  } catch (error) {
    showToast(error.message, 'error');
    saveButton.disabled = false;
    saveButton.textContent = originalLabel;
  }
});

initializeForm();
