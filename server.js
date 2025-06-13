import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import ytdl from "@distube/ytdl-core";

const __dirname = path.resolve();
const downloadsDir = path.join(__dirname, "downloads");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const app = express();
const port = 3001;

// Ativando o CORS
app.use(cors()); // Isso permitirá que o frontend acesse o backend
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL é obrigatória!" });
  }

  try {
    // Extraindo o parâmetro v se ele existe
    const urlObject = new URL(url);
    const videoId = urlObject.searchParams.get("v");

    const cleanedUrl = videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : url.split("?")[0 ];

    console.log(`URL recebida: ${url}`);
    console.log(`URL limpa: ${cleanedUrl}`);

    // Pegando info do vídeo
    const info = await ytdl.getInfo(cleanedUrl);

    if (!info || !info.videoDetails) {
      return res.status(404).json({ error: "Vídeo não encontrado!" });
    }

    console.log("Informações do vídeo.", info);

    const video = info.videoDetails;

    // Extraindo nome e artista automaticamente
    let [artist, title] = video.title.split(" - ");
    if (!title) {
      title = video.title.trim();
      artist = video.author.name.trim();
    } else {
      title = title.trim();
      artist = artist.trim();
    }

    // Baixando o vídeo (áudio)
    const videoStream = ytdl(cleanedUrl, { quality: "highestaudio" });

    // Criar nome de arquivo seguro
    const safeTitle = title.replace(/[<>:"/\\|?*]/g, "");
    const safeArtist = artist.replace(/[<>:"/\\|?*]/g, "");
    const fileName = `${safeTitle}-${safeArtist}.mp4`;
    const downloadPath = path.join(downloadsDir, fileName);

    const writeStream = fs.createWriteStream(downloadPath);
    videoStream.pipe(writeStream);

    writeStream.on("finish", () => {
      res.json({ 
        success: true, 
        cover: video.thumbnails[0].url,
        title,
        artist
      });
    });

    writeStream.on("error", (err) => {
      console.error("Erro ao salvar o arquivo.", err);
      res
        .status(500)
        .json({ error: `Erro ao salvar a música: ${err.message}` });
    });
  } catch (err) {
    console.error("Erro ao processar o download.", err);
    res
      .status(500)
      .json({ error: `Erro ao processar a música: ${err.message}` });
  }
});

// Iniciando o server
app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
