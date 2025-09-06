import { promises as fs } from "fs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try:
    const { id } = JSON.parse(event.body);

    const file = await fs.readFile("products.json", "utf-8");
    let products = JSON.parse(file);

    products = products.filter(p => p.id !== id);

    await fs.writeFile("products.json", JSON.stringify(products, null, 2));

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: "Error removing product" };
  }
}
