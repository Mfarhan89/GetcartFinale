import { connectLambda, getStore } from "@netlify/blobs";

export const handler = async (event) => {
  connectLambda(event);

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { index } = JSON.parse(event.body);
    const store = getStore("products");
    const products = await store.get("products.json", { type: "json" }) || [];

    if (index < 0 || index >= products.length) {
      return { statusCode: 400, body: "Invalid index" };
    }

    products.splice(index, 1);
    await store.setJSON("products.json", products);

    return { statusCode: 200, body: JSON.stringify({ message: "Product removed" }) };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
};
