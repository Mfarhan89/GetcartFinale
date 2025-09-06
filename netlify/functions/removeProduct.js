import { createClient } from "@netlify/blobs";

export async function handler(event) {
  const id = event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: "Missing ID" };

  const client = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const store = client.store("products");

  await store.delete(id);
  return { statusCode: 200, body: JSON.stringify({ message: "Deleted" }) };
}
