function requireAuth() {
  if (sessionStorage.getItem('barberflow_auth') !== 'true') {
    window.location.href = '/index.html';
  }
}

function logout() {
  sessionStorage.removeItem('barberflow_auth');
  window.location.href = '/index.html';
}

function setupLayout(activePage) {
  requireAuth();
  document.querySelector(`[data-page="${activePage}"]`)?.classList.add('active');
  document.querySelector('[data-logout]')?.addEventListener('click', logout);
}
