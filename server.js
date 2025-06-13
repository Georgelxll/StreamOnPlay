import express from "express";
import cors from "cors"; // <--- Importação do cors
import fs from "fs";
import path from "path";
import ytdl from "@distube/ytdl-core";

const __dirname = path.resolve();
const downloadsDir = path.join(__dirname, "downloads");

// Garantir que o diretório de downloads existe
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const app = express();
const port = 3001;

// Ativando o CORS
app.use(cors()); // <--- Aqui ele permite requisições do frontend
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { title, artist, url } = req.body;

  if (!title || !artist || !url) {
    return res
      .status(400)
      .json({ error: "Título, artista e URL são obrigatórios!" });
  }

  const cleanedUrl = url.split("?")[0];

  console.log(`URL recebida: ${url}`);
  console.log(`URL limpa: ${cleanedUrl}`);

  try {
    const info = await ytdl.getInfo(cleanedUrl);

    if (!info || !info.videoDetails) {
      return res.status(404).json({ error: "Vídeo não encontrado!" });
    }

    console.log("Informações do vídeo:", info);

    const videoStream = ytdl(cleanedUrl, { quality: "highestaudio" });

    // Criar nome de arquivo seguro (remover caracteres inválidos)
    const safeTitle = title.replace(/[<>:"/\\|?*]/g, "");
    const safeArtist = artist.replace(/[<>:"/\\|?*]/g, "");
    const fileName = `${safeTitle}-${safeArtist}.mp4`;
    const downloadPath = path.join(downloadsDir, fileName);

    const writeStream = fs.createWriteStream(downloadPath);
    videoStream.pipe(writeStream);

    writeStream.on("finish", () => {
      res.json({ success: true, cover: info.videoDetails.thumbnails[0].url });
    });

    writeStream.on("error", (err) => {
      console.error("Erro ao salvar o arquivo", err);
      res
        .status(500)
        .json({ error: `Erro ao salvar a música: ${err.message}` });
    });
  } catch (err) {
    console.error("Erro ao processar o download:", err);
    res
      .status(500)
      .json({ error: `Erro ao processar a música: ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
