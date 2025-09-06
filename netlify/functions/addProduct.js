import { createClient } from "@netlify/blobs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);
  const client = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const store = client.store("products");

  const id = Date.now().toString();
  await store.setJSON(id, { id, ...data });

  return { statusCode: 200, body: JSON.stringify({ message: "Product added!", id }) };
}
