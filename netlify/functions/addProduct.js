const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const product = JSON.parse(event.body);

  try {
    const filePath = path.join(process.cwd(), "products.json");

    let products = [];
    if (fs.existsSync(filePath)) {
      products = JSON.parse(fs.readFileSync(filePath));
    }

    products.push(product);

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product added successfully!" }),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error saving product: " + err.message };
  }
};
