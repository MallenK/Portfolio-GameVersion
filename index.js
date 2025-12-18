import { Sprite, Boundary, Player, Interactable, Structure } from './classes.js';
import { MAPS, TILES, SOLID_TILES } from './data/maps.js';
import { NPCS } from './data/npcs.js';
import { HOUSES, SIGNS } from './data/world_config.js';
import { ASSETS } from './data/assets.js';
import { UI } from './ui/panels.js';
import { AIDialogManager } from './ui/aiInterface.js';

// --- Configuration ---
const canvas = document.querySelector('canvas');
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
    cvs.height = 48;
    const ctx = cvs.getContext('2d');

    const fillTexture = (x, color, type = 'solid') => {
        ctx.fillStyle = color;
        ctx.fillRect(x * 48, 0, 48, 48);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        if (type === 'grass') {
            for(let i=0; i<10; i++) ctx.fillRect(x*48 + Math.random()*40, Math.random()*40, 2, 6);
        } else if (type === 'cobble') {
            for(let i=0; i<48; i+=12) {
                ctx.beginPath(); ctx.arc(x*48 + i + 6, 12, 5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(x*48 + i + 6, 36, 5, 0, Math.PI*2); ctx.fill();
            }
        } else if (type === 'brick') {
            for(let i=0; i<48; i+=12) {
                ctx.fillRect(x*48, i, 48, 1);
                ctx.fillRect(x*48 + 12, i, 1, 12);
            }
        }
    };

    fillTexture(0, '#65a30d', 'grass'); 
    fillTexture(1, '#9f1239', 'brick'); 
    fillTexture(2, '#171717');
    fillTexture(3, '#65a30d', 'grass');
    ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(144+24, 24, 5, 0, Math.PI*2); ctx.fill();
    fillTexture(4, '#d4a373'); 
    fillTexture(5, '#d6d3d1');
    fillTexture(6, '#0c0a09');
    fillTexture(7, '#9f1239'); 
    ctx.fillStyle = '#78350f'; ctx.fillRect(388,10,40,28);
    ctx.fillStyle = '#451a03'; ctx.fillRect(436, 4, 40, 44);
    ctx.fillStyle = '#334155'; ctx.fillRect(480,0,48,48);
    ctx.fillStyle = '#854d0e'; ctx.beginPath(); ctx.arc(528+24, 38, 8, 0, Math.PI*2); ctx.fill(); 
    fillTexture(12, '#3f6212', 'grass'); 
    fillTexture(13, '#d6cba8', 'cobble'); 
    fillTexture(14, '#38bdf8');
    fillTexture(15, '#65a30d', 'grass'); 
    ctx.fillStyle = '#171717'; ctx.fillRect(720+5, 10, 4, 30);
    fillTexture(16, '#3b82f6');
    ctx.fillStyle = '#525252'; ctx.fillRect(816+4, 12, 40, 24);
    ctx.fillStyle = '#b45309'; ctx.fillRect(864, 12, 48, 24);
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(912+4, 8, 40, 36); 
    ctx.fillStyle = '#451a03'; ctx.fillRect(960+4, 0, 40, 48);
    ctx.fillStyle = '#334155'; ctx.fillRect(1008+4, 12, 40, 24);
    fillTexture(22, '#166534', 'grass');
    fillTexture(23, '#78716c');
    fillTexture(24, '#d6cba8');
    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(1152+24, 24, 16, 0, Math.PI*2); ctx.fill();
    fillTexture(25, '#3f6212', 'grass');
    fillTexture(26, '#d6cba8', 'cobble'); 
    ctx.fillStyle = '#171717'; ctx.fillRect(1248+22, 10, 4, 38); 
    ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(1248+24, 10, 5, 0, Math.PI*2); ctx.fill();
    fillTexture(27, '#65a30d', 'grass'); 
    ctx.fillStyle = '#451a03'; ctx.fillRect(1296+8, 20, 32, 10);
    fillTexture(28, '#78350f');
    fillTexture(29, '#92400e');
    fillTexture(30, '#b91c1c', 'brick');
    fillTexture(31, '#38bdf8');
    fillTexture(32, '#ef4444'); 

    const img = new Image();
    img.src = cvs.toDataURL();
    return img;
};

const createCharSprite = (color) => {
    const cvs = document.createElement('canvas');
    cvs.width = 192; cvs.height = 48;
    const ctx = cvs.getContext('2d');
    for(let i=0; i<4; i++) {
        const x = i * 48;
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.ellipse(x+24, 44, 10, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.fillRect(x+16, 40, 6, 8); ctx.fillRect(x+26, 40, 6, 8);
        ctx.fillStyle = color; ctx.fillRect(x+14, 18, 20, 22);
        ctx.fillStyle = '#ffedd5'; ctx.fillRect(x+14, 6, 20, 14); 
        ctx.fillStyle = '#000'; ctx.fillRect(x+18, 10, 4, 4); ctx.fillRect(x+26, 10, 4, 4);
    }
    const img = new Image();
    img.src = cvs.toDataURL();
    return img;
};

const tilesetImage = createTileset();
const playerSprite = createCharSprite('#ef4444');
const npcSprite = createCharSprite('#0ea5e9'); 

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
    const target = currentInteractables.find(i => i.isPlayerInRange);
    if (target && target.panelData) {
        gameState = 'PANEL';
        UI.showPanel(target.panelData);
    } else {
        gameState = 'WORLD';
    }
});

const PLAYER_SCREEN_X = canvas.width/2 - 24;
const PLAYER_SCREEN_Y = canvas.height/2 - 24;

const player = new Player({
    position: { x: PLAYER_SCREEN_X, y: PLAYER_SCREEN_Y }, 
    image: playerSprite,
    frames: { max: 4 },
    sprites: { up: playerSprite, down: playerSprite, left: playerSprite, right: playerSprite }
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
            const visualSymbol = mapConfig.visual[i][j];
            if (SOLID_TILES.includes(symbol) || SOLID_TILES.includes(visualSymbol)) { 
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
                collisionHeight: TILE_SIZE,
                offsetY: (h.height - 1) * TILE_SIZE
            });
            currentStructures.push(house);
            currentBoundaries.push(new Boundary({
                position: { x: h.x * TILE_SIZE, y: h.y * TILE_SIZE + (h.height-1)*TILE_SIZE }
            }));
            const b = currentBoundaries[currentBoundaries.length-1];
            b.width = h.width * TILE_SIZE; b.height = TILE_SIZE;
        });

        SIGNS.forEach(s => {
            currentInteractables.push(new Interactable({
                position: { x: s.x * TILE_SIZE, y: s.y * TILE_SIZE },
                image: ASSETS.sign,
                triggerType: 'sign',
                dialogue: s.text
            }));
            currentBoundaries.push(new Boundary({ position: { x: s.x * TILE_SIZE, y: s.y * TILE_SIZE } }));
        });
    }

    const mapNpcs = NPCS.filter(n => n.mapId === mapId);
    mapNpcs.forEach(n => {
        const npc = new Interactable({
            position: { x: n.x * TILE_SIZE, y: n.y * TILE_SIZE },
            image: npcSprite,
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
        }, 100);
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
            if (target.aiConfig && activeMapId === 'overworld') {
                gameState = 'AI_DIALOG'; UI.toggleInteractionPrompt(false); aiDialogManager.start(target);
            } else {
                gameState = 'DIALOG'; dialogController = UI.showDialog(target.dialogue); UI.toggleInteractionPrompt(false);
            }
            return;
        }
    }
}

function render() {
    c.fillStyle = '#050505';
    c.fillRect(0, 0, canvas.width, canvas.height);
    const cols = 40; 
    const time = performance.now();
    currentVisualLayer.forEach((row, i) => {
        row.forEach((idx, j) => {
            const x = j * TILE_SIZE + offset.x;
            const y = i * TILE_SIZE + offset.y;
            if (x > -TILE_SIZE && x < canvas.width && y > -TILE_SIZE && y < canvas.height) {
                c.drawImage(tilesetImage, (idx % cols) * TILE_SIZE, Math.floor(idx / cols) * TILE_SIZE, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
                const drawDecor = (img) => { c.drawImage(img, x, y); };
                if (idx === TILES.SOFA) drawDecor(ASSETS.sofa);
                if (idx === TILES.CHAIR) drawDecor(ASSETS.chair);
                if (idx === TILES.WEIGHTS) drawDecor(ASSETS.weights);
                if (idx === TILES.PUNCHING_BAG) drawDecor(ASSETS.punching_bag);
                if (idx === TILES.BOOKS) drawDecor(ASSETS.books);
                if (idx === TILES.STAIRS) drawDecor(ASSETS.stairs);
                if (idx === TILES.WATER || idx === TILES.FOUNTAIN) {
                    c.fillStyle = `rgba(255,255,255,${Math.sin(time / 800) * 0.1})`;
                    c.fillRect(x,y,TILE_SIZE,TILE_SIZE);
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
             const worldX = item.obj.position.x; const worldY = item.obj.position.y;
             item.obj.position.x += offset.x; item.obj.position.y += offset.y;
             item.obj.draw(c);
             item.obj.position.x = worldX; item.obj.position.y = worldY;
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
    } else { UI.toggleInteractionPrompt(false); }
}

function update() {
    if (!gameStarted || isTransitioning || gameState !== 'WORLD') return;
    let moving = true;
    player.moving = false;
    if (!keys.ArrowUp && !keys.ArrowDown && !keys.ArrowLeft && !keys.ArrowRight) moving = false;
    if (moving) {
        let dx = 0, dy = 0; const SPEED = 4;
        if (keys.ArrowUp) dy = SPEED; else if (keys.ArrowDown) dy = -SPEED;
        else if (keys.ArrowLeft) dx = SPEED; else if (keys.ArrowRight) dx = -SPEED;
        const nextX = (PLAYER_SCREEN_X + 24) - offset.x - dx;
        const nextY = (PLAYER_SCREEN_Y + 48) - offset.y - dy;
        const pRect = { position: { x: nextX - 8, y: nextY - 8 }, width: 16, height: 16 };
        let collide = false;
        for (const b of currentBoundaries) {
             if (rectCollision({ r1: pRect, r2: { position: b.position, width: b.width, height: b.height } })) { collide = true; break; }
        }
        if (!collide) {
            offset.x += dx; offset.y += dy; player.moving = true;
            const checkX = Math.floor(nextX / TILE_SIZE); const checkY = Math.floor(nextY / TILE_SIZE);
            if (activeMapId === 'overworld') {
                for(const h of HOUSES) {
                    if (h.type === 'filler') continue;
                    const doorX = (h.x * TILE_SIZE) + h.doorOffset.x; const doorY = (h.y * TILE_SIZE) + h.doorOffset.y;
                    if (Math.hypot(nextX - doorX, nextY - doorY) < 60 && keys.ArrowUp) { 
                        returnPosition = { x: h.x + Math.floor(h.doorOffset.x / TILE_SIZE), y: h.y + Math.floor(h.doorOffset.y / TILE_SIZE) + 1 };
                        switchScene(h.targetMap, h.spawn.x, h.spawn.y); return;
                    }
                }
            } else {
                 if (MAPS[activeMapId].grid[checkY]?.[checkX] === TILES.DOOR) { switchScene('overworld', returnPosition.x, returnPosition.y); return; }
            }
        }
    }
}

function loop() { window.requestAnimationFrame(loop); update(); render(); }
startBtn.addEventListener('click', () => { startScreen.classList.add('hidden'); hud.classList.remove('hidden'); gameStarted = true; });
window.addEventListener('keydown', e => {
    if (gameState === 'AI_DIALOG') { aiDialogManager.handleInputEvents(e.code); return; }
    if(keys[e.code] !== undefined) keys[e.code] = true;
    if(e.code === 'Space' || e.code === 'Enter') handleInteraction();
});
window.addEventListener('keyup', e => { if(keys[e.code] !== undefined) keys[e.code] = false; });

// SPAWN AT BLOCK C2 (MAIN ROAD)
loadMap('overworld', 30, 52);
loop();
