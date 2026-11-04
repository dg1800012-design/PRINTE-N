// Datos estructurados del catálogo
const productsData = [
    { 
        id: 1, 
        name: "Tarot: Sube, Baja, Gira y Ríe", 
        price: 55000, 
        tag: "Edición Limitada", 
        desc: "Camiseta de corte oversized en tono marfil con ilustración original tipo carta de tarot magenta en la espalda." 
    },
    { 
        id: 2, 
        name: "Arte, Amor y Ansiedad", 
        price: 60000, 
        tag: "Exclusivo", 
        desc: "Camiseta estilo Pop-Art moderno con cuadrícula de 6 personajes ilustrados." 
    },
    { 
        id: 3, 
        name: "Galaxial", 
        price: 55000, 
        tag: "Top Ventas", 
        desc: "Camiseta negra con la frase 'TAKE ME, I HAVE MILK' e ilustración espacial." 
    },
    { 
        id: 4, 
        name: "No hay Money", 
        price: 67000, 
        tag: "Básico Premium", 
        desc: "Buzo con capota y bolsillo canguro, minimalista con el logo bordado sutil." 
    }
];

let cart = [];

// Función para obtener dinámicamente la ruta de la imagen en el DOM HTML
function getImgSrc(id) {
    const imgElement = document.getElementById(`product-img-${id}`);
    return imgElement ? imgElement.src : '';
}

// Formateador a Pesos Colombianos (COP)
function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        maximumFractionDigits: 0 
    }).format(amount);
}

// Filtro de búsqueda en tiempo real
function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.product-item').forEach(card => {
        const title = card.querySelector('.product-title').innerText.toLowerCase();
        card.style.display = title.includes(query) ? 'flex' : 'none';
    });
}

// Lógica de Carrito de Compras
function addToCart(productId) {
    const item = productsData.find(p => p.id === productId);
    const imgSrc = getImgSrc(productId);
    const existing = cart.find(c => c.id === productId);
    
    if (existing) { 
        existing.qty += 1; 
    } else { 
        cart.push({ ...item, image: imgSrc, qty: 1 }); 
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(c => c.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotal = document.getElementById('cart-total');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartBadge.innerText = totalQty;
    cartTotal.innerText = formatCOP(totalPrice);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 py-8 text-sm">Tu carrito está vacío</p>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between gap-3 bg-brand-cardDark p-3 rounded-xl border border-gray-800">
            <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover bg-brand-bgDark">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-white truncate">${item.name}</p>
                <p class="text-xs text-brand-mint font-semibold">${formatCOP(item.price)} x ${item.qty}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-500 hover:text-brand-red p-1">
                <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
        </div>
    `).join('');
}

// Drawer del Carrito
function toggleCartModal() { 
    document.getElementById('cart-drawer').classList.toggle('hidden'); 
}

// Modal de Vista Rápida
function openProductModal(id) {
    const p = productsData.find(prod => prod.id === id);
    const imgSrc = getImgSrc(id);
    
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-tag').innerText = p.tag;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-price').innerText = formatCOP(p.price);
    document.getElementById('modal-desc').innerText = p.desc;
    
    document.getElementById('modal-add-btn').onclick = () => { 
        addToCart(p.id); 
        closeProductModal(); 
    };
    
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() { 
    document.getElementById('product-modal').classList.add('hidden'); 
}

function checkout() {
    if (cart.length === 0) return alert("Añade productos al carrito primero.");
    alert("¡Gracias por tu compra en PRINTEÓN! Te redirigiremos a la pasarela de pago.");
    cart = [];
    updateCartUI();
    toggleCartModal();
}

// Event Listeners (Separación limpia de HTML y JS)
document.addEventListener('DOMContentLoaded', () => {
    // Escucha del buscador
    document.getElementById('search-input').addEventListener('keyup', filterProducts);

    // Botones de abrir/cerrar Carrito
    document.getElementById('cart-toggle-btn').addEventListener('click', toggleCartModal);
    document.getElementById('cart-close-btn').addEventListener('click', toggleCartModal);
    document.getElementById('cart-backdrop').addEventListener('click', toggleCartModal);
    document.getElementById('checkout-btn').addEventListener('click', checkout);

    // Botones de cerrar Modal
    document.getElementById('modal-close-btn').addEventListener('click', closeProductModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeProductModal);

    // Eventos para botones "Agregar" en las tarjetas
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(id);
        });
    });

    // Eventos para hacer clic en las imágenes y abrir el Modal
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            openProductModal(id);
        });
    });
});