const inventory = [
    // --- PROMOCIONES ---
    { id: 23, category: 'promo', name: "Paquetembriagues (Encendedor + Cenicero + Tarro 500ml)", price: 350, img: "img/p1.jpg" },
    { id: 24, category: 'promo', name: "Paquetembriagues Plus (+ Licorera)", price: 600, img: "img/pp.jpg" },
    { id: 25, category: 'promo', name: "Promo Llaveros (Rectangular o Ovalado 3x$200)", price: 200, img: "img/lla.jpg" },
    { id: 26, category: 'promo', name: "Promo Playeras (En stock con diseño 2x$300)", price: 300, img: "img/pla.jpg" },

    // --- TEXTILES DTF ---
    { id: 1, category: 'dtf', name: "Playera Algodón Manga Corta", price: 200, img: "img/plc.jpg" },
    { id: 2, category: 'dtf', name: "Playera Algodón Manga Larga", price: 230, img: "img/plcb.jpg" },
    { id: 3, category: 'dtf', name: "Sudadera Capucha", price: 380, img: "img/scn.jpg" },
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 350, img: "img/scb.jpg" },
    { id: 5, category: 'dtf', name: "Playera Dry Fit Manga Corta", price: 300, img: "img/pdn.jpg" },
    { id: 21, category: 'dtf', name: "Playera Dry Fit Manga Larga", price: 340, img: "img/pdl.jpg" },
    { id: 22, category: 'dtf', name: "Playera Dry Fit tipo Polo", price: 360, img: "img/polo.jpg" },
    { id: 6, category: 'dtf', name: "Gorras", price: 120, img: "img/mgorra.jpg" },

    // --- GRABADO LÁSER ---
    { id: 7, category: 'laser', name: "Tarros 1L", price: 200, img: "img/t1.jpg" },
    { id: 8, category: 'laser', name: "Tarros 500 ML", price: 150, img: "img/t500.jpg" },
    { id: 9, category: 'laser', name: "Tarros 355ML", price: 90, img: "img/t355.jpg" },
    { id: 10, category: 'laser', name: "Placas de Identificacion (Gruesa)", price: 160, img: "img/pid.jpg" },
    { id: 11, category: 'laser', name: "Placas de Identificacion colores", price: 120, img: "img/pidc.jpg" },
    { id: 12, category: 'laser', name: "Licoreras Estuche", price: 350, img: "img/lm.jpg" },
    { id: 13, category: 'laser', name: "Encendedor", price: 120, img: "img/e.jpg" },
    { id: 14, category: 'laser', name: "Llavero de Piel", price: 120, img: "img/llp.jpg" },
    { id: 15, category: 'laser', name: "Llavero de madera rectangular", price: 80, img: "img/llr.jpg" },
    { id: 16, category: 'laser', name: "Llavero de madera sin esquinas", price: 80, img: "img/llrse.jpg" },
    { id: 17, category: 'laser', name: "Cartera de Piel", price: 250, img: "img/car.jpg" },
    { id: 18, category: 'laser', name: "Tarjetero Vinipiel", price: 150, img: "img/tar.jpg" },
    { id: 19, category: 'laser', name: "Termo acero inoxidable", price: 180, img: "img/termo.jpg" },
    { id: 20, category: 'laser', name: "Taza", price: 120, img: "img/taza.jpg" },
    { id: 27, category: 'laser', name: "Cenicero", price: 80, img: "img/ce.jpg" }
];

function renderProducts(filter = 'all') {
    const container = document.getElementById('product-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = filter === 'all' ? inventory : inventory.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';

        // Logica para cambiar la etiqueta visual dependiendo de la categoría
        let categoryLabel = 'Láser';
        if(p.category === 'dtf') categoryLabel = 'DTF';
        if(p.category === 'promo') categoryLabel = 'PROMO';

        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/250x200/111111/ff3300?text=BOB+GEAR'">
            <span class="category-tag">${categoryLabel}</span>
            <h3>${p.name}</h3>
            <p class="price">$${p.price} MXN</p>
            <a href="personalizar.html?id=${p.id}" class="btn" style="display:inline-block; margin-top:10px;">Personalizar Ahora</a>
        `;
        container.appendChild(card);
    });
}

function filterProducts(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');
    renderProducts(cat);
}

window.onload = () => renderProducts('all');

// Opcional: Mostrar un indicador de cuántos items hay en el carrito en la página principal
function checkCartCounter() {
    const cart = JSON.parse(localStorage.getItem('bob_cart')) || [];
    if(cart.length > 0) {
        // Podrías crear un pequeño aviso que diga "Tienes X productos en el carrito"
        console.log("Items en carrito:", cart.length);
    }
}
window.addEventListener('load', checkCartCounter);

// Cargar carrito desde LocalStorage
let cart = JSON.parse(localStorage.getItem('bob_cart')) || [];

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


// Las demás funciones (removeItem, toggleCart, etc.) se mantienen igual

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('bob_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart() {
    const el = document.getElementById('cart-floating');
    // Soporte para animaciones si se desea en el futuro
    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'flex';
    } else {
        el.style.display = 'none';
    }
}

// 1. Esta función ahora solo abre el modal de datos
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showAlertModal("⚠️ CARRITO VACÍO", "Aún no tienes armamento en tu arsenal.");
        return;
    }
    document.getElementById('checkout-modal').style.display = 'flex';
    togglePaymentDetails(); // Iniciar UI oculta
    toggleDeliveryDetails(); // Iniciar UI oculta
}

// 2. Función para cerrar el modal de datos
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// 3. Esta es la función final que envía TODO a WhatsApp
function confirmOrder() {
    const nameInput = document.getElementById('client-name');
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;

    if (!nameInput || nameInput.value.trim() === "") {
        showAlertModal("⚠️ ACCESO DENEGADO", "Debes ingresar tu nombre de piloto para registrar el pedido.");
        return;
    }
    if (!delivery || !payment) {
        showAlertModal("⚠️ FALTAN DATOS", "Debes seleccionar un punto de entrega y método de pago.");
        return;
    }

    const name = nameInput.value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    let message = `🏴‍☠️ *NUEVA ORDEN B.O.B CUSTOM* 🏴‍☠️\n\n`;
    message += `👤 *CLIENTE:* ${name.toUpperCase()}\n`;
    message += `📍 *ENTREGA:* ${delivery}\n`;

    if (delivery === "Narvarte / Santa Moto") {
        message += `   _(Por favor, envíame la ubicación del local/punto)_\n`;
    } else if (delivery === "Domicilio") {
        message += `   _(Por favor, cotízame el envío a mi domicilio)_\n`;
    }

    message += `💳 *PAGO:* ${payment}\n`;

    // Lógica para enviar detalles del método de pago
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
        message += `📦 *ARTÍCULO ${i + 1}:* ${item.name}\n`;
        if (item.size || item.color) message += `   • Detalle: ${item.size || 'N/A'} / ${item.color || 'N/A'}\n`;
        if (item.logoName && item.logoName !== "Sin logo") message += `   • Diseño: ${item.logoName}\n`;
        if (item.position) message += `   • Ubicación: ${item.position}\n`;
        if (item.notes) message += `   • Notas: _${item.notes}_\n`;
        message += `   • Subtotal: *$${item.price} MXN*\n\n`;
    });

    message += `──────────────────\n`;
    message += `💰 *TOTAL A PAGAR: $${total} MXN*\n\n`;
    message += `_Por favor, adjunta tus capturas de diseño si personalizaste algún artículo._`;

    const phone = "525546628442";
    closeCheckoutModal();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Inicializar al cargar la página
window.addEventListener('load', updateCartUI);

// Función para mostrar el modal personalizado
function showAlertModal(titulo, mensaje) {
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-message').innerText = mensaje;
    document.getElementById('alert-modal').style.display = 'flex';
}

function closeAlertModal() {
    document.getElementById('alert-modal').style.display = 'none';
}


// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
    const modal = document.getElementById('alert-modal');
    if (e.target == modal) closeAlertModal();
});

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
        infoText.innerText = "Te enviaremos la ubicación exacta por WhatsApp.";
    } else if (delivery === "Domicilio") {
        container.style.display = 'block';
        infoText.innerText = "Se te cotizará el envío por WhatsApp dependiendo de donde sea la entrega.";
    } else if (delivery) {
        container.style.display = 'none'; // Para los puntos medios no mostramos alerta extra
    }
}
