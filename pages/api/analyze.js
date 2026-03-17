export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { base64Image } = req.body;
  if (!base64Image) {
    return res.status(400).json({ error: "No image provided" });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image
              }
            },
            {
              type: "text",
              text: `Analyze this food image. Respond ONLY with valid JSON no markdown:
{
  "foodName": "food name",
  "portionSize": "200g",
  "calories": 350,
  "protein": 12,
  "carbs": 45,
  "fats": 14,
  "confidence": 87,
  "healthInsight": "brief insight",
  "emoji": "🍕"
}`
            }
          ]
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (error) {
    return res.status(500).json({ error: "Failed to analyze" });
  }
}
