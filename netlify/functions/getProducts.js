import { promises as fs } from "fs";

export async function handler() {
  try {
    const data = await fs.readFile("products.json", "utf-8");
    return {
      statusCode: 200,
      body: data,
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return { statusCode: 500, body: "Error reading products" };
  }
}
