// api/hint.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, subject } = req.body;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `You are a helpful tutor. Give a SHORT hint (not the answer!) for this question: ${question}. Subject: ${subject}. Keep it under 1 sentence.`,
        parameters: { max_new_tokens: 60 }
      })
    }
  );

  const data = await response.json();
  const hint = data[0]?.generated_text?.replace(/.*?\. /, '') || "Try rephrasing your question!";

  res.status(200).json({ hint });
}
