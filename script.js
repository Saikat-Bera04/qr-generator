let logoImage = null;
let currentPattern = "square";

const qrCode = new QRCodeStyling({
  width: 240,
  height: 240,
  data: "https://example.com",
  margin: 10,
  dotsOptions: { type: "square", color: "#000" },
  backgroundOptions: { color: "#fff" },
  imageOptions: { margin: 6 }
});

qrCode.append(document.getElementById("qr-container"));

function setPattern(type) {
  currentPattern = type;
  generateQR();
}

function applyFrame(frame) {
  const frameEl = document.getElementById("qr-frame");
  frameEl.className = "";
  frameEl.classList.add(`frame-${frame}`);
}

/* Color palettes */
document.querySelectorAll(".palette").forEach(p => {
  p.style.background = `linear-gradient(45deg, ${p.dataset.fg}, ${p.dataset.bg})`;
  p.onclick = () => {
    qrCode.update({
      dotsOptions: { color: p.dataset.fg, type: currentPattern },
      backgroundOptions: { color: p.dataset.bg }
    });
  };
});

/* Drag & drop */
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("logoUpload");

dropZone.onclick = () => fileInput.click();
dropZone.ondragover = e => e.preventDefault();
dropZone.ondrop = e => {
  e.preventDefault();
  loadLogo(e.dataTransfer.files[0]);
};
fileInput.onchange = e => loadLogo(e.target.files[0]);

function loadLogo(file) {
  const reader = new FileReader();
  reader.onload = () => logoImage = reader.result;
  reader.readAsDataURL(file);
}

function generateQR() {
  qrCode.update({
    data: document.getElementById("qrText").value || " ",
    margin: +document.getElementById("margin").value,
    dotsOptions: {
      type: currentPattern,
      scale: document.getElementById("dotScale").value / 100
    },
    image: logoImage
  });
}

function downloadQR() {
  qrCode.download({ name: "glassqr", extension: "png" });
}
