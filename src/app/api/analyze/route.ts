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

    // Try Anthropic first, then OpenAI
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let analysisText: string;

    if (anthropicKey) {
      analysisText = await analyzeWithAnthropic(anthropicKey, base64, mediaType);
    } else if (openaiKey) {
      analysisText = await analyzeWithOpenAI(openaiKey, base64, mediaType);
    } else {
      return NextResponse.json(
        {
          error:
            "No AI API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment variables.",
        },
        { status: 503 }
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
