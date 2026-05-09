## 🎨 Frontend - Sistema de Gerenciamento de Usuários.

Interface web para gerenciamento de usuários, com páginas de cadastro, login e edição de perfil. Desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## ✨ Funcionalidades

### 📄 Páginas

1. **Login (`index.html`)** 
   - Autenticação com email e senha
   - Validação de campos
   - Feedback visual de erros
   - Redirecionamento automático se já estiver logado

2. **Cadastro (`register.html`)**
   - Formulário de criação de conta
   - Validação de idade (18+)
   - Confirmação de senha
   - Criação automática de sessão após cadastro

3. **Perfil (`profile.html`)**
   - Visualização de dados do usuário
   - Edição de informações pessoais
   - Alteração de senha com validação
   - Logout
   - Exclusão de conta com confirmação dupla

### 🎨 Recursos Visuais

- ✅ Design moderno e responsivo
- ✅ Gradientes e animações suaves
- ✅ Loading states nos botões
- ✅ Alertas de sucesso/erro
- ✅ Proteção de rotas (redirecionamento automático)
- ✅ Formatação automática de datas

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e animações
- **JavaScript ES6+** - Lógica e integração com API
- **LocalStorage** - Armazenamento de token JWT

## 📋 Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Backend rodando (veja [user-management-backend](https://github.com/juramal/user-management-backend))

## 🚀 Instalação e Uso

### Opção 1: Abrir direto no navegador

1. Clone o repositório:
```bash
git clone https://github.com/juramal/user-management-frontend.git
cd user-management-frontend
```

2. Configure a URL da API em `js/config.js`:
```javascript
const API_URL = 'http://localhost:3000/api';
```

3. Abra o arquivo `index.html` no navegador

### Opção 2: Usar Live Server (VS Code)

1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code

2. Clique com botão direito em `index.html` → "Open with Live Server"

3. O navegador abrirá automaticamente em `http://localhost:5500`

### Opção 3: Usar servidor HTTP local

```bash
# Python 3
python -m http.server 5500

# Node.js
npx http-server -p 5500
```

Acesse: http://localhost:5500

## ⚙️ Configuração

### Conectar ao Backend

Edite o arquivo `js/config.js`:

```javascript
// Desenvolvimento local
const API_URL = 'http://localhost:3000/api';

// Produção
// const API_URL = 'https://sua-api.com/api';
```

**⚠️ IMPORTANTE**: A URL deve corresponder ao endereço onde seu backend está rodando.

## 🗂️ Estrutura do Projeto

```
user-management-frontend/
├── css/
│   └── styles.css          # Estilos globais
├── js/
│   ├── config.js           # Configuração da API
│   ├── login.js            # Lógica da página de login
│   ├── register.js         # Lógica da página de cadastro
│   └── profile.js          # Lógica da página de perfil
├── index.html              # Página de login (inicial)
├── register.html           # Página de cadastro
├── profile.html            # Página de perfil
├── package.json
├── .gitignore
└── README.md
```

## 📱 Páginas e Funcionalidades

### 🔐 Login (index.html)

**Campos:**
- Email
- Senha

**Validações:**
- Todos os campos obrigatórios
- Formato de email válido
- Feedback de erro da API

**Comportamento:**
- Salva token JWT no localStorage
- Redireciona para perfil após login bem-sucedido
- Se já estiver logado, redireciona automaticamente para perfil

---

### 📝 Cadastro (register.html)

**Campos:**
- Nome completo
- Data de nascimento
- Email
- Senha
- Confirmar senha

**Validações:**
- Todos os campos obrigatórios
- Idade mínima de 18 anos
- Senhas devem coincidir
- Senha mínima de 6 caracteres
- Email único (validado pelo backend)

**Comportamento:**
- Cria conta e faz login automaticamente
- Salva token JWT no localStorage
- Redireciona para perfil após cadastro

---

### 👤 Perfil (profile.html)

**Funcionalidades:**
1. **Visualizar Dados**
   - Carrega informações do usuário logado
   - Exibe nome de boas-vindas no cabeçalho

2. **Editar Dados**
   - Nome completo
   - Data de nascimento
   - Email
   - Senha (opcional)

3. **Trocar Senha**
   - Requer senha atual
   - Nova senha com confirmação
   - Campos opcionais (deixar em branco para não alterar)

4. **Logout**
   - Limpa localStorage
   - Redireciona para login

5. **Deletar Conta**
   - Confirmação dupla de segurança
   - Remove conta permanentemente
   - Redireciona para cadastro

**Proteção:**
- Redireciona para login se não houver token
- Redireciona para login se token expirar

## 🎨 Customização de Estilos

### Cores Principais

Edite em `css/styles.css`:

```css
/* Gradiente de fundo */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cor primária dos botões */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cor de foco dos inputs */
border-color: #667eea;
```

### Responsividade

O design é responsivo por padrão e se adapta a:
- 📱 Mobile (< 600px)
- 📱 Tablet (600px - 1024px)
- 💻 Desktop (> 1024px)

## 🔒 Segurança

- ✅ Token JWT armazenado no localStorage
- ✅ Validações no frontend E backend
- ✅ Headers de autorização em todas as requisições autenticadas
- ✅ Tratamento de sessão expirada
- ✅ Confirmação dupla para exclusão de conta
- ✅ Limpeza de dados sensíveis no logout

## 🐛 Solução de Problemas

### Erro de CORS

Se você ver erros de CORS no console:

1. Verifique se o backend está rodando
2. Confirme que o `FRONTEND_URL` no `.env` do backend está correto
3. Verifique o `API_URL` em `js/config.js`

### Token expirado

Se você for redirecionado para login inesperadamente:

- O token JWT expira após o tempo configurado no backend (padrão: 7 dias)
- Faça login novamente para gerar um novo token

### Formulário não envia

Verifique:
1. Console do navegador para erros JavaScript
2. Network tab para ver se a requisição está sendo feita
3. Se o backend está respondendo em `/api/health`

### Página em branco

- Abra o console do navegador (F12)
- Verifique se há erros JavaScript
- Confirme que todos os arquivos JS e CSS foram carregados

## 🧪 Testando

### Fluxo Completo de Teste

1. **Teste de Cadastro**
   - Acesse `register.html`
   - Preencha todos os campos
   - Use um email único
   - Senha com 6+ caracteres
   - Confirme a senha igual
   - Clique em "Criar Conta"
   - Deve redirecionar para perfil

2. **Teste de Login**
   - Acesse `index.html`
   - Use o email e senha cadastrados
   - Clique em "Entrar"
   - Deve redirecionar para perfil

3. **Teste de Edição de Perfil**
   - Na página de perfil, altere algum dado
   - Clique em "Salvar Alterações"
   - Verifique o alerta de sucesso

4. **Teste de Troca de Senha**
   - Preencha "Senha Atual"
   - Preencha "Nova Senha" e "Confirmar Nova Senha"
   - Clique em "Salvar Alterações"
   - Faça logout e login com a nova senha

5. **Teste de Logout**
   - Clique em "Sair"
   - Deve redirecionar para login
   - Tente acessar `profile.html` diretamente
   - Deve ser redirecionado para login

## 🔗 Integração com Backend

Este frontend foi projetado para consumir a API em:
- **Repositório Backend**: https://github.com/juramal/user-management-backend

### Endpoints Utilizados

| Método | Endpoint | Usado em | Autenticação |
|--------|----------|----------|--------------|
| POST | `/api/auth/register` | Cadastro | Não |
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/users/me` | Perfil | Sim |
| PUT | `/api/users/me` | Perfil | Sim |
| DELETE | `/api/users/me` | Perfil | Sim |

## 📄 Licença

MIT

---

**🎉 Frontend configurado e pronto para uso!**

Para começar:
1. Configure o `API_URL` em `js/config.js`
2. Certifique-se que o backend está rodando
3. Abra `index.html` no navegador

**Sugestão de porta para o frontend:** 5500 (se usar Live Server)
