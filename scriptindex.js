const inventory = [
    { id: 1, category: 'dtf', name: "Playera Algodón Hombre", price: 250, img: "img/ph.png" },
    { id: 2, category: 'dtf', name: "Playera Algodón Mujer", price: 250, img: "img/pm.png" },
    { id: 3, category: 'dtf', name: "Sudadera Unisex Capucha", price: 550, img: "img/sc.png" },
    { id: 4, category: 'dtf', name: "Sudadera Cerrada", price: 480, img: "img/sc1.png" },
    { id: 5, category: 'dtf', name: "Playera Dri-fit", price: 280, img: "img/pd.png" },
    { id: 6, category: 'dtf', name: "Gorra de Malla", price: 180, img: "img/gm.png" },
    { id: 7, category: 'laser', name: "Placas Militares", price: 150, img: "img/pm1.png" },
    { id: 8, category: 'laser', name: "Licorera Metálica", price: 320, img: "img/lm.jpg" },
    { id: 9, category: 'laser', name: "Navaja Táctica", price: 450, img: "img/nt.jpg" },
    { id: 10, category: 'laser', name: "Porta Llaves", price: 200, img: "img/pll.png" },
    { id: 11, category: 'laser', name: "Portacascos", price: 650, img: "img/pc.jpg" },
    { id: 12, category: 'laser', name: "Libreta de Piel", price: 380, img: "img/l.png" }
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
    const name = document.getElementById('client-name').value;
    const delivery = document.getElementById('delivery-point').value;
    const payment = document.getElementById('payment-method').value;

    if (!name) {
        alert("Por favor, ingresa tu nombre para el pedido.");
        return;
    }

    const phone = "525546628442";
    let message = "🏴‍☠️ *ORDEN DE PERSONALIZACIÓN B.O.B* 🏴‍☠️\n\n";

    message += `👤 *CLIENTE:* ${name}\n`;
    message += `📍 *ENTREGA:* Zona ${delivery}\n`;
    message += `💳 *PAGO:* ${payment}\n`;
    message += `----------------------------\n\n`;

    cart.forEach((item, i) => {
        message += `*${i+1}. ${item.name}*\n`;
        if (item.size) message += `   └ Talla: ${item.size} | Color: ${item.color}\n`;
        if (item.position) message += `   └ Ubicación: ${item.position}\n`;
        if (item.logoName && item.logoName !== "Sin logo") message += `   └ Logo: ${item.logoName}\n`;
        message += `   └ Precio: $${item.price}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `*TOTAL A PAGAR: $${total} MXN*`;

    // Cerrar modal y abrir WhatsApp
    closeCheckoutModal();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
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
