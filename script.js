/***** CONFIG *****/
const cloudName   = 'drkkjp6za';   // <-- tu Cloud Name
const uploadPreset = 'galeria';    // <-- tu Upload Preset (Unsigned)
const TAG = 'galeria';             // <-- el tag que agregaste en el preset
const gallery = document.getElementById('gallery');

/***** HELPERS *****/
function createCard(url){
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Recuerdo';
  fig.appendChild(img);
  return fig;
}

/**
 * Carga SIEMPRE las fotos guardadas en Cloudinary con el tag definido.
 * Requiere en Cloudinary: Settings → Security → habilitar "Resource lists".
 */
async function loadGallery(){
  try {
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${TAG}.json?v=${Date.now()}`;
    const res = await fetch(listUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.log('No hay lista pública aún o falta habilitar "Resource lists".');
      return;
    }
    const data = await res.json();
    gallery.innerHTML = '';

    // Opcional: ordenar más nuevas primero
    (data.resources || [])
      .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
      .forEach(r => {
        const url = r.secure_url || `https://res.cloudinary.com/${cloudName}/image/upload/${r.public_id}.${r.format}`;
        gallery.appendChild(createCard(url));
      });
  } catch (err) {
    console.warn('Error al cargar la galería:', err);
  }
}

/***** SUBIDA (widget Cloudinary) *****/
const widget = cloudinary.createUploadWidget({
  cloudName,
  uploadPreset,               // el preset ya añade el tag "galeria"
  folder: 'galeria-recuerdos',
  tags: [TAG],                // redundante pero útil si algún día cambias el preset
  multiple: true,
  sources: ['local','camera','url'],
  maxFileSize: 6 * 1024 * 1024,
  clientAllowedFormats: ['jpg','jpeg','png','webp']
}, (error, result) => {
  if (!error && result && result.event === 'success') {
    // Mostrar de inmediato lo recién subido
    gallery.prepend(createCard(result.info.secure_url));
    // Y refrescar desde la lista para quedar en sync con Cloudinary/CDN
    loadGallery();
  }
});

/***** UI *****/
document.getElementById('uploadBtn')?.addEventListener('click', () => widget.open());

/***** INIT: al abrir la página, leer lo que ya está guardado en Cloudinary *****/
loadGallery();


