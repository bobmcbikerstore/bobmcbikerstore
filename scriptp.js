const inventory = [
    // Se añade el arreglo 'bundle' con los IDs originales de cada pieza del paquete
    { id: 23, category: 'promo', name: "Paquetembriagues (Encendedor + Cenicero + Tarro 500ml)", price: 350, img: "img/promo1.jpg", bundle: [13, 27, 8] },
    { id: 24, category: 'promo', name: "Paquetembriagues Plus (+ Licorera)", price: 600, img: "img/promo2.jpg", bundle: [13, 27, 8, 12] },
    { id: 25, category: 'promo', name: "Promo Llaveros (Rectangular o Ovalado 3x)", price: 200, img: "img/lla.jpg", bundle: [15, 16] }, // Modifica los IDs según los llaveros que incluyas
    { id: 26, category: 'promo', name: "Promo Playeras (En stock con diseño 2x)", price: 300, img: "img/promo4.jpg" }, // Sin bundle, actuará como DTF normal
    // --- TEXTILES DTF ---
    { id: 1, category: 'dtf', name: "Playera Algodón Manga Corta", price: 200, img: "img/ph.png", imgBack: "img/phr.png" },
    { id: 2, category: 'dtf', name: "Playera Algodón Manga Larga", price: 230, img: "img/pm.png", imgBack: "img/pmr.png" },
    { id: 3, category: 'dtf', name: "Sudadera Capucha", price: 380, img: "img/scf.png", imgBack: "img/sc.png" },
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 350, img: "img/sc1.png", imgBack: "img/scr1.png" },
    { id: 5, category: 'dtf', name: "Playera Dry Fit Manga Corta", price: 300, img: "img/pd.png", imgBack: "img/pdr.png" },
    { id: 21, category: 'dtf', name: "Playera Dry Fit Manga Larga", price: 340, img: "img/pdf.jpg", imgBack: "img/pdfb.jpg" }, // Placeholder espalda
    { id: 22, category: 'dtf', name: "Playera Dry Fit tipo Polo", price: 360, img: "img/pf.jpg", imgBack: "img/pb.jpg" },   // Placeholder espalda
    { id: 6, category: 'dtf', name: "Gorras", price: 120, img: "img/gorra.jpg" },

    // --- GRABADO LÁSER ---
    { id: 7, category: 'laser', name: "Tarros 1L", price: 200, img: "img/tarro.jpg", imgBack: "img/tarro1.jpg"  },
    { id: 8, category: 'laser', name: "Tarros 500 ML", price: 150, img: "img/tarro2.jpg", imgBack: "img/tarro3.jpg" },
    { id: 9, category: 'laser', name: "Tarros 355ML", price: 90, img: "img/tarro4.jpg", imgBack: "img/tarro5.jpg" },
    { id: 10, category: 'laser', name: "Placas de Identificacion (Gruesa)", price: 160, img: "img/placa.jpg", imgBack: "img/placa.jpg" },
    { id: 11, category: 'laser', name: "Placas de Identificacion colores", price: 120, img: "img/placa1.jpg", imgBack: "img/placa1.jpg" },
    { id: 12, category: 'laser', name: "Licoreras Estuche", price: 350, img: "img/lm1.jpg" },
    { id: 13, category: 'laser', name: "Encendedor", price: 120, img: "img/en.jpg", imgBack: "img/en1.jpg" },
    { id: 14, category: 'laser', name: "Llavero de Piel", price: 120, img: "img/llaverop.jpg", imgBack: "img/llavero2.jpg" },
    { id: 15, category: 'laser', name: "Llavero de madera rectangular", price: 80, img: "img/llaverom.jpg", imgBack: "img/llaverom.jpg" },
    { id: 16, category: 'laser', name: "Llavero de madera sin esquinas", price: 80, img: "img/llaveromo.jpg", imgBack: "img/llaveromo.jpg" },
    { id: 17, category: 'laser', name: "Cartera de Piel", price: 250, img: "img/cartera.jpg", imgBack: "img/carterar.jpg" },
    { id: 18, category: 'laser', name: "Tarjetero Vinipiel", price: 150, img: "img/tarje.jpg", imgBack: "img/tarje2.jpg" },
    { id: 19, category: 'laser', name: "Termo acero inoxidable", price: 180, img: "img/termo1.jpg"},
    { id: 20, category: 'laser', name: "Taza", price: 120, img: "img/taza1.jpg", imgBack: "img/taza2.jpg" },
    { id: 27, category: 'laser', name: "Cenicero", price: 80, img: "img/ce1.jpg" }
];
let cart = JSON.parse(localStorage.getItem('bob_cart')) || [];
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));
const product = inventory.find(p => p.id === productId);

// Variables para manipulación
let activeLayer = null;
let isDragging = false, isResizing = false, isRotating = false;
let startX, startY, startWidth, startAngle;
let currentBundleIndex = 0; // Controla qué producto del paquete estamos viendo

// --- 2. INICIALIZACIÓN DE PRODUCTO ---
// --- 2. INICIALIZACIÓN DE PRODUCTO ---
if(product) {
    if (product.id === 25) {
        // Promo Llaveros
        document.getElementById('keychain-setup-section').style.display = 'block';
        document.getElementById('customization-steps-container').style.display = 'none';
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-price').innerText = `$${product.price} MXN`;
        document.getElementById('product-img-frente').src = product.img;

    } else if (product.id === 26) {
        // Promo Playeras Stock
        document.querySelector('.preview-box').style.display = 'none'; // Ocultar visualizador
        document.getElementById('keychain-setup-section').style.display = 'none';
        document.getElementById('customization-steps-container').style.display = 'none';
        document.getElementById('tshirt-promo-section').style.display = 'block';

        // Cargar las 10 playeras
        renderTshirtGrid();

    } else {
        // Productos normales
        document.getElementById('keychain-setup-section').style.display = 'none';
        document.getElementById('customization-steps-container').style.display = 'block';
        initProductUI();
    }
}

// Función que captura la decisión de formas y desbloquea el personalizador
function confirmKeychainSelection() {
    const k1 = parseInt(document.getElementById('kc-1').value);
    const k2 = parseInt(document.getElementById('kc-2').value);
    const k3 = parseInt(document.getElementById('kc-3').value);

    // Asignamos los 3 llaveros seleccionados al paquete
    product.bundle = [k1, k2, k3];

    // Ocultar sección de configuración y mostrar la interfaz de diseño paso a paso
    document.getElementById('keychain-setup-section').style.display = 'none';
    document.getElementById('customization-steps-container').style.display = 'block';

    // Inicializar el motor de vistas múltiples
    initProductUI();
}

function initProductUI() {
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-price').innerText = `$${product.price} MXN`;

    const viewSelector = document.getElementById('view-selector');
    const previewBox = document.querySelector('.preview-box');

    let bundleContainer = document.getElementById('bundle-container');
    if(!bundleContainer) {
        bundleContainer = document.createElement('div');
        bundleContainer.id = 'bundle-container';
        previewBox.insertBefore(bundleContainer, document.getElementById('product-price'));
    }
    bundleContainer.innerHTML = '';

    const originalLabel = document.querySelector('.preview-box .view-label');

    if (product.bundle) {
        // ES UN PAQUETE PROMOCIONAL
        if (originalLabel) originalLabel.style.display = 'none';
        document.getElementById('canvas-frente').style.display = 'none';
        document.getElementById('back-view-wrapper').style.display = 'none';
        viewSelector.innerHTML = '';
        currentBundleIndex = 0;

        product.bundle.forEach((itemId, index) => {
            const item = inventory.find(i => i.id === itemId);
            if (item) {
                const displayStyle = index === 0 ? 'block' : 'none';
                let html = `<div class="bundle-step" id="bundle-step-${index}" style="display: ${displayStyle};">`;

                html += `<h3 style="color: #fff; text-align: center; margin: 15px 0;">Paso ${index + 1} de ${product.bundle.length}: ${item.name}</h3>`;

                const frenteId = `canvas-frente-${item.id}`;
                html += `
                    <div class="view-label" style="margin-top: 10px;">FRENTE</div>
                    <div class="image-container canvas-container" id="${frenteId}">
                        <img src="${item.img}" alt="Frente">
                    </div>
                `;

                if (item.imgBack) {
                    const espaldaId = `canvas-espalda-${item.id}`;
                    html += `
                        <div class="view-label" style="margin-top: 20px;">ESPALDA</div>
                        <div class="image-container canvas-container" id="${espaldaId}">
                            <img src="${item.imgBack}" alt="Espalda">
                        </div>
                    `;
                }
                html += `</div>`;
                bundleContainer.innerHTML += html;
            }
        });

        updateViewSelectorForBundle(0);
        setupBundleNavigation();

    } else {
        // PRODUCTO NORMAL O PROMO DE PLAYERAS
        if (originalLabel) originalLabel.style.display = 'block';
        document.getElementById('canvas-frente').style.display = 'block';

        document.getElementById('product-img-frente').src = product.img;
        if(product.imgBack) {
            document.getElementById('back-view-wrapper').style.display = 'block';
            document.getElementById('product-img-espalda').src = product.imgBack;
        } else {
            document.getElementById('back-view-wrapper').style.display = 'none';
        }

        setupBundleNavigation();
    }

    // --- LÓGICA DE COLOR Y TALLA FILTRADA ---
    const colorSelect = document.getElementById('color');
    const colorContainer = colorSelect.closest('.input-group');
    const sizeContainer = document.getElementById('size-container');

    if (product.category === 'dtf' || product.id === 26) {
        colorContainer.style.display = 'block';
        sizeContainer.style.display = 'block';
        colorSelect.innerHTML = '';
        const dtfColors = ["Negro", "Blanco", "Marino", "Rojo", "Vino", "Oxford", "Militar", "Rey", "Rosa"];

        dtfColors.forEach(c => {
            let opt = document.createElement('option');
            opt.value = c; opt.innerText = c;
            colorSelect.appendChild(opt);
        });
    } else {
        sizeContainer.style.display = 'none';
        colorContainer.style.display = 'none';
        colorSelect.innerHTML = '<option value="N/A">N/A</option>';
    }
}


function initProductUI() {
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-price').innerText = `$${product.price} MXN`;

    const viewSelector = document.getElementById('view-selector');
    const previewBox = document.querySelector('.preview-box');

    let bundleContainer = document.getElementById('bundle-container');
    if(!bundleContainer) {
        bundleContainer = document.createElement('div');
        bundleContainer.id = 'bundle-container';
        previewBox.insertBefore(bundleContainer, document.getElementById('product-price'));
    }
    bundleContainer.innerHTML = '';

    const originalLabel = document.querySelector('.preview-box .view-label');

    if (product.bundle) {
        // ES UN PAQUETE PROMOCIONAL
        if (originalLabel) originalLabel.style.display = 'none';
        document.getElementById('canvas-frente').style.display = 'none';
        document.getElementById('back-view-wrapper').style.display = 'none';
        viewSelector.innerHTML = '';
        currentBundleIndex = 0; // Reiniciar siempre al cargar

        // Generar todos los contenedores pero ocultar los que no son el primero
        product.bundle.forEach((itemId, index) => {
            const item = inventory.find(i => i.id === itemId);
            if (item) {
                // Solo el primer producto (index 0) será visible al inicio
                const displayStyle = index === 0 ? 'block' : 'none';
                let html = `<div class="bundle-step" id="bundle-step-${index}" style="display: ${displayStyle};">`;

                // Título para saber qué accesorio se está personalizando
                html += `<h3 style="color: #fff; text-align: center; margin: 15px 0;">Paso ${index + 1} de ${product.bundle.length}: ${item.name}</h3>`;

                const frenteId = `canvas-frente-${item.id}`;
                html += `
                    <div class="view-label" style="margin-top: 10px;">FRENTE</div>
                    <div class="image-container canvas-container" id="${frenteId}">
                        <img src="${item.img}" alt="Frente">
                    </div>
                `;

                if (item.imgBack) {
                    const espaldaId = `canvas-espalda-${item.id}`;
                    html += `
                        <div class="view-label" style="margin-top: 20px;">ESPALDA</div>
                        <div class="image-container canvas-container" id="${espaldaId}">
                            <img src="${item.imgBack}" alt="Espalda">
                        </div>
                    `;
                }
                html += `</div>`;
                bundleContainer.innerHTML += html;
            }
        });

        // Configurar selector y botones para el paso 1
        updateViewSelectorForBundle(0);
        setupBundleNavigation();

    } else {
        // PRODUCTO NORMAL O PROMO DE PLAYERAS
        if (originalLabel) originalLabel.style.display = 'block';
        document.getElementById('canvas-frente').style.display = 'block';

        document.getElementById('product-img-frente').src = product.img;
        if(product.imgBack) {
            document.getElementById('back-view-wrapper').style.display = 'block';
            document.getElementById('product-img-espalda').src = product.imgBack;
        } else {
            document.getElementById('back-view-wrapper').style.display = 'none';
        }

        // Asegurar que el botón normal de carrito esté visible si no es bundle
        setupBundleNavigation();
    }

    // --- LÓGICA DE COLOR Y TALLA FILTRADA ---
    const colorSelect = document.getElementById('color');
    const colorContainer = colorSelect.closest('.input-group');
    const sizeContainer = document.getElementById('size-container');

    if (product.category === 'dtf' || product.id === 26) {
        colorContainer.style.display = 'block';
        sizeContainer.style.display = 'block';
        colorSelect.innerHTML = '';
        const dtfColors = ["Negro", "Blanco", "Marino", "Rojo", "Vino", "Oxford", "Militar", "Rey", "Rosa"];

        dtfColors.forEach(c => {
            let opt = document.createElement('option');
            opt.value = c; opt.innerText = c;
            colorSelect.appendChild(opt);
        });
    } else {
        sizeContainer.style.display = 'none';
        colorContainer.style.display = 'none';
        colorSelect.innerHTML = '<option value="N/A">N/A</option>';
    }
}

// --- 3. SUBIDA Y CREACIÓN DE LOGOS ---
document.getElementById('logo-file').addEventListener('change', function(e) {
    const files = e.target.files;
    // Obtenemos cuál vista seleccionó el usuario
    const selectedView = document.getElementById('view-selector').value;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Validamos si la vista trasera existe para ese producto
            // Dentro de tu reader.onload = (event) => {
            if (!product.bundle && selectedView === 'canvas-espalda' && !product.imgBack) {
                showGenericAlert("AVISO", "Este producto no tiene vista trasera disponible.");
                return;
            }
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

    // Preparar el texto de talla y color (Aplica principalmente para textiles)
    let detallesTexto = "";
    if (product.category === 'dtf' || product.id === 26) {
        const color = document.getElementById('color').value;
        const sizeSelect = document.getElementById('size');
        const tallaTexto = sizeSelect.options[sizeSelect.selectedIndex].text.split(' (')[0];

        detallesTexto = `TALLA: ${tallaTexto.toUpperCase()} | COLOR: ${color.toUpperCase()} | `;
    }

    let viewsToDownload = [];

    if (product.bundle) {
        // SI ES UN PAQUETE: Solo obtener los contenedores (frente/espalda) del paso actual
        const currentItemId = product.bundle[currentBundleIndex];

        // Agregar vista frontal del accesorio actual
        viewsToDownload.push(`canvas-frente-${currentItemId}`);

        // Revisar si ese accesorio en particular tiene vista trasera y agregarla
        const currentItem = inventory.find(i => i.id === currentItemId);
        if (currentItem && currentItem.imgBack) {
            viewsToDownload.push(`canvas-espalda-${currentItemId}`);
        }
    } else {
        // SI ES PRODUCTO NORMAL: Obtener frente y espalda estándar
        viewsToDownload = ['canvas-frente'];
        if (product.imgBack) viewsToDownload.push('canvas-espalda');
    }

    // Procesar y descargar solo las vistas seleccionadas
    for (let id of viewsToDownload) {
        const container = document.getElementById(id);
        if (!container) continue;

        // Intentar leer el nombre correcto desde el selector de opciones
        const option = document.querySelector(`#view-selector option[value="${id}"]`);
        const vistaNombre = option ? option.innerText : (id.includes('frente') ? 'FRENTE' : 'ESPALDA');

        // 1. Crear la etiqueta temporal que se guardará en la imagen
        const watermark = document.createElement('div');
        watermark.innerHTML = `${detallesTexto}VISTA: ${vistaNombre}`;
        watermark.style.position = 'absolute';
        watermark.style.bottom = '10px';
        watermark.style.left = '50%';
        watermark.style.transform = 'translateX(-50%)';
        watermark.style.background = 'rgba(0, 0, 0, 0.85)';
        watermark.style.color = '#ffffff';
        watermark.style.border = '1px solid #ff3300';
        watermark.style.padding = '6px 12px';
        watermark.style.fontFamily = "'Roboto', sans-serif";
        watermark.style.fontSize = '12px';
        watermark.style.fontWeight = 'bold';
        watermark.style.borderRadius = '4px';
        watermark.style.zIndex = '9999';
        watermark.style.whiteSpace = 'nowrap';

        // 2. Añadir la etiqueta al contenedor del lienzo
        container.appendChild(watermark);

        // 3. Tomar la "fotografía" del contenedor
        const canvas = await html2canvas(container, { useCORS: true });

        // 4. Retirar la etiqueta
        container.removeChild(watermark);

        // 5. Descargar la imagen
        const link = document.createElement('a');

        // Obtener el nombre del producto para el archivo
        let productNameForFile = product.name;
        if (product.bundle) {
             const currentItemForName = inventory.find(i => i.id === product.bundle[currentBundleIndex]);
             if(currentItemForName) productNameForFile = currentItemForName.name;
        }

        link.download = `DISEÑO_${vistaNombre.replace(/\s+/g, '_')}_${productNameForFile.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    showAlertModal("GUARDADO", "El diseño de esta pieza se ha descargado. Continúa personalizando tu paquete.");
}

function addToCart() {
    const layers = document.querySelectorAll('.logo-wrapper');
    const logosInfo = Array.from(layers).map(l => {
    const containerId = l.parentElement.id;
    const option = document.querySelector(`#view-selector option[value="${containerId}"]`);
    const vistaName = option ? option.innerText : (containerId === 'canvas-frente' ? 'Frente' : 'Espalda');
    return `${l.dataset.name} (${vistaName})`;
}).join(", ");

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

    // CORRECCIÓN: En lugar de buscar un modal que no existe, mostramos el carrito y una alerta.
    document.getElementById('cart-floating').style.display = 'flex';
    showAlertModal("✅ AÑADIDO", "Tu artículo se ha guardado en el arsenal.");
}

// --- FUNCIÓN ACTUALIZADA CON IMÁGENES Y MEJOR DISEÑO ---
// --- FUNCIÓN ACTUALIZADA CON IMÁGENES Y MEJOR DISEÑO ---
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#888; font-style:italic; margin-top:20px;">Tu arsenal está vacío...</p>`;
        totalEl.innerText = 0;

        // --- NUEVO: Ocultar el contador si el carrito está vacío ---
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.innerText = 0;
            counter.classList.add('hidden');
        }
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;

        const imgSrc = item.img ? item.img : 'https://placehold.co/50x50/111111/ff3300?text=BOB';

        container.innerHTML += `
            <div class="cart-item-card">
                <div class="cart-item-img-container">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.src='https://placehold.co/50x50/111111/ff3300?text=BOB'">
                </div>

                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <strong>${item.name}</strong>
                        <span onclick="removeItem(${index})" class="cart-item-remove" title="Eliminar del arsenal">✕</span>
                    </div>

                    <div class="cart-item-specs">
                        ${item.size && item.size !== "N/A" ? `<span>Talla: ${item.size}</span>` : ''}
                        ${item.color && item.color !== "N/A" ? `<span>Color: ${item.color}</span>` : ''}
                        ${item.logoName && item.logoName !== "Sin logo" ? `<span>Diseño: ${item.logoName}</span>` : ''}
                        ${item.notes ? `<span class="cart-notes">📝 ${item.notes}</span>` : ''}
                    </div>

                    <div class="cart-item-price-row">
                        <span class="cart-item-price">$${item.price} MXN</span>
                    </div>
                </div>
            </div>
        `;
    });
    totalEl.innerText = total;

    // --- NUEVO: Actualizar el contador con el número de items ---
    const counter = document.getElementById('cart-counter');
    if (counter) {
        counter.innerText = cart.length;
        counter.classList.remove('hidden');

        // Efecto visual rápido al agregar
        counter.style.transform = 'scale(1.3)';
        setTimeout(() => counter.style.transform = 'scale(1)', 200);
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('bob_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart() {
    const el = document.getElementById('cart-floating');
    // Se cambia 'block' por 'flex'
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'flex' : 'none';
}

// Abrir modal de datos
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showAlertModal("⚠️ CARRITO VACÍO", "Aún no tienes armamento en tu arsenal.");
        return;
    }
    document.getElementById('checkout-modal').style.display = 'flex';
    togglePaymentDetails(); // Iniciar UI oculta
    toggleDeliveryDetails(); // Iniciar UI oculta
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
    const nameInput = document.getElementById('client-name');
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (!nameInput || nameInput.value.trim() === "") {
        showAlertModal("⚠️ ACCESO DENEGADO", "Debes ingresar tu nombre de piloto para registrar el pedido.");
        return;
    }
    if (!delivery || !payment) {
        showAlertModal("⚠️ FALTAN DATOS", "Debes seleccionar un punto de entrega y método de pago.");
        return;
    }

    const name = nameInput.value;

    let message = `🏴‍☠️ *NUEVA ORDEN B.O.B CUSTOM* 🏴‍☠️\n\n`;
    message += `👤 *CLIENTE:* ${name.toUpperCase()}\n`;
    message += `📍 *ENTREGA:* ${delivery}\n`;

    if (delivery === "Narvarte / Santa Moto") {
        message += `   _(Por favor, envíame la ubicación del local/punto)_\n`;
    } else if (delivery === "Domicilio") {
        message += `   _(Por favor, cotízame el envío a mi domicilio)_\n`;
    }

    message += `💳 *PAGO:* ${payment}\n`;

    if (payment === 'Efectivo') {
        const cash = parseFloat(document.getElementById('cash-amount').value) || 0;
        message += `   💵 Paga con: $${cash}\n`;
        if (cash >= total) {
            message += `   🪙 Cambio a entregar: $${cash - total}\n`;
        }
    } else if (payment === 'Tarjeta') {
        message += `   💳 _Llevar terminal para el cobro_\n`;
    } else if (payment === 'Transferencia') {
        message += `   📱 _Se depositará a la CLABE: 012080015528219551 (Gabriela Gomez Robles)_\n`;
    }

    message += `──────────────────\n\n`;

    cart.forEach((item, i) => {
        const icono = item.tshirtList ? '🔥' : '📦';
        message += `${icono} *ARTÍCULO ${i + 1}:* ${item.name}\n`;

        if (item.tshirtList) {
            message += item.tshirtList;
        }

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

// --- GUÍA DE PERSONALIZACIÓN ---
function showTutorial() {
    const mensaje = `
    1️⃣ ELIGE TU BASE: Selecciona tu talla y el color de la prenda.
    2️⃣ POSICIÓN: Decide si tu diseño va al frente o en la espalda.
    3️⃣ SUBE TU LOGO: Carga tu imagen o añade texto.
    4️⃣ AJUSTA: Toca tu diseño para moverlo, usa la esquina inferior para cambiar el tamaño y la superior para rotarlo.
    5️⃣ GUARDA: Presiona el boton de guardar diseño
    6️⃣ FINALIZA: Añade al carrito y envía tu pedido para procesarlo.
    `;
    showAlertModal("🛠️ GUÍA DE PERSONALIZACIÓN", mensaje);
}

// Opcional: Mostrar la guía automáticamente la primera vez que entran
window.addEventListener('DOMContentLoaded', (event) => {
    // Revisa si ya vio el tutorial usando localStorage
    if (!localStorage.getItem('bob_tutorial_visto')) {
        setTimeout(showTutorial, 1000);
        localStorage.setItem('bob_tutorial_visto', 'true');
    }
});

// --- FUNCIONES DE NAVEGACIÓN PARA PAQUETES ---

function updateViewSelectorForBundle(index) {
    const viewSelector = document.getElementById('view-selector');
    viewSelector.innerHTML = '';
    const itemId = product.bundle[index];
    const item = inventory.find(i => i.id === itemId);

    if (item) {
        const frenteId = `canvas-frente-${item.id}`;
        viewSelector.innerHTML += `<option value="${frenteId}">FRENTE</option>`;

        if (item.imgBack) {
            const espaldaId = `canvas-espalda-${item.id}`;
            viewSelector.innerHTML += `<option value="${espaldaId}">ESPALDA</option>`;
        }
    }
}

function setupBundleNavigation() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    let nextBtn = document.getElementById('btn-next-bundle');

    if (product.bundle && product.bundle.length > 1) {
        addToCartBtn.style.display = 'none'; // Ocultar añadir al carrito al inicio

        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'btn-next-bundle';
            nextBtn.className = 'btn';
            nextBtn.style.width = '100%';
            // Estilo opcional para que resalte
            nextBtn.style.backgroundColor = 'var(--primary)';
            nextBtn.style.color = 'black';
            nextBtn.innerText = 'SIGUIENTE ARTÍCULO ➡️';
            nextBtn.onclick = nextBundleItem;
            // Insertarlo justo antes del botón de carrito
            addToCartBtn.parentNode.insertBefore(nextBtn, addToCartBtn);
        }
        nextBtn.style.display = 'block';
    } else {
        // Si no es un paquete (o es la promo 26), asegurar comportamiento normal
        addToCartBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

function nextBundleItem() {
    // 1. Ocultar el producto que acabamos de personalizar
    const currentStep = document.getElementById(`bundle-step-${currentBundleIndex}`);
    if (currentStep) currentStep.style.display = 'none';

    // 2. Avanzar al siguiente índice
    currentBundleIndex++;

    // 3. Mostrar el nuevo producto
    const nextStep = document.getElementById(`bundle-step-${currentBundleIndex}`);
    if (nextStep) nextStep.style.display = 'block';

    // 4. Actualizar el selector desplegable (Frente/Espalda) para el nuevo producto
    updateViewSelectorForBundle(currentBundleIndex);

    // 5. Hacer scroll suave hacia arriba para que el usuario vea el nuevo artículo
    document.querySelector('.preview-box').scrollIntoView({ behavior: 'smooth' });

    // 6. Si llegamos al último producto del paquete...
    if (currentBundleIndex === product.bundle.length - 1) {
        document.getElementById('btn-next-bundle').style.display = 'none'; // Ocultar "Siguiente"
        document.getElementById('add-to-cart-btn').style.display = 'block'; // Revelar "Añadir al carrito"
    }
}

// --- FUNCIONES PARA PROMO PLAYERAS (ID 26) ---

function renderTshirtGrid() {
    const grid = document.getElementById('tshirt-grid');
    grid.innerHTML = '';

    // AQUÍ COLOCAS LOS NOMBRES E IMÁGENES DE TUS 10 PLAYERAS
    const promoShirts = [
        { id: 'ts1', name: "Playera Biker Skull", img: "img/ph.png" },
        { id: 'ts2', name: "Playera Ruta 66", img: "img/ph.png" },
        { id: 'ts3', name: "Playera Custom", img: "img/ph.png" },
        { id: 'ts4', name: "Playera Chopper", img: "img/ph.png" },
        { id: 'ts5', name: "Playera Bobber", img: "img/ph.png" },
        { id: 'ts6', name: "Playera Águila", img: "img/ph.png" },
        { id: 'ts7', name: "Playera Motor V2", img: "img/ph.png" },
        { id: 'ts8', name: "Playera MC Club", img: "img/ph.png" },
        { id: 'ts9', name: "Playera Ride Hard", img: "img/ph.png" },
        { id: 'ts10', name: "Playera Vintage Rider", img: "img/ph.png" }
    ];

    promoShirts.forEach(shirt => {
        grid.innerHTML += `
            <label class="tshirt-option" style="border: 1px solid #444; border-radius: 8px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; background: #181818; transition: 0.3s;">
                <img src="${shirt.img}" alt="${shirt.name}" style="width: 100%; height: 120px; object-fit: contain; border-radius: 4px; margin-bottom: 10px; background: #222;">
                <span style="color: white; font-size: 0.8rem; text-align: center; margin-bottom: 8px; font-weight: bold;">${shirt.name}</span>
                <input type="checkbox" class="tshirt-cb" value="${shirt.name}" onchange="limitTshirtSelection(this)" style="transform: scale(1.5); cursor: pointer;">
            </label>
        `;
    });
}

function limitTshirtSelection(checkbox) {
    const selectedCheckboxes = document.querySelectorAll('.tshirt-cb:checked');
    if (selectedCheckboxes.length > 2) {
        checkbox.checked = false; // Desmarcar si intenta seleccionar una tercera
        showAlertModal("⚠️ LÍMITE ALCANZADO", "Solo puedes seleccionar 2 diseños para esta promoción.");
    }

    // Resaltar visualmente las seleccionadas
    document.querySelectorAll('.tshirt-cb').forEach(cb => {
        cb.parentElement.style.borderColor = cb.checked ? 'var(--primary)' : '#444';
        cb.parentElement.style.boxShadow = cb.checked ? '0 0 10px rgba(255, 51, 0, 0.5)' : 'none';
    });
}

function addTshirtPromoToCart() {
    const selected = document.querySelectorAll('.tshirt-cb:checked');

    // Validación: Obligar a seleccionar exactamente 2 playeras
    if (selected.length !== 2) {
        showAlertModal("⚠️ ATENCIÓN", "Debes marcar exactamente 2 playeras en el catálogo.");
        return;
    }

    // Extraemos los nombres
    const p1 = selected[0].value;
    const p2 = selected[1].value;

    // Creamos el artículo con la propiedad especial "tshirtList"
    const promoItem = {
        name: product.name,
        price: product.price,
        size: "", // Vacío para que salte la línea de detalles
        color: "",
        notes: "",
        logoName: "",
        tshirtList: `   Playera 1: ${p1}\n   Playera 2: ${p2}\n`
    };

    cart.push(promoItem);
    localStorage.setItem('bob_cart', JSON.stringify(cart));
    updateCartUI();

    // Limpiar selección
    selected.forEach(cb => {
        cb.checked = false;
        cb.parentElement.style.borderColor = '#444';
        cb.parentElement.style.boxShadow = 'none';
    });

    document.getElementById('cart-floating').style.display = 'flex';
    showAlertModal("✅ AÑADIDO", "La promoción de playeras se guardó en tu arsenal.");
}
// --- NUEVAS FUNCIONES PARA PAGOS Y ENTREGAS ---

function togglePaymentDetails() {
    const method = document.getElementById('payment-method').value;
    const container = document.getElementById('payment-details-container');
    const cashDiv = document.getElementById('cash-details');
    const transferDiv = document.getElementById('transfer-details');
    const cardDiv = document.getElementById('card-details');

    container.style.display = 'block';
    cashDiv.style.display = 'none';
    transferDiv.style.display = 'none';
    cardDiv.style.display = 'none';

    if (method === 'Efectivo') {
        cashDiv.style.display = 'block';
        calculateChange();
    } else if (method === 'Transferencia') {
        transferDiv.style.display = 'block';
    } else if (method === 'Tarjeta') {
        cardDiv.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function calculateChange() {
    const cashInput = document.getElementById('cash-amount').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const changeDisplay = document.getElementById('change-display');

    if (cashInput && parseFloat(cashInput) >= total) {
        const change = parseFloat(cashInput) - total;
        changeDisplay.innerText = `Cambio: $${change.toFixed(2)} MXN`;
    } else {
        changeDisplay.innerText = `Cambio: $0.00 MXN (Por favor ingresa un monto mayor o igual al total de $${total})`;
    }
}

function toggleDeliveryDetails() {
    const delivery = document.getElementById('delivery-point').value;
    const container = document.getElementById('delivery-details-container');
    const infoText = document.getElementById('delivery-info-text');

    if (delivery === "Narvarte / Santa Moto") {
        container.style.display = 'block';
        infoText.innerText = "Te enviaremos la ubicación exacta por WhatsApp. (Solo domingos)";
    } else if (delivery === "Domicilio") {
        container.style.display = 'block';
        infoText.innerText = "Se te cotizará el envío por WhatsApp dependiendo de donde sea la entrega.";
    } else if (delivery) {
        container.style.display = 'none'; // Para los puntos medios no mostramos alerta extra
    }
}
