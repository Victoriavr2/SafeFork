# 🛡️ SafeFork PWA

Aplicativo mobile PWA para facilitar a alimentação segura e prazerosa para pessoas com alergias alimentares.

## 🎨 Identidade Visual

- **Cores**: `#e07a5f` (Pimentão Vibrante), `#d4e09b` (Abacate Amigo), `#364329` (Rabanete Limpo), `#3d405b` (Grão Seguro), `#f4f1de` (Laranja Vital)
- **Fontes**: Playfair Display (títulos/logo), Poppins (textos)
- **Foco**: Zona do Polegar (Thumb Zone) — navegação inferior, botões grandes, touch-friendly

## ✨ Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| 🔐 Login e Conta | Cadastro, login, perfil editável, bio, privacidade |
| ⚠️ Alergias | Cadastro de alergias, tags de risco, filtros automáticos |
| 🔍 Busca | Busca por nome, filtro por alergias, tempo de preparo, categorias |
| 🍽️ Receitas | Feed, detalhes, ingredientes com checkbox, modo de preparo passo a passo |
| 💬 Interação | Curtidas, comentários, compartilhamento |
| 👥 Social | Seguir usuários, comunidade, descoberta |
| 🛒 Compras | Lista de compras, exportar TXT, adicionar por receita |
| 📝 Publicar | Cadastrar novas receitas com categorias e ingredientes |
| ⚙️ Configurações | Modo escuro, fonte grande, leitor de tela, exportar dados, privacidade |
| 🔔 Notificações | Alertas de interação e segurança alimentar |

## 🚀 Deploy no Vercel

### Opção 1: Deploy via CLI

```bash
# Instale o Vercel CLI
npm i -g vercel

# No diretório do projeto
vercel

# Siga as instruções e pronto!
```

### Opção 2: Deploy via Git

1. Crie um repositório no GitHub
2. Envie estes arquivos:
```bash
git init
git add .
git commit -m "SafeFork PWA initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/safefork.git
git push -u origin main
```
3. No [Vercel](https://vercel.com), importe o repositório
4. Framework Preset: **Other**
5. Deploy!

### Opção 3: Deploy Manual (Drag & Drop)

1. Acesse [vercel.com](https://vercel.com)
2. Arraste esta pasta inteira para a dashboard
3. Pronto! O Vercel fará o deploy automaticamente

## 📱 Instalação no Celular

1. Acesse a URL do deploy no navegador do celular
2. Toque em **"Adicionar à Tela Inicial"**
3. O app funcionará como um app nativo (standalone)

## 🗂️ Estrutura

```
safefork-pwa/
├── index.html          # App shell (SPA)
├── manifest.json       # Configuração PWA
├── service-worker.js   # Cache offline
├── css/
│   └── styles.css      # Estilos mobile-first
├── js/
│   └── app.js          # Lógica principal
└── assets/
    └── icons/          # Ícones PWA (72x72 a 512x512)
```

## 👤 Dados de Teste

- **E-mail**: `usuario@safefork.com`
- **Senha**: `123456`

Ou crie uma nova conta — todos os dados são salvos no `localStorage` do navegador.

## ♿ Acessibilidade

- Navegação otimizada para **Zona do Polegar**
- Botões mínimo **52px** de altura
- Contraste adequado para leitura
- Suporte a **leitor de tela**
- **Modo escuro** para conforto visual
- Fonte aumentada disponível

---

Desenvolvido com 💚 para inclusão alimentar.


## 🔑 Login com Google (Firebase Authentication)

O botão **Entrar com Google** utiliza Firebase Authentication com o provedor Google. Para habilitá-lo no seu projeto:

1. No [Firebase Console](https://console.firebase.google.com/), abra o projeto `safefork-e59b2`.
2. Vá em **Authentication → Sign-in method** e habilite **Google**.
3. Em **Authentication → Settings → Authorized domains**, adicione o domínio de produção do Vercel (por exemplo, `seu-projeto.vercel.app`) e também `localhost` para testes locais.
4. Publique os arquivos atualizados no Vercel e teste o botão em HTTPS.

A configuração web do Firebase usada pelo site está no `index.html`. A chave `apiKey` de configuração web é identificadora do projeto; a segurança deve ser aplicada pelas regras e configurações dos serviços Firebase.

**Importante:** esta alteração autentica a identidade do usuário pelo Google/Firebase, mas não migra receitas, comentários, alergias ou demais dados do `localStorage` para a nuvem. Esses dados continuam armazenados localmente no navegador/dispositivo, como na versão original.
