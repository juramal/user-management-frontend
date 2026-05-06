const form = document.getElementById('profileForm');
const submitBtn = document.getElementById('submitBtn');
const logoutBtn = document.getElementById('logoutBtn');
const deleteBtn = document.getElementById('deleteBtn');
const alertContainer = document.getElementById('alertContainer');
const welcomeMessage = document.getElementById('welcomeMessage');

function showAlert(message, type = 'error') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading 
    ? 'Salvando<span class="loading"></span>' 
    : '💾 Salvar Alterações';
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadUserData() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Sessão expirada');
    }
    
    const user = await response.json();
    
    // Preencher formulário
    document.getElementById('fullName').value = user.fullName;
    document.getElementById('birthDate').value = formatDateForInput(user.birthDate);
    document.getElementById('email').value = user.email;
    
    // Atualizar mensagem de boas-vindas
    welcomeMessage.textContent = `Bem-vindo(a), ${user.fullName.split(' ')[0]}!`;
    
  } catch (error) {
    showAlert('Erro ao carregar dados. Faça login novamente.', 'error');
    setTimeout(() => {
      localStorage.clear();
      window.location.href = 'login.html';
    }, 2000);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Validação de senha
  if (data.password || data.confirmPassword) {
    if (data.password !== data.confirmPassword) {
      showAlert('As senhas não coincidem!', 'error');
      return;
    }
    
    if (!data.currentPassword) {
      showAlert('Digite sua senha atual para alterar a senha', 'error');
      return;
    }
  }
  
  setLoading(true);
  
  try {
    const updateData = {
      fullName: data.fullName,
      birthDate: data.birthDate,
      email: data.email
    };
    
    // Adicionar campos de senha apenas se foram preenchidos
    if (data.password) {
      updateData.password = data.password;
      updateData.currentPassword = data.currentPassword;
    }
    
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar perfil');
    }
    
    showAlert('Perfil atualizado com sucesso!', 'success');
    
    // Limpar campos de senha
    document.getElementById('currentPassword').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    
    // Recarregar dados
    await loadUserData();
    
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    setLoading(false);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

deleteBtn.addEventListener('click', async () => {
  const confirmed = confirm(
    '⚠️ Tem certeza que deseja deletar sua conta?\n\nEsta ação é irreversível!'
  );
  
  if (!confirmed) return;
  
  const doubleConfirmed = confirm(
    '🚨 ÚLTIMA CONFIRMAÇÃO!\n\nTodos os seus dados serão permanentemente deletados.\n\nDeseja realmente continuar?'
  );
  
  if (!doubleConfirmed) return;
  
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar conta');
    }
    
    showAlert('Conta deletada com sucesso. Redirecionando...', 'success');
    
    setTimeout(() => {
      localStorage.clear();
      window.location.href = 'register.html';
    }, 2000);
    
  } catch (error) {
    showAlert(error.message, 'error');
  }
});

// Carregar dados ao iniciar
window.addEventListener('DOMContentLoaded', loadUserData);
