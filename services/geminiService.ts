
import { GoogleGenAI, Type } from "@google/genai";
import type { Card, ReadingInterpretations } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set. Please configure it in your Vercel project settings.");
  }
  return new GoogleGenAI({ apiKey });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    fila1_interpretacion: {
      type: Type.STRING,
      description: "Interpretación detallada de la primera fila de cartas en relación a la primera pregunta.",
    },
    fila2_interpretacion: {
      type: Type.STRING,
      description: "Interpretación detallada de la segunda fila de cartas en relación a la segunda pregunta.",
    },
    fila3_interpretacion: {
      type: Type.STRING,
      description: "Interpretación detallada de la tercera fila de cartas en relación a la tercera pregunta.",
    },
    sintesis_global: {
      type: Type.STRING,
      description: "Un resumen y consejo final que conecte las tres filas y ofrezca una visión general de la lectura.",
    },
  },
  required: ["fila1_interpretacion", "fila2_interpretacion", "fila3_interpretacion", "sintesis_global"],
};


export const getTarotInterpretation = async (cards: Card[], questions: string[]): Promise<ReadingInterpretations> => {
  const ai = getAIClient();
  const prompt = `
    Realiza una lectura de tarot de 9 cartas en una disposición de 3x3.
    Eres un experto tarotista, sabio y empático. Tu propósito es ofrecer interpretaciones profundas y constructivas.
    Evita el lenguaje fatalista. Enfócate en el crecimiento personal, la reflexión y los posibles caminos a seguir. Habla en español.

    La lectura se estructura así:

    Pregunta 1 (${questions[0]}):
    Cartas: ${cards[0].name}, ${cards[1].name}, ${cards[2].name}

    Pregunta 2 (${questions[1]}):
    Cartas: ${cards[3].name}, ${cards[4].name}, ${cards[5].name}

    Pregunta 3 (${questions[2]}):
    Cartas: ${cards[6].name}, ${cards[7].name}, ${cards[8].name}

    Proporciona un análisis para cada fila y luego una síntesis global que conecte todo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Validate the parsed JSON against the expected type
    if (
        typeof parsedJson.fila1_interpretacion === 'string' &&
        typeof parsedJson.fila2_interpretacion === 'string' &&
        typeof parsedJson.fila3_interpretacion === 'string' &&
        typeof parsedJson.sintesis_global === 'string'
    ) {
        return parsedJson as ReadingInterpretations;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error fetching tarot interpretation:", error);
    throw new Error("No se pudo obtener la interpretación del tarot. Por favor, inténtalo de nuevo.");
  }
};

export const generateCardImage = async (cardName: string): Promise<string> => {
    const ai = getAIClient();
    const prompt = `Rider-Waite style tarot card illustration of '${cardName}'. Detailed, classic tarot art, vibrant colors, mystical.`;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3', // standard card-like aspect ratio
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation failed, no images returned.");
        }
    } catch (error) {
        console.error(`Error generating image for ${cardName}:`, error);
        throw new Error(`Failed to generate image for ${cardName}.`);
    }
};