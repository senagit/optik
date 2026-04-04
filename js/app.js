
const STORAGE_KEY = 'optikLocalProducts';

function getLocalProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function getAllProducts(baseProducts) {
  return [...getLocalProducts(), ...baseProducts];
}

function renderCategories(products) {
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  $('#categoryFilter').html('<option value="">Tüm Kategoriler</option>');
  categories.forEach(cat => {
    $('#categoryFilter').append(`<option value="${cat}">${cat}</option>`);
  });
}

function productCard(product) {
  const message = encodeURIComponent(`Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`);
  const whatsappLink = `https://wa.me/905304057546?text=${message}`;
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.svg'">
          <span class="product-badge">${product.category || 'Ürün'}</span>
        </div>
        <div class="product-content">
          <div class="product-brand">${product.brand || ''}</div>
          <div class="product-title">${product.name}</div>
          <div class="product-meta">
            <span class="badge rounded-pill text-bg-light border">${product.gender || 'Unisex'}</span>
            <div class="product-price">${product.price || ''}</div>
          </div>
          <a href="${whatsappLink}" class="btn btn-success w-100" target="_blank" rel="noopener">WhatsApp ile Sor</a>
        </div>
      </div>
    </div>`;
}

function applyFilters(products) {
  const search = $('#searchInput').val().toLowerCase().trim();
  const category = $('#categoryFilter').val();
  const gender = $('#genderFilter').val();

  return products.filter(p => {
    const inSearch =
      !search ||
      (p.name && p.name.toLowerCase().includes(search)) ||
      (p.brand && p.brand.toLowerCase().includes(search));
    const inCategory = !category || p.category === category;
    const inGender = !gender || p.gender === gender;
    return inSearch && inCategory && inGender;
  });
}

function renderProducts(products) {
  $('#totalCount').text(products.length);
  const filtered = applyFilters(products);
  $('#resultText').text(`${filtered.length} ürün gösteriliyor`);
  $('#productList').html(filtered.map(productCard).join(''));
  $('#emptyState').toggleClass('d-none', filtered.length !== 0);
}

$(async function () {
  let baseProducts = [];
  try {
    const response = await fetch('data/products.json');
    baseProducts = await response.json();
  } catch (e) {
    console.error('products.json okunamadı', e);
  }

  const allProducts = getAllProducts(baseProducts);
  renderCategories(allProducts);
  renderProducts(allProducts);

  $('#searchInput, #categoryFilter, #genderFilter').on('input change', function () {
    renderProducts(allProducts);
  });

  $('#resetFilters').on('click', function () {
    $('#searchInput').val('');
    $('#categoryFilter').val('');
    $('#genderFilter').val('');
    renderProducts(allProducts);
  });
});
