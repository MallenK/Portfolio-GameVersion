/**
 * Base Sprite class for rendering images and handling animations
 */
export class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        
        this.width = 48; // Default fallback
        this.height = 48;

        this.loaded = false;
        
        // Attempt immediate load
        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            this.loaded = true;
        }

        this.moving = false;
        this.sprites = sprites;
    }

    draw(c) {
        if (!this.image) return;

        // Lazy Load Check: If image wasn't ready at construction, check now
        if (!this.loaded) {
            if (this.image.complete && this.image.naturalWidth > 0) {
                this.width = this.image.width / this.frames.max;
                this.height = this.image.height;
                this.loaded = true;
            }
        }

        // Draw Shadow (Simple oval)
        c.save();
        c.fillStyle = 'rgba(0,0,0,0.2)';
        c.beginPath();
        // Ellipse centered at bottom of sprite
        c.ellipse(
            this.position.x + this.width / 2, 
            this.position.y + this.height - 2, 
            this.width / 3, 
            6, 
            0, 0, Math.PI * 2
        );
        c.fill();
        c.restore();

        // Draw Sprite
        // If width/height are still 0 (very rare race condition), this draws nothing, which is fine
        c.drawImage(
            this.image,
            this.frames.val * this.width, 
            0,                            
            this.width, 
            this.height,            
            this.position.x,
            this.position.y,
            this.width, 
            this.height             
        );

        if (!this.moving) {
            this.frames.val = 0;
            return;
        }

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

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

/**
 * Structure (House)
 * Large static object with 2.5D collision properties.
 * The player can walk "behind" the roof, but collides with the base.
 */
export class Structure {
    constructor({ position, image, collisionWidth, collisionHeight, offsetY }) {
        this.position = position;
        this.image = image;
        this.width = image.width || 0;
        this.height = image.height || 0;
        this.loaded = false;
        
        if (this.image.complete && this.image.naturalWidth > 0) {
            this.loaded = true;
            this.width = this.image.width;
            this.height = this.image.height;
        }

        // The solid part at the bottom
        this.collisionBox = {
            width: collisionWidth,
            height: collisionHeight,
            // OffsetX cannot be calculated reliably if width is 0, but collision logic in index.js might not use it directly 
            // depending on implementation. We store it just in case.
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
                // Update collision offset center if needed (though mostly static)
                this.collisionBox.offsetX = (this.width - this.collisionBox.width) / 2;
            }
        }

        // Draw Shadow for building
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
    constructor({ position, image, frames = { max: 1 }, sprites, dialogue = [], panelData, triggerType }) {
        super({ position, image, frames, sprites });
        this.dialogue = dialogue;
        this.panelData = panelData;
        this.triggerType = triggerType; // 'npc' or 'sign'
        this.isPlayerInRange = false;
    }

    draw(c) {
        super.draw(c);
        if (this.isPlayerInRange) {
            c.save();
            const bubbleX = this.position.x + this.width / 2;
            const bubbleY = this.position.y;

            // Animate bubble
            const floatY = Math.sin(Date.now() / 200) * 2;

            c.fillStyle = 'white';
            c.strokeStyle = 'black';
            c.lineWidth = 2;
            c.beginPath();
            c.arc(bubbleX, bubbleY - 12 + floatY, 8, 0, Math.PI * 2);
            c.fill();
            c.stroke();

            // Icon based on type
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

    draw(c) {
        // Debug collision
        // c.fillStyle = 'rgba(255, 0, 0, 0.2)'; 
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}