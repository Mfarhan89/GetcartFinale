// Add new product
async function uploadProduct() {
  const product = {
    name: document.getElementById("pname").value,
    desc: document.getElementById("pdesc").value,
    link: document.getElementById("plink").value,
    img: document.getElementById("pimg").value,
    category: document.getElementById("pcategory").value
  };

  const res = await fetch("/.netlify/functions/addProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  if (res.ok) {
    alert("✅ Product uploaded successfully!");
    loadProducts(true); // refresh dashboard list
  } else {
    alert("❌ Upload failed!");
  }
}

// Load products for dashboard or public page
async function loadProducts(isOwner = false) {
  const res = await fetch("/products.json");
  const products = await res.json();

  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <a href="${p.link}" target="_blank">Buy</a>
      ${isOwner ? `<button class="btn" onclick="removeProduct(${index})">Remove</button>` : ""}
    `;
    list.appendChild(div);
  });
}

// Remove a product
async function removeProduct(index) {
  const res = await fetch("/.netlify/functions/removeProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index })
  });

  if (res.ok) {
    alert("🗑️ Product removed!");
    loadProducts(true);
  } else {
    alert("❌ Remove failed!");
  }
}
