
const STORAGE_KEY = 'optikLocalProducts';

function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function renderTable() {
  const products = getProducts();
  const rows = products.map((p, i) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.brand}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${i}">Sil</button>
      </td>
    </tr>
  `).join('');
  $('#adminTable').html(rows || '<tr><td colspan="5" class="text-center text-secondary">Henüz ürün eklenmedi.</td></tr>');
}

function downloadJsonFile() {
  const products = getProducts();
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products-local.json';
  a.click();
  URL.revokeObjectURL(url);
}

$(function(){
  renderTable();

  $('#productForm').on('submit', function(e){
    e.preventDefault();
    const current = getProducts();
    current.unshift({
      id: Date.now(),
      name: $('#name').val().trim(),
      brand: $('#brand').val().trim(),
      price: $('#price').val().trim(),
      category: $('#category').val(),
      gender: $('#gender').val(),
      image: $('#image').val().trim() || 'images/placeholder.svg'
    });
    saveProducts(current);
    this.reset();
    renderTable();
    alert('Ürün eklendi. Katalog sayfasında bu cihazda görünür.');
  });

  $(document).on('click', '.delete-btn', function(){
    const index = Number($(this).data('index'));
    const current = getProducts();
    current.splice(index, 1);
    saveProducts(current);
    renderTable();
  });

  $('#clearLocal').on('click', function(){
    if(confirm('Tarayıcıdaki tüm local ürünler silinsin mi?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderTable();
    }
  });

  $('#downloadJson').on('click', function(){
    downloadJsonFile();
  });
});
