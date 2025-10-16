// === CONFIG ===
const cloudName = 'drkkjp6za';     // tu Cloud Name
const uploadPreset = 'galeria';    // tu preset unsigned
const gallery = document.getElementById('gallery');

// Utilidad: crear tarjeta de imagen
function createCard(url){
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = url; img.alt = 'Recuerdo';
  fig.appendChild(img);
  return fig;
}

// Cargar imágenes existentes por TAG (requiere "Resource lists" habilitado en Cloudinary)
async function loadGallery(){
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/galeria.json`);
    if (!res.ok) return console.log("Aún no hay fotos en la galería.");
    const data = await res.json();
    gallery.innerHTML = ''; // Limpiar galería
    data.resources.forEach(r => {
      const url = r.secure_url || `https://res.cloudinary.com/${cloudName}/image/upload/${r.public_id}.${r.format}`;
      gallery.appendChild(createCard(url));
    });
  } catch (err) {
    console.warn('Error al cargar la galería:', err);
  }
}

// Upload Widget de Cloudinary
const widget = cloudinary.createUploadWidget({
  cloudName, uploadPreset,
  folder: 'galeria-recuerdos',
  tags: ['galeria'],
  multiple: true,
  sources: ['local', 'camera', 'url'],
  maxFileSize: 6 * 1024 * 1024,  // 6 MB
  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
}, (error, result) => {
  if (!error && result && result.event === 'success') {
    gallery.prepend(createCard(result.info.secure_url));  // Agregar la nueva imagen
  }
});

// Abrir el widget cuando se haga clic en el botón
document.getElementById('uploadBtn').addEventListener('click', () => widget.open());

// Inicializar la galería
loadGallery();

