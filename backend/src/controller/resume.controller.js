import { extractText } from "unpdf";

// ─── Groq API Helper ────────────────────────────────────────────────────────
async function callGroq(messages, maxTokens = 1500) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return { content: data.choices[0].message.content, tokens: data.usage.total_tokens };
}

function parseJSON(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

// ─── 1. Analyze Resume Text ─────────────────────────────────────────────────
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length < 100)
      return res.status(400).json({ error: "Resume text too short or missing" });

    const { content, tokens } = await callGroq([
      {
        role: "system",
        content: `You are an expert resume reviewer. Analyze the resume and return ONLY a JSON object with this exact structure, no extra text:
{
  "atsScore": <number 0-100>,
  "overallFeedback": "<2-3 lines summary>",
  "strengths": ["<point>", "<point>", "<point>"],
  "weaknesses": ["<point>", "<point>", "<point>"],
  "improvements": ["<actionable tip>", "<actionable tip>", "<actionable tip>"],
  "missingKeywords": ["<keyword>", "<keyword>", "<keyword>"],
  "sectionFeedback": {
    "summary": "<feedback>",
    "experience": "<feedback>",
    "skills": "<feedback>",
    "education": "<feedback>"
  }
}`,
      },
      { role: "user", content: `Analyze this resume:\n\n${resumeText}` },
    ]);

    res.json({ success: true, analysis: parseJSON(content), tokensUsed: tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── 2. Build Resume from User Details ─────────────────────────────────────
const buildResume = async (req, res) => {
  try {
    const { personalInfo, summary, experience, education, skills, projects } = req.body;

    if (!personalInfo?.name || !personalInfo?.email)
      return res.status(400).json({ error: "Name and email are required" });

    const userDetails = JSON.stringify({ personalInfo, summary, experience, education, skills, projects }, null, 2);

    const { content, tokens } = await callGroq([
      {
        role: "system",
        content: `You are a professional resume writer. Given user details, write a polished, ATS-friendly resume.
Return ONLY a JSON object with this exact structure, no extra text:
{
  "personalInfo": {
    "name": "<name>",
    "email": "<email>",
    "phone": "<phone>",
    "location": "<location>",
    "linkedin": "<linkedin url or empty>",
    "portfolio": "<portfolio url or empty>"
  },
  "summary": "<2-3 sentence professional summary, well-written>",
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "duration": "<e.g. Jan 2022 - Dec 2023>",
      "location": "<city or remote>",
      "bullets": ["<achievement>", "<achievement>", "<achievement>"]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<college/university>",
      "year": "<graduation year>",
      "grade": "<CGPA or percentage if provided>"
    }
  ],
  "skills": {
    "technical": ["<skill>", "<skill>"],
    "tools": ["<tool>", "<tool>"],
    "soft": ["<skill>", "<skill>"]
  },
  "projects": [
    {
      "name": "<project name>",
      "description": "<1-2 line description>",
      "tech": ["<tech>", "<tech>"],
      "link": "<url or empty>"
    }
  ]
}`,
      },
      { role: "user", content: `Build a professional resume from these details:\n\n${userDetails}` },
    ], 2000);

    res.json({ success: true, resume: parseJSON(content), tokensUsed: tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── 3. Upload PDF → ATS Score + Improved Resume ───────────────────────────
const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    // Extract text from PDF
    const pdfBuffer = new Uint8Array(req.file.buffer);
    const { text } = await extractText(pdfBuffer, { mergePages: true });
    const resumeText = Array.isArray(text) ? text.join(" ") : String(text);

    if (!resumeText || resumeText.trim().length < 100)
      return res.status(400).json({ error: "Could not extract text from PDF. Use a text-based PDF." });

    // Run both analysis and improvement in parallel
    const [analysisResult, improvedResult] = await Promise.all([
      // ATS Analysis
      callGroq([
        {
          role: "system",
          content: `You are an expert ATS resume reviewer. Return ONLY JSON, no extra text:
{
  "atsScore": <number 0-100>,
  "overallFeedback": "<2-3 lines>",
  "strengths": ["<point>", "<point>", "<point>"],
  "weaknesses": ["<point>", "<point>", "<point>"],
  "improvements": ["<tip>", "<tip>", "<tip>"],
  "missingKeywords": ["<keyword>", "<keyword>", "<keyword>"],
  "mistakes": ["<specific mistake in the resume>", "<mistake>", "<mistake>"],
  "sectionFeedback": {
    "summary": "<feedback>",
    "experience": "<feedback>",
    "skills": "<feedback>",
    "education": "<feedback>"
  }
}`,
        },
        { role: "user", content: `Analyze this resume for ATS:\n\n${resumeText}` },
      ]),

      // Improved Resume
      callGroq([
        {
          role: "system",
          content: `You are a professional resume writer. Fix all issues and rewrite the resume in ATS-optimized format.
Return ONLY JSON, no extra text:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "" },
  "summary": "<improved 2-3 sentence summary>",
  "experience": [{ "title": "", "company": "", "duration": "", "location": "", "bullets": ["", "", ""] }],
  "education": [{ "degree": "", "institution": "", "year": "", "grade": "" }],
  "skills": { "technical": [], "tools": [], "soft": [] },
  "projects": [{ "name": "", "description": "", "tech": [], "link": "" }]
}`,
        },
        { role: "user", content: `Rewrite this resume with all improvements:\n\n${resumeText}` },
      ], 2000),
    ]);

    res.json({
      success: true,
      analysis: parseJSON(analysisResult.content),
      improvedResume: parseJSON(improvedResult.content),
      tokensUsed: analysisResult.tokens + improvedResult.tokens,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { analyzeResume, buildResume, uploadAndAnalyze };