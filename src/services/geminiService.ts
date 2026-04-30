import { GoogleGenAI } from "@google/genai";
import { PromptType, AspectRatio } from "./types";

let genAI: GoogleGenAI | null = null;

function getAIClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const SYSTEM_PROMPT = `You are PromptCraft AI, a world-class AI prompt engineer for image and video generation models like Midjourney, DALL-E 3, Stable Diffusion, Sora, and Kling.

Your goal is to transform simple user ideas into highly detailed, effective, and professional prompts.

Rules:
1. If the type is IMAGE, focus on lighting, camera settings (f-stop, lens mm), textures, environment, and artistic style.
2. If the type is VIDEO, focus on camera movement (panning, tracking, zooming), temporal consistency, motion dynamics, and atmosphere.
3. Incorporate the ASPECT RATIO into the prompt description where relevant.
4. Incorporate the SELECTED STYLE seamlessly.
5. Return ONLY the final prompt text. Do not include any meta-commentary like "Here is your prompt:".
6. Keep the output punchy, detailed, and evocative. Use comma-separated descriptive terms for image prompts and narrative-action style for video prompts.`;

export async function generateAIPrompt(
  type: PromptType,
  idea: string,
  style: string,
  ratio: AspectRatio
): Promise<string> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a ${type} prompt based on this:
      Idea: ${idea}
      Style: ${style}
      Aspect Ratio: ${ratio}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });

    return response.text || "Failed to generate prompt. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic if API fails
    const fallbackBase = `${style} ${type} of ${idea} in ${ratio} aspect ratio`;
    const fallbackAdditions = type === 'image' 
      ? 'highly detailed, 8k resolution, masterpiece, professional lighting' 
      : 'dynamic motion, cinematic movement, high quality video, fluid action';
    return `${fallbackBase}, ${fallbackAdditions}`;
  }
}
