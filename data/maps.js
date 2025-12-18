
/**
 * Map Data Registry - Portfolio Game Version
 * All world grids and visual layers.
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
    SOFA: 32,
    CHAIR: 33,
    WEIGHTS: 34,
    PUNCHING_BAG: 35,
    BOOKS: 36,
    STAIRS: 37,
    METAL: 38,
    STRIPE: 39,
    MACHINE: 40,
    CONVEYOR: 41,
    TREE_TRUNK: 42,
    PIPE_V: 43,
    PIPE_H: 44,
    WARNING_SIGN: 45,
    TOOLS: 46,
    CONTROL_PANEL: 47
};

export const SOLID_TILES = [
    TILES.WALL, TILES.VOID, TILES.TABLE, TILES.SHELF, TILES.TECH, 
    TILES.PLANT, TILES.TREE, TILES.WATER, TILES.FENCE, TILES.DESK, 
    TILES.COUNTER, TILES.BED, TILES.BOOKSHELF, TILES.MONITOR,
    TILES.BUSH, TILES.ROCK, TILES.FOUNTAIN,
    TILES.TREE_PINE, TILES.LAMP_ON, TILES.BENCH, TILES.BARREL, TILES.CRATE,
    TILES.SOFA, TILES.CHAIR, TILES.WEIGHTS, TILES.PUNCHING_BAG, TILES.BOOKS,
    TILES.MACHINE, TILES.METAL, TILES.TREE_TRUNK, TILES.CONTROL_PANEL
];

const createGrid = (w, h, fill = 0) => Array(h).fill().map(() => Array(w).fill(fill));

// --- 1. OVERWORLD (60x60) ---
const owGrid = createGrid(60, 60, 0); 
const owVisual = createGrid(60, 60, TILES.GRASS); 

const fillArea = (grid, visual, x, y, w, h, tile, isSolid = false) => {
    for (let iy = y; iy < y + h; iy++) {
        for (let ix = x; ix < x + w; ix++) {
            if (iy >= 0 && iy < visual.length && ix >= 0 && ix < visual[0].length) {
                visual[iy][ix] = tile;
                grid[iy][ix] = isSolid ? 1 : 0;
            }
        }
    }
};

const drawPath = (visual, x1, y1, x2, y2, tile) => {
    for (let iy = Math.min(y1, y2); iy <= Math.max(y1, y2); iy++) {
        for (let ix = Math.min(x1, x2); ix <= Math.max(x1, x2); ix++) {
            if (visual[iy] && visual[iy][ix] !== undefined) {
                visual[iy][ix] = tile;
            }
        }
    }
};

// Map Borders
for(let i=0; i<60; i++) {
    owGrid[0][i] = 1; owVisual[0][i] = TILES.TREE_PINE;
    owGrid[59][i] = 1; owVisual[59][i] = TILES.TREE_PINE;
    owGrid[i][0] = 1; owVisual[i][0] = TILES.TREE_PINE;
    owGrid[i][59] = 1; owVisual[i][59] = TILES.TREE_PINE;
}

// BLOQUE C1 (x 0-19, y 40-59)
fillArea(owGrid, owVisual, 0, 40, 20, 20, TILES.GRASS, false);

// 1) FÁBRICA EXTERIOR
fillArea(owGrid, owVisual, 1, 37, 5, 15, TILES.METAL, true);
owVisual[51][3] = TILES.DOOR;
owGrid[51][3] = 0;

// 2) CAMINOS
drawPath(owVisual, 8, 42, 9, 57, TILES.PATH);
drawPath(owVisual, 10, 42, 19, 42, TILES.PATH);
drawPath(owVisual, 10, 57, 19, 57, TILES.PATH);

// 4) ÁRBOL GIGANTE (x: 12-16, y: 43-47)
fillArea(owGrid, owVisual, 12, 43, 5, 5, TILES.TREE, true);
owVisual[47][14] = TILES.TREE_TRUNK;
owGrid[47][14] = 1;

// 5) DECORACIÓN EXTERIOR
const setBench = (x, y) => { owVisual[y][x] = TILES.BENCH; owGrid[y][x] = 1; };
setBench(12, 56); setBench(13, 56);
setBench(15, 49); setBench(16, 49);

// ---------------------------------------------------------
// INTERIOR FÁBRICA "experience_interior" (30x30)
// ---------------------------------------------------------
const INT_W = 30;
const INT_H = 30;
const intGrid = createGrid(INT_W, INT_H, 1);
const intVisual = createGrid(INT_W, INT_H, TILES.VOID);

// Foundation Floor
fillArea(intGrid, intVisual, 1, 1, 28, 28, TILES.METAL, false);

// Perimeter Walls
for(let i=0; i<30; i++) {
    intVisual[0][i] = TILES.WALL; intGrid[0][i] = 1;
    intVisual[29][i] = TILES.WALL; intGrid[29][i] = 1;
    intVisual[i][0] = TILES.WALL; intGrid[i][0] = 1;
    intVisual[i][29] = TILES.WALL; intGrid[i][29] = 1;
    intVisual[1][i] = TILES.WALL;
}

// ZONES:
// 1. Generador Alpha (8x6) - Top Left
fillArea(intGrid, intVisual, 2, 3, 8, 6, TILES.MACHINE, true);
// 2. Procesador Beta (6x8) - Top Right
fillArea(intGrid, intVisual, 22, 3, 6, 8, TILES.MACHINE, true);
// 3. Núcleo de Datos (10x6) - Center
fillArea(intGrid, intVisual, 10, 12, 10, 6, TILES.MACHINE, true);

// Pipes connecting zones
for(let ix=10; ix<22; ix++) { intVisual[5][ix] = TILES.PIPE_H; }
for(let iy=9; iy<12; iy++) { intVisual[iy][5] = TILES.PIPE_V; }
for(let iy=11; iy<12; iy++) { intVisual[iy][25] = TILES.PIPE_V; }

// Conveyor belts on the sides
fillArea(intGrid, intVisual, 2, 10, 1, 15, TILES.CONVEYOR, true);
fillArea(intGrid, intVisual, 27, 10, 1, 15, TILES.CONVEYOR, true);

// Consoles around the Data Core
fillArea(intGrid, intVisual, 11, 11, 8, 1, TILES.TECH, true);
fillArea(intGrid, intVisual, 11, 18, 8, 1, TILES.TECH, true);

// Add Control Panels (Interactive)
intVisual[15][9] = TILES.CONTROL_PANEL; intGrid[15][9] = 1;
intVisual[15][20] = TILES.CONTROL_PANEL; intGrid[15][20] = 1;

// Safety pasillos (Stripes)
for(let iy=2; iy<28; iy++) { intVisual[iy][15] = TILES.STRIPE; }
for(let ix=2; ix<28; ix++) { intVisual[22][ix] = TILES.STRIPE; }

// Decorations: Tools and Signs
intVisual[5][2] = TILES.WARNING_SIGN;
intVisual[10][20] = TILES.TOOLS;
intVisual[25][5] = TILES.TOOLS;
intVisual[25][25] = TILES.WARNING_SIGN;

// Logistics Zone - Bottom Right
fillArea(intGrid, intVisual, 21, 23, 7, 5, TILES.METAL, false);
for(let k=0; k<5; k++) {
    const rx = 22 + k;
    const ry = 24 + (k % 2);
    const t = k % 2 === 0 ? TILES.CRATE : TILES.BARREL;
    intVisual[ry][rx] = t;
    intGrid[ry][rx] = 1;
}

// Exit Door at the bottom
intVisual[29][15] = TILES.DOOR;
intGrid[29][15] = 0;
intVisual[28][15] = TILES.DOOR;
intGrid[28][15] = 0;

const createRoom = (w, h, floor) => {
    const grid = createGrid(w, h, 1);
    const visual = createGrid(w, h, TILES.VOID);
    for(let iy=1; iy<h-1; iy++) {
        for(let ix=1; ix<w-1; ix++) {
            grid[iy][ix] = 0;
            visual[iy][ix] = floor;
            if (iy === 1) visual[iy][ix] = TILES.WALL;
        }
    }
    grid[h-1][Math.floor(w/2)] = 0;
    visual[h-1][Math.floor(w/2)] = TILES.DOOR;
    return { grid, visual };
};

export const MAPS = {
    'overworld': { id: 'overworld', grid: owGrid, visual: owVisual },
    'about_interior': createRoom(10, 10, TILES.FLOOR_WOOD),
    'skills_interior': createRoom(12, 10, TILES.FLOOR_STONE),
    'contact_interior': createRoom(10, 8, TILES.FLOOR_STONE),
    'experience_interior': { id: 'experience_interior', grid: intGrid, visual: intVisual }
};
