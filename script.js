// === CONFIGURACIÓN ===
const cloudName = 'drkkjp6za';     // tu Cloud Name
const uploadPreset = 'galeria';    // tu preset unsigned
const gallery = document.getElementById('gallery');

// Función para crear una tarjeta de imagen
function createCard(url){
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Recuerdo';

  // Añadir el evento de lightbox
  img.addEventListener('click', () => openLightbox(url));
  
  fig.appendChild(img);
  return fig;
}

// Cargar las fotos de Cloudinary
async function loadGallery(){
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/galeria.json`);
    if (!res.ok) return console.log("Aún no hay fotos.");
    const data = await res.json();
    gallery.innerHTML = '';  // Limpiar la galería antes de cargar nuevas imágenes
    data.resources.forEach(r => {
      const url = r.secure_url || `https://res.cloudinary.com/${cloudName}/image/upload/${r.public_id}.${r.format}`;
      gallery.appendChild(createCard(url));
    });
  } catch (err) {
    console.warn('Error al cargar las fotos:', err);
  }
}

// Crear el widget de subida para Cloudinary
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
    // Cuando la foto es subida con éxito, la añadimos a la galería
    gallery.prepend(createCard(result.info.secure_url)); // Añadir foto en la parte superior de la galería
  }
});

// Mostrar el widget al hacer clic en el botón
document.getElementById('uploadBtn').addEventListener('click', () => widget.open());

// Lightbox: abre la imagen en tamaño grande
function openLightbox(url) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  
  lightboxImg.src = url;  // Asignar la imagen seleccionada
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

// Cerrar el lightbox
const closeLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.getElementById('lightboxImg').src = '';  // Limpiar la imagen
};
document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// Inicializar la galería (cargar imágenes ya subidas al sitio)
loadGallery();

