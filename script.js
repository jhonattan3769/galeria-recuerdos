// === CONFIGURACIÓN ===
const cloudName = 'drkkjp6za';     // tu Cloud Name
const uploadPreset = 'galeria';    // tu preset unsigned
const gallery = document.getElementById('gallery');

// Función para agregar la imagen al DOM
function createCard(url){
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Recuerdo';

  // Cuando se hace clic en la imagen, se abre el lightbox
  img.addEventListener('click', () => openLightbox(url));

  fig.appendChild(img);
  return fig;
}

// Cargar fotos existentes por TAG (requiere "Resource lists" habilitado en Cloudinary)
async function loadGallery(){
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/galeria.json`);
    if (!res.ok) return; // Si aún no hay lista, no rompe
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

// Crear el widget de subida de fotos
const widget = cloudinary.createUploadWidget({
  cloudName,
  uploadPreset,
  folder: 'galeria-recuerdos',
  tags: ['galeria'],
  multiple: true,
  sources: ['local', 'camera', 'url'],
  maxFileSize: 6 * 1024 * 1024, // 6 MB
  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
}, (error, result) => {
  if (!error && result && result.event === 'success') {
    gallery.prepend(createCard(result.info.secure_url));  // Añadir la nueva imagen
  }
});

// Abrir el widget al hacer clic en el botón
document.getElementById('uploadBtn').addEventListener('click', () => widget.open());

// Función para abrir el lightbox
function openLightbox(url) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  lightboxImg.src = url;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

// Cerrar el lightbox
const closeLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.getElementById('lightboxImg').src = '';
};
document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// Inicializar la galería al cargar la página
loadGallery();

