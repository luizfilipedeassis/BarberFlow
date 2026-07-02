if (sessionStorage.getItem('barberflow_auth') === 'true') {
  window.location.href = '/pages/dashboard.html';
}

document.querySelector('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const user = document.querySelector('#user').value.trim();
  const password = document.querySelector('#password').value;
  const error = document.querySelector('#loginError');

  if (user === 'admin' && password === 'admin123') {
    sessionStorage.setItem('barberflow_auth', 'true');
    window.location.href = '/pages/dashboard.html';
    return;
  }

  error.textContent = 'Usuário ou senha incorretos.';
  error.classList.remove('hidden');
});
