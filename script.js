let logoImage = null;
let currentPattern = "square";
let fgColor = "#000000";
let bgColor = "#ffffff";

const qrCode = new QRCodeStyling({
  width: 240,
  height: 240,
  data: "",
  margin: 10,
  dotsOptions: { type: "square", color: fgColor },
  backgroundOptions: { color: bgColor },
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

/* Manual color pickers */
document.getElementById("manualFg").oninput = e => {
  fgColor = e.target.value;
  generateQR();
};

document.getElementById("manualBg").oninput = e => {
  bgColor = e.target.value;
  generateQR();
};

/* Palette click */
document.querySelectorAll(".palette").forEach(p => {
  p.style.background = `linear-gradient(45deg, ${p.dataset.fg}, ${p.dataset.bg})`;
  p.onclick = () => {
    fgColor = p.dataset.fg;
    bgColor = p.dataset.bg;
    generateQR();
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
      color: fgColor,
      scale: document.getElementById("dotScale").value / 100
    },
    backgroundOptions: {
      color: bgColor
    },
    image: logoImage
  });
}

function downloadQR() {
  qrCode.download({ name: "qrystal", extension: "png" });
}
function loadLogo(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = () => {
    logoImage = reader.result;

    const preview = document.getElementById("logo-preview");
    const status = document.getElementById("upload-status");
    const text = document.getElementById("upload-text");

    preview.src = logoImage;
    preview.style.display = "block";
    status.style.display = "block";
    status.textContent = "✔ Logo uploaded successfully";
    text.style.display = "none";

    generateQR();
  };
  reader.readAsDataURL(file);
}
