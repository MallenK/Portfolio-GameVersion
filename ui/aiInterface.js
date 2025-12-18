import { aiClient } from '../ai/aiClient.js';

/**
 * AI Dialog Interface
 * Manages the UI state for AI conversations:
 * - Text Typewriter effect
 * - Input handling (Text vs Options)
 * - "Thinking" states
 */

const DOM = {
    box: document.getElementById('dialogBox'),
    content: document.getElementById('dialogContent'),
    name: document.getElementById('dialogName'),
    next: document.getElementById('dialogNext'),
    
    // AI Specifics
    container: document.getElementById('aiContainer'),
    thinking: document.getElementById('aiThinking'),
    inputMode: document.getElementById('aiInputMode'),
    input: document.getElementById('aiInput'),
    sendBtn: document.getElementById('aiSendBtn'),
    optionsMode: document.getElementById('aiOptionsMode')
};

export class AIDialogManager {
    constructor(onCloseCallback) {
        this.onClose = onCloseCallback;
        // States: IDLE, TYPING, READING, INTERACTION (Input/Options), THINKING
        this.state = 'IDLE'; 
        this.typeInterval = null;
        this.activeNpcConfig = null;
        this.currentOptions = [];
        this.selectedOptionIndex = 0;
        this.fullTextBuffer = '';

        // Bind events
        DOM.sendBtn.addEventListener('click', () => this.handleInputSubmit());
        DOM.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleInputSubmit();
            // Prevent Enter from bubbling to game loop if focused
            e.stopPropagation();
        });
    }

    start(npcData) {
        this.resetUI();
        DOM.box.classList.remove('hidden');
        
        // Show Name
        if (npcData.id) {
            DOM.name.textContent = npcData.id.replace(/_/g, ' ').toUpperCase();
            DOM.name.classList.remove('hidden');
        }

        this.activeNpcMode = npcData.aiConfig?.mode || 'options';
        
        // Initialize AI Session
        this.state = 'THINKING';
        this.showThinking(true);
        
        aiClient.startSession(npcData.id).then(config => {
            this.activeNpcConfig = config;
            
            // AI Greeting or Static Greeting
            const introText = npcData.dialogue[0] || "Hello traveler.";
            this.showThinking(false);
            
            // Start Typing
            this.typeText(introText);
        });
    }

    resetUI() {
        DOM.content.textContent = '';
        DOM.container.classList.add('hidden');
        DOM.next.classList.add('hidden');
        DOM.inputMode.classList.add('hidden');
        DOM.optionsMode.classList.add('hidden');
        DOM.thinking.classList.add('hidden');
        DOM.optionsMode.innerHTML = '';
        DOM.input.value = '';
    }

    showThinking(isThinking) {
        if (isThinking) {
            DOM.thinking.classList.remove('hidden');
            DOM.inputMode.classList.add('hidden');
            DOM.optionsMode.classList.add('hidden');
            DOM.next.classList.add('hidden');
        } else {
            DOM.thinking.classList.add('hidden');
        }
    }

    typeText(text) {
        this.state = 'TYPING';
        this.fullTextBuffer = text;
        DOM.content.textContent = '';
        DOM.container.classList.add('hidden'); // Hide options while typing
        DOM.next.classList.add('hidden');
        
        let i = 0;
        clearInterval(this.typeInterval);
        
        this.typeInterval = setInterval(() => {
            DOM.content.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                this.finishTyping();
            }
        }, 30);
    }

    finishTyping() {
        clearInterval(this.typeInterval);
        DOM.content.textContent = this.fullTextBuffer;
        this.state = 'READING';
        DOM.next.classList.remove('hidden'); // Show arrow to indicate "Press Enter to Continue"
        DOM.next.textContent = "▼ Press Space/Enter";
    }

    advanceState() {
        // Transition from READING -> INTERACTION
        this.state = 'INTERACTION';
        DOM.next.classList.add('hidden');
        this.presentUserInterface();
    }

    presentUserInterface() {
        DOM.container.classList.remove('hidden');
        
        if (this.activeNpcMode === 'input') {
            DOM.inputMode.classList.remove('hidden');
            DOM.input.focus();
        } else {
            // Options Mode
            DOM.optionsMode.classList.remove('hidden');
            this.renderOptions(this.activeNpcConfig.options);
        }
    }

    renderOptions(options) {
        DOM.optionsMode.innerHTML = '';
        this.currentOptions = [...options, "Goodbye"]; // Always add exit option
        this.selectedOptionIndex = 0;

        this.currentOptions.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = `pixel-btn w-full ${idx === 0 ? 'selected' : ''}`;
            btn.textContent = `▶ ${opt}`;
            btn.onclick = () => this.handleOptionClick(opt);
            DOM.optionsMode.appendChild(btn);
        });
    }

    // Called by index.js keydown listener
    handleInputEvents(key) {
        if (this.state === 'THINKING') return; // Block input while thinking

        // 1. TYPING -> Fast Forward
        if (this.state === 'TYPING') {
            if (key === 'Enter' || key === 'Space') {
                this.finishTyping();
            }
            return;
        }

        // 2. READING -> Show Options/Input
        if (this.state === 'READING') {
            if (key === 'Enter' || key === 'Space') {
                this.advanceState();
            }
            return;
        }

        // 3. INTERACTION (Options Navigation)
        if (this.state === 'INTERACTION' && this.activeNpcMode === 'options') {
            if (key === 'ArrowUp') {
                this.selectedOptionIndex = Math.max(0, this.selectedOptionIndex - 1);
                this.updateOptionSelection();
            } else if (key === 'ArrowDown') {
                this.selectedOptionIndex = Math.min(this.currentOptions.length - 1, this.selectedOptionIndex + 1);
                this.updateOptionSelection();
            } else if (key === 'Enter' || key === 'Space') {
                const choice = this.currentOptions[this.selectedOptionIndex];
                this.handleOptionClick(choice);
            }
        } 
        
        // Input mode is handled by focus, but allow Escape to exit
        if (key === 'Escape') {
            this.endDialog();
        }
    }

    updateOptionSelection() {
        const btns = DOM.optionsMode.children;
        for (let i = 0; i < btns.length; i++) {
            if (i === this.selectedOptionIndex) btns[i].classList.add('selected');
            else btns[i].classList.remove('selected');
        }
    }

    async handleOptionClick(text) {
        if (text === 'Goodbye') {
            this.endDialog();
            return;
        }
        this.submitToAI(text);
    }

    handleInputSubmit() {
        const text = DOM.input.value.trim();
        if (!text) return;
        DOM.input.value = '';
        this.submitToAI(text);
    }

    async submitToAI(userInput) {
        this.state = 'THINKING';
        DOM.container.classList.add('hidden'); 
        DOM.content.textContent = ''; 
        this.showThinking(true);
        DOM.container.classList.remove('hidden'); 

        // Call API
        const response = await aiClient.sendMessage(userInput);

        // Show Response
        this.showThinking(false);
        this.typeText(response); 
        // Note: typeText sets state to TYPING -> READING -> User must press Enter again to see options
    }

    endDialog() {
        DOM.box.classList.add('hidden');
        DOM.name.classList.add('hidden');
        this.state = 'IDLE';
        if (this.onClose) this.onClose();
    }
}