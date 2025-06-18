# 🎵 StreamOn Play - Sua Biblioteca de Músicas na Nuvem

**StreamOn Play** é uma plataforma de música online moderna, responsiva e divertida. Com ele, você pode montar sua própria coleção de músicas, adicionando links do YouTube, organizando por capa, título e artista, e reproduzindo suas faixas favoritas em um reprodutor de tela cheia.

![StreamOn Play Banner](./assets/banner.png)

## 🔧 Tecnologias Utilizadas

- **Vue 3 (Composition API)**
- **Vuetify 3 (Material Design UI)**
- **Node.js & Express (API Backend)**
- **Autenticação JWT**
- **YouTube Embed API**
- **CSS Flip Card Animations**

## 🚀 Funcionalidades

- 🎵 **Adicione músicas por URL do YouTube**
- 🔍 **Busca instantânea por artista ou título**
- 🎮 **Animação Flip Card interativa (hover sob a imagem)**
- ▶️ **Player Fullscreen imersivo**
- 🔐 **Sistema de login e autenticação JWT**
- 📱 **Totalmente responsivo (desktop e mobile)**
- 📃 **Gerenciamento de biblioteca pessoal privada**

## 🔧 Como Rodar o Projeto Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/streamon-play.git
cd streamon-play
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o frontend

```bash
npm run dev
```

### 4. Certifique-se de iniciar o backend separadamente

- O backend deve rodar em `http://localhost:3001`
- Configure suas variáveis de ambiente para o backend (`.env`)

## 🔹 Backend (API REST)

- Autenticação JWT
- Endpoints:

  - `POST /api/login`
  - `GET /api/songs/public`
  - `GET /api/songs` (privado)
  - `POST /api/songs` (privado)
  - `GET /api/users`

## 🌟 Roadmap Futuro

- Playlists personalizadas
- Compartilhamento de coleções com amigos
- Integração com Spotify API
- Modo escuro personalizável
- Integração de letras sincronizadas

## 🔝 Contribuições

Sinta-se à vontade para abrir _issues_, enviar _pull requests_ ou sugerir melhorias!

## 🙋‍♂️ Autor

Dono - BackEnd [George](https://github.com/Georgelxll)  
Colaborador - FrontEnd [Luiz Pedro](https://github.com/luuizpeedro)

## 🏆 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
