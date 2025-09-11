let editIndex = null;
let allProducts = []; // store all products for filtering

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

  const product = { name, desc, link, img, category };

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

// --- Edit Functions ---
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

// Load Products
async function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "Loading...";

  try {
    const res = await fetch("/.netlify/functions/getProducts");
    const products = await res.json();
    allProducts = products; // save for filters
    applyFilters(); // show filtered list (initially all)
  } catch (err) {
    productList.innerHTML = "❌ Failed to load products.";
  }
}

// Apply Search + Filter
function applyFilters() {
  const searchText = document.getElementById("searchBox")?.value.toLowerCase() || "";
  const category = document.getElementById("filterCategory")?.value || "all";

  let filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchText) ||
    p.desc.toLowerCase().includes(searchText)
  );

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  renderProducts(filtered);
}

// Render Products
function renderProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  if (!products.length) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

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
      <button class="btn danger" onclick="deleteProduct(${i})">Delete</button>
    `;
    productList.appendChild(card);
  });
}
