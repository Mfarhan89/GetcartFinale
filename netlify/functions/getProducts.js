import { Octokit } from "@octokit/rest";

export async function handler() {
  try {
    const REPO = "GetcartFinale";        // <-- change this
    const OWNER = "Mfarhan89"; // <-- change this
    const FILE_PATH = "products.json";

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data: fileData } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
    });

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const products = JSON.parse(content);

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
}
