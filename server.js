import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import ytdl from "@distube/ytdl-core";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { songQueue } from './queue.js';

// Configurar o caminho do ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

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

    const match = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!match) return res.status(400).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      name: result.rows[0].name,
      id: result.rows[0].id,
      permission: result.rows[0].permission, // ✅ Retorne aqui
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

// Adicionar nova música (protected)
app.post("/api/songs", autenticarJWT, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Informe o link do YouTube" });
  }

  try {
    const cleaned = url.split("&")[0];
    const info = await ytdl.getInfo(cleaned);
    const title = info.videoDetails.title;

    // Verifica se a música já existe
    const consult = await pool.query(
      "SELECT title FROM songs WHERE title = $1 AND user_id = $2",
      [title, req.user.id]
    );

    if (consult.rows.length > 0) {
      return res.status(400).json({ error: "Música já adicionada." });
    }

    // Adiciona o job na fila
    const job = await songQueue.add('processSong', {
      url: cleaned,
      userId: req.user.id,
      downloadsDir: downloadsDir
    });

    // Retorna imediatamente enquanto o processamento ocorre em background
    res.json({ 
      message: "Sua música está sendo processada em segundo plano",
      jobId: job.id,
      title: title
    });

  } catch (err) {
    res.status(500).json({
      error: "Erro ao processar",
      details: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
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

app.get("/api/songs/status/:jobId", autenticarJWT, async (req, res) => {
  try {
    const job = await songQueue.getJob(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: "Job não encontrado" });
    }

    const state = await job.getState();
    const progress = job.progress;
    
    res.json({
      state,
      progress,
      result: job.returnvalue,
      failedReason: job.failedReason
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar status" });
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

app.get("/api/users/:id/songs", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID do usuário inválido" });
    }

    // Verifica se o usuário existe
    const userExists = await pool.query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const result = await pool.query(
      `SELECT songs.*, users.name AS user_name
       FROM songs
       JOIN users ON songs.user_id = users.id
       WHERE songs.user_id=$1
       ORDER BY songs.id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter músicas do usuário:", err);
    res.status(500).json({ error: "Erro ao obter músicas do usuário" });
  }
});

// GET /api/admin/songs
app.get("/api/admin/songs", autenticarJWT, async (req, res) => {
  if (!req.user?.id) return res.status(403).json({ error: "Sem permissão" });

  const result = await pool.query(
    "SELECT permission FROM users WHERE id = $1",
    [req.user.id]
  );
  if (result.rows[0]?.permission !== true) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const songs = await pool.query(`
      SELECT s.id, s.title, s.artist, s.cover, s.url, s.file_path, s.created_at,
             u.name AS added_by
      FROM songs s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    res.json(songs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar músicas" });
  }
});

app.get("/api/admin/downloads", autenticarJWT, async (req, res) => {
  // (opcional) checar permissão de admin aqui
  fs.readdir(downloadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Erro ao ler a pasta" });
    res.json(files);
  });
});

app.delete(
  "/api/admin/downloads/:filename",
  autenticarJWT,
  async (req, res) => {
    // (opcional) checar permissão de admin aqui também
    const filePath = path.join(downloadsDir, req.params.filename);
    fs.unlink(filePath, (err) => {
      if (err)
        return res.status(500).json({ error: "Erro ao excluir arquivo" });
      res.json({ message: "Arquivo excluído com sucesso" });
    });
  }
);

// Executar o servidor
app.listen(port, () => {
  console.log(`Server iniciado na porta ${port}. http://localhost:${port}`);
});

// Lista todos os usuários (endpoint necessário para o frontend)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});
