import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

// Configuração do Redis (pode usar um serviço como Redis Cloud ou Upstash)
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Configuração do pool do PostgreSQL (use sua configuração existente)
const pool = new Pool({
  connectionString: "postgresql://streamon_owner:npg_6qENmtywph1f@ep-dark-bread-aclxi3lb-pooler.sa-east-1.aws.neon.tech/streamon?sslmode=require",
});

// Criar a fila
export const songQueue = new Queue('songQueue', { connection });

// Worker para processar as tarefas
export const songWorker = new Worker('songQueue', async job => {
  const { url, userId, downloadsDir } = job.data;
  
  try {
    const cleaned = url.split("&")[0];
    const info = await ytdl.getInfo(cleaned);
    const title = info.videoDetails.title;
    const artist = info.videoDetails.author.name;
    const cover = info.videoDetails.thumbnails[0]?.url || "";

    // Gera um nome de arquivo seguro
    const safeTitle = title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
    const fileName = `${safeTitle}_${Date.now()}.mp3`;
    const filePath = path.join(downloadsDir, fileName);

    // Faz o download e converte para MP3
    const audioStream = ytdl(cleaned, { quality: "lowestaudio" });
    
    await new Promise((resolve, reject) => {
      ffmpeg(audioStream)
        .audioBitrate(96)
        .save(filePath)
        .on('end', resolve)
        .on('error', reject);
    });

    // Insere no banco de dados
    const result = await pool.query(
      "INSERT INTO songs (user_id, title, artist, cover, url, file_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, title, artist, cover, cleaned, fileName]
    );

    return { success: true, song: result.rows[0] };
  } catch (error) {
    console.error('Error processing song:', error);
    throw error;
  }
}, { connection });

// Lidar com eventos do worker
songWorker.on('completed', job => {
  console.log(`Job ${job.id} completed - song added`);
});

songWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});