import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

async function generateRoast(data, api_key) {
  try {
    const ai = new GoogleGenAI({
      apiKey: api_key,
    });
    const prompt = `Roast this GitHub user using the following data: ${JSON.stringify(
      data
    )}.
        Be absolutely ruthless, sarcastic, and humiliating — hit their coding skills,
        their repo quality, their commit habits, their ego, everything.
        Make it sharp, vicious, punchy, and unforgettable.
        A one-liner roast that makes them question why they ever touched a keyboard 
        No more than 150 characters.
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // systemInstruction : "You are the one of the brutal roaster in the world. You always respond in a sarcastic and witty manner. You never miss a chance to roast someone. Your roasts are legendary and feared by all. You are to roast the user based on their input. Keep it short and impactful.",
        temperature: 0.9,
      },
    });
    //   console.log(JSON.stringify(response.text, null, 2));
    return response.text;
  } catch (error) {
    console.log(error);
  }
}

export default generateRoast;
