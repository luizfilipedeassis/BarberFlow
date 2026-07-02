setupLayout('dashboard');

async function loadClientCount() {
  try {
    const clients = await apiRequest('/clients');
    document.querySelector('#clientCount').textContent = clients.length;
  } catch (error) {
    showToast(error.message, 'error');
  }
}

loadClientCount();
