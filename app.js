// Load Public Products
async function loadPublicProducts() {
  const res = await fetch("/.netlify/functions/getProducts");
  const products = await res.json();
  renderProducts(products, false);
}

// Load Dashboard Products
async function loadProducts(isDashboard = false) {
  const res = await fetch("/.netlify/functions/getProducts");
  const products = await res.json();
  renderProducts(products, isDashboard);
}

// Upload Product
async function uploadProduct() {
  const pname = document.getElementById("pname").value.trim();
  const pdesc = document.getElementById("pdesc").value.trim();
  const plink = document.getElementById("plink").value.trim();
  const pimg = document.getElementById("pimg").value.trim();
  const pcategory = document.getElementById("pcategory").value;

  if (!pname || !plink || !pimg) {
    alert("Please fill in all fields!");
    return;
  }

  const product = { pname, pdesc, plink, pimg, pcategory };

  const res = await fetch("/.netlify/functions/addProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (res.ok) {
    alert("✅ Product added!");
    loadProducts(true);
  } else {
    alert("❌ Failed to add product.");
  }
}

// Delete Product
async function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;

  const res = await fetch(`/.netlify/functions/deleteProduct?id=${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    alert("🗑️ Product deleted!");
    loadProducts(true);
  } else {
    alert("❌ Failed to delete product.");
  }
}

// Render Products
function renderProducts(products, isDashboard) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.pimg}" alt="${p.pname}">
      <h4>${p.pname}</h4>
      <p>${p.pdesc || ""}</p>
      <a class="btn" href="${p.plink}" target="_blank">View</a>
      ${isDashboard ? `<button class="btn danger" onclick="deleteProduct('${p.id}')">Delete</button>` : ""}
    `;
    container.appendChild(div);
  });
}
