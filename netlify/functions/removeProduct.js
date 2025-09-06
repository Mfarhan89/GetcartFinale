const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { index } = JSON.parse(event.body);
    const filePath = path.join(process.cwd(), "products.json");

    if (!fs.existsSync(filePath)) {
      return { statusCode: 404, body: "Products file not found" };
    }

    let products = JSON.parse(fs.readFileSync(filePath));

    if (index < 0 || index >= products.length) {
      return { statusCode: 400, body: "Invalid product index" };
    }

    products.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product removed successfully!" }),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error removing product: " + err.message };
  }
};
