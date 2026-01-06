let logoImage = null;
let bgImage = null;
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

/* Drag & drop for logo */
const logoDropZone = document.getElementById("logo-drop-zone");
const logoFileInput = document.getElementById("logoUpload");

logoDropZone.onclick = () => logoFileInput.click();
logoDropZone.ondragover = e => e.preventDefault();
logoDropZone.ondrop = e => {
  e.preventDefault();
  loadLogo(e.dataTransfer.files[0]);
};
logoFileInput.onchange = e => loadLogo(e.target.files[0]);

/* Drag & drop for background */
const bgDropZone = document.getElementById("bg-drop-zone");
const bgFileInput = document.getElementById("bgUpload");

bgDropZone.onclick = () => bgFileInput.click();
bgDropZone.ondragover = e => e.preventDefault();
bgDropZone.ondrop = e => {
  e.preventDefault();
  loadBackground(e.dataTransfer.files[0]);
};
bgFileInput.onchange = e => loadBackground(e.target.files[0]);

function loadBackground(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = () => {
    bgImage = reader.result;

    const preview = document.getElementById("bg-preview");
    const status = document.getElementById("bg-upload-status");
    const text = bgDropZone.querySelector('p');

    preview.src = bgImage;
    preview.style.display = "block";
    status.style.display = "block";
    status.textContent = "✔ Background uploaded";
    text.style.display = "none";

    generateQR();
  };
  reader.readAsDataURL(file);
}

function generateQR() {
  const qrContainer = document.getElementById("qr-container");
  
  // Apply background image if available
  if (bgImage) {
    qrContainer.style.backgroundImage = `url(${bgImage})`;
    qrContainer.style.backgroundSize = 'cover';
    qrContainer.style.backgroundPosition = 'center';
    qrContainer.style.backgroundRepeat = 'no-repeat';
    
    // Make QR code background transparent when background image is present
    qrCode.update({
      data: document.getElementById("qrText").value || " ",
      margin: +document.getElementById("margin").value,
      dotsOptions: {
        type: currentPattern,
        color: fgColor,
        scale: document.getElementById("dotScale").value / 100
      },
      backgroundOptions: {
        color: 'transparent',
        gradient: null
      },
      image: logoImage
    });
  } else {
    qrContainer.style.backgroundImage = 'none';
    
    // Use solid background color when no background image
    qrCode.update({
      data: document.getElementById("qrText").value || " ",
      margin: +document.getElementById("margin").value,
      dotsOptions: {
        type: currentPattern,
        color: fgColor,
        scale: document.getElementById("dotScale").value / 100
      },
      backgroundOptions: {
        color: bgColor,
        gradient: null
      },
      image: logoImage
    });
  }
}

// ... (keep all existing code above the downloadQR function) ...

function downloadQR() {
  const qrContainer = document.getElementById('qr-container');
  const qrCanvas = qrContainer.querySelector('canvas');
  
  if (!qrCanvas) {
    console.error('QR Code canvas not found');
    return;
  }

  if (bgImage) {
    // Create a temporary canvas to combine background and QR code
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set canvas size to match QR code
    tempCanvas.width = qrCanvas.width;
    tempCanvas.height = qrCanvas.height;

    // Create an image element for the background
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous'; // Handle CORS if needed
    
    bgImg.onload = function() {
      // Draw the background image
      tempCtx.drawImage(bgImg, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw the QR code on top
      tempCtx.drawImage(qrCanvas, 0, 0);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.download = 'qrystal-with-bg.png';
      link.href = tempCanvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    bgImg.onerror = function() {
      console.error('Error loading background image for download');
      // Fallback to regular download if background fails to load
      qrCode.download({ name: "qrystal", extension: "png" });
    };
    
    bgImg.src = bgImage;
  } else {
    // Original download if no background image
    qrCode.download({ name: "qrystal", extension: "png" });
  }
}

// ... (keep all existing code below the downloadQR function) ...
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
    status.textContent = "✔ Logo uploaded";
    text.style.display = "none";

    generateQR();
  };
  reader.readAsDataURL(file);
}
