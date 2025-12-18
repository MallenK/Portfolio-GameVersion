/**
 * Generates the world map with specific zones:
 * Top-Left: House (About)
 * Top-Right: Gym (Skills)
 * Center: City (Projects)
 * Bottom-Left: Office (Experience)
 * Bottom-Right: Park (Contact)
 */

const mapWidth = 40;
const mapHeight = 30;

const mapData = [];
const visualLayer = [];

// Helper indices for our runtime tileset
const T_GRASS = 0;
const T_WALL = 1;
const T_DOOR = 2;
const T_FLOWER = 3;
const T_FLOOR_WOOD = 4; // New simulated
const T_FLOOR_STONE = 5; // New simulated

// Initialize empty map
for (let y = 0; y < mapHeight; y++) {
    mapData[y] = [];
    visualLayer[y] = [];
    for (let x = 0; x < mapWidth; x++) {
        mapData[y][x] = 0; // Walkable
        visualLayer[y][x] = T_GRASS; // Grass
    }
}

// Helper to draw rect on map
const drawBuilding = (x, y, w, h, doorX, doorY) => {
    for (let iy = y; iy < y + h; iy++) {
        for (let ix = x; ix < x + w; ix++) {
            // Walls around perimeter
            if (ix === x || ix === x + w - 1 || iy === y || iy === y + h - 1) {
                mapData[iy][ix] = 1; // Collision
                visualLayer[iy][ix] = T_WALL;
            } else {
                // Floor inside
                visualLayer[iy][ix] = T_FLOOR_WOOD;
            }
        }
    }
    // Door
    if (doorX !== undefined) {
        mapData[doorY][doorX] = 0; // Walkable
        visualLayer[doorY][doorX] = T_DOOR;
    }
};

const drawArea = (x, y, w, h, type) => {
    for (let iy = y; iy < y + h; iy++) {
        for (let ix = x; ix < x + w; ix++) {
            if (type === 'city') visualLayer[iy][ix] = T_FLOOR_STONE;
        }
    }
};

// 1. Map Borders
for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
        if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
            mapData[y][x] = 1;
            visualLayer[y][x] = T_WALL;
        }
    }
}

// 2. House (About Me) - Top Left
drawBuilding(2, 2, 9, 7, 6, 8); // Door at 6,8 (Wall is at y=8)
// Fix door logic: The function draws wall at y+h-1. So door should be at y+h-1.
mapData[8][6] = 0; visualLayer[8][6] = T_DOOR; 

// 3. Gym (Skills) - Top Right
drawBuilding(28, 2, 10, 8, 33, 9); // Door at 33,9
mapData[9][33] = 0; visualLayer[9][33] = T_DOOR;

// 4. City Plaza (Projects) - Center
drawArea(15, 10, 10, 10, 'city');
// Fountain/Statue in center
mapData[15][19] = 1; visualLayer[15][19] = T_WALL;
mapData[15][20] = 1; visualLayer[15][20] = T_WALL;

// 5. Office (Experience) - Bottom Left
drawBuilding(2, 20, 9, 8, 6, 27);
mapData[27][6] = 0; visualLayer[27][6] = T_DOOR;

// 6. Park Gate (Contact) - Bottom Right
// Fences
for(let x=28; x<38; x++) {
    mapData[20][x] = 1; visualLayer[20][x] = T_WALL;
    mapData[28][x] = 1; visualLayer[28][x] = T_WALL;
}
for(let y=20; y<29; y++) {
    mapData[y][28] = 1; visualLayer[y][28] = T_WALL;
    mapData[y][38] = 1; visualLayer[y][38] = T_WALL;
}
// Gate
mapData[28][33] = 0; visualLayer[28][33] = T_DOOR;

// Flowers scattered
for(let i=0; i<30; i++) {
    const rx = Math.floor(Math.random() * (mapWidth - 2)) + 1;
    const ry = Math.floor(Math.random() * (mapHeight - 2)) + 1;
    if (mapData[ry][rx] === 0 && visualLayer[ry][rx] === T_GRASS) {
        visualLayer[ry][rx] = T_FLOWER;
    }
}

export { mapData, visualLayer };