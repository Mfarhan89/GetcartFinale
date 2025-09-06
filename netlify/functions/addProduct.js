import { connectLambda, getStore } from "@netlify/blobs";

export const handler = async (event) => {
  connectLambda(event);

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const product = JSON.parse(event.body);
    const store = getStore("products");
    const existing = await store.get("products.json", { type: "json" }) || [];
    existing.push(product);
    await store.setJSON("products.json", existing);
    return { statusCode: 200, body: JSON.stringify({ message: "Product added" }) };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
};
