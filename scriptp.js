 const inventory = [
    { id: 1, category: 'dtf', name: "Playera Algodón Hombre", price: 250, img: "img/ph.png", imgBack: "img/phr.png" },
    { id: 2, category: 'dtf', name: "Playera Algodón Mujer", price: 250, img: "img/pm.png", imgBack: "img/pmr.png" },
    { id: 3, category: 'dtf', name: "Sudadera Unisex Capucha", price: 550, img: "img/scf.png", imgBack: "img/sc.png" },
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 480, img: "img/sc1.png", imgBack: "img/scr1.png" },
    { id: 5, category: 'dtf', name: "Playera Dri-fit", price: 280, img: "img/pd.png", imgBack: "img/pdr.png" },
    { id: 6, category: 'dtf', name: "Gorra de Malla", price: 180, img: "img/gm.png"},
    { id: 7, category: 'laser', name: "Placas Militares", price: 150, img: "img/pm1.png" },
    { id: 8, category: 'laser', name: "Licorera Metálica", price: 320, img: "img/lm.jpg" },
    { id: 9, category: 'laser', name: "Navaja Táctica", price: 450, img: "img/nt.jpg" },
    { id: 10, category: 'laser', name: "Porta Llaves", price: 200, img: "img/pll.png" },
    { id: 11, category: 'laser', name: "Portacascos", price: 650, img: "img/pc.jpg" },
    { id: 12, category: 'laser', name: "Libreta de Piel", price: 380, img: "img/l.png" }
];

    // Cargar carrito desde LocalStorage al iniciar
    let cart = JSON.parse(localStorage.getItem('bob_cart')) || [];

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = inventory.find(p => p.id === productId);

    if(product) {
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-img').src = product.img;
    document.getElementById('product-price').innerText = `$${product.price} MXN`;

    // MOSTRAR SELECTOR SOLO SI ES DTF
    if(product.category === 'dtf') {
        document.getElementById('view-side-group').style.display = 'block';
    } else {
        document.getElementById('view-side-group').style.display = 'none';
    }
}

// Función para cambiar la imagen
function changeView() {
    const side = document.getElementById('view-side').value;
    const productImg = document.getElementById('product-img');
    
    // Si es espalda, usa imgBack; si es frente, usa img original
    if (side === 'Espalda' && product.imgBack) {
        productImg.src = product.imgBack;
    } else {
        productImg.src = product.img;
    }
    
    resetLogo(); // Limpia la posición del logo para que no quede "flotando" en el aire
}

    async function addToCart() {
    const isDTF = product.category === 'dtf';
    
    // 1. Capturar el diseño actual antes de guardarlo
    const canvasContainer = document.getElementById('canvas-container');
    if (activeLayer) activeLayer.style.outline = "none"; // Quitar borde de selección

    const canvas = await html2canvas(canvasContainer, {
        useCORS: true,
        backgroundColor: null
    });
    const designImage = canvas.toDataURL("image/png"); // Guardamos la imagen en base64

    // 2. Obtener nombres de logos
    const layers = document.querySelectorAll('.logo-layer');
    let allLogos = Array.from(layers).map(l => l.dataset.name).join(", ");

    const item = {
        name: product.name,
        price: product.price,
        size: document.getElementById('size').value,
        color: document.getElementById('color').value,
        side: isDTF ? document.getElementById('view-side').value : "N/A", 
        position: "Ver imagen adjunta", 
        notes: document.getElementById('notes').value,
        logoName: allLogos || "Sin logo",
        preview: designImage // <--- NUEVA PROPIEDAD: Guardamos la foto aquí
    };

    cart.push(item);
    localStorage.setItem('bob_cart', JSON.stringify(cart));
    updateCartUI();
    document.getElementById('custom-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('custom-modal').style.display = 'none';
}

// Opcional: Cerrar modal si hacen clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('custom-modal');
    if (event.target == modal) {
        closeModal();
    }
}

    function updateCartUI() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        container.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div style="border-bottom: 1px solid #333; padding: 5px 0; display: flex; justify-content: space-between;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.size} | ${item.color}</small>
                    </div>
                    <div>
                        $${item.price}
                        <span onclick="removeItem(${index})" style="color:red; cursor:pointer; margin-left:5px;">✕</span>
                    </div>
                </div>
            `;
        });
        totalEl.innerText = total;
    }

    function removeItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('bob_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function toggleCart() {
        const el = document.getElementById('cart-floating');
        el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }

    // Función para abrir cualquier modal con mensaje personalizado (opcional)
function showGenericAlert(titulo, mensaje) {
    document.getElementById('alert-title').innerText = titulo;
    document.getElementById('alert-message').innerText = mensaje;
    document.getElementById('generic-alert-modal').style.display = 'flex';
}

// Función corregida para cerrar cualquier modal por ID
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function checkoutWhatsApp() {
    if(cart.length === 0) {
        showGenericAlert("ARSENAL VACÍO", "Selecciona tu equipo antes de ir a la batalla.");
        return;
    }

    showGenericAlert("PREPARANDO DESCARGAS", "Se descargarán los diseños de tu carrito. Por favor, adjúntalos en el chat.");

    // 1. Descargar cada imagen guardada en el carrito
    cart.forEach((item, index) => {
        if (item.preview) {
            const link = document.createElement('a');
            link.download = `Diseno_${index + 1}_${item.name.replace(/\s+/g, '_')}.png`;
            link.href = item.preview;
            link.click();
        }
    });

    // 2. Preparar mensaje de WhatsApp
    const phone = "525546628442";
    let message = "🏴‍☠️ *ORDEN DE PERSONALIZACIÓN B.O.B* 🏴‍☠️\n\n";
    message += "⚠️ *HE ADJUNTO LOS DISEÑOS DESCARGADOS ABAJO* ⚠️\n\n";

    cart.forEach((item, i) => {
        message += `*${i+1}. ${item.name}*\n`;
        message += `   └ Talla: ${item.size} | Color: ${item.color}\n`;
        message += `   └ Lado: ${item.side} | Logo: ${item.logoName}\n`;
        if(item.notes) message += `   └ Notas: ${item.notes}\n`;
        message += `   └ Precio: $${item.price}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `*TOTAL A PAGAR: $${total} MXN*`;

    // 3. Abrir WhatsApp tras un breve delay para permitir las descargas
    setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    }, 1500);
}

// Opcional: Cerrar cualquier modal al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
}

    // Cambiar la función del botón original de "Enviar a WhatsApp" por "Añadir al carrito"
    document.querySelector('.form-box .btn').innerText = "🛒 AÑADIR AL CARRITO";
    document.querySelector('.form-box .btn').onclick = addToCart;

    // Inicializar UI si ya hay cosas
    window.onload = updateCartUI;

// --- NUEVA LÓGICA MULTI-CAPA ---
let activeLayer = null; 

// 1. Manejo de archivos (Permite subir varios)
document.getElementById('logo-file').addEventListener('change', function(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            createImageLayer(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('edit-controls').style.display = 'block';
});

// 2. Crear capas dinámicas
function createImageLayer(src, name) {
    const container = document.getElementById('canvas-container');
    const newImg = document.createElement('img');
    
    newImg.src = src;
    newImg.className = 'logo-layer'; // Clase para CSS
    newImg.dataset.name = name;
    newImg.style.width = '100px'; 
    newImg.style.position = 'absolute';
    newImg.style.left = '50%';
    newImg.style.top = '50%';
    newImg.style.cursor = 'move';
    newImg.style.transform = 'translate(-50%, -50%)';

    // Seleccionar al hacer clic
    newImg.addEventListener('mousedown', (e) => setActiveLayer(e.target));
    newImg.addEventListener('touchstart', (e) => setActiveLayer(e.target));

    container.appendChild(newImg);
    setActiveLayer(newImg);
}

function setActiveLayer(el) {
    if (activeLayer) activeLayer.style.outline = "none";
    activeLayer = el;
    activeLayer.style.outline = "2px dashed #ff0000"; // Borde rojo para saber cuál editas
}

// 3. Controles de Escala y Rotación
document.getElementById('scale-range').oninput = (e) => {
    if (activeLayer) activeLayer.style.width = e.target.value + 'px';
};

document.getElementById('rotate-range').oninput = (e) => {
    if (activeLayer) {
        // Mantenemos el centrado del transform original
        activeLayer.style.transform = `translate(-50%, -50%) rotate(${e.target.value}deg)`;
    }
};

// 4. Arrastre (Drag)
let isDragging = false;
let startX, startY;

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('logo-layer')) {
        isDragging = true;
        activeLayer = e.target;
        // Calculamos posición relativa
        const rect = activeLayer.getBoundingClientRect();
        startX = e.clientX - activeLayer.offsetLeft;
        startY = e.clientY - activeLayer.offsetTop;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && activeLayer) {
        activeLayer.style.left = (e.clientX - startX) + 'px';
        activeLayer.style.top = (e.clientY - startY) + 'px';
    }
});

document.addEventListener('mouseup', () => isDragging = false);

// 5. Resetear (Elimina la capa seleccionada)
function resetLogo() {
    if (activeLayer) {
        activeLayer.remove();
        activeLayer = null;
    }
}
// Definición de colores extendida (Basada en tu imagen)
const dtfColors = [
    "Negro", "Blanco", "Marino", "Rojo", "Jaspe",
    "Rosa", "Rosa Pastel", "Palo Rosa", "Morado", "Lila",
    "Oxford", "Vino", "Rey", "Militar", "Beige",
    "Café", "Verde", "Naranja", "Acua", "Amarillo",
    "Shedron", "Amarillo Mango", "Moztaza", "Verde Manzana", "Azul Cielo"
];

// Colores básicos para Láser
const laserColors = ["Acero", "Negro Mate", "Madera", "Piel"];

// ... (Aquí mantén tu constante inventory)

if(product) {
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-img').src = product.img;
    document.getElementById('product-price').innerText = `$${product.price} MXN`;

    const colorSelect = document.getElementById('color');
    colorSelect.innerHTML = ''; // Limpiamos opciones actuales

    if(product.category === 'dtf') {
        // Mostrar selector de lado
        document.getElementById('view-side-group').style.display = 'block';
        
        // Cargar paleta completa de colores DTF
        dtfColors.forEach(color => {
            let opt = document.createElement('option');
            opt.value = color;
            opt.innerText = color;
            colorSelect.appendChild(opt);
        });
    } else {
        // Ocultar selector de lado
        document.getElementById('view-side-group').style.display = 'none';
        
        // Cargar colores de Láser
        laserColors.forEach(color => {
            let opt = document.createElement('option');
            opt.value = color;
            opt.innerText = color;
            colorSelect.appendChild(opt);
        });
    }
}
