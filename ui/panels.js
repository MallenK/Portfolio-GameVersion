/**
 * UI Manager for HTML overlays
 */

const elements = {
    dialogBox: document.getElementById('dialogBox'),
    dialogContent: document.getElementById('dialogContent'),
    panel: document.getElementById('portfolioPanel'),
    panelTitle: document.getElementById('panelTitle'),
    panelBody: document.getElementById('panelBody'),
    closeBtn: document.getElementById('closeBtn'),
    interactionPrompt: document.getElementById('interactionPrompt')
};

let typeWriterInterval = null;

export const UI = {
    showDialog(lines, onComplete) {
        elements.dialogBox.classList.remove('hidden');
        let lineIndex = 0;
        
        const showLine = () => {
            if (lineIndex >= lines.length) {
                this.hideDialog();
                if (onComplete) onComplete();
                return;
            }

            const text = lines[lineIndex];
            elements.dialogContent.textContent = '';
            let charIndex = 0;
            
            clearInterval(typeWriterInterval);
            typeWriterInterval = setInterval(() => {
                elements.dialogContent.textContent += text[charIndex];
                charIndex++;
                if (charIndex >= text.length) {
                    clearInterval(typeWriterInterval);
                }
            }, 30); // Typing speed
        };

        showLine();

        return {
            next: () => {
                if (elements.dialogContent.textContent.length < lines[lineIndex].length) {
                    // Instant finish
                    elements.dialogContent.textContent = lines[lineIndex];
                    clearInterval(typeWriterInterval);
                } else {
                    lineIndex++;
                    if (lineIndex < lines.length) {
                        showLine();
                        return true; // Still in dialog
                    } else {
                        this.hideDialog();
                        if (onComplete) onComplete();
                        return false; // Dialog finished
                    }
                }
                return true;
            }
        };
    },

    hideDialog() {
        elements.dialogBox.classList.add('hidden');
        clearInterval(typeWriterInterval);
    },

    showPanel(data) {
        elements.panelTitle.textContent = data.title;
        elements.panelBody.innerHTML = data.html;
        elements.panel.classList.remove('hidden');
        
        // Setup close handler
        elements.closeBtn.onclick = () => this.hidePanel();
    },

    hidePanel() {
        elements.panel.classList.add('hidden');
    },

    toggleInteractionPrompt(show) {
        if (show) {
            elements.interactionPrompt.classList.remove('hidden');
        } else {
            elements.interactionPrompt.classList.add('hidden');
        }
    }
};