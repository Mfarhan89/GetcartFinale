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

async function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "Loading...";

  try {
    const res = await fetch("/.netlify/functions/getProducts");
    const products = await res.json();

    productList.innerHTML = "";
    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <a href="${p.link}" target="_blank">Buy Now</a>
        <span class="category">${p.category}</span>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    productList.innerHTML = "❌ Failed to load products.";
  }
}
