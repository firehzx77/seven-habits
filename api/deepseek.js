export default async function handler(req, res) {
  // Allow only POST (and handle preflight just in case)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing DEEPSEEK_API_KEY in environment variables." });
  }

  // Vercel automatically parses JSON body when Content-Type is application/json
  const body = req.body || {};
  // Optional: enforce model allowlist to prevent accidental high-cost models
  const model = body.model || "deepseek-chat";

  try {
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ ...body, model }),
    });

    const text = await upstream.text();
    // Forward status code and JSON if possible
    res.status(upstream.status);

    // Try to return JSON; if not JSON, return text
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.send(text);
    }
  } catch (err) {
    return res.status(500).json({
      error: "Upstream request failed.",
      message: err?.message || String(err),
    });
  }
}
