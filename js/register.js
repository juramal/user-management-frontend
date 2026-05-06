const form = document.getElementById('registerForm');
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
    ? 'Criando conta<span class="loading"></span>' 
    : 'Criar Conta';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Validação de senha
  if (data.password !== data.confirmPassword) {
    showAlert('As senhas não coincidem!', 'error');
    return;
  }
  
  // Validação de idade mínima (18 anos)
  const birthDate = new Date(data.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) {
    showAlert('Você deve ter pelo menos 18 anos para se cadastrar', 'error');
    return;
  }
  
  setLoading(true);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: data.fullName,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar conta');
    }
    
    // Salvar token no localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    showAlert('Conta criada com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    setLoading(false);
  }
});
