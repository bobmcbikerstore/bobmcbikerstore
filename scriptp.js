const inventory = [
    // --- TEXTILES DTF ---
    { id: 1, category: 'dtf', name: "Playera Manga Corta", price: 200, img: "img/ph.png" }, // Precio actualizado
    { id: 2, category: 'dtf', name: "Playera Manga Larga", price: 220, img: "img/pm.png" }, // Nuevo precio
    { id: 3, category: 'dtf', name: "Sudadera Capucha", price: 350, img: "img/sc.png" },     // Precio actualizado
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 300, img: "img/sc1.png" },    // Precio actualizado
    { id: 5, category: 'dtf', name: "Playera Dry Fit", price: 300, img: "img/pd.png" },      // Precio actualizado
    { id: 6, category: 'dtf', name: "Gorras", price: 100, img: "img/gm.png" },               // Precio actualizado

    // --- GRABADO LÁSER ---
    { id: 7, category: 'laser', name: "Tarros 1L", price: 190, img: "img/t1l.png" },         // Nuevo producto
    { id: 8, category: 'laser', name: "Tarros 600 ML", price: 150, img: "img/t600.png" },    // Nuevo producto
    { id: 9, category: 'laser', name: "Tarros 355ML", price: 100, img: "img/t355.png" },     // Nuevo producto
    { id: 10, category: 'laser', name: "Placas y Llaveros", price: 100, img: "img/pm1.png" },// Precio actualizado
    { id: 11, category: 'laser', name: "Licoreras Estuche", price: 350, img: "img/lm.jpg" }, // Precio actualizado
    { id: 12, category: 'laser', name: "Encendedor", price: 120, img: "img/enc.png" },       // Nuevo producto
    { id: 13, category: 'laser', name: "Portallaves", price: 150, img: "img/pll.png" },      // Precio actualizado
    { id: 14, category: 'laser', name: "Portacascos", price: 250, img: "img/pc.jpg" },       // Precio actualizado
    { id: 15, category: 'laser', name: "Navajas", price: 200, img: "img/nt.jpg" },           // Precio actualizado
    { id: 16, category: 'laser', name: "Cuadros", price: 150, img: "img/cuad.png" }          // Nuevo producto
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

// --- NUEVA FUNCIÓN: SOLO DESCARGA ---
async function downloadDesign() {
    const canvasContainer = document.getElementById('canvas-container');

    // Desactivamos selección visual para la "foto"
    if (activeLayer) activeLayer.classList.remove('active');

    const canvas = await html2canvas(canvasContainer, {
        useCORS: true,
        backgroundColor: null
    });

    const designImage = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    const fileName = `BOB_Diseno_${product.name.replace(/\s+/g, '_')}_${Date.now()}.png`;

    link.download = fileName;
    link.href = designImage;
    link.click();

    showGenericAlert("DISEÑO GUARDADO", "Tu imagen se ha descargado. ¡No olvides adjuntarla al enviar tu pedido!");
}

// --- FUNCIÓN CARRITO: SOLO DATOS ---
function addToCart() {
    const isDTF = product.category === 'dtf';
    const layers = document.querySelectorAll('.logo-wrapper');
    let allLogos = Array.from(layers).map(l => l.dataset.name).join(", ");

    // Creamos el objeto SIN procesar el canvas (más rápido)
    const item = {
        name: product.name,
        price: product.price,
        size: document.getElementById('size').value,
        color: document.getElementById('color').value,
        side: isDTF ? document.getElementById('view-side').value : "N/A",
        notes: document.getElementById('notes').value,
        logoName: allLogos || "Sin logo"
        // Quitamos la propiedad 'preview' base64 para no saturar el almacenamiento
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

// Abre el modal de checkout en lugar de ir directo a WhatsApp
function checkoutWhatsApp() {
    if(cart.length === 0) {
        showGenericAlert("ARSENAL VACÍO", "Selecciona tu equipo antes de ir a la batalla.");
        return;
    }
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Procesa los datos del modal y envía a WhatsApp
function confirmOrder() {
    const name = document.getElementById('client-name').value;
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;

    if(!name) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    const phone = "525546628442";
    let message = `🏴‍☠️ *ORDEN DE PERSONALIZACIÓN B.O.B* 🏴‍☠️\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📍 *Entrega:* ${delivery}\n`;
    message += `💳 *Pago:* ${payment}\n`;
    message += `--------------------------\n`;
    message += `📢 *IMPORTANTE: Te enviaré las fotos de los diseños a continuación* 📢\n\n`;

    cart.forEach((item, i) => {
        message += `*${i+1}. ${item.name}*\n`;
        message += `   └ Talla: ${item.size} | Color: ${item.color}\n`;
        message += `   └ Lado: ${item.side} | Logo: ${item.logoName}\n`;
        if(item.notes) message += `   └ Notas: ${item.notes}\n`;
        message += `   └ Precio: $${item.price}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `*TOTAL A PAGAR: $${total} MXN*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);

    // Opcional: Limpiar carrito y cerrar modal tras enviar
    // cart = [];
    // localStorage.removeItem('bob_cart');
    // updateCartUI();
    closeCheckoutModal();
}

// Opcional: Cerrar cualquier modal al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
}
    // Inicializar UI si ya hay cosas
    window.onload = updateCartUI;

// --- NUEVA LÓGICA MULTI-CAPA ---
let activeLayer = null;
let isDragging = false;
let isResizing = false;
let isRotating = false;
let startX, startY, startWidth, startAngle;

// Manejo de archivos (Subir imagen)
document.getElementById('logo-file').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            createImageLayer(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('edit-controls').style.display = 'block';
    this.value = ""; // Limpiar input
});

// 1. Crear capa con manejadores
function createImageLayer(src, name) {
    const container = document.getElementById('canvas-container');
    const wrapper = document.createElement('div');
    wrapper.className = 'logo-wrapper';
    wrapper.dataset.name = name;
    wrapper.style.left = '50%';
    wrapper.style.top = '50%';
    wrapper.style.width = '100px';
    wrapper.dataset.angle = 0; // Guardamos el ángulo aquí

    const newImg = document.createElement('img');
    newImg.src = src;
    newImg.className = 'logo-layer';

    const delBtn = document.createElement('div');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '✕';
    delBtn.onclick = (e) => { e.stopPropagation(); wrapper.remove(); };

    // Agregamos los manejadores visuales
    const resizer = document.createElement('div');
    resizer.className = 'resizer';

    const rotator = document.createElement('div');
    rotator.className = 'rotator';

    wrapper.appendChild(newImg);
    wrapper.appendChild(delBtn);
    wrapper.appendChild(resizer);
    wrapper.appendChild(rotator);
    container.appendChild(wrapper);

    setActiveLayer(wrapper);
}

function setActiveLayer(el) {
    if (activeLayer) activeLayer.classList.remove('active');
    activeLayer = el;
    if (activeLayer) {
        activeLayer.classList.add('active');
        document.getElementById('edit-controls').style.display = 'block';
    }
}

// 2. Lógica Maestra de Interacción
document.addEventListener('mousedown', initAction);
document.addEventListener('touchstart', initAction, { passive: false });

function initAction(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (e.target.classList.contains('resizer')) {
        isResizing = true;
        startX = clientX;
        startWidth = activeLayer.offsetWidth;
        e.preventDefault();
    }
    else if (e.target.classList.contains('rotator')) {
        isRotating = true;
        const rect = activeLayer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(clientY - centerY, clientX - centerX);
        e.preventDefault();
    }
    else if (e.target.closest('.logo-wrapper')) {
        isDragging = true;
        const target = e.target.closest('.logo-wrapper');
        setActiveLayer(target);
        startX = clientX - target.offsetLeft;
        startY = clientY - target.offsetTop;
    } else {
        if (activeLayer && !e.target.closest('#edit-controls')) {
            activeLayer.classList.remove('active');
            activeLayer = null;
        }
    }
}

document.addEventListener('mousemove', doAction);
document.addEventListener('touchmove', doAction, { passive: false });

function doAction(e) {
    if (!activeLayer) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (isResizing) {
        const newWidth = startWidth + (clientX - startX);
        if (newWidth > 30) activeLayer.style.width = newWidth + 'px';
        e.preventDefault();
    }
   else if (isRotating) {
        const rect = activeLayer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);

        // Convertir a grados y ajustar
        let rotation = (currentAngle - startAngle) * (180 / Math.PI);

        // Usar un dataset para mantener la rotación acumulada si prefieres,
        // o simplemente aplicar el cálculo:
        activeLayer.style.transform = `rotate(${rotation}deg)`;
        e.preventDefault();
    }
    else if (isDragging) {
        activeLayer.style.left = (clientX - startX) + 'px';
        activeLayer.style.top = (clientY - startY) + 'px';
        e.preventDefault();
    }
}

document.addEventListener('mouseup', () => { isDragging = isResizing = isRotating = false; });
document.addEventListener('touchend', () => { isDragging = isResizing = isRotating = false; });

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
