
/**
 * Base Sprite class for rendering images and handling animations
 */
export class Sprite {
    constructor({ position, image, frames = { max: 4 }, sprites }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        
        this.width = 48; 
        this.height = 48;
        this.loaded = false;
        
        // Direction: 0-Down, 1-Up, 2-Left, 3-Right
        this.direction = 0; 
        
        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height / 4; // Assuming 4 directions/rows
            this.loaded = true;
        }

        this.moving = false;
        this.sprites = sprites;
    }

    draw(c) {
        if (!this.image) return;

        if (!this.loaded) {
            if (this.image.complete && this.image.naturalWidth > 0) {
                this.width = this.image.width / this.frames.max;
                this.height = this.image.height / 4;
                this.loaded = true;
            }
        }

        c.drawImage(
            this.image,
            this.frames.val * this.width, 
            this.direction * this.height,                            
            this.width, 
            this.height,            
            this.position.x,
            this.position.y,
            this.width, 
            this.height             
        );

        if (!this.moving) {
            this.frames.val = 0; // Return to idle frame
            return;
        }

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

        // Cycle through 4 frames for walking (0: Idle, 1: Step, 2: Idle, 3: Step)
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

export class Player extends Sprite {
    constructor(props) {
        super(props);
    }
}

export class Structure {
    constructor({ position, image, collisionWidth, collisionHeight, offsetY }) {
        this.position = position;
        this.image = image;
        this.width = 0;
        this.height = 0;
        this.loaded = false;
        
        if (this.image.complete && this.image.naturalWidth > 0) {
            this.loaded = true;
            this.width = this.image.width;
            this.height = this.image.height;
        }

        this.collisionBox = {
            width: collisionWidth,
            height: collisionHeight,
            offsetX: 0, 
            offsetY: offsetY
        };
    }

    draw(c) {
        if (!this.loaded) {
            if (this.image.complete && this.image.naturalWidth > 0) {
                this.width = this.image.width;
                this.height = this.image.height;
                this.loaded = true;
                this.collisionBox.offsetX = (this.width - this.collisionBox.width) / 2;
            }
        }

        if (this.width > 0) {
            c.save();
            c.fillStyle = 'rgba(0,0,0,0.4)';
            c.fillRect(
                this.position.x + 5, 
                this.position.y + this.height - 10, 
                this.width - 10, 
                15
            );
            c.restore();
        }

        if (this.loaded) {
            c.drawImage(this.image, this.position.x, this.position.y);
        }
    }
}

export class Interactable extends Sprite {
    constructor({ position, image, frames = { max: 4 }, sprites, dialogue = [], panelData, triggerType }) {
        super({ position, image, frames, sprites });
        this.dialogue = dialogue;
        this.panelData = panelData;
        this.triggerType = triggerType; 
        this.isPlayerInRange = false;
    }

    draw(c) {
        super.draw(c);
        if (this.isPlayerInRange) {
            c.save();
            const bubbleX = this.position.x + this.width / 2;
            const bubbleY = this.position.y;
            const floatY = Math.sin(Date.now() / 200) * 2;

            c.fillStyle = 'white';
            c.strokeStyle = 'black';
            c.lineWidth = 2;
            c.beginPath();
            c.arc(bubbleX, bubbleY - 12 + floatY, 8, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            c.fillStyle = 'black';
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.font = 'bold 14px monospace';
            const icon = this.triggerType === 'sign' ? '?' : '!';
            c.fillText(icon, bubbleX, bubbleY - 11 + floatY);
            c.restore();
        }
    }
}

export class Boundary {
    static width = 48;
    static height = 48;
    
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw(c) {}
}
