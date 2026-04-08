// --- 1. BASE DE DATOS Y ESTADO ---
const inventory = [
    { id: 1, category: 'dtf', name: "Playera Manga Corta", price: 200, img: "img/ph.png", imgBack: "img/phr.png" },
    { id: 2, category: 'dtf', name: "Playera Manga Larga", price: 220, img: "img/pm.png", imgBack: "img/pmr.png" },
    { id: 3, category: 'dtf', name: "Sudadera Capucha", price: 350, img: "img/scf.png", imgBack: "img/sc.png" },
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 300, img: "img/sc1.png", imgBack: "img/scr1.png" },
    { id: 5, category: 'dtf', name: "Playera Dry Fit", price: 300, img: "img/pd.png", imgBack: "img/pdr.png" },
    { id: 6, category: 'dtf', name: "Gorras", price: 100, img: "img/gm.png" },
    { id: 7, category: 'laser', name: "Tarros 1L", price: 190, img: "img/t1.png" },
    { id: 8, category: 'laser', name: "Tarros 600 ML", price: 150, img: "img/t600.png" },
    { id: 9, category: 'laser', name: "Tarros 355ML", price: 100, img: "img/t355.png" },
    { id: 10, category: 'laser', name: "Placas y Llaveros", price: 100, img: "img/pm1.png" },
    { id: 11, category: 'laser', name: "Licoreras Estuche", price: 250, img: "img/lm.jpg" },
    { id: 12, category: 'laser', name: "Licorera kit", price: 350, img: "img/lk.png" },
    { id: 13, category: 'laser', name: "Encendedor", price: 120, img: "img/e.png" },
    { id: 14, category: 'laser', name: "Navajas", price: 200, img: "img/n.png" },
    { id: 15, category: 'laser', name: "Portallaves", price: 150, img: "img/pll.png" },
    { id: 16, category: 'laser', name: "Portacascos", price: 250, img: "img/pc.png" },
    { id: 17, category: 'laser', name: "Cuadros", price: 150, img: "img/c.png" },
    
];

let cart = JSON.parse(localStorage.getItem('bob_cart')) || [];
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));
const product = inventory.find(p => p.id === productId);

// Variables para manipulación
let activeLayer = null;
let isDragging = false, isResizing = false, isRotating = false;
let startX, startY, startWidth, startAngle;

// --- 2. INICIALIZACIÓN DE PRODUCTO ---
// --- 2. INICIALIZACIÓN DE PRODUCTO ---
if(product) {
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-price').innerText = `$${product.price} MXN`;
    document.getElementById('product-img-frente').src = product.img;

    if(product.imgBack) {
        document.getElementById('back-view-wrapper').style.display = 'block';
        document.getElementById('product-img-espalda').src = product.imgBack;
    }

    // --- LÓGICA DE COLOR FILTRADA ---
    const colorSelect = document.getElementById('color');
    const colorContainer = colorSelect.closest('.input-group'); // Selecciona el contenedor del campo
    const sizeContainer = document.getElementById('size-container');
    if (product.category === 'dtf') {
        // Mostrar campo de color para DTF
        colorContainer.style.display = 'block';
        colorSelect.innerHTML = ''; // Limpiar
        const dtfColors = ["Negro", "Blanco", "Marino", "Rojo", "Vino", "Oxford", "Militar", "Rey", "Rosa"];
        
        dtfColors.forEach(c => {
            let opt = document.createElement('option');
            opt.value = c; opt.innerText = c;
            colorSelect.appendChild(opt);
        });
    } else {
        sizeContainer.style.display = 'none';

    // Ocultar color
    colorContainer.style.display = 'none';
    colorSelect.innerHTML = '<option value="N/A">N/A</option>'; 
        // Ocultar campo de color para Laser
        colorContainer.style.display = 'none';
        colorSelect.innerHTML = '<option value="N/A">N/A</option>'; 
    }
}

// --- 3. SUBIDA Y CREACIÓN DE LOGOS ---
// --- 3. SUBIDA Y CREACIÓN DE LOGOS ---
document.getElementById('logo-file').addEventListener('change', function(e) {
    const files = e.target.files;
    // Obtenemos cuál vista seleccionó el usuario
    const selectedView = document.getElementById('view-selector').value;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Validamos si la vista trasera existe para ese producto
            if (selectedView === 'canvas-espalda' && !product.imgBack) {
                showGenericAlert("AVISO", "Este producto no tiene vista trasera disponible.");
                return;
            }
            
            // Usamos la vista seleccionada en lugar de dejarlo fijo en 'canvas-frente'
            createImageLayer(event.target.result, file.name, selectedView);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('edit-controls').style.display = 'block';
    // Desplaza la pantalla automáticamente hacia la vista donde se subió el logo
document.getElementById(selectedView).scrollIntoView({ behavior: 'smooth' });
});

function createImageLayer(src, name, containerId) {
    const container = document.getElementById(containerId);
    const wrapper = document.createElement('div');
    wrapper.className = 'logo-wrapper active';
    wrapper.dataset.name = name;
    wrapper.dataset.container = containerId;
    
    wrapper.style.left = '35%';
    wrapper.style.top = '30%';
    wrapper.style.width = '120px'; // <-- Asegúrate que diga 'px'

    wrapper.innerHTML = `
        <img src="${src}" class="logo-layer" style="width: 100%;">
        <div class="delete-btn" onclick="this.parentElement.remove()">✕</div>
        <div class="resizer"></div>
        <div class="rotator"></div>
    `;

    container.appendChild(wrapper);
    setActiveLayer(wrapper);
}

function setActiveLayer(el) {
    // Quitar clase activa de la capa anterior
    if (activeLayer) activeLayer.classList.remove('active');
    
    activeLayer = el;
    
    if (activeLayer) {
        activeLayer.classList.add('active');
        
        const textElement = activeLayer.querySelector('.text-layer');
        const slider = document.getElementById('size-slider');
        const display = document.getElementById('px-display');
        const sidebarInput = document.getElementById('custom-text-input');

        if (textElement) {
            // Si es texto, sincronizamos el input lateral y el tamaño de fuente
            if (sidebarInput) sidebarInput.value = textElement.textContent.trim();
            const fontSize = parseInt(window.getComputedStyle(textElement).fontSize);
            if (slider) slider.value = fontSize;
            if (display) display.innerText = fontSize;
        } else {
            // Si es imagen, el slider maneja el ancho (width)
            const currentWidth = activeLayer.offsetWidth;
            if (slider) slider.value = currentWidth;
            if (display) display.innerText = currentWidth;
        }
    }
}

// Permite editar el texto de la capa activa mientras escribes en el input
document.getElementById('custom-text-input').addEventListener('input', function(e) {
    if (activeLayer) {
        const textElement = activeLayer.querySelector('.text-layer');
        if (textElement) {
            textElement.innerText = e.target.value;
            activeLayer.dataset.name = "Texto: " + e.target.value;
            // Importante: Si el texto es muy largo, permite que la capa crezca
            activeLayer.style.width = 'auto'; 
        }
    }
});

// --- 4. LÓGICA DE MOVIMIENTO (MOUSE & TOUCH) ---
document.addEventListener('mousedown', initAction);
document.addEventListener('touchstart', initAction, { passive: false });

function initAction(e) {
    // 🚨 NUEVO: ignorar clics dentro del modal
    if (e.target.closest('#edit-text-modal')) return;

    // 🚨 NUEVO: ignorar clics en botones
    if (e.target.closest('button')) return;

    // Si el clic es dentro del panel de edición, no hacer nada
    if (e.target.closest('#edit-controls')) return;

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
        startAngle = Math.atan2(clientY - (rect.top + rect.height/2), clientX - (rect.left + rect.width/2));
        e.preventDefault();
    } 
    else if (e.target.closest('.logo-wrapper')) {
        isDragging = true;
        const target = e.target.closest('.logo-wrapper');
        setActiveLayer(target);
        startX = clientX - target.offsetLeft;
        startY = clientY - target.offsetTop;
    } 
    else {
        if (activeLayer) {
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

    // ... dentro de doAction, en el bloque if (isResizing) ...
    if (isResizing) {
        let newWidth = startWidth + (clientX - startX);
        if (newWidth > 30) {
            activeLayer.style.width = newWidth + 'px';
            
            const slider = document.getElementById('size-slider');
            const display = document.getElementById('px-display');
            
            const textElement = activeLayer.querySelector('.text-layer');
            if (textElement) {
                // En el resizer manual, mantenemos una proporción estética
                const fontSize = Math.round(newWidth * 0.3); 
                textElement.style.fontSize = fontSize + 'px';
                if (slider) slider.value = fontSize;
                if (display) display.innerText = fontSize;
            } else {
                if (slider) slider.value = newWidth;
                if (display) display.innerText = newWidth;
            }
        }
    } else if (isRotating) {
        const rect = activeLayer.getBoundingClientRect();
        const angle = Math.atan2(clientY - (rect.top + rect.height/2), clientX - (rect.left + rect.width/2));
        activeLayer.style.transform = `rotate(${(angle - startAngle) * (180 / Math.PI)}deg)`;
    } else if (isDragging) {
        activeLayer.style.left = (clientX - startX) + 'px';
        activeLayer.style.top = (clientY - startY) + 'px';
    }
}

document.addEventListener('mouseup', () => isDragging = isResizing = isRotating = false);
document.addEventListener('touchend', () => isDragging = isResizing = isRotating = false);

// --- 5. CARRITO Y DESCARGA ---
async function downloadDesign() {
    if (activeLayer) activeLayer.classList.remove('active');
    
    const views = ['canvas-frente'];
    if(product.imgBack) views.push('canvas-espalda');

    for(let id of views) {
        const canvas = await html2canvas(document.getElementById(id), { useCORS: true });
        const link = document.createElement('a');
        link.download = `DISEÑO_${id.toUpperCase()}_${product.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
    showGenericAlert("GUARDADO", "Se han descargado las vistas de tu diseño.");
}

function addToCart() {
    const layers = document.querySelectorAll('.logo-wrapper');
    const logosInfo = Array.from(layers).map(l => `${l.dataset.name} (${l.parentElement.id === 'canvas-frente' ? 'Frente' : 'Espalda'})`).join(", ");
    
    // Obtenemos el valor del color solo si es visible
    const colorValue = product.category === 'dtf' ? document.getElementById('color').value : "N/A";

    const item = {
        name: product.name,
        price: product.price,
        size: product.category === 'dtf' ? document.getElementById('size').value : "N/A",
        color: colorValue, // Aquí usamos la variable validada
        notes: document.getElementById('notes').value,
        logoName: logosInfo || "Sin logo"
    };

    cart.push(item);
    localStorage.setItem('bob_cart', JSON.stringify(cart));
    updateCartUI();
    document.getElementById('custom-modal').style.display = 'flex';
}

// --- FUNCIONES UNIFICADAS DE CARRITO ---

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div style="border-bottom: 1px solid #333; padding: 8px 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="color:var(--primary)">${item.name}</strong><br>
                    <small style="color:#aaa;">${item.size || ''} ${item.color || ''}</small>
                </div>
                <div style="color:white;">
                    $${item.price}
                    <span onclick="removeItem(${index})" style="color:var(--primary); cursor:pointer; margin-left:8px; font-weight:bold;">✕</span>
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
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
}

// Abrir modal de datos
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showAlertModal("⚠️ CARRITO VACÍO", "Aún no tienes armamento en tu arsenal.");
        return;
    }
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// Modales de alerta unificados
// Modales de alerta unificados (Corregido para usar los IDs del HTML)
function showAlertModal(titulo, mensaje) {
    // Usamos 'alert-title' y 'alert-message' que son los IDs en tu HTML
    const titleEl = document.getElementById('alert-title');
    const messageEl = document.getElementById('alert-message');
    const modal = document.getElementById('generic-alert-modal');

    if(titleEl && messageEl && modal) {
        titleEl.innerText = titulo;
        messageEl.innerText = mensaje;
        modal.style.display = 'flex';
    } else {
        // Backup por si los IDs fallan
        alert(titulo + ": " + mensaje);
    }
}

function closeAlertModal() {
    document.getElementById('generic-alert-modal').style.display = 'none';
}

// Reemplaza tu función confirmOrder antigua por esta que es la "Final"
function confirmOrder() {
    const name = document.getElementById('client-name').value;
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (name.trim() === "") {
        showAlertModal("⚠️ ACCESO DENEGADO", "Debes ingresar tu nombre de piloto para registrar el pedido.");
        return;
    }

    let message = `🏴‍☠️ *NUEVA ORDEN B.O.B CUSTOM* 🏴‍☠️\n\n`;
    message += `👤 *CLIENTE:* ${name.toUpperCase()}\n`;
    message += `📍 *ENTREGA:* Zona ${delivery}\n`;
    message += `💳 *PAGO:* ${payment}\n`;
    message += `──────────────────\n\n`;

    cart.forEach((item, i) => {
        message += `📦 *ARTÍCULO ${i + 1}:* ${item.name}\n`;
        if (item.size || item.color) {
            message += `   • Detalle: ${item.size || 'N/A'} / ${item.color || 'N/A'}\n`;
        }
        if (item.logoName && item.logoName !== "Sin logo") {
            message += `   • Diseño: ${item.logoName}\n`;
        }
        if (item.notes) {
            message += `   • Notas: _${item.notes}_\n`;
        }
        message += `   • Subtotal: *$${item.price} MXN*\n\n`;
    });

    message += `──────────────────\n`;
    message += `💰 *TOTAL A PAGAR: $${total} MXN*\n\n`;
    message += `_Por favor, adjunta tus capturas de diseño si personalizaste algún artículo._`;

    const phone = "525546628442";
    closeCheckoutModal();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

window.onload = updateCartUI;
function resetLogo() { if(activeLayer) { activeLayer.remove(); activeLayer = null; } }

// Función genérica para cerrar cualquier modal por su ID
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addTextLayer() {
    const text = document.getElementById('custom-text-input').value;
    const font = document.getElementById('font-selector').value;
    const color = document.getElementById('text-color-picker').value;
    const selectedView = document.getElementById('view-selector').value;

    if (!text.trim()) {
        showAlertModal("⚠️ CAMPO VACÍO", "Escribe algo antes de añadir el texto.");
        return;
    }

    const container = document.getElementById(selectedView);
    const wrapper = document.createElement('div');
    wrapper.className = 'logo-wrapper active'; 
    wrapper.dataset.name = "Texto: " + text;
    wrapper.style.left = '30%';
    wrapper.style.top = '40%';
    wrapper.style.position = 'absolute';

    
// Busca esta parte en tu función addTextLayer y asegúrate que esté así:
wrapper.innerHTML = `
    <div class="text-layer" style="font-family: ${font}; color: ${color}; white-space: nowrap; padding: 10px; font-size: 40px; min-width: 50px;">
        ${text}
    </div>
    <div class="edit-btn" style="position:absolute; right:-10px; top:-10px; background:var(--primary); color:black; border-radius:50%; width:20px; height:20px; text-align:center; cursor:pointer; z-index:10;">⋮</div>
    <div class="delete-btn" onclick="this.parentElement.remove()">✕</div>
    <div class="resizer"></div>
    <div class="rotator"></div>
`;

    // UN SOLO EVENTO PARA EL BOTÓN EDITAR
    const eb = wrapper.querySelector('.edit-btn');
    eb.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        setActiveLayer(wrapper); // Nos aseguramos que esta sea la capa activa
        openEditTextModal();
    };

    container.appendChild(wrapper);
    setActiveLayer(wrapper);
    document.getElementById('edit-controls').style.display = 'block';
}

// Listener para cambiar color en tiempo real a la capa seleccionada
document.getElementById('text-color-picker').addEventListener('input', function(e) {
    if (activeLayer) {
        const textElement = activeLayer.querySelector('.text-layer');
        if (textElement) {
            textElement.style.color = e.target.value;
        }
    }
});

// Función para cambiar el tamaño desde el control de PX
function updateLayerSize(val) {
    if (!activeLayer) return;
    
    const newValue = parseInt(val);
    document.getElementById('px-display').innerText = newValue;

    const textElement = activeLayer.querySelector('.text-layer');
    
    if (textElement) {
        // Para TEXTO: El slider controla directamente el tamaño de la fuente
        textElement.style.fontSize = newValue + 'px';
        // Ajustamos el contenedor para que no corte el texto
        activeLayer.style.width = 'auto'; 
        activeLayer.style.minWidth = '50px';
    } else {
        // Para IMÁGENES: El slider controla el ancho del contenedor
        activeLayer.style.width = newValue + 'px';
    }
}


// Abre el modal y carga el texto actual de la capa activa
function openEditTextModal() {
    if (activeLayer) {
        const textElement = activeLayer.querySelector('.text-layer');
        if (textElement) {
            const input = document.getElementById('edit-text-input');
            input.value = textElement.innerText.trim();
            
            document.getElementById('edit-text-modal').style.display = 'flex';

            setTimeout(() => input.focus(), 100);
        }
    }
}

function saveTextEdit() {
    const newText = document.getElementById('edit-text-input').value.trim();
    
    if (!activeLayer) return;

    const textElement = activeLayer.querySelector('.text-layer');

    if (textElement && newText !== "") {
        textElement.innerText = newText;

        // Actualizar dataset correctamente
        activeLayer.dataset.name = "Texto: " + newText;

        // Forzar reflow (clave para que se vea el cambio)
        textElement.style.display = 'none';
        textElement.offsetHeight; // trigger reflow
        textElement.style.display = 'block';

        // Ajuste visual
        activeLayer.style.width = 'auto';
    }

    closeModal('edit-text-modal');
}
