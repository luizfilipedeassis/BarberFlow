const API = '/api';

function requireAuth() {
  if (sessionStorage.getItem('barberflow_auth') !== 'true') {
    window.location.href = '/index.html';
  }
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível concluir a operação.');
  }
  return data;
}

function showToast(message, type = 'success') {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHtml(value = '') {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));
}

function logout() {
  sessionStorage.removeItem('barberflow_auth');
  window.location.href = '/index.html';
}

function setupLayout(activePage) {
  requireAuth();
  document.querySelector(`[data-page="${activePage}"]`)?.classList.add('active');
  document.querySelector('[data-logout]')?.addEventListener('click', logout);

  const message = sessionStorage.getItem('barberflow_message');
  if (message) {
    showToast(message);
    sessionStorage.removeItem('barberflow_message');
  }
}
