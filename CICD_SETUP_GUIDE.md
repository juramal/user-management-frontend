# 🚀 Guia Completo: GitHub Actions + Docker + Semantic Release

Este guia explica como configurar e usar toda a infraestrutura de CI/CD criada para os projetos.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquivos Criados](#arquivos-criados)
3. [Configuração no GitHub](#configuração-no-github)
4. [Configuração do Docker Hub](#configuração-do-docker-hub)
5. [Como Funciona o Versionamento](#como-funciona-o-versionamento)
6. [Comandos Docker](#comandos-docker)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### O que foi configurado?

**Backend (`user-management-backend`)**:
- ✅ CI/CD com testes automáticos
- ✅ Versionamento automático (Semantic Release)
- ✅ Build e push de imagens Docker
- ✅ Docker Compose para desenvolvimento local

**Frontend (`user-management-frontend`)**:
- ✅ Validação de código
- ✅ Versionamento automático
- ✅ Build e push de imagens Docker (Nginx)
- ✅ Configuração otimizada para produção

---

## 📁 Arquivos Criados

### Backend

```
user-management-backend/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Testes + Build
│       ├── release.yml      # Versionamento automático
│       └── docker.yml       # Build Docker
├── Dockerfile               # Imagem Docker otimizada
├── .dockerignore            # Ignora arquivos desnecessários
├── docker-compose.yml       # Para rodar localmente
└── .releaserc.json          # Config Semantic Release
```

### Frontend

```
user-management-frontend/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Validação
│       ├── release.yml      # Versionamento automático
│       └── docker.yml       # Build Docker
├── Dockerfile               # Nginx otimizado
├── .dockerignore            # Ignora arquivos desnecessários
├── nginx.conf               # Config Nginx
└── .releaserc.json          # Config Semantic Release
```

---

## ⚙️ Configuração no GitHub

### 1. Configurar Permissões do GitHub Actions

Para **CADA repositório** (backend e frontend):

1. Acesse: `Settings` → `Actions` → `General`
2. Em **Workflow permissions**:
   - ✅ Marque: **Read and write permissions**
   - ✅ Marque: **Allow GitHub Actions to create and approve pull requests**
3. Clique em **Save**

### 2. Configurar Secrets para Docker

Para **CADA repositório**:

1. Acesse: `Settings` → `Secrets and variables` → `Actions`
2. Clique em **New repository secret**
3. Adicione os seguintes secrets:

| Name | Value | Descrição |
|------|-------|-----------|
| `DOCKER_USERNAME` | seu_usuario_dockerhub | Usuário do Docker Hub |
| `DOCKER_PASSWORD` | sua_senha_dockerhub | Senha do Docker Hub |

> 💡 **Dica**: Use um Access Token do Docker Hub em vez da senha para maior segurança.

### 3. Configurar Branch Protection (Opcional mas Recomendado)

1. Acesse: `Settings` → `Branches` → `Add branch protection rule`
2. Em **Branch name pattern**: `main`
3. Marque:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Selecione: `Test and Build` (CI do backend)
4. Clique em **Create**

---

## 🐳 Configuração do Docker Hub

### Criar Access Token (Recomendado)

1. Faça login no [Docker Hub](https://hub.docker.com/)
2. Acesse: `Account Settings` → `Security` → `New Access Token`
3. Nome: `GitHub Actions`
4. Permissões: **Read, Write, Delete**
5. Clique em **Generate**
6. **Copie o token** (você só verá uma vez!)
7. Use este token como `DOCKER_PASSWORD` no GitHub

### Criar Repositórios no Docker Hub

1. No Docker Hub, clique em **Create Repository**
2. Crie dois repositórios:
   - `seu-usuario/user-management-backend`
   - `seu-usuario/user-management-frontend`
3. Deixe como **Public** (ou **Private** se preferir)

---

## 🔄 Como Funciona o Versionamento

### Semantic Release - Convenção de Commits

O versionamento é **100% automático** baseado nos seus commits:

| Tipo de Commit | Versão | Exemplo |
|----------------|--------|---------|
| `feat:` | Minor (1.0.0 → 1.1.0) | `feat: adicionar login com Google` |
| `fix:` | Patch (1.0.0 → 1.0.1) | `fix: corrigir validação de email` |
| `perf:` | Patch | `perf: otimizar consultas ao banco` |
| `refactor:` | Patch | `refactor: reorganizar estrutura de pastas` |
| `BREAKING CHANGE:` | Major (1.0.0 → 2.0.0) | Ver exemplo abaixo |

### Exemplos de Commits

```bash
# Minor version (nova funcionalidade)
git commit -m "feat: adicionar recuperação de senha"

# Patch version (correção de bug)
git commit -m "fix: corrigir erro ao deletar usuário"

# Major version (mudança que quebra compatibilidade)
git commit -m "feat!: alterar estrutura do JWT

BREAKING CHANGE: O formato do token JWT foi alterado.
Tokens antigos não funcionarão mais."

# Não gera release
git commit -m "docs: atualizar README"
git commit -m "style: formatar código"
git commit -m "chore: atualizar dependências"
```

### Fluxo Completo

1. **Você faz um commit e push para `main`**:
   ```bash
   git add .
   git commit -m "feat: adicionar upload de avatar"
   git push origin main
   ```

2. **GitHub Actions executa automaticamente**:
   - ✅ CI: Roda testes e build
   - ✅ Release: Analisa commits e gera versão
   - ✅ Cria tag no Git (ex: `v1.1.0`)
   - ✅ Gera Release Notes no GitHub
   - ✅ Atualiza CHANGELOG.md

3. **Quando uma tag é criada**:
   - ✅ Docker: Faz build da imagem
   - ✅ Push para Docker Hub
   - ✅ Cria tags múltiplas (v1.1.0, v1.1, v1, latest)

---

## 🐋 Comandos Docker

### Backend - Desenvolvimento Local

```bash
cd user-management-backend

# Subir tudo (backend + MySQL)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar tudo
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

### Frontend - Desenvolvimento Local

```bash
cd user-management-frontend

# Build da imagem
docker build -t user-management-frontend .

# Rodar container
docker run -d -p 8080:80 --name frontend user-management-frontend

# Ver logs
docker logs -f frontend

# Parar e remover
docker stop frontend && docker rm frontend
```

### Testar Imagens do Docker Hub

```bash
# Baixar e rodar backend
docker pull seu-usuario/user-management-backend:latest
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e JWT_SECRET="seu_secret" \
  seu-usuario/user-management-backend:latest

# Baixar e rodar frontend
docker pull seu-usuario/user-management-frontend:latest
docker run -p 8080:80 seu-usuario/user-management-frontend:latest
```

---

## 🔧 Instalação de Dependências

### Backend

```bash
cd user-management-backend
npm install
```

Novas dependências adicionadas:
- `semantic-release` - Versionamento automático
- `@semantic-release/changelog` - Gera CHANGELOG.md
- `@semantic-release/git` - Commit das mudanças de versão

### Frontend

```bash
cd user-management-frontend
npm install
```

Novas dependências adicionadas:
- `semantic-release` - Versionamento automático
- `@semantic-release/changelog` - Gera CHANGELOG.md
- `@semantic-release/git` - Commit das mudanças de versão
- `html-validate` - Validação de HTML

---

## 🎯 Workflows Configurados

### Backend - CI (`ci.yml`)

**Quando roda**: Push ou PR em `main` ou `develop`

**O que faz**:
1. Testa em Node.js 18 e 20
2. Sobe MySQL no container
3. Instala dependências
4. Gera Prisma Client
5. Roda migrações
6. Executa testes
7. Faz build do TypeScript
8. Valida tipos

### Backend - Release (`release.yml`)

**Quando roda**: Push em `main`

**O que faz**:
1. Analisa commits desde último release
2. Calcula nova versão (major/minor/patch)
3. Atualiza package.json
4. Gera CHANGELOG.md
5. Cria commit de release
6. Cria tag no Git
7. Publica Release no GitHub

### Backend - Docker (`docker.yml`)

**Quando roda**: Quando uma tag `v*.*.*` é criada

**O que faz**:
1. Faz build da imagem Docker
2. Faz push para Docker Hub
3. Cria múltiplas tags (v1.0.0, v1.0, v1, latest)
4. Suporta multi-plataforma (amd64, arm64)

### Frontend - CI, Release, Docker

Funcionam da mesma forma que o backend, adaptados para aplicação estática.

---

## ❗ Troubleshooting

### Erro: "Resource not accessible by integration"

**Causa**: Falta de permissões no GitHub Actions

**Solução**:
1. Vá em `Settings` → `Actions` → `General`
2. Marque **Read and write permissions**
3. Salve e reexecute o workflow

### Erro: "docker login failed"

**Causa**: Secrets do Docker não configurados

**Solução**:
1. Verifique que `DOCKER_USERNAME` e `DOCKER_PASSWORD` estão em `Settings` → `Secrets`
2. Use Access Token do Docker Hub em vez da senha

### Erro: "ENONPMTOKEN No npm token specified"

**Causa**: Semantic Release tentando publicar no npm (este projeto não é um pacote npm)

**Solução**: ✅ **JÁ CORRIGIDO** - O `.releaserc.json` foi atualizado com `"npmPublish": false`

Se ainda encontrar este erro, verifique se o `.releaserc.json` contém:
```json
[
  "@semantic-release/npm",
  {
    "npmPublish": false
  }
]
```

### Erro: "No release published"

**Causa**: Nenhum commit elegível desde último release

**Solução**:
- Certifique-se de usar convenção: `feat:`, `fix:`, etc.
- Commits como `docs:`, `style:`, `chore:` não geram release

### Semantic Release não cria tag

**Causa**: Commits não seguem a convenção

**Solução**:
```bash
# ❌ Errado
git commit -m "adicionei nova funcionalidade"

# ✅ Correto
git commit -m "feat: adicionar nova funcionalidade"
```

### Docker build falha no CI

**Causa**: Dependências não instaladas ou build TypeScript falhou

**Solução**:
1. Teste localmente: `docker build -t teste .`
2. Verifique logs do CI
3. Certifique-se que `npm run build` funciona localmente

### Container backend reiniciando: "Error loading shared library libssl.so.1.1"

**Causa**: Prisma precisa do OpenSSL no Alpine Linux

**Solução**: ✅ **JÁ CORRIGIDO** - O `Dockerfile` foi atualizado com:
```dockerfile
# Instalar dependências necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat
```

### Container backend reiniciando: "tsconfig.json not found"

**Causa**: `.dockerignore` estava bloqueando o `tsconfig.json`

**Solução**: ✅ **JÁ CORRIGIDO** - Linha removida do `.dockerignore`

---

## 📚 Recursos Adicionais

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)

---

## ✅ Checklist de Configuração

### GitHub (para cada repositório)

- [ ] Permissões do Actions configuradas (Read/Write)
- [ ] Secrets do Docker configurados
- [ ] Branch protection configurada (opcional)
- [ ] Primeiro commit com convenção feat/fix feito

### Docker Hub

- [ ] Access Token criado
- [ ] Repositórios criados (backend e frontend)
- [ ] Token adicionado nos Secrets do GitHub

### Local

- [ ] Dependências instaladas (npm install)
- [ ] Docker testado localmente
- [ ] Commits seguindo convenção
- [ ] Push para GitHub realizado

---

## 🎉 Próximos Passos

1. **Instale as dependências**:
   ```bash
   cd user-management-backend && npm install
   cd ../user-management-frontend && npm install
   ```

2. **Configure os Secrets no GitHub** (instruções acima)

3. **Faça seu primeiro commit com convenção**:
   ```bash
   git add .
   git commit -m "feat: configurar CI/CD completo"
   git push origin main
   ```

4. **Acompanhe o workflow**:
   - Acesse a aba **Actions** no GitHub
   - Veja os workflows rodando em tempo real

5. **Após o release automático**:
   - Verifique a aba **Releases**
   - Veja o CHANGELOG.md atualizado
   - Confira as imagens no Docker Hub

---

**✨ Pronto! Seu projeto agora tem CI/CD profissional completo!**
