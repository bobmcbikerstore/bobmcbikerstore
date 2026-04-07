const inventory = [
    // --- TEXTILES DTF ---
    { id: 1, category: 'dtf', name: "Playera Manga Corta", price: 200, img: "img/ph.png" }, // Precio actualizado
    { id: 2, category: 'dtf', name: "Playera Manga Larga", price: 220, img: "img/pm.png" }, // Nuevo precio
    { id: 3, category: 'dtf', name: "Sudadera Capucha", price: 350, img: "img/scf.png" },     // Precio actualizado
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 300, img: "img/sc1.png" },    // Precio actualizado
    { id: 5, category: 'dtf', name: "Playera Dry Fit", price: 300, img: "img/pd.png" },      // Precio actualizado
    { id: 6, category: 'dtf', name: "Gorras", price: 100, img: "img/gm.png" },               // Precio actualizado

    // --- GRABADO LÁSER ---
    { id: 7, category: 'laser', name: "Tarros 1L", price: 190, img: "img/t1.png" },         // Nuevo producto
    { id: 8, category: 'laser', name: "Tarros 600 ML", price: 150, img: "img/t600.png" },    // Nuevo producto
    { id: 9, category: 'laser', name: "Tarros 355ML", price: 100, img: "img/t355.png" },     // Nuevo producto
    { id: 10, category: 'laser', name: "Placas y Llaveros", price: 100, img: "img/pmm.png" },// Precio actualizado
    { id: 11, category: 'laser', name: "Licoreras Estuche", price: 350, img: "img/lm.jpg" }, // Precio actualizado
    { id: 12, category: 'laser', name: "Encendedor", price: 120, img: "img/e.png" },       // Nuevo producto
    { id: 13, category: 'laser', name: "Portallaves", price: 150, img: "img/pll.png" },      // Precio actualizado
    { id: 14, category: 'laser', name: "Portacascos", price: 250, img: "img/pc.png" },       // Precio actualizado
    { id: 15, category: 'laser', name: "Navajas", price: 200, img: "img/n.png" },           // Precio actualizado
    { id: 16, category: 'laser', name: "Cuadros", price: 150, img: "img/c.png" }          // Nuevo producto
];

function renderProducts(filter = 'all') {
    const container = document.getElementById('product-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = filter === 'all' ? inventory : inventory.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/250x200?text=B.O.B+Gear'">
            <span class="category-tag">${p.category === 'dtf' ? 'DTF' : 'Láser'}</span>
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

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if(!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div style="border-bottom: 1px solid #333; padding: 5px 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.size || ''} ${item.color || ''}</small>
                </div>
                <div>
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

// 1. Esta función ahora solo abre el modal de datos
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showAlertModal("⚠️ CARRITO VACÍO", "Aún no tienes armamento en tu arsenal.");
        return;
    }
    // Abrimos el modal de recolección de datos
    document.getElementById('checkout-modal').style.display = 'flex';
}

// 2. Función para cerrar el modal de datos
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// 3. Esta es la función final que envía TODO a WhatsApp
function confirmOrder() {
    // 1. Obtener los valores de los inputs del modal
    const name = document.getElementById('client-name').value;
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Validación de seguridad
    // Dentro de confirmOrder()
if (name.trim() === "") {
    showAlertModal("⚠️ ACCESO DENEGADO", "Debes ingresar tu nombre de piloto para registrar el pedido.");
    return;
}

    // 2. Construcción estética del mensaje
    let message = `🏴‍☠️ *NUEVA ORDEN B.O.B CUSTOM* 🏴‍☠️\n\n`;
    message += `👤 *CLIENTE:* ${name.toUpperCase()}\n`;
    message += `📍 *ENTREGA:* Zona ${delivery}\n`;
    message += `💳 *PAGO:* ${payment}\n`;
    message += `──────────────────\n\n`;

    // 3. Listado detallado de productos
    cart.forEach((item, i) => {
        message += `📦 *ARTÍCULO ${i + 1}:* ${item.name}\n`;
        
        // Detalles técnicos
        if (item.size || item.color) {
            message += `   • Detalle: ${item.size || 'N/A'} / ${item.color || 'N/A'}\n`;
        }
        
        if (item.logoName && item.logoName !== "Sin logo") {
            message += `   • Diseño: ${item.logoName}\n`;
        }

        if (item.position) {
            message += `   • Ubicación: ${item.position}\n`;
        }
        
        if (item.notes) {
            message += `   • Notas: _${item.notes}_\n`;
        }

        message += `   • Subtotal: *$${item.price} MXN*\n\n`;
    });

    // 4. Cierre de la orden
    message += `──────────────────\n`;
    message += `💰 *TOTAL A PAGAR: $${total} MXN*\n\n`;
    message += `_Por favor, adjunta tus capturas de diseño si personalizaste algún artículo._`;

    // 5. Ejecución
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
