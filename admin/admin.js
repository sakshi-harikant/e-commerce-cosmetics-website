// ========== CHECK ADMIN LOGIN ==========
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin_login.html';
}

// ========== GLOBAL VARIABLES ==========
let products = [];
let orders = [];

// ========== DOCUMENT READY ==========
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    updateCurrentDate();
    
    // Load all data from localStorage
    loadProducts();
    loadOrders();
    loadDashboard();
    
    // Tab switching
    setupTabSwitching();
    
    // Setup form submission
    setupProductForm();
});

// ========== DATE FUNCTIONS ==========
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// ========== TAB SWITCHING ==========
function setupTabSwitching() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            this.classList.add('active');
            
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
            document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
            
            if (tabId === 'products') displayProducts();
            if (tabId === 'orders') displayOrders();
            if (tabId === 'customers') extractAndDisplayCustomers();
            if (tabId === 'dashboard') loadDashboard();
        });
    });
}

// ========== PRODUCT MANAGEMENT (Using localStorage) ==========

function loadProducts() {
    // Get products from localStorage
    const savedProducts = localStorage.getItem('adminProducts');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products if none exist
        products = [
            {
                id: 'prod1',
                name: 'Gentle Face Serum with Aloe Vera',
                description: 'Hydrating serum with pure aloe vera extract for all skin types',
                price: 300,
                originalPrice: 450,
                stock: 50,
                badge: 'BESTSELLER',
                image: 'https://i.postimg.cc/bwkrK6HM/IMG-20250308-WA0040.jpg',
                tags: ['serum', 'hydrating', 'aloe']
            },
            {
                id: 'prod2',
                name: 'Hydrating Lip Mask',
                description: 'Overnight treatment for dry, chapped lips with hyaluronic acid',
                price: 159,
                originalPrice: 250,
                stock: 100,
                badge: 'NEW',
                image: 'https://i.postimg.cc/MHwXZ165/IMG-20250308-WA0041.jpg',
                tags: ['lip', 'mask', 'hydrating']
            },
            {
                id: 'prod3',
                name: 'Ultra Soothing Lip Moisturizer',
                description: 'Daily lip treatment with shea butter and vitamin E',
                price: 499,
                originalPrice: 699,
                stock: 75,
                badge: 'LIMITED',
                image: 'https://i.postimg.cc/4NBnZKrv/IMG-20250308-WA0039.jpg',
                tags: ['lip', 'moisturizer', 'soothing']
            },
            {
                id: 'prod4',
                name: 'Collagen Booster Face Toner',
                description: 'Refreshing toner that enhances skin elasticity and firmness',
                price: 358,
                originalPrice: 499,
                stock: 60,
                badge: '',
                image: 'https://i.postimg.cc/3R5x92vh/IMG-20250308-WA0037.jpg',
                tags: ['toner', 'collagen', 'firming']
            },
            {
                id: 'prod5',
                name: 'Exfoliating Solution',
                description: 'Gentle chemical exfoliant with AHA and BHA complex',
                price: 219,
                originalPrice: 350,
                stock: 80,
                badge: 'SALE',
                image: 'https://i.postimg.cc/nz2f7mK0/IMG-20250308-WA0034.jpg',
                tags: ['exfoliator', 'AHA', 'BHA']
            },
            {
                id: 'prod6',
                name: 'Hylamide Radiance Booster',
                description: 'Illuminating serum for a healthy, glowing complexion',
                price: 299,
                originalPrice: 450,
                stock: 45,
                badge: 'BESTSELLER',
                image: 'https://i.postimg.cc/pr0xNjpp/IMG-20250308-WA0035.jpg',
                tags: ['serum', 'radiance', 'glow']
            }
        ];
        localStorage.setItem('adminProducts', JSON.stringify(products));
    }
    
    displayProducts();
    updateStoreProducts();
}

function displayProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/50?text=Product'"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description.substring(0, 30)}${product.description.length > 30 ? '...' : ''}</td>
            <td>₹${product.price}</td>
            <td>₹${product.originalPrice}</td>
            <td>${product.stock}</td>
            <td>${product.badge ? `<span class="status-badge" style="background: var(--primary-pastel); color: var(--primary);">${product.badge}</span>` : '-'}</td>
            <td>
                <button class="action-btn edit" onclick="editProduct('${product.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct('${product.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update products for store front (products.html will read from this)
function updateStoreProducts() {
    localStorage.setItem('storeProducts', JSON.stringify(products));
}

function openProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDesc').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productBadge').value = product.badge || '';
    document.getElementById('productImage').value = product.image;
    document.getElementById('productTags').value = product.tags ? product.tags.join(', ') : '';
    
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function setupProductForm() {
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const productData = {
            id: productId || 'prod' + Date.now(),
            name: document.getElementById('productName').value,
            description: document.getElementById('productDesc').value,
            price: parseFloat(document.getElementById('productPrice').value),
            originalPrice: parseFloat(document.getElementById('productOriginalPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            badge: document.getElementById('productBadge').value,
            image: document.getElementById('productImage').value,
            tags: document.getElementById('productTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        if (productId) {
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) products[index] = productData;
        } else {
            products.push(productData);
        }
        
        localStorage.setItem('adminProducts', JSON.stringify(products));
        displayProducts();
        updateStoreProducts();
        closeProductModal();
        alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
    });
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        displayProducts();
        updateStoreProducts();
        alert('Product deleted successfully!');
    }
}

// ========== ORDER MANAGEMENT (Using localStorage) ==========

function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Sample orders for demo
        orders = [
            {
                id: 'ORD' + (Date.now() - 86400000),
                date: new Date(Date.now() - 86400000).toISOString(),
                items: [{ name: 'Gentle Face Serum', quantity: 2, price: 300 }],
                total: 600,
                shipping: 0,
                paymentMethod: 'Credit Card',
                status: 'Delivered',
                shippingInfo: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '9876543210',
                    address: '123 Main St',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zip: '400001'
                }
            },
            {
                id: 'ORD' + (Date.now() - 172800000),
                date: new Date(Date.now() - 172800000).toISOString(),
                items: [{ name: 'Hydrating Lip Mask', quantity: 1, price: 159 }],
                total: 258,
                shipping: 99,
                paymentMethod: 'UPI',
                status: 'Processing',
                shippingInfo: {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '9876543211',
                    address: '456 Park Ave',
                    city: 'Delhi',
                    state: 'Delhi',
                    zip: '110001'
                }
            }
        ];
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    displayOrders();
}

// ========== UPDATED displayOrders() WITH DELETE BUTTON ==========
function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.shippingInfo?.name || 'N/A'}</td>
            <td>${order.shippingInfo?.email || 'N/A'}</td>
            <td>${order.shippingInfo?.phone || 'N/A'}</td>
            <td>${order.shippingInfo?.address || 'N/A'}, ${order.shippingInfo?.city || ''}</td>
            <td>${order.items ? order.items.length : 0} items</td>
            <td>₹${order.total}</td>
            <td>${order.paymentMethod || 'COD'}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${getStatusClass(order.status)}">${order.status || 'Processing'}</span>
            </td>
            <td>
                <button class="action-btn view" onclick="viewOrderDetails('${order.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="action-btn delete" onclick="deleteOrder('${order.id}')" title="Delete Order" style="color: #ff4444; margin-left: 5px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateRecentOrders();
}

// ========== NEW deleteOrder() FUNCTION ==========
function deleteOrder(orderId) {
    // Show confirmation dialog
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        
        // Find the order to show details in confirmation
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            // Double check with more details
            const confirmDelete = confirm(
                `Order Details:\n` +
                `ID: ${order.id}\n` +
                `Customer: ${order.shippingInfo?.name}\n` +
                `Amount: ₹${order.total}\n\n` +
                `Click OK to permanently delete this order.`
            );
            
            if (confirmDelete) {
                // Filter out the order
                orders = orders.filter(o => o.id !== orderId);
                
                // Save to localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Refresh the display
                displayOrders();
                
                // Also update dashboard stats
                loadDashboard();
                
                // Refresh customers tab
                extractAndDisplayCustomers();
                
                // Show success message
                alert('Order deleted successfully!');
            }
        }
    }
}

// ========== OPTIONAL: Delete all orders function ==========
function deleteAllOrders() {
    if (confirm('⚠️ WARNING: Delete ALL orders? This cannot be undone!')) {
        const password = prompt('Enter admin password to confirm:');
        if (password === 'unleash2024') {
            orders = [];
            localStorage.setItem('orders', JSON.stringify(orders));
            displayOrders();
            extractAndDisplayCustomers();
            loadDashboard();
            alert('All orders deleted successfully');
        } else {
            alert('Incorrect password');
        }
    }
}

// ========== OPTIONAL: Delete customer orders ==========
function deleteCustomerOrders(email) {
    if (confirm(`Delete all orders for ${email}?`)) {
        const beforeCount = orders.length;
        orders = orders.filter(o => o.shippingInfo?.email !== email);
        const deletedCount = beforeCount - orders.length;
        
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        extractAndDisplayCustomers();
        loadDashboard();
        
        alert(`${deletedCount} orders deleted for ${email}`);
    }
}

function getStatusClass(status) {
    switch(status?.toLowerCase()) {
        case 'delivered': return 'completed';
        case 'shipped': return 'processing';
        case 'processing': return 'pending';
        case 'cancelled': return 'danger';
        default: return '';
    }
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        alert('Order status updated!');
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let details = `ORDER DETAILS\n`;
    details += `==============\n`;
    details += `Order ID: ${order.id}\n`;
    details += `Date: ${new Date(order.date).toLocaleString()}\n`;
    details += `Status: ${order.status}\n\n`;
    details += `CUSTOMER INFORMATION\n`;
    details += `Name: ${order.shippingInfo?.name}\n`;
    details += `Email: ${order.shippingInfo?.email}\n`;
    details += `Phone: ${order.shippingInfo?.phone}\n`;
    details += `Address: ${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state} ${order.shippingInfo?.zip}\n\n`;
    details += `PRODUCTS\n`;
    order.items?.forEach((item, index) => {
        details += `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    details += `\nSubtotal: ₹${order.total - (order.shipping || 0)}\n`;
    details += `Shipping: ₹${order.shipping || 0}\n`;
    details += `Total: ₹${order.total}\n`;
    details += `Payment Method: ${order.paymentMethod}`;
    
    alert(details);
}

function updateRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    
    const recentOrders = orders.slice(0, 5);
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.shippingInfo?.name || 'N/A'}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>₹${order.total}</td>
            <td>${order.paymentMethod || 'COD'}</td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status || 'Processing'}</span></td>
        </tr>
    `).join('');
}

// ========== CUSTOMER MANAGEMENT ==========

function extractAndDisplayCustomers() {
    const customers = [];
    const customerMap = new Map();
    
    orders.forEach(order => {
        const email = order.shippingInfo?.email;
        if (email && !customerMap.has(email)) {
            customerMap.set(email, {
                name: order.shippingInfo?.name,
                email: email,
                phone: order.shippingInfo?.phone,
                address: order.shippingInfo?.address,
                city: order.shippingInfo?.city,
                state: order.shippingInfo?.state,
                zip: order.shippingInfo?.zip,
                totalOrders: 1,
                lastOrder: order.date
            });
        } else if (email) {
            const customer = customerMap.get(email);
            customer.totalOrders++;
            if (new Date(order.date) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.date;
            }
        }
    });
    
    customers.push(...customerMap.values());
    displayCustomers(customers);
}

function displayCustomers(customers) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name || 'N/A'}</td>
            <td>${customer.email}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.address || 'N/A'}</td>
            <td>${customer.city || 'N/A'}</td>
            <td>${customer.state || 'N/A'}</td>
            <td>${customer.zip || 'N/A'}</td>
            <td>${customer.totalOrders}</td>
            <td>${new Date(customer.lastOrder).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// ========== DASHBOARD ==========

function loadDashboard() {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    
    const uniqueCustomers = new Set();
    orders.forEach(order => {
        if (order.shippingInfo?.email) {
            uniqueCustomers.add(order.shippingInfo.email);
        }
    });
    const totalCustomers = uniqueCustomers.size;
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toFixed(2);
    
    updateRecentOrders();
}

// ========== SEARCH ==========

function searchProducts(query) {
    if (!query) {
        displayProducts();
        return;
    }
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayFilteredProducts(filtered);
}

function displayFilteredProducts(filteredProducts) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-img"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description.substring(0, 30)}...</td>
            <td>₹${product.price}</td>
            <td>₹${product.originalPrice}</td>
            <td>${product.stock}</td>
            <td>${product.badge ? `<span class="status-badge">${product.badge}</span>` : '-'}</td>
            <td>
                <button class="action-btn edit" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ========== EXPORT ==========

function exportOrdersToCSV() {
    let csv = 'Order ID,Customer,Email,Phone,Address,Items,Total,Payment,Date,Status\n';
    
    orders.forEach(order => {
        csv += `"${order.id}","${order.shippingInfo?.name || ''}","${order.shippingInfo?.email || ''}","${order.shippingInfo?.phone || ''}","${order.shippingInfo?.address || ''} ${order.shippingInfo?.city || ''}",${order.items?.length || 0},${order.total},${order.paymentMethod || 'COD'},"${new Date(order.date).toLocaleDateString()}",${order.status || 'Processing'}\n`;
    });
    
    downloadCSV(csv, 'orders_export.csv');
}

function exportProductsToCSV() {
    let csv = 'ID,Name,Description,Price,Original Price,Stock,Badge,Image,Tags\n';
    
    products.forEach(product => {
        csv += `"${product.id}","${product.name}","${product.description}",${product.price},${product.originalPrice},${product.stock},"${product.badge || ''}","${product.image}","${product.tags?.join(', ') || ''}"\n`;
    });
    
    downloadCSV(csv, 'products_export.csv');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ========== LOGOUT ==========
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin_login.html';
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    // Add search to products tab
    const productsTab = document.getElementById('products-tab');
    if (productsTab) {
        const searchDiv = document.createElement('div');
        searchDiv.style.marginBottom = '20px';
        searchDiv.innerHTML = `
            <input type="text" id="productSearch" placeholder="Search products..." 
                   style="width: 300px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px;">
        `;
        productsTab.insertBefore(searchDiv, productsTab.querySelector('.table-container'));
        
        document.getElementById('productSearch').addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
    
    // Add export buttons and delete all button to orders tab
    const ordersTab = document.getElementById('orders-tab');
    if (ordersTab) {
        // Export button
        const exportBtn = document.createElement('button');
        exportBtn.className = 'add-btn';
        exportBtn.style.marginBottom = '20px';
        exportBtn.style.marginRight = '10px';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Orders';
        exportBtn.onclick = exportOrdersToCSV;
        ordersTab.querySelector('h2').after(exportBtn);
        
        // Delete all button
        const deleteAllBtn = document.createElement('button');
        deleteAllBtn.className = 'add-btn';
        deleteAllBtn.style.marginBottom = '20px';
        deleteAllBtn.style.marginLeft = '10px';
        deleteAllBtn.style.background = '#ff4444';
        deleteAllBtn.innerHTML = '<i class="fas fa-trash"></i> Delete All Orders';
        deleteAllBtn.onclick = deleteAllOrders;
        ordersTab.querySelector('h2').after(deleteAllBtn);
    }
    
    const productsTab2 = document.getElementById('products-tab');
    if (productsTab2) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'add-btn';
        exportBtn.style.marginBottom = '20px';
        exportBtn.style.marginLeft = '10px';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Products';
        exportBtn.onclick = exportProductsToCSV;
        productsTab2.querySelector('.tab-header').appendChild(exportBtn);
    }
});