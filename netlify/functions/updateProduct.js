import { Octokit } from "@octokit/rest";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { index, product } = JSON.parse(event.body);

    const REPO = "GetcartFinale";        // <-- change this
    const OWNER = "Mfarhan89"; // <-- change this
    const FILE_PATH = "products.json";

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Get current file
    const { data: fileData } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    let products = JSON.parse(content);

    // Update product at given index
    if (index >= 0 && index < products.length) {
      products[index] = product;
    } else {
      return { statusCode: 400, body: "Invalid index" };
    }

    // Save updated file
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: "Update product",
      content: Buffer.from(JSON.stringify(products, null, 2)).toString("base64"),
      sha: fileData.sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, index, product }),
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
}
