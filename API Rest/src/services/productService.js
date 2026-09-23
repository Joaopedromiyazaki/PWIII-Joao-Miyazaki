/**
 * productService.js
 * Servico de gerenciamento de produtos em memoria.
 * Campos: id, name, description, price, quantity, category, createdAt, updatedAt
 */

let products = [
    {
        id: 1,
        name: "Notebook Gamer",
        description: "Notebook para jogos e edicao com placa dedicada",
        price: 4500,
        quantity: 8,
        category: "Eletronicos",
        createdAt: new Date("2025-01-10").toISOString(),
        updatedAt: new Date("2025-01-10").toISOString()
    },
    {
        id: 2,
        name: "Mouse Sem Fio",
        description: "Mouse ergonomico com autonomia de 12 meses",
        price: 120,
        quantity: 40,
        category: "Perifericos",
        createdAt: new Date("2025-01-12").toISOString(),
        updatedAt: new Date("2025-01-12").toISOString()
    },
    {
        id: 3,
        name: "Teclado Mecanico",
        description: "Teclado mecanico com switches blue e iluminacao RGB",
        price: 350,
        quantity: 15,
        category: "Perifericos",
        createdAt: new Date("2025-02-05").toISOString(),
        updatedAt: new Date("2025-02-05").toISOString()
    },
    {
        id: 4,
        name: "Monitor 4K",
        description: "Monitor 27 polegadas com resolucao 4K e taxa de 144Hz",
        price: 2800,
        quantity: 5,
        category: "Eletronicos",
        createdAt: new Date("2025-03-01").toISOString(),
        updatedAt: new Date("2025-03-01").toISOString()
    },
    {
        id: 5,
        name: "Headset Bluetooth",
        description: "Headset com cancelamento de ruido ativo",
        price: 650,
        quantity: 20,
        category: "Audio",
        createdAt: new Date("2025-03-15").toISOString(),
        updatedAt: new Date("2025-03-15").toISOString()
    },
    {
        id: 6,
        name: "Webcam Full HD",
        description: "Webcam 1080p com microfone integrado",
        price: 280,
        quantity: 30,
        category: "Perifericos",
        createdAt: new Date("2025-04-02").toISOString(),
        updatedAt: new Date("2025-04-02").toISOString()
    },
    {
        id: 7,
        name: "SSD 1TB",
        description: "SSD NVMe com leitura de 3500 MB/s",
        price: 420,
        quantity: 50,
        category: "Armazenamento",
        createdAt: new Date("2025-04-10").toISOString(),
        updatedAt: new Date("2025-04-10").toISOString()
    }
];

let nextId = 8;

// ─── READ ──────────────────────────────────────────────────────────────────

function getAll({ category, search, sort, order, page, limit } = {}) {
    let result = [...products];

    // Filtrar por categoria
    if (category) {
        const cat = category.toLowerCase();
        result = result.filter(p => p.category.toLowerCase() === cat);
    }

    // Busca por nome (parcial, case-insensitive)
    if (search) {
        const term = search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    // Ordenacao
    const validSortFields = ["name", "price", "quantity", "category", "createdAt"];
    if (sort && validSortFields.includes(sort)) {
        const dir = order === "desc" ? -1 : 1;
        result.sort((a, b) => {
            if (a[sort] < b[sort]) return -1 * dir;
            if (a[sort] > b[sort]) return 1 * dir;
            return 0;
        });
    }

    // Paginacao
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || result.length;
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum);
    const start = (pageNum - 1) * limitNum;
    const paginated = result.slice(start, start + limitNum);

    return {
        data: paginated,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages
        }
    };
}

function getById(id) {
    return products.find(p => p.id === id) || null;
}

function existsByName(name, excludeId = null) {
    const lower = name.toLowerCase();
    return products.some(p => p.name.toLowerCase() === lower && p.id !== excludeId);
}

// ─── WRITE ─────────────────────────────────────────────────────────────────

function create(data) {
    const now = new Date().toISOString();
    const product = {
        id: nextId++,
        name: data.name,
        description: data.description || "",
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        createdAt: now,
        updatedAt: now
    };
    products.push(product);
    return product;
}

function update(id, data) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
        id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        createdAt: products[index].createdAt,
        updatedAt: new Date().toISOString()
    };
    return products[index];
}

function patch(id, data) {
    const product = getById(id);
    if (!product) return null;

    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.quantity !== undefined) product.quantity = data.quantity;
    if (data.category !== undefined) product.category = data.category;
    product.updatedAt = new Date().toISOString();

    return product;
}

function remove(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
}

// ─── STATS ─────────────────────────────────────────────────────────────────

function getStats() {
    if (products.length === 0) {
        return { total: 0, totalValue: 0, mostExpensive: null, cheapest: null, outOfStock: 0 };
    }

    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const sorted = [...products].sort((a, b) => b.price - a.price);
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const byCategory = {};
    products.forEach(p => {
        byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });

    return {
        total: products.length,
        totalValue: parseFloat(totalValue.toFixed(2)),
        mostExpensive: sorted[0],
        cheapest: sorted[sorted.length - 1],
        outOfStock,
        byCategory
    };
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────

function getDistinctCategories() {
    const set = new Set(products.map(p => p.category));
    return [...set].sort();
}

module.exports = {
    getAll,
    getById,
    existsByName,
    create,
    update,
    patch,
    remove,
    getStats,
    getDistinctCategories
};
