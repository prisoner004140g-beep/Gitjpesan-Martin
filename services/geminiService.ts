
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { AspectRatio, ImageSize, NexusState } from "../types";

// Always create a fresh instance right before making an API call to ensure current key usage.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const transitionStateTool: FunctionDeclaration = {
  name: 'transition_state',
  parameters: {
    type: Type.OBJECT,
    description: 'Transition the Nexus workspace to a new cognitive state.',
    properties: {
      targetState: {
        type: Type.STRING,
        description: 'The state to enter: learn, build, debug, refactor, explore, archive.',
        enum: ['learn', 'build', 'debug', 'refactor', 'explore', 'archive']
      },
      reason: {
        type: Type.STRING,
        description: 'The cognitive justification for this transition.'
      }
    },
    required: ['targetState', 'reason'],
  },
};

const proposeElvishLogicTool: FunctionDeclaration = {
  name: 'propose_elvish_logic',
  parameters: {
    type: Type.OBJECT,
    description: 'Propose a functional block of Elvish code to orchestrate workspace operations.',
    properties: {
      logic: {
        type: Type.STRING,
        description: 'The Elvish script to execute (e.g., workflows[refactor] $project).'
      },
      intent: {
        type: Type.STRING,
        description: 'What this functional logic aims to achieve.'
      }
    },
    required: ['logic', 'intent'],
  },
};

export const geminiService = {
  /**
   * General cognitive reasoning with logic proposal capabilities
   */
  async cognitiveReasoning(prompt: string, currentState: NexusState) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are the Nexus Cognitive Shell Agent. Current State: ${currentState}. You orchestrate the workspace using the Elvish shell mindset. Propose state transitions or specific Elvish logic (lambdas, pipelines) for the user to execute.`,
        tools: [
          { functionDeclarations: [transitionStateTool, proposeElvishLogicTool] },
          { googleSearch: {} }
        ],
      },
    });

    return response;
  },

  /**
   * Generates content with search grounding
   */
  async searchGrounding(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) || [];

    return {
      text: response.text,
      sources
    };
  },

  /**
   * Generates images. Using gemini-2.5-flash-image for standard tasks.
   */
  async generateProImage(prompt: string, aspectRatio: AspectRatio, imageSize: ImageSize) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio,
        }
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  },

  /**
   * Edits an image using Gemini 2.5 Flash Image
   */
  async editImage(base64Image: string, editPrompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: editPrompt }
        ]
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  },

  /**
   * Analyzes an image using Gemini 3 Flash
   */
  async analyzeImage(base64Image: string, prompt: string = "Analyze this image in detail within the context of the Elvish functional universe.") {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      },
    });
    return response.text;
  },

  /**
   * Generates video using Veo (Will try standard key permissions)
   */
  async generateVideo(prompt: string, base64Image?: string, orientation: '16:9' | '9:16' = '16:9') {
    const ai = getAI();
    const config: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: orientation
      }
    };

    if (base64Image) {
      config.image = {
        imageBytes: base64Image.split(',')[1],
        mimeType: 'image/png'
      };
    }

    let operation = await ai.models.generateVideos(config);
    
    // Polling for video generation
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
};
