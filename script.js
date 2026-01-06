let logoImage = null;
let currentPattern = "square";

const qrCode = new QRCodeStyling({
  width: 260,
  height: 260,
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

/* Color palette click */
document.querySelectorAll(".palette").forEach(p => {
  p.style.background = `linear-gradient(45deg, ${p.dataset.fg}, ${p.dataset.bg})`;
  p.onclick = () => {
    qrCode.update({
      dotsOptions: { color: p.dataset.fg, type: currentPattern },
      backgroundOptions: { color: p.dataset.bg }
    });
  };
});

/* Drag & drop logo */
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("logoUpload");

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = e => {
  e.preventDefault();
  dropZone.style.opacity = "0.7";
};

dropZone.ondragleave = () => dropZone.style.opacity = "1";

dropZone.ondrop = e => {
  e.preventDefault();
  dropZone.style.opacity = "1";
  loadLogo(e.dataTransfer.files[0]);
};

fileInput.onchange = e => loadLogo(e.target.files[0]);

function loadLogo(file) {
  if (!file) return;
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
