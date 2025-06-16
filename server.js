import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import ytdl from "@distube/ytdl-core";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";

const { Pool } = pkg;

// Conexão com o banco de dados
const pool = new Pool({
  connectionString:
    "postgresql://streamon_owner:npg_6qENmtywph1f@ep-dark-bread-aclxi3lb-pooler.sa-east-1.aws.neon.tech/streamon?sslmode=require",
});

const __dirname = path.resolve();
const downloadsDir = path.join(__dirname, "downloads");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const app = express();
const port = 3001;

// Ativando o CORS
app.use(cors()); // permitirá requests de qualquer lugar
app.use(express.json());

// Segredo para o JWT
const JWT_SECRET = "segredo_superseguro";

// Middleware para autenticar o usuário pelo JWT
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido!" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Não autorizado!" });
  }
}

// Rotas de autenticação
app.post("/api/Register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !email || !password) {
    return res
      .status(400)
      .json({ error: "Informe o first name, e-mail e a senha" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
      [firstName, email, hashed]
    );
    res.json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar o usuário" });
  }
});

// Login
app.post("/api/Login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Informe o e-mail e a senha" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 LIMIT 1",
      [email]
    );

    if (result.rowCount === 0)
      return res.status(400).json({ error: "Usuário não encontrado" });

    // verifica a senha
    const match = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!match) return res.status(400).json({ error: "Senha incorreta" });

    // Gera o JWT junto com o nome
    const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, name: result.rows[0].name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

// Adicionar nova música (protected)
app.post("/api/songs", autenticarJWT, async (req, res) => {
  const { url } = req.body;
  console.log("URL recebida:", url); // Log adicional

  if (!url) {
    return res.status(400).json({ error: "Informe o link do YouTube" });
  }

  try {
    // Limpa a URL removendo parâmetros desnecessários
    const cleaned = url.split('&')[0]; // Pega apenas até o primeiro &
    console.log("URL limpa:", cleaned); // Log da URL processada

    const info = await ytdl.getInfo(cleaned);
    console.log("Info do vídeo:", { // Log das informações
      title: info.videoDetails.title,
      artist: info.videoDetails.author.name,
      thumbnails: info.videoDetails.thumbnails.length
    });

    const title = info.videoDetails.title;
    const artist = info.videoDetails.author.name;
    const cover = info.videoDetails.thumbnails[0]?.url || '';

    // Log antes da inserção no banco
    console.log("Inserindo no banco:", { 
      user_id: req.user.id,
      title,
      artist,
      cover,
      url: cleaned
    });

    const result = await pool.query(
      "INSERT INTO songs (user_id, title, artist, cover, url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [req.user.id, title, artist, cover, cleaned]
    );
    
    console.log("Inserção bem-sucedida:", result.rows[0]);
    res.json({ message: "Música criada!", ...result.rows[0] });

  } catch (err) {
    console.error("ERRO COMPLETO:", err); // Log detalhado
    res.status(500).json({ 
      error: "Erro ao processar",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Listar as músicas do usuário
app.get("/api/songs", autenticarJWT, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs WHERE user_id=$1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter as músicas" });
  }
});

// Listar TODAS as músicas (público)
app.get("/api/songs/public", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM songs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter as músicas" });
  }
});

// Executar o servidor
app.listen(port, () => {
  console.log(`Server iniciado na porta ${port}. http://localhost:${port}`);
});
