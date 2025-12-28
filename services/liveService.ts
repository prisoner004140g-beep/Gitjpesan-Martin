
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import { NexusState } from '../types';

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

export class LiveCognition {
  private ai: any;
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private stream: MediaStream | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async connect(callbacks: {
    onMessage: (text: string) => void;
    onInterrupted: () => void;
    onClose: () => void;
    onToolCall: (fc: any) => Promise<string>;
  }) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(this.stream!);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = this.createBlob(inputData);
            this.sessionPromise?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              const result = await callbacks.onToolCall(fc);
              this.sessionPromise?.then((session) => {
                session.sendToolResponse({
                  functionResponses: [{
                    id: fc.id,
                    name: fc.name,
                    response: { result },
                  }]
                });
              });
            }
          }
          if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
            this.playAudio(base64);
          }
          if (message.serverContent?.outputTranscription) {
            callbacks.onMessage(message.serverContent.outputTranscription.text);
          }
          if (message.serverContent?.interrupted) {
            this.stopAudio();
            callbacks.onInterrupted();
          }
        },
        onclose: callbacks.onClose,
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: `You are the Nexus Cognitive Agent. You interact with the user via a functional Elvish shell environment.
        You have two primary tools:
        1. transition_state: Propose a move to a new cognitive state (learn, build, debug, refactor, explore, archive).
        2. propose_elvish_logic: Propose a block of Elvish code to automate tasks, manipulate data, or run workflows.
        
        Always explain your reasoning before using these tools. Use the mindset that the OS is a functional universe.`,
        outputAudioTranscription: {},
        tools: [{ functionDeclarations: [transitionStateTool, proposeElvishLogicTool] }],
      },
    });

    return this.sessionPromise;
  }

  private async playAudio(base64: string) {
    if (!this.audioContext) return;
    this.nextStartTime = Math.max(this.nextStartTime, this.audioContext.currentTime);
    const buffer = await this.decodeAudioData(this.decode(base64), this.audioContext, 24000, 1);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.addEventListener('ended', () => this.sources.delete(source));
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.sources.add(source);
  }

  private stopAudio() {
    for (const source of this.sources.values()) {
      source.stop();
      this.sources.delete(source);
    }
    this.nextStartTime = 0;
  }

  private decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  private createBlob(data: Float32Array): Blob {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
  }

  disconnect() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stopAudio();
    this.sessionPromise = null;
  }
}
