/**
 * Map Data Registry
 */

export const TILES = {
    GRASS: 0,
    WALL: 1,      
    DOOR: 2,
    FLOWER: 3,
    FLOOR_WOOD: 4,
    FLOOR_STONE: 5,
    VOID: 6,
    RUG: 7,
    TABLE: 8,     
    SHELF: 9,     
    TECH: 10,     
    PLANT: 11,    
    TREE: 12,     
    PATH: 13,     
    WATER: 14,    
    FENCE: 15,
    GYM_MAT: 16,
    DESK: 17,
    COUNTER: 18,
    BED: 19,
    BOOKSHELF: 20,
    MONITOR: 21,
    BUSH: 22,
    ROCK: 23,
    FOUNTAIN: 24,
    TREE_PINE: 25,
    LAMP_ON: 26,
    BENCH: 27,
    BARREL: 28,
    CRATE: 29,
    PATH_ALT: 30,
    LILYPAD: 31,
    // Interiors
    SOFA: 32,
    CHAIR: 33,
    WEIGHTS: 34,
    PUNCHING_BAG: 35,
    BOOKS: 36,
    STAIRS: 37
};

export const SOLID_TILES = [
    TILES.WALL, TILES.VOID, TILES.TABLE, TILES.SHELF, TILES.TECH, 
    TILES.PLANT, TILES.TREE, TILES.WATER, TILES.FENCE, TILES.DESK, 
    TILES.COUNTER, TILES.BED, TILES.BOOKSHELF, TILES.MONITOR,
    TILES.BUSH, TILES.ROCK, TILES.FOUNTAIN,
    TILES.TREE_PINE, TILES.LAMP_ON, TILES.BENCH, TILES.BARREL, TILES.CRATE,
    TILES.SOFA, TILES.CHAIR, TILES.WEIGHTS, TILES.PUNCHING_BAG, TILES.BOOKS
];

const createGrid = (w, h, fill = 0) => Array(h).fill().map(() => Array(w).fill(fill));

const drawRect = (grid, visual, x, y, w, h, borderTile, floorTile) => {
    for (let iy = y; iy < y + h; iy++) {
        for (let ix = x; ix < x + w; ix++) {
            if (iy >= 0 && iy < grid.length && ix >= 0 && ix < grid[0].length) {
                if (ix === x || ix === x + w - 1 || iy === y || iy === y + h - 1) {
                    grid[iy][ix] = 1; 
                    visual[iy][ix] = borderTile;
                } else {
                    grid[iy][ix] = 0; 
                    visual[iy][ix] = floorTile;
                }
            }
        }
    }
};

// --- 3x3 BLOCK MATRIX OVERWORLD (60x60) ---
const OW_WIDTH = 60;
const OW_HEIGHT = 60;
const owGrid = createGrid(OW_WIDTH, OW_HEIGHT, 1);
const owVisual = createGrid(OW_WIDTH, OW_HEIGHT, TILES.TREE_PINE); // Forest Background

// 1. CARVE BLOCKS (A1-C3)
// Each block is 20x20
for(let by=0; by<3; by++) {
    for(let bx=0; bx<3; bx++) {
        const startX = bx * 20 + 2;
        const startY = by * 20 + 2;
        const size = 16;
        for(let y=startY; y<startY+size; y++) {
            for(let x=startX; x<startX+size; x++) {
                owGrid[y][x] = 0;
                owVisual[y][x] = TILES.GRASS;
            }
        }
    }
}

// 2. ROAD SYSTEM (1-2 Tiles wide)
const drawRoad = (x1, y1, x2, y2, type = TILES.PATH) => {
    let x = x1, y = y1;
    const dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;
    while (true) {
        // Road width 2
        for(let ox=0; ox<=1; ox++) for(let oy=0; oy<=1; oy++) {
            const tx = x + ox;
            const ty = y + oy;
            if (ty >= 0 && ty < OW_HEIGHT && tx >= 0 && tx < OW_WIDTH) {
                owGrid[ty][tx] = 0;
                owVisual[ty][tx] = type;
            }
        }
        if (x === x2 && y === y2) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x += sx; }
        if (e2 <= dx) { err += dx; y += sy; }
    }
};

// Vertical Connections
drawRoad(10, 5, 10, 55); // Col 1
drawRoad(30, 5, 30, 55); // Col 2
drawRoad(50, 5, 50, 55); // Col 3

// Horizontal Connections
drawRoad(10, 30, 50, 30); // Row B (Plaza Hub)
drawRoad(10, 10, 30, 10); // A1 ↔ A2
drawRoad(30, 50, 50, 50); // C2 ↔ C3

// 3. BLOCK DECORATION
// B2: Plaza Principal (Center Hub)
for(let y=26; y<34; y++) for(let x=26; x<34; x++) { owVisual[y][x] = TILES.PATH; }
owGrid[30][30] = 1; owVisual[30][30] = TILES.FOUNTAIN;
owGrid[28][28] = 1; owVisual[28][28] = TILES.BENCH;
owGrid[32][28] = 1; owVisual[32][28] = TILES.BENCH;
owGrid[28][32] = 1; owVisual[28][32] = TILES.BENCH;
owGrid[32][32] = 1; owVisual[32][32] = TILES.BENCH;
// Farolas
owGrid[27][27] = 1; owVisual[27][27] = TILES.LAMP_ON;
owGrid[33][33] = 1; owVisual[33][33] = TILES.LAMP_ON;

// A1: Park 1
for(let i=0; i<15; i++) {
    const rx = Math.floor(Math.random()*14)+3;
    const ry = Math.floor(Math.random()*14)+3;
    owVisual[ry][rx] = TILES.FLOWER;
}

// A3: Soccer Field (Decorative)
for(let y=5; y<15; y++) {
    for(let x=43; x<57; x++) {
        if(y===5 || y===14 || x===43 || x===57 || x===50) {
            owVisual[y][x] = TILES.PATH_ALT; // Field lines
        }
    }
}

// C1: Park 2 (Industrial Green)
for(let y=42; y<48; y++) {
    for(let x=12; x<18; x++) {
        if(Math.random()>0.7) { owGrid[y][x]=1; owVisual[y][x]=TILES.BUSH; }
    }
}

// 4. INTERIORS (Compact)
const createRoom = (w, h, floor) => {
    const grid = createGrid(w, h, 1);
    const visual = createGrid(w, h, TILES.VOID);
    drawRect(grid, visual, 1, 1, w-2, h-2, TILES.WALL, floor);
    grid[h-2][Math.floor(w/2)] = 2; 
    visual[h-2][Math.floor(w/2)] = TILES.DOOR;
    return { grid, visual };
};
const place = (room, x, y, tile, solid=false) => {
    if(room.visual[y]) {
        room.visual[y][x] = tile;
        if(solid) room.grid[y][x] = 1;
    }
};

const rAbout = createRoom(10, 10, TILES.FLOOR_WOOD);
place(rAbout, 2, 2, TILES.BED, true); place(rAbout, 7, 3, TILES.SOFA, true);
place(rAbout, 7, 6, TILES.LAMP_ON, true); place(rAbout, 2, 6, TILES.BOOKSHELF, true);

const rSkills = createRoom(12, 10, TILES.FLOOR_STONE);
place(rSkills, 2, 2, TILES.GYM_MAT); place(rSkills, 3, 2, TILES.GYM_MAT);
place(rSkills, 9, 2, TILES.WEIGHTS, true); place(rSkills, 9, 5, TILES.PUNCHING_BAG, true);

const rProjects = createRoom(12, 12, TILES.FLOOR_STONE);
place(rProjects, 2, 2, TILES.TECH, true); place(rProjects, 9, 2, TILES.TECH, true);
place(rProjects, 5, 5, TILES.TABLE, true); place(rProjects, 6, 5, TILES.MONITOR, true);

const rExp1 = createRoom(12, 12, TILES.FLOOR_WOOD);
place(rExp1, 2, 2, TILES.COUNTER, true); place(rExp1, 9, 2, TILES.STAIRS); place(rExp1, 2, 6, TILES.SOFA, true);
const rExp2 = createRoom(10, 10, TILES.FLOOR_WOOD);
rExp2.grid[8][5] = 1; rExp2.visual[8][5] = TILES.WALL; 
place(rExp2, 7, 2, TILES.STAIRS); place(rExp2, 2, 2, TILES.BOOKSHELF, true);

const rContact = createRoom(10, 8, TILES.FLOOR_STONE);
place(rContact, 2, 2, TILES.COUNTER, true);

export const MAPS = {
    'overworld': { id: 'overworld', grid: owGrid, visual: owVisual },
    'about_interior': { id: 'about_interior', grid: rAbout.grid, visual: rAbout.visual },
    'skills_interior': { id: 'skills_interior', grid: rSkills.grid, visual: rSkills.visual },
    'projects_interior': { id: 'projects_interior', grid: rProjects.grid, visual: rProjects.visual },
    'experience_interior': { id: 'experience_interior', grid: rExp1.grid, visual: rExp1.visual },
    'experience_interior_f2': { id: 'experience_interior_f2', grid: rExp2.grid, visual: rExp2.visual },
    'contact_interior': { id: 'contact_interior', grid: rContact.grid, visual: rContact.visual }
};
