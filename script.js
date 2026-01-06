let logoImage = null;

const qrCode = new QRCodeStyling({
  width: 260,
  height: 260,
  data: "https://example.com",
  margin: 10,
  dotsOptions: {
    color: "#000000",
    type: "square"
  },
  backgroundOptions: {
    color: "#ffffff"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 6
  }
});

qrCode.append(document.getElementById("qr-container"));

document.getElementById("logoUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => logoImage = reader.result;
  reader.readAsDataURL(file);
});

function generateQR() {
  const text = document.getElementById("qrText").value || " ";
  const color = document.getElementById("qrColor").value;
  const bg = document.getElementById("bgColor").value;
  const pattern = document.getElementById("pattern").value;
  const margin = document.getElementById("margin").value;
  const dotScale = document.getElementById("dotScale").value / 100;

  qrCode.update({
    data: text,
    margin: parseInt(margin),
    dotsOptions: {
      color: color,
      type: pattern,
      scale: dotScale   // controls inner spacing
    },
    backgroundOptions: {
      color: bg
    },
    image: logoImage
  });
}

function downloadQR() {
  qrCode.download({
    name: "custom-qr",
    extension: "png"
  });
}
