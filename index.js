
import { Sprite, Boundary, Player, Interactable, Structure } from './classes.js';
import { MAPS, TILES, SOLID_TILES } from './data/maps.js';
import { NPCS } from './data/npcs.js';
import { HOUSES, SIGNS } from './data/world_config.js';
import { ASSETS } from './data/assets.js';
import { UI } from './ui/panels.js';
import { AIDialogManager } from './ui/aiInterface.js';

// --- Configuration ---
const canvas = document.getElementById('gameCanvas');
const c = canvas.getContext('2d');
const transitionOverlay = document.getElementById('transitionOverlay');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const hud = document.getElementById('hud');

canvas.width = 960;
canvas.height = 720;
const TILE_SIZE = 48;

// --- Asset Generation ---
const createTileset = () => {
    const cvs = document.createElement('canvas');
    cvs.width = 2400; 
    cvs.height = 480; 
    const ctx = cvs.getContext('2d');

    const fillTexture = (idx, color, type = 'solid') => {
        const tx = idx * 48;
        const ty = 0;
        ctx.fillStyle = color;
        ctx.fillRect(tx, ty, 48, 48);
        
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(tx, ty, 48, 48);

        if (type === 'grass') {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            for(let i=0; i<8; i++) ctx.fillRect(tx + Math.random()*40, ty + Math.random()*40, 2, 4);
        } else if (type === 'path') {
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            for(let i=0; i<20; i++) ctx.fillRect(tx + Math.random()*44, ty + Math.random()*44, 4, 4);
        } else if (type === 'water') {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(tx + 5, ty + 10, 30, 2);
            ctx.fillRect(tx + 15, ty + 25, 20, 2);
        } else if (type === 'flower') {
            ctx.fillStyle = '#f87171';
            ctx.beginPath(); ctx.arc(tx+24, ty+24, 4, 0, Math.PI*2); ctx.fill();
        } else if (type === 'tree') {
            // SOLID COLOR TREE
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(tx+24, ty+24, 20, 0, Math.PI*2); ctx.fill();
        } else if (type === 'trunk') {
            ctx.fillStyle = '#451a03';
            ctx.fillRect(tx+16, ty, 16, 48);
        } else if (type === 'bench') {
            ctx.fillStyle = '#78350f'; 
            ctx.fillRect(tx+4, ty+14, 40, 8); 
            ctx.fillRect(tx+4, ty+28, 40, 10); 
            ctx.fillStyle = '#451a03'; 
            ctx.fillRect(tx+6, ty+22, 4, 18); 
            ctx.fillRect(tx+38, ty+22, 4, 18); 
        } else if (type === 'barrel') {
            ctx.fillStyle = '#451a03';
            ctx.beginPath(); ctx.ellipse(tx+24, ty+24, 14, 18, 0, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#271701'; ctx.lineWidth = 2; ctx.stroke();
        } else if (type === 'crate') {
            ctx.fillStyle = '#92400e';
            ctx.fillRect(tx+6, ty+6, 36, 36);
            ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2;
            ctx.strokeRect(tx+6, ty+6, 36, 36);
            ctx.beginPath(); ctx.moveTo(tx+6, ty+6); ctx.lineTo(tx+42, ty+42); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tx+42, ty+6); ctx.lineTo(tx+6, ty+42); ctx.stroke();
        } else if (type === 'stripe') {
            ctx.fillStyle = '#fbbf24'; // Yellow
            ctx.fillRect(tx, ty, 48, 48);
            ctx.fillStyle = '#000'; // Black stripes
            ctx.beginPath();
            ctx.moveTo(tx, ty); ctx.lineTo(tx+15, ty); ctx.lineTo(tx, ty+15); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(tx+20, ty); ctx.lineTo(tx+40, ty); ctx.lineTo(tx, ty+40); ctx.lineTo(tx, ty+20); ctx.fill();
        } else if (type === 'pipe_v') {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(tx+20, ty, 8, 48);
            ctx.fillStyle = '#475569';
            ctx.fillRect(tx+20, ty+10, 8, 2);
            ctx.fillRect(tx+20, ty+38, 8, 2);
        } else if (type === 'pipe_h') {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(tx, ty+20, 48, 8);
            ctx.fillStyle = '#475569';
            ctx.fillRect(tx+10, ty+20, 2, 8);
            ctx.fillRect(tx+38, ty+20, 2, 8);
        } else if (type === 'warning') {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(tx+24, ty+10); ctx.lineTo(tx+40, ty+38); ctx.lineTo(tx+8, ty+38); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#000'; ctx.fillRect(tx+23, ty+20, 2, 10); ctx.fillRect(tx+23, ty+32, 2, 2);
        } else if (type === 'tools') {
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(tx+10, ty+20, 28, 6); // Wrench-like
            ctx.fillRect(tx+10, ty+16, 6, 14);
            ctx.fillRect(tx+32, ty+16, 6, 14);
        } else if (type === 'control') {
            ctx.fillStyle = '#334155'; ctx.fillRect(tx+4, ty+4, 40, 40);
            ctx.fillStyle = '#0f172a'; ctx.fillRect(tx+8, ty+8, 32, 24); // Screen
            ctx.fillStyle = '#10b981'; ctx.fillRect(tx+10, ty+34, 6, 6); // Button
            ctx.fillStyle = '#ef4444'; ctx.fillRect(tx+20, ty+34, 6, 6); // Button
        }
    };

    fillTexture(TILES.GRASS, '#3f6212', 'grass');
    fillTexture(TILES.WALL, '#1e293b');
    fillTexture(TILES.DOOR, '#000000');
    fillTexture(TILES.FLOWER, '#3f6212', 'flower');
    fillTexture(TILES.FLOOR_WOOD, '#451a03', 'path');
    fillTexture(TILES.FLOOR_STONE, '#334155', 'path');
    fillTexture(TILES.PATH, '#713f12', 'path');
    fillTexture(TILES.WATER, '#0c4a6e', 'water');
    fillTexture(TILES.TREE_PINE, '#064e3b', 'tree');
    fillTexture(TILES.METAL, '#27272a', 'path');
    fillTexture(TILES.PATH_ALT, '#57534e', 'path');
    fillTexture(TILES.LILYPAD, '#0c4a6e', 'water');
    fillTexture(TILES.MACHINE, '#475569');
    fillTexture(TILES.CONVEYOR, '#1e293b');
    fillTexture(TILES.STRIPE, '#fbbf24', 'stripe');
    fillTexture(TILES.TECH, '#1e293b', 'path');
    fillTexture(TILES.PIPE_V, '#64748b', 'pipe_v');
    fillTexture(TILES.PIPE_H, '#64748b', 'pipe_h');
    fillTexture(TILES.WARNING_SIGN, '#fbbf24', 'warning');
    fillTexture(TILES.TOOLS, '#94a3b8', 'tools');
    fillTexture(TILES.CONTROL_PANEL, '#334155', 'control');
    
    fillTexture(TILES.TREE, '#065f46', 'tree');     
    fillTexture(TILES.TREE_TRUNK, '#451a03', 'trunk');
    fillTexture(TILES.BENCH, '#78350f', 'bench');   
    fillTexture(TILES.BARREL, '#451a03', 'barrel'); 
    fillTexture(TILES.CRATE, '#92400e', 'crate');   

    const img = new Image();
    img.src = cvs.toDataURL();
    return img;
};

const createCharSprite = (bodyColor, eyeColor = '#000') => {
    const cvs = document.createElement('canvas');
    cvs.width = 192; cvs.height = 192; 
    const ctx = cvs.getContext('2d');
    
    const directions = ['down', 'up', 'left', 'right'];
    directions.forEach((dir, rowIdx) => {
        const yBase = rowIdx * 48;
        for(let i = 0; i < 4; i++) {
            const x = i * 48;
            const y = yBase;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath(); ctx.ellipse(x+24, y+44, 12, 4, 0, 0, Math.PI*2); ctx.fill();
            
            // Legs
            ctx.fillStyle = '#111';
            let ly = y + 36;
            if (i === 1 || i === 3) ly -= 3; // Bobbing effect for walking
            
            if (dir === 'down' || dir === 'up') {
                ctx.fillRect(x+16, ly, 6, 8); ctx.fillRect(x+26, ly, 6, 8);
            } else {
                ctx.fillRect(x+20, ly, 8, 8);
            }

            // Body
            ctx.fillStyle = bodyColor;
            ctx.fillRect(x+14, y+18, 20, 20);
            
            // Head
            ctx.fillStyle = '#ffedd5'; 
            ctx.fillRect(x+14, y+6, 20, 16); 
            
            // Features based on direction
            ctx.fillStyle = eyeColor;
            if (dir === 'down') {
                ctx.fillRect(x+18, y+12, 3, 3); ctx.fillRect(x+27, y+12, 3, 3);
            } else if (dir === 'up') {
                ctx.fillStyle = bodyColor;
                ctx.fillRect(x+14, y+6, 20, 5); // Hair/Back of head
            } else if (dir === 'left') {
                ctx.fillRect(x+16, y+12, 3, 3);
            } else if (dir === 'right') {
                ctx.fillRect(x+29, y+12, 3, 3);
            }
            
            // Simple mouth
            if (dir === 'down') {
                ctx.fillStyle = '#f87171';
                ctx.fillRect(x+22, y+18, 4, 2);
            }
        }
    });

    const img = new Image();
    img.src = cvs.toDataURL();
    return img;
};

const tilesetImage = createTileset();
const playerSprite = createCharSprite('#ef4444'); 
const npcSprite = createCharSprite('#3b82f6'); 
const engineerSprite = createCharSprite('#f59e0b', '#fff'); 

const offset = { x: 0, y: 0 };
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

let activeMapId = 'overworld';
let currentBoundaries = [];
let currentInteractables = [];
let currentVisualLayer = [];
let currentStructures = []; 
let isTransitioning = false;
let gameStarted = false;
let gameState = 'WORLD'; 
let dialogController = null;
let returnPosition = { x: 30, y: 32 };

const aiDialogManager = new AIDialogManager(() => {
    gameState = 'WORLD';
});

const PLAYER_SCREEN_X = canvas.width/2 - 24;
const PLAYER_SCREEN_Y = canvas.height/2 - 24;

const player = new Player({
    position: { x: PLAYER_SCREEN_X, y: PLAYER_SCREEN_Y }, 
    image: playerSprite,
    frames: { max: 4 }
});

function loadMap(mapId, startX, startY) {
    const mapConfig = MAPS[mapId];
    if (!mapConfig) return;

    activeMapId = mapId;
    currentVisualLayer = mapConfig.visual;
    const targetPx = startX * TILE_SIZE;
    const targetPy = startY * TILE_SIZE;
    
    offset.x = (canvas.width / 2) - targetPx - (TILE_SIZE / 2);
    offset.y = (canvas.height / 2) - targetPy - (TILE_SIZE / 2);

    currentBoundaries = [];
    mapConfig.grid.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === 1) { 
                currentBoundaries.push(new Boundary({ position: { x: j * TILE_SIZE, y: i * TILE_SIZE } }));
            }
        });
    });

    currentStructures = [];
    currentInteractables = [];

    if (mapId === 'overworld') {
        HOUSES.forEach(h => {
            const house = new Structure({
                position: { x: h.x * TILE_SIZE, y: h.y * TILE_SIZE },
                image: h.image,
                collisionWidth: h.width * TILE_SIZE,
                collisionHeight: TILE_SIZE * 2,
                offsetY: (h.height - 2) * TILE_SIZE
            });
            currentStructures.push(house);
        });

        SIGNS.forEach(s => {
            currentInteractables.push(new Interactable({
                position: { x: s.x * TILE_SIZE, y: s.y * TILE_SIZE },
                image: ASSETS.sign,
                triggerType: 'sign',
                dialogue: s.text
            }));
        });
    }

    if (mapId === 'experience_interior') {
        // Add static control panels
        currentInteractables.push(new Interactable({
            position: { x: 9 * TILE_SIZE, y: 15 * TILE_SIZE },
            image: null, // Drawn by tileset
            triggerType: 'sign',
            dialogue: ["SYSTEM STATUS: OPTIMAL", "Thermal output within standard parameters."]
        }));
        currentInteractables.push(new Interactable({
            position: { x: 20 * TILE_SIZE, y: 15 * TILE_SIZE },
            image: null,
            triggerType: 'sign',
            dialogue: ["LOAD BALANCER: ACTIVE", "Redistributing data packets to Procesador Beta."]
        }));
    }

    const mapNpcs = NPCS.filter(n => n.mapId === mapId);
    mapNpcs.forEach(n => {
        const sprite = n.id === 'chief_engineer' ? engineerSprite : npcSprite;
        const npc = new Interactable({
            position: { x: n.x * TILE_SIZE, y: n.y * TILE_SIZE },
            image: sprite,
            frames: { max: 4 },
            dialogue: n.dialogue,
            panelData: n.panel,
            triggerType: 'npc'
        });
        if (n.aiConfig) npc.aiConfig = n.aiConfig;
        if (n.id) npc.id = n.id;
        currentInteractables.push(npc);
    });
}

function rectCollision({ r1, r2 }) {
    return (r1.position.x + r1.width > r2.position.x &&
            r1.position.x < r2.position.x + r2.width &&
            r1.position.y + r1.height > r2.position.y &&
            r1.position.y < r2.position.y + r2.height);
}

function switchScene(targetMapId, x, y) {
    if (isTransitioning) return;
    isTransitioning = true;
    player.moving = false;
    transitionOverlay.classList.remove('opacity-0');
    transitionOverlay.classList.add('opacity-100');
    setTimeout(() => {
        loadMap(targetMapId, x, y);
        setTimeout(() => {
            transitionOverlay.classList.remove('opacity-100');
            transitionOverlay.classList.add('opacity-0');
            isTransitioning = false;
        }, 300);
    }, 500);
}

function handleInteraction() {
    if (!gameStarted || isTransitioning) return;
    if (gameState === 'AI_DIALOG') return;
    if (gameState === 'PANEL') { UI.hidePanel(); gameState = 'WORLD'; return; }
    if (gameState === 'DIALOG') {
        const isStillTyping = dialogController.next();
        if (!isStillTyping) {
            const target = currentInteractables.find(i => i.isPlayerInRange);
            if (target && target.panelData) { gameState = 'PANEL'; UI.showPanel(target.panelData); }
            else { gameState = 'WORLD'; }
        }
        return;
    }
    if (gameState === 'WORLD') {
        const target = currentInteractables.find(i => i.isPlayerInRange);
        if (target) {
            player.moving = false; 
            if (target.aiConfig) {
                gameState = 'AI_DIALOG'; UI.toggleInteractionPrompt(false); aiDialogManager.start(target);
            } else {
                gameState = 'DIALOG'; dialogController = UI.showDialog(target.dialogue); UI.toggleInteractionPrompt(false);
            }
        }
    }
}

function render() {
    c.fillStyle = '#050505';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() / 400;

    currentVisualLayer.forEach((row, i) => {
        row.forEach((idx, j) => {
            const x = j * TILE_SIZE + offset.x;
            let y = i * TILE_SIZE + offset.y;
            
            // Render basic tiles
            if (x > -TILE_SIZE && x < canvas.width && y > -TILE_SIZE && y < canvas.height) {
                // Flower bobbing
                let finalY = y;
                if (idx === TILES.FLOWER) {
                    finalY += Math.sin(time + (i + j)) * 3;
                }
                c.drawImage(tilesetImage, idx * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, x, finalY, TILE_SIZE, TILE_SIZE);

                // Animated machine overlay (blinking lights)
                if (idx === TILES.MACHINE) {
                    const blink = (Math.sin(time * 2 + (i * j)) + 1) / 2;
                    if (blink > 0.8) {
                        c.fillStyle = '#ef4444';
                        c.fillRect(x + 10, y + 10, 4, 4);
                    }
                    if (blink < 0.2) {
                        c.fillStyle = '#10b981';
                        c.fillRect(x + 34, y + 10, 4, 4);
                    }
                    // Steam effect
                    const steamOffset = (Date.now() / 20) % 60;
                    c.fillStyle = `rgba(255, 255, 255, ${0.2 * (1 - steamOffset/60)})`;
                    c.beginPath();
                    c.arc(x + 24, y - steamOffset, 8 - (steamOffset/10), 0, Math.PI * 2);
                    c.fill();
                }

                // Control panel blinking
                if (idx === TILES.CONTROL_PANEL) {
                    const screenBlink = (Math.sin(time * 5) + 1) / 2;
                    c.fillStyle = `rgba(59, 130, 246, ${0.3 * screenBlink})`;
                    c.fillRect(x + 8, y + 8, 32, 24);
                }
            }
        });
    });

    const renderList = [];
    renderList.push({ type: 'player', obj: player, y: player.position.y + player.height });
    currentInteractables.forEach(i => { renderList.push({ type: 'interactable', obj: i, y: i.position.y + offset.y + i.height }); });
    currentStructures.forEach(s => { renderList.push({ type: 'structure', obj: s, y: s.position.y + offset.y + s.height }); });
    renderList.sort((a,b) => a.y - b.y);

    renderList.forEach(item => {
        if(item.type === 'structure') {
            c.drawImage(item.obj.image, item.obj.position.x + offset.x, item.obj.position.y + offset.y);
        } else if (item.type === 'interactable') {
             if (item.obj.image) {
                const worldX = item.obj.position.x; const worldY = item.obj.position.y;
                item.obj.position.x += offset.x; item.obj.position.y += offset.y;
                item.obj.draw(c);
                item.obj.position.x = worldX; item.obj.position.y = worldY;
             } else {
                // Invisible interactables (like control panels drawn on floor) still need to check distance
                const worldX = item.obj.position.x; const worldY = item.obj.position.y;
                item.obj.position.x += offset.x; item.obj.position.y += offset.y;
                item.obj.draw(c); // This draws the interaction bubble
                item.obj.position.x = worldX; item.obj.position.y = worldY;
             }
        } else if (item.type === 'player') { player.draw(c); }
    });

    if (gameStarted && !isTransitioning && gameState === 'WORLD') {
        const cx = PLAYER_SCREEN_X + 24; const cy = PLAYER_SCREEN_Y + 24;
        let found = false;
        currentInteractables.forEach(i => {
            i.isPlayerInRange = false;
            const nx = i.position.x + offset.x + 24; const ny = i.position.y + offset.y + 24; 
            if (Math.hypot(cx - nx, cy - ny) < 60) { i.isPlayerInRange = true; found = true; }
        });
        UI.toggleInteractionPrompt(found);
    }
}

function update() {
    if (!gameStarted || isTransitioning || gameState !== 'WORLD') return;
    player.moving = false;
    
    const SPEED = 5;
    let moveX = 0, moveY = 0;
    if (keys.ArrowUp) { moveY = SPEED; player.direction = 1; }
    else if (keys.ArrowDown) { moveY = -SPEED; player.direction = 0; }
    else if (keys.ArrowLeft) { moveX = SPEED; player.direction = 2; }
    else if (keys.ArrowRight) { moveX = -SPEED; player.direction = 3; }

    if (moveX !== 0 || moveY !== 0) {
        const nextX = (PLAYER_SCREEN_X + 24) - (offset.x + moveX);
        const nextY = (PLAYER_SCREEN_Y + 40) - (offset.y + moveY);
        const pRect = { position: { x: nextX - 12, y: nextY - 12 }, width: 24, height: 24 };
        
        let collide = false;
        for (const b of currentBoundaries) {
             if (rectCollision({ r1: pRect, r2: { position: b.position, width: b.width, height: b.height } })) { collide = true; break; }
        }
        
        if (!collide) {
            offset.x += moveX; offset.y += moveY; player.moving = true;
            
            const checkX = Math.floor(nextX / TILE_SIZE);
            const checkY = Math.floor(nextY / TILE_SIZE);
            
            if (activeMapId === 'overworld') {
                for(const h of HOUSES) {
                    if (!h.targetMap) continue;
                    const doorX = (h.x * TILE_SIZE) + h.doorOffset.x;
                    const doorY = (h.y * TILE_SIZE) + h.doorOffset.y;
                    if (Math.hypot(nextX - doorX, nextY - doorY) < 40 && keys.ArrowUp) {
                        returnPosition = { x: h.x + Math.floor(h.doorOffset.x / TILE_SIZE), y: h.y + Math.floor(h.doorOffset.y / TILE_SIZE) + 1 };
                        switchScene(h.targetMap, h.spawn.x, h.spawn.y); return;
                    }
                }
            } else {
                if (currentVisualLayer[checkY]?.[checkX] === TILES.DOOR) {
                    switchScene('overworld', returnPosition.x, returnPosition.y);
                }
            }
        }
    }
}

function loop() { window.requestAnimationFrame(loop); update(); render(); }

startBtn.addEventListener('click', () => { 
    startScreen.classList.add('hidden'); 
    hud.classList.remove('hidden'); 
    gameStarted = true; 
});

window.addEventListener('keydown', e => {
    if (gameState === 'AI_DIALOG') { aiDialogManager.handleInputEvents(e.code); return; }
    if(keys[e.code] !== undefined) keys[e.code] = true;
    if(e.code === 'Space' || e.code === 'Enter') handleInteraction();
});
window.addEventListener('keyup', e => { if(keys[e.code] !== undefined) keys[e.code] = false; });

loadMap('overworld', 30, 52);
loop();
