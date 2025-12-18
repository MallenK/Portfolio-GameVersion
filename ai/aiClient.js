
import { GoogleGenAI } from "@google/genai";
import { NPC_PROMPTS } from './npcPrompts.js';

/**
 * AI Client
 * Manages connection to Gemini API and stores chat history per session.
 */
class AIClient {
    constructor() {
        // The API key is obtained from process.env.API_KEY
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.modelName = "gemini-3-flash-preview"; 
        this.currentChat = null;
    }

    /**
     * Starts a new chat session for a specific NPC.
     * @param {string} npcId - The ID of the NPC from data/npcs.js
     */
    async startSession(npcId) {
        let config = NPC_PROMPTS[npcId];
        
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
                    maxOutputTokens: 150,
                    temperature: 0.8,
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
        if (!this.currentChat) return "Connection lost... (No active chat)";

        try {
            const response = await this.currentChat.sendMessage({ message });
            // Accessing .text property as per @google/genai standards
            return response.text;
        } catch (error) {
            console.error("AI Response Error:", error);
            return "Bzzzt... signal interrupted. Try again traveler.";
        }
    }
}

export const aiClient = new AIClient();
