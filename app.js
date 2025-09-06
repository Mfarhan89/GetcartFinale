async function loadProducts(isOwner = false) {
  const res = await fetch("/.netlify/functions/getProducts");
  const products = await res.json();
  // render into #productList (same structure you already have)
}

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
    await loadProducts(true);
  } else {
    console.error(await res.text());
    alert("Upload failed");
  }
}

async function removeProduct(index) {
  await fetch("/.netlify/functions/removeProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index })
  });
  await loadProducts(true);
}
