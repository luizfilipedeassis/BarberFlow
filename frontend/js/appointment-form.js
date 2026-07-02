setupLayout('appointments');

const form = document.querySelector('#appointmentForm');
const dateInput = document.querySelector('#date');

async function loadClients() {
  try {
    const clients = await apiRequest('/clients');
    const clientSelect = document.querySelector('#clientId');

    if (!clients.length) {
      clientSelect.innerHTML = '<option value="">Nenhum cliente cadastrado</option>';
      document.querySelector('#saveButton').disabled = true;
      showToast('Cadastre um cliente antes de criar o agendamento.', 'error');
      return;
    }

    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>'
      + clients.map((client) => `
        <option value="${client.id}">${escapeHtml(client.name)} — ${escapeHtml(client.phone)}</option>
      `).join('');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  try {
    await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    form.reset();
    dateInput.min = new Date().toLocaleDateString('en-CA');
    showToast('Agendamento criado com sucesso!');
  } catch (error) {
    showToast(error.message, 'error');
  }
});

dateInput.min = new Date().toLocaleDateString('en-CA');
loadClients();
