// === CONFIGURACIÓN ===
const cloudName = 'drkkjp6za';   // tu Cloud Name
const uploadPreset = 'galeria';  // tu Upload Preset unsigned

const gallery = document.getElementById('gallery');

// Cargar fotos existentes (requiere tener activado "Resource lists" en Cloudinary)
async function loadGallery() {
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/galeria.json`);
    if (!res.ok) return console.log("Aún no hay lista pública disponible.");
    const data = await res.json();
    gallery.innerHTML = "";
    data.resources.forEach(img => {
      const imageUrl = img.secure_url || `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}.${img.format}`;
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "Recuerdo";
      image.style.width = "250px";
      image.style.margin = "10px";
      image.style.borderRadius = "10px";
      image.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
      gallery.appendChild(image);
    });
  } catch (err) {
    console.error("Error al cargar galería:", err);
  }
}

// === WIDGET DE SUBIDA ===
const uploadWidget = cloudinary.createUploadWidget({
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  folder: "galeria-recuerdos",
  tags: ["galeria"],  // importante para listarlas luego
  multiple: true,
  sources: ["local", "camera", "url"],
  maxFileSize: 5000000, // 5 MB
  clientAllowedFormats: ["jpg", "jpeg", "png", "webp"]
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log("Imagen subida:", result.info.secure_url);
    const image = document.createElement("img");
    image.src = result.info.secure_url;
    image.alt = "Nuevo recuerdo";
    image.style.width = "250px";
    image.style.margin = "10px";
    image.style.borderRadius = "10px";
    image.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    gallery.prepend(image);
  }
});

// === EVENTO DEL BOTÓN ===
document.getElementById("uploadBtn").addEventListener("click", () => {
  uploadWidget.open();
}, false);

// === INICIALIZAR ===
loadGallery();

