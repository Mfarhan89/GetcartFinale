async function uploadProduct() {
  const product = {
    name: document.getElementById("pname").value,
    desc: document.getElementById("pdesc").value,
    link: document.getElementById("plink").value,
    image: document.getElementById("pimg").value,
  };

  const res = await fetch("/api/addProduct", {
    method: "POST",
    body: JSON.stringify(product),
  });

  if (res.ok) {
    alert("Product uploaded!");
    loadProducts();
  } else {
    alert("Failed to upload product");
  }
}

async function loadProducts() {
  const res = await fetch("/api/getProducts");
  const products = await res.json();
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="product">
        <img src="${p.image}" width="150">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <a href="${p.link}" target="_blank" class="btn">Buy Now</a>
        <button class="btn" onclick="copyLink('${p.link}')">Share</button>
      </div>`;
  });
}

async function loadPublicProducts() {
  const res = await fetch("/api/getProducts");
  const products = await res.json();
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    list.innerHTML += `
      <div class="product">
        <img src="${p.image}" width="150">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <a href="${p.link}" target="_blank" class="btn">Buy Now</a>
        <button class="btn" onclick="copyLink('${p.link}')">Share</button>
      </div>`;
  });
}

function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert("Link copied!");
}