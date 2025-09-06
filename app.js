let cachedProducts = [];

async function uploadProduct() {
  const product = {
    name: document.getElementById("pname").value,
    desc: document.getElementById("pdesc").value,
    link: document.getElementById("plink").value,
    image: document.getElementById("pimg").value,
    category: document.getElementById("pcategory").value,
  };

  const res = await fetch("/api/addProduct", {
    method: "POST",
    body: JSON.stringify(product),
  });

  if (res.ok) {
    alert("Product uploaded!");
    loadProducts(true);
  } else {
    alert("Failed to upload product");
  }
}

async function loadProducts(admin = false) {
  const res = await fetch("/api/getProducts");
  const products = await res.json();
  cachedProducts = products;
  renderProducts(products, admin);
}

async function loadPublicProducts() {
  const res = await fetch("/api/getProducts");
  cachedProducts = await res.json();
  renderProducts(cachedProducts);
}

function filterProducts() {
  const category = document.getElementById("categoryFilter").value;
  if (category === "all") {
    renderProducts(cachedProducts);
  } else {
    renderProducts(cachedProducts.filter(p => p.category === category));
  }
}

function renderProducts(products, admin = false) {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="product">
        <img src="${p.image}" width="150">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <p><strong>Category:</strong> ${p.category}</p>
        <a href="${p.link}" target="_blank" class="btn">Buy Now</a>
        <button class="btn" onclick="copyLink('${p.link}')">Share</button>
        ${admin ? `<button class="btn" onclick="removeProduct(${p.id})">Remove</button>` : ""}
      </div>`;
  });
}

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert("Link copied!");
}

async function removeProduct(id) {
  const res = await fetch("/api/removeProduct", {
    method: "POST",
    body: JSON.stringify({ id }),
  });

  if (res.ok) {
    alert("Product removed!");
    loadProducts(true);
  } else {
    alert("Failed to remove product");
  }
}
