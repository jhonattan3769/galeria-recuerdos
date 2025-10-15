// Configura tu cuenta de Cloudinary
const cloudName = 'tu-cloud-name';  // Cambia esto por tu Cloud Name
const uploadPreset = 'tu-upload-preset';  // Cambia esto por tu Upload Preset

// Selecciona los elementos del DOM
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');

// Función para subir imágenes a Cloudinary
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Enviar la imagen a Cloudinary
        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Obtén la URL de la imagen
            const imageUrl = data.secure_url;

            // Crear un elemento de imagen y agregarlo a la galería
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            gallery.appendChild(imgElement);
        })
        .catch(error => console.error('Error al subir la imagen:', error));
    }
});
