const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const alertContainer = document.getElementById('alertContainer');

function showAlert(message, type = 'error') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading 
    ? 'Entrando<span class="loading"></span>' 
    : 'Entrar';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  setLoading(true);
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao fazer login');
    }
    
    // Salvar token no localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    showAlert('Login realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    setLoading(false);
  }
});

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  }
});
