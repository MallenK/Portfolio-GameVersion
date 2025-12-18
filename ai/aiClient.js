import { GoogleGenAI } from "@google/genai";
import { NPC_PROMPTS } from './npcPrompts.js';

/**
 * AI Client
 * Manages connection to Gemini API and stores chat history per session.
 */
class AIClient {
    constructor() {
        // Initialize with API Key from environment
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.modelName = "gemini-2.5-flash"; // Using Flash for speed/latency in games
        this.currentChat = null;
    }

    /**
     * Starts a new chat session for a specific NPC.
     * @param {string} npcId - The ID of the NPC from data/npcs.js
     */
    async startSession(npcId) {
        // Determine which persona to use
        let config = NPC_PROMPTS[npcId];
        
        // Fallback mapping if exact ID isn't in prompts, or use generic
        if (!config) {
            if (npcId.includes('guide')) config = NPC_PROMPTS.guide;
            else if (npcId.includes('hr')) config = NPC_PROMPTS.hr_manager;
            else if (npcId.includes('bot') || npcId.includes('project')) config = NPC_PROMPTS.project_bot;
            else config = NPC_PROMPTS.generic;
        }

        this.currentConfig = config;

        try {
            this.currentChat = this.ai.chats.create({
                model: this.modelName,
                config: {
                    systemInstruction: config.systemInstruction,
                    maxOutputTokens: 100, // Enforce brevity for RPG dialog boxes
                    temperature: 0.7,
                }
            });
            return config;
        } catch (error) {
            console.error("AI Initialization Error:", error);
            return null;
        }
    }

    /**
     * Sends a message to the current NPC and gets a response.
     * @param {string} message - User input or selected option
     */
    async sendMessage(message) {
        if (!this.currentChat) return "Error: No active conversation.";

        try {
            const result = await this.currentChat.sendMessage({ message });
            return result.text;
        } catch (error) {
            console.error("AI Response Error:", error);
            return "The connection to the server is static... (AI Error)";
        }
    }
}

export const aiClient = new AIClient();