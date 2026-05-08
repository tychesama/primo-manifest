const photoInput = document.querySelector("#photoInput");
const form = document.querySelector("#manifestForm");
const characterSelect = document.querySelector("#characterSelect");
const wishName = document.querySelector("#wishName");
const ritualMood = document.querySelector("#ritualMood");
const canvas = document.querySelector("#portraitCanvas");
const ctx = canvas.getContext("2d");
const emptyState = document.querySelector("#emptyState");
const loadingState = document.querySelector("#loadingState");
const fortuneTitle = document.querySelector("#fortuneTitle");
const fortuneBody = document.querySelector("#fortuneBody");
const readingKicker = document.querySelector("#readingKicker");
const readingTitle = document.querySelector("#readingTitle");
const readingBody = document.querySelector("#readingBody");
const probabilityValue = document.querySelector("#probabilityValue");
const downloadButton = document.querySelector("#downloadButton");

const characters = {
  furina: {
    name: "Furina",
    element: "Hydro",
    colors: ["#4bd6ff", "#2447d8", "#ffffff"],
    charm: "Your aura is dramatic, sparkling, and absolutely ready for a five-star entrance.",
  },
  neuvillette: {
    name: "Neuvillette",
    element: "Hydro",
    colors: ["#8be9ff", "#2f3f93", "#d8f7ff"],
    charm: "The judgment of the stars is calm: your next ten-pull has serious main-character energy.",
  },
  nahida: {
    name: "Nahida",
    element: "Dendro",
    colors: ["#9dff86", "#2fb875", "#fff6b8"],
    charm: "Tiny leaf-shaped omens are circling your wish history with suspicious confidence.",
  },
  raiden: {
    name: "Raiden Shogun",
    element: "Electro",
    colors: ["#c387ff", "#6730c9", "#ffe1ff"],
    charm: "Electro sparks keep landing on the wish button. That is never an accident.",
  },
  zhongli: {
    name: "Zhongli",
    element: "Geo",
    colors: ["#ffd06d", "#9d642e", "#fff1c1"],
    charm: "A golden contract has formed. It strongly recommends saving one extra intertwined fate.",
  },
  kazuha: {
    name: "Kaedehara Kazuha",
    element: "Anemo",
    colors: ["#93ffd7", "#d65353", "#fff7de"],
    charm: "The wind has checked your pity count and whispered: keep going.",
  },
  hutao: {
    name: "Hu Tao",
    element: "Pyro",
    colors: ["#ff755d", "#5a1d2a", "#ffd29a"],
    charm: "A cheeky flame just winked. Your banner luck is feeling mischievous.",
  },
  wanderer: {
    name: "Wanderer",
    element: "Anemo",
    colors: ["#73e5ff", "#3a3392", "#f5ebff"],
    charm: "The sky is acting smug, which usually means a dramatic pull is loading.",
  },
};

const fortunes = [
  {
    title: "Wish fortune",
    body: "A bright pull is close. Choose your banner with calm hands and one confident tap.",
  },
  {
    title: "Lucky ritual",
    body: "Your best luck comes after a tiny pause. Breathe once, smile once, then wish.",
  },
  {
    title: "Starlight forecast",
    body: "The sky feels generous today. Your next wish has a little extra sparkle around it.",
  },
  {
    title: "Banner whisper",
    body: "Soft pity energy is gathering. Keep the vibes steady and the snacks nearby.",
  },
  {
    title: "Fortune ping",
    body: "A rare shimmer crossed your path. Manifest gently, then let the stars cook.",
  },
];

let uploadedImage = null;
let loadingTimer = null;

setFortune();

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) return;

  startLoading("Reading your wish light...");
  downloadButton.disabled = true;

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      uploadedImage = image;
      loadingTimer = window.setTimeout(() => {
        drawPortrait();
        stopLoading();
        downloadButton.disabled = false;
      }, 2200);
    };
    image.onerror = () => {
      stopLoading();
      readingKicker.textContent = "Upload failed";
      readingTitle.textContent = "That photo could not be read";
      readingBody.textContent = "Try a different PNG, JPG, or WEBP image.";
      downloadButton.disabled = true;
    };
    image.src = reader.result;
  };
  reader.onerror = () => {
    stopLoading();
    readingKicker.textContent = "Upload failed";
    readingTitle.textContent = "That photo could not be read";
    readingBody.textContent = "Try a different PNG, JPG, or WEBP image.";
    downloadButton.disabled = true;
  };
  reader.readAsDataURL(file);
});

characterSelect.addEventListener("change", () => {
  if (uploadedImage) drawPortrait();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const character = characters[characterSelect.value];
  const mood = ritualMood.value.trim() || "quietly lucky";
  const seed = `${wishName.value}-${mood}-${character.name}-${Date.now()}`;
  const probability = 42 + (hash(seed) % 57);
  const traveler = wishName.value.trim() || "Traveler";

  setFortune(seed);

  if (!uploadedImage) {
    readingKicker.textContent = `${character.element} attunement detected`;
    readingTitle.textContent = `${traveler}, ${character.name} is listening`;
    readingBody.textContent = `${character.charm} Your ritual mood is ${mood}. Upload a photo when you are ready to make the portrait.`;
    probabilityValue.textContent = `${probability}%`;
    downloadButton.disabled = true;
    return;
  }

  startLoading("Manifesting your portrait...");
  loadingTimer = window.setTimeout(() => {
    readingKicker.textContent = `${character.element} attunement detected`;
    readingTitle.textContent = `${traveler}, ${character.name} is listening`;
    readingBody.textContent = `${character.charm} Your ${mood} ritual says the best pull starts with one confident wish, one snack, and zero doom-scrolling before the banner.`;
    probabilityValue.textContent = `${probability}%`;
    drawPortrait();
    stopLoading();
    downloadButton.disabled = false;
  }, 1800);
});

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "primo-manifest-portrait.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

function drawPortrait() {
  const character = characters[characterSelect.value];
  emptyState.style.display = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(character);

  if (uploadedImage) {
    drawSoftPortrait(uploadedImage, character);
    drawReferenceDecor();
    drawMagicOverlay(character);
    drawCaption(character);
  }
}

function drawBackground(character) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#fff2f4");
  gradient.addColorStop(0.58, "#fffdf6");
  gradient.addColorStop(1, "#effaf3");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 214, 220, 0.34)";
  ctx.fillRect(0, 0, 30, canvas.height);
  ctx.fillRect(canvas.width - 30, 0, 30, canvas.height);
  ctx.fillRect(0, 0, canvas.width, 30);
  ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

  ctx.strokeStyle = "rgba(219, 99, 112, 0.55)";
  ctx.lineWidth = 5;
  roundedStroke(34, 34, canvas.width - 68, canvas.height - 68, 12);
  ctx.lineWidth = 2;
  roundedStroke(50, 50, canvas.width - 100, canvas.height - 100, 8);

  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 24; i += 1) {
    const x = (hash(`${character.name}-${i}`) % canvas.width);
    const y = (hash(`${i}-${character.element}`) % canvas.height);
    const size = 12 + (hash(`${i}-wash`) % 28);
    ctx.fillStyle = i % 2 === 0 ? "#f08b98" : "#f1b866";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

}

function drawSoftPortrait(image, character) {
  const frameW = 792;
  const frameH = 1120;
  const frameX = 54;
  const frameY = 64;
  const zoom = 1.2;
  const scale = Math.max(frameW / image.width, frameH / image.height) * zoom;
  const sourceW = frameW / scale;
  const sourceH = frameH / scale;
  const sourceX = (image.width - sourceW) / 2;
  const sourceY = Math.max(0, (image.height - sourceH) * 0.34);

  ctx.save();
  roundedClip(frameX, frameY, frameW, frameH, 42);
  ctx.fillStyle = "rgba(255, 253, 246, 0.82)";
  ctx.fillRect(frameX, frameY, frameW, frameH);
  ctx.filter = "saturate(1.04) contrast(1.02) brightness(1.03)";
  ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, frameX, frameY, frameW, frameH);
  ctx.filter = "none";
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = character.colors[0];
  ctx.globalAlpha = 0.12;
  ctx.fillRect(frameX, frameY, frameW, frameH);
  ctx.restore();

  ctx.strokeStyle = "rgba(219, 99, 112, 0.16)";
  ctx.lineWidth = 3;
  roundedStroke(frameX + 10, frameY + 10, frameW - 20, frameH - 20, 34);

  ctx.strokeStyle = "rgba(219, 99, 112, 0.42)";
  ctx.lineWidth = 6;
  roundedStroke(frameX, frameY, frameW, frameH, 42);
}

function drawMagicOverlay(character) {
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = "#f1b866";
  for (let i = 0; i < 8; i += 1) {
    drawDiamond(124 + i * 92, 132 + (i % 2) * 30, 8 + (i % 3) * 3);
  }
  ctx.fillStyle = character.colors[0];
  drawDiamond(104, 1110, 10);
  drawDiamond(790, 178, 10);
  ctx.globalAlpha = 1;
}

function drawCaption(character) {
  const labelX = 112;
  const labelY = 988;
  const labelW = 676;
  const labelH = 112;

  ctx.save();
  ctx.shadowColor = "rgba(128, 50, 74, 0.2)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "rgba(255, 253, 246, 0.84)";
  roundedRect(labelX, labelY, labelW, labelH, 26);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(219, 99, 112, 0.36)";
  ctx.lineWidth = 3;
  roundedStroke(labelX, labelY, labelW, labelH, 26);
  ctx.fillStyle = "#d95767";
  ctx.font = "900 34px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Manifesting ${character.name}`, 450, labelY + 43);
  ctx.fillStyle = "rgba(143, 101, 112, 0.9)";
  ctx.font = "800 24px Inter, sans-serif";
  ctx.fillText(`${character.element} fortune`, 450, labelY + 78);
  drawCanvasGem(742, labelY + 78, 24);
}

function drawReferenceDecor() {
  drawFlower(86, 74, 1.2, -0.3);
  drawFlower(166, 90, 0.86, 0.48);
  drawFlower(784, 82, 0.9, -0.34);
  drawFlower(836, 142, 0.72, 0.62);
  drawFlower(102, 1124, 0.78, 0.18);

  drawStem(110, 132, 66, 58, -0.8);
  drawStem(790, 140, 64, 74, 0.9);
  drawStem(240, 1190, 72, 46, -0.28);
  drawStem(688, 1202, 80, 54, 0.42);

  drawLeaf(665, 44, 34, 18, "#7bb5a1", -0.24);
  drawLeaf(718, 34, 42, 20, "#7bb5a1", 0.34);
  drawLeaf(758, 1216, 38, 18, "#7bb5a1", -0.44);
  drawLeaf(88, 1194, 34, 16, "#f1b866", 0.52);
}

function drawFlower(x, y, scale, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 189, 201, 0.72)";
  ctx.strokeStyle = "rgba(219, 99, 112, 0.82)";
  ctx.lineWidth = 3;

  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -26, 18, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "rgba(255, 239, 210, 0.95)";
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawStem(x, y, width, height, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = "rgba(184, 96, 57, 0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(width * 0.35, height * 0.35, width, height);
  ctx.stroke();

  drawLeaf(width * 0.38, height * 0.28, 28, 12, "#d58f57", -0.6);
  drawLeaf(width * 0.68, height * 0.58, 24, 10, "#d58f57", 0.72);
  ctx.restore();
}

function drawLeaf(x, y, width, height, color, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCanvasGem(x, y, size) {
  const gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
  gradient.addColorStop(0, "#86d8de");
  gradient.addColorStop(0.52, "#ffd166");
  gradient.addColorStop(1, "#f48aa3");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.88, y - size * 0.28);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.88, y - size * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(219, 99, 112, 0.5)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawDiamond(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
}

function roundedClip(x, y, width, height, radius) {
  roundedPath(x, y, width, height, radius);
  ctx.clip();
}

function roundedStroke(x, y, width, height, radius) {
  roundedPath(x, y, width, height, radius);
  ctx.stroke();
}

function roundedRect(x, y, width, height, radius) {
  roundedPath(x, y, width, height, radius);
}

function roundedPath(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function hash(value) {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) {
    total = (total << 5) - total + value.charCodeAt(i);
    total |= 0;
  }
  return Math.abs(total);
}

function startLoading(message) {
  window.clearTimeout(loadingTimer);
  emptyState.style.display = "none";
  loadingState.hidden = false;
  loadingState.querySelector("p").textContent = message;
}

function stopLoading() {
  loadingState.hidden = true;
}

function setFortune(seed = new Date().toDateString()) {
  const fortune = fortunes[hash(seed) % fortunes.length];
  fortuneTitle.textContent = fortune.title;
  fortuneBody.textContent = fortune.body;
}
