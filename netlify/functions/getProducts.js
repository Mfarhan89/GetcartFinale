import { createClient } from "@netlify/blobs";

export async function handler() {
  const client = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const store = client.store("products");

  const list = await store.list();
  const products = await Promise.all(list.blobs.map(b => store.getJSON(b.key)));

  return { statusCode: 200, body: JSON.stringify(products) };
}
