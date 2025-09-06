import { connectLambda, getStore } from "@netlify/blobs";

export const handler = async (event) => {
  connectLambda(event);

  try {
    const store = getStore("products"); // site-level store named "products"
    const products = await store.get("products.json", { type: "json" }) || [];
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
};
