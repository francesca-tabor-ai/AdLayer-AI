import { NextRequest, NextResponse } from "next/server";
import { KV_SYSTEM_PROMPT } from "@/lib/kv-analysis";

export const maxDuration = 60; // Allow up to 60s for AI processing
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, or WebP." },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type;

    // Build ordered list of available providers
    const providers: { name: string; fn: () => Promise<string> }[] = [];

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (anthropicKey) {
      providers.push({
        name: "Anthropic",
        fn: () => analyzeWithAnthropic(anthropicKey, base64, mediaType),
      });
    }
    if (openaiKey) {
      providers.push({
        name: "OpenAI",
        fn: () => analyzeWithOpenAI(openaiKey, base64, mediaType),
      });
    }
    if (geminiKey) {
      providers.push({
        name: "Gemini",
        fn: () => analyzeWithGemini(geminiKey, base64, mediaType),
      });
    }

    if (providers.length === 0) {
      return NextResponse.json(
        {
          error:
            "No AI API key configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in your environment variables.",
        },
        { status: 503 }
      );
    }

    // Try each provider in order, falling back on failure
    let analysisText: string | null = null;
    const errors: string[] = [];

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider.name}...`);
        analysisText = await provider.fn();
        console.log(`${provider.name} succeeded.`);
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`${provider.name} failed: ${msg}`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    if (!analysisText) {
      return NextResponse.json(
        {
          error: `All AI providers failed.\n${errors.join("\n")}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (err) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Anthropic Claude Vision ──────────────────────────────────────────────────

async function analyzeWithAnthropic(
  apiKey: string,
  base64: string,
  mediaType: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: KV_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Analyze this advertisement image. Provide the full 10-section production analysis.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  // Extract text from content blocks
  const textBlocks = data.content?.filter(
    (block: { type: string }) => block.type === "text"
  );
  return textBlocks?.map((b: { text: string }) => b.text).join("\n") || "";
}

// ─── OpenAI GPT-4o Vision ─────────────────────────────────────────────────────

async function analyzeWithOpenAI(
  apiKey: string,
  base64: string,
  mediaType: string
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 8192,
      messages: [
        {
          role: "system",
          content: KV_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mediaType};base64,${base64}`,
              },
            },
            {
              type: "text",
              text: "Analyze this advertisement image. Provide the full 10-section production analysis.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── Google Gemini Vision ─────────────────────────────────────────────────────

async function analyzeWithGemini(
  apiKey: string,
  base64: string,
  mediaType: string
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: KV_SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mediaType,
                  data: base64,
                },
              },
              {
                text: "Analyze this advertisement image. Provide the full 10-section production analysis.",
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || "")
      .join("\n") || ""
  );
}
