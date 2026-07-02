setupLayout('clients');

let clients = [];
let selectedClientId = null;

function renderClients(items) {
  const container = document.querySelector('#clientList');
  document.querySelector('#clientSummary').textContent = `${clients.length} cliente(s) cadastrado(s)`;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><strong>Nenhum cliente encontrado</strong>Use o formulário acima para cadastrar.</div>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Cadastro</th><th>Ações</th></tr></thead>
      <tbody>${items.map((client) => `
        <tr>
          <td><strong>${escapeHtml(client.name)}</strong></td>
          <td>${escapeHtml(client.phone)}</td>
          <td>${escapeHtml(client.email) || '—'}</td>
          <td>${new Date(client.createdAt).toLocaleDateString('pt-BR')}</td>
          <td><button class="btn btn-danger btn-sm" data-delete-client="${client.id}">Excluir</button></td>
        </tr>`).join('')}</tbody>
    </table>`;

  container.querySelectorAll('[data-delete-client]').forEach((button) => {
    button.addEventListener('click', () => openClientDeleteModal(Number(button.dataset.deleteClient)));
  });
}

function openClientDeleteModal(id) {
  const client = clients.find((item) => item.id === id);
  selectedClientId = id;
  document.querySelector('#deleteClientMessage').textContent =
    `Deseja excluir ${client?.name || 'este cliente'}? Esta ação é permanente.`;
  document.querySelector('#deleteClientModal').classList.remove('hidden');
}

function closeClientDeleteModal() {
  selectedClientId = null;
  document.querySelector('#deleteClientModal').classList.add('hidden');
}

async function loadClients() {
  try {
    clients = await apiRequest('/clients');
    renderClients(clients);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.querySelector('#clientForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Cadastrando...';

  try {
    await apiRequest('/clients', { method: 'POST', body: JSON.stringify(data) });
    form.reset();
    showToast('Cliente cadastrado com sucesso!');
    await loadClients();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Cadastrar cliente';
  }
});

document.querySelector('#clientSearch').addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase();
  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.phone} ${client.email}`.toLowerCase().includes(term)
  );
  renderClients(filteredClients);
});

document.querySelector('#cancelClientDelete').addEventListener('click', closeClientDeleteModal);

document.querySelector('#deleteClientModal').addEventListener('click', (event) => {
  if (event.target.id === 'deleteClientModal') {
    closeClientDeleteModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeClientDeleteModal();
  }
});

document.querySelector('#confirmClientDelete').addEventListener('click', async () => {
  if (!selectedClientId) return;

  try {
    await apiRequest(`/clients/${selectedClientId}`, { method: 'DELETE' });
    closeClientDeleteModal();
    showToast('Cliente excluído com sucesso!');
    await loadClients();
  } catch (error) {
    closeClientDeleteModal();
    showToast(error.message, 'error');
  }
});

document.querySelector('#phone').addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  event.target.value = digits
    .replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
    .replace(/-$/, '');
});

loadClients();
