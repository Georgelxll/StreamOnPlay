<template>
  <v-app>
    <!-- Fundo animado -->
    <div class="animated-bg">
      <!-- SVG animado copiado diretamente -->
      <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          <circle id="dot" r="1.5" fill="#00ff88" filter="url(#glow)" />
        </defs>

        <g>
          <use href="#dot" x="200" y="150" />
          <use href="#dot" x="600" y="300" />
          <use href="#dot" x="1200" y="200" />
          <use href="#dot" x="1600" y="500" />
          <use href="#dot" x="300" y="600" />
          <use href="#dot" x="800" y="700" />
          <use href="#dot" x="1500" y="900" />
          <use href="#dot" x="1000" y="450" />
          <use href="#dot" x="400" y="250" />
          <use href="#dot" x="1800" y="800" />
          <use href="#dot" x="100" y="950" />
          <use href="#dot" x="1700" y="300" />
        </g>

        <g id="wave-up" fill="#00ff88" filter="url(#glow)"></g>
        <g id="wave-down" fill="#00ff88" filter="url(#blur)" opacity="0.3"></g>
      </svg>
    </div>

    <v-main class="promo-screen pt-16">
      <v-container class="py-12">
        <h1 class="bot-title">{{ $t("botPromo.title") }}</h1>
        <p class="bot-description">
          {{ $t("botPromo.description") }}
        </p>

        <div class="cta-wrapper mt-6 mb-12">
          <v-btn color="green-accent-4" class="cta-button" size="large">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1385051788691898478"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none; color: black"
              >{{ $t("botPromo.addButton") }}</a
            >
          </v-btn>
        </div>

        <v-row class="features" justify="center" dense>
          <v-col cols="12" sm="6" md="4">
            <v-card class="feature-card" elevation="4" rounded>
              <v-card-text class="text-center">
                <v-icon size="36" color="green-accent-4">mdi-music</v-icon>
                <h3 class="feature-title">
                  {{ $t("botPromo.features.music.title") }}
                </h3>
                <p class="feature-description">
                  {{ $t("botPromo.features.music.description") }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card class="feature-card" elevation="4" rounded>
              <v-card-text class="text-center">
                <v-icon size="36" color="green-accent-4"
                  >mdi-shield-check</v-icon
                >
                <h3 class="feature-title">
                  {{ $t("botPromo.features.moderation.title") }}
                </h3>
                <p class="feature-description">
                  {{ $t("botPromo.features.moderation.description") }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card class="feature-card" elevation="4" rounded>
              <v-card-text class="text-center">
                <v-icon size="36" color="green-accent-4"
                  >mdi-controller-classic</v-icon
                >
                <h3 class="feature-title">
                  {{ $t("botPromo.features.fun.title") }}
                </h3>
                <p class="feature-description">
                  {{ $t("botPromo.features.fun.description") }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const svg = document.querySelector(".animated-bg svg");
  const upWave = svg.getElementById("wave-up");
  const downWave = svg.getElementById("wave-down");

  const total = 96;
  const spacing = 20;
  const barWidth = 10;
  const centerX = 960;
  const centerY = 540;

  for (let i = 0; i < total; i++) {
    const offset = (i - total / 2) * spacing;
    const x = centerX + offset;

    const up = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    up.setAttribute("x", x);
    up.setAttribute("y", centerY);
    up.setAttribute("width", barWidth);
    up.setAttribute("height", 0);

    const animHeight = "0;200;80;150;0";
    const dur = `${1 + Math.random()}s`;
    const delay = `${Math.abs(i - total / 2) * 0.03}s`;

    const animUpHeight = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animUpHeight.setAttribute("attributeName", "height");
    animUpHeight.setAttribute("values", animHeight);
    animUpHeight.setAttribute("dur", dur);
    animUpHeight.setAttribute("repeatCount", "indefinite");
    animUpHeight.setAttribute("begin", delay);
    up.appendChild(animUpHeight);

    const animUpY = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animUpY.setAttribute("attributeName", "y");
    animUpY.setAttribute(
      "values",
      `${centerY};${centerY - 200};${centerY - 80};${centerY - 150};${centerY}`
    );
    animUpY.setAttribute("dur", dur);
    animUpY.setAttribute("repeatCount", "indefinite");
    animUpY.setAttribute("begin", delay);
    up.appendChild(animUpY);

    upWave.appendChild(up);

    const down = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    down.setAttribute("x", x);
    down.setAttribute("y", centerY);
    down.setAttribute("width", barWidth);
    down.setAttribute("height", 0);

    const animDown = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animDown.setAttribute("attributeName", "height");
    animDown.setAttribute("values", animHeight);
    animDown.setAttribute("dur", dur);
    animDown.setAttribute("repeatCount", "indefinite");
    animDown.setAttribute("begin", delay);
    down.appendChild(animDown);

    downWave.appendChild(down);
  }
});
const onDiscordClick = () => {
  window.open(
    "https://discord.com/oauth2/authorize?client_id=SEU_ID",
    "_blank"
  );
};
</script>

<style scoped>
.discord-icon {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10;
}

.discord-icon img {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 0 6px #00ff88aa);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.discord-icon img:hover {
  transform: scale(1.1);
}

.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background-color: black;
}

.promo-screen {
  position: relative;
  z-index: 1;
  color: #cceeff;
  min-height: 100vh;
  background-color: transparent;
}

.bot-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #00ff88;
  text-align: center;
  text-shadow: 0 0 12px #00ff88aa;
}

.bot-description {
  text-align: center;
  font-size: 1.25rem;
  color: #cceeff;
  max-width: 700px;
  margin: 0 auto;
  margin-top: 16px;
  text-shadow: 0 0 4px #00ff8855;
}

.cta-wrapper {
  text-align: center;
}

.cta-button {
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 24px;
  color: black !important;
  background-color: #00ff88 !important;
  box-shadow: 0 0 12px #00ff88aa;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #00ffaa !important;
  box-shadow: 0 0 20px #00ff88cc;
}

.feature-card {
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid #00ff88aa;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: 0.3s ease;
  padding: 20px;
  box-shadow: 0 0 10px #00ff8844;
}

.feature-card:hover {
  box-shadow: 0 0 24px #00ff88aa;
  transform: scale(1.02);
}

.feature-title {
  margin-top: 12px;
  font-size: 1.3rem;
  color: #cceeff;
  font-weight: bold;
}

.feature-description {
  font-size: 1rem;
  color: #aaddff;
  margin-top: 10px;
  line-height: 1.4;
}

/* MEDIA QUERY PARA TABLETS E CELULARES */
@media (max-width: 768px) {
  .discord-icon {
    top: 60px;
    right: 10px;
  }

  .discord-icon img {
    width: 40px;
    height: 40px;
  }

  .bot-title {
    font-size: 2.4rem;
    padding: 0 16px;
  }

  .bot-description {
    font-size: 1rem;
    padding: 0 16px;
  }

  .cta-button {
    font-size: 0.95rem;
    padding: 10px 20px;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-description {
    font-size: 0.95rem;
  }

  .feature-card {
    margin-bottom: 20px;
  }

  .v-container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Fundo animado adaptado para mobile */
  .animated-bg {
    position: absolute !important;
    top: 0;
    left: 0;
    height: 300px;
    width: 100%;
    background-color: black;
    overflow: hidden;
    z-index: 0;
  }

  .animated-bg svg {
    transform: scale(1.4) translateY(-40px);
    transform-origin: top center;
    width: 100%;
    height: auto;
  }

  /* Fundo da tela com pontinhos neon */
  .promo-screen {
    background-color: black;
    background-image: radial-gradient(#00ff88 1px, transparent 1px);
    background-size: 22px 22px;
    background-position: center top 300px;
  }
}

/* TELAS PEQUENAS (CELULARES PEQUENOS) */
@media (max-width: 480px) {
  .bot-title {
    font-size: 2rem;
  }

  .bot-description {
    font-size: 0.9rem;
  }

  .cta-button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-description {
    font-size: 0.9rem;
  }

  .discord-icon {
    top: 50px;
    right: 8px;
  }

  .discord-icon img {
    width: 36px;
    height: 36px;
  }
}
</style>
