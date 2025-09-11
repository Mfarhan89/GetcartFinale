let editIndex = null;
let publicProducts = [];

/* -------------------------
   Admin Functions (Dashboard)
-------------------------- */

// Add Product
async function uploadProduct() {
  const name = document.getElementById("pname").value.trim();
  const desc = document.getElementById("pdesc").value.trim();
  const link = document.getElementById("plink").value.trim();
  const img = document.getElementById("pimg").value.trim();
  const category = document.getElementById("pcategory").value;

  if (!name || !desc || !link || !img) {
    alert("Please fill in all fields.");
    return;
  }

  const product = { name, desc, link, img, category, timestamp: Date.now() };

  try {
    const res = await fetch("/.netlify/functions/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("✅ Product added successfully!");
    loadProducts();
  } catch (err) {
    alert("❌ Failed to add product.\n" + err.message);
  }
}

// Delete Product
async function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch("/.netlify/functions/deleteProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("🗑️ Product deleted!");
    loadProducts();
  } catch (err) {
    alert("❌ Failed to delete product.\n" + err.message);
  }
}

// Edit Modal
function openEdit(index, product) {
  editIndex = index;
  document.getElementById("editName").value = product.name;
  document.getElementById("editDesc").value = product.desc;
  document.getElementById("editLink").value = product.link;
  document.getElementById("editImg").value = product.img;
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editModal").style.display = "block";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
  editIndex = null;
}

async function saveEdit() {
  if (editIndex === null) return;

  const product = {
    name: document.getElementById("editName").value.trim(),
    desc: document.getElementById("editDesc").value.trim(),
    link: document.getElementById("editLink").value.trim(),
    img: document.getElementById("editImg").value.trim(),
    category: document.getElementById("editCategory").value,
    timestamp: Date.now(),
  };

  try {
    const res = await fetch("/.netlify/functions/updateProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: editIndex, product }),
    });

    if (!res.ok) throw new Error(await res.text());

    alert("✏️ Product updated!");
    closeEdit();
    loadProducts();
  } catch (err) {
    alert("❌ Failed to update product.\n" + err.message);
  }
}

// Load Products for Dashboard
async function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "Loading...";

  try {
    const res = await fetch("/.netlify/functions/getProducts");
    const products = await res.json();

    productList.innerHTML = "";
    products.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <a href="${p.link}" target="_blank">Buy Now</a>
        <span class="category">${p.category}</span>
        <br>
        <button class="btn" onclick='openEdit(${i}, ${JSON.stringify(p).replace(/"/g, "&quot;")})'>Edit</button>
        <button class="btn" onclick="deleteProduct(${i})">Delete</button>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    productList.innerHTML = "❌ Failed to load products.";
  }
}

/* -------------------------
   Public Functions (Website)
-------------------------- */
async function loadPublicProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "Loading...";

  try {
    const res = await fetch("/.netlify/functions/getProducts");
    const products = await res.json();

    publicProducts = products;
    applyPublicFilters();
  } catch (err) {
    productList.innerHTML = "❌ Failed to load products.";
  }
}

function renderPublicProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  if (!products.length) {
    productList.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <a href="${p.link}" target="_blank" class="btn primary">Buy Now</a>
      <span class="category">${p.category}</span>
    `;
    productList.appendChild(card);
  });
}

function applyPublicFilters() {
  const searchText = document.getElementById("searchBox")?.value.toLowerCase() || "";
  const category = document.getElementById("categoryFilter")?.value || "all";
  const sortBy = document.getElementById("sortBy")?.value || "newest";

  let filtered = publicProducts.filter(p =>
    p.name.toLowerCase().includes(searchText) ||
    p.desc.toLowerCase().includes(searchText)
  );

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "category") {
    filtered.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === "newest") {
    filtered = filtered.slice().reverse();
  }

  renderPublicProducts(filtered);
}
