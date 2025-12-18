/**
 * Procedural Asset Generator
 * Creates complex sprites (Houses, Signs) using Canvas API to avoid external image dependencies.
 */

export const ASSETS = {};

const createCanvas = (w, h) => {
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    return { cvs, ctx: cvs.getContext('2d') };
};

// --- COLÒNIA GÜELL STYLE HELPERS ---

const drawBrickTexture = (ctx, x, y, w, h, color = '#a05440') => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    // Organic Brick pattern
    for(let iy = y; iy < y+h; iy+=8) {
        const offset = (iy/8) % 2 === 0 ? 0 : 10;
        ctx.fillRect(x, iy, w, 1); // Horizontal
        for(let ix = x + offset; ix < x+w; ix+=20) {
            // Randomize vertical mortar slightly for "handmade" look
            if(Math.random() > 0.1) ctx.fillRect(ix, iy, 1, 8); 
        }
    }
};

const drawArchedWindow = (ctx, x, y, w, h) => {
    ctx.fillStyle = '#1e293b'; 
    ctx.beginPath();
    ctx.arc(x + w/2, y + w/2, w/2, Math.PI, 0);
    ctx.rect(x, y + w/2, w, h - w/2);
    ctx.fill();
    
    // Stone Frame
    ctx.strokeStyle = '#d6cba8'; 
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glass reflection
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x+4, y+w/2+4, w-8, 4);
};

const drawSlateRoof = (ctx, x, y, w, h) => {
    ctx.fillStyle = '#334155'; // Dark Slate
    ctx.beginPath();
    ctx.moveTo(x - 5, y + h);
    ctx.lineTo(x + w/2, y);
    ctx.lineTo(x + w + 5, y + h);
    ctx.fill();
    
    // Tiles texture
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<h; i+=6) {
        ctx.beginPath();
        ctx.moveTo(x - 5 + (i/h)*5, y + h - i);
        ctx.lineTo(x + w + 5 - (i/h)*5, y + h - i);
        ctx.stroke();
    }
};

const drawDoorMat = (ctx, x, y) => {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x, y, 32, 6);
};

// --- FILLER HOUSE (For Density) ---
// Simple brick row house, non-interactive visual
const generateFillerHouse = () => {
    const { cvs, ctx } = createCanvas(144, 144); // 3x3 tiles
    
    // Body
    drawBrickTexture(ctx, 10, 50, 124, 90, '#7f1d1d'); // Dark Red Brick
    
    // Roof
    drawSlateRoof(ctx, 0, 10, 144, 40);

    // Door
    ctx.fillStyle = '#3f2c20';
    ctx.fillRect(56, 90, 32, 50);
    drawDoorMat(ctx, 56, 140);

    // Windows
    drawArchedWindow(ctx, 20, 70, 24, 40);
    drawArchedWindow(ctx, 100, 70, 24, 40);

    return cvs;
};

// 1. Cottage (About) - North East
const generateCottage = () => {
    const { cvs, ctx } = createCanvas(240, 240); 
    drawBrickTexture(ctx, 40, 100, 160, 130, '#c2410c'); // Orange Brick
    ctx.fillStyle = '#78716c'; ctx.fillRect(38, 220, 164, 10); // Base
    
    // Door
    ctx.fillStyle = '#451a03';
    ctx.beginPath(); ctx.arc(120, 170, 24, Math.PI, 0); ctx.rect(96, 170, 48, 60); ctx.fill();
    drawDoorMat(ctx, 104, 230);

    drawArchedWindow(ctx, 50, 140, 30, 50);
    drawArchedWindow(ctx, 160, 140, 30, 50);
    drawSlateRoof(ctx, 30, 50, 180, 50);
    return cvs;
};

// 2. Gym (Skills) - East Street
const generateGym = () => {
    const { cvs, ctx } = createCanvas(288, 240); 
    drawBrickTexture(ctx, 20, 80, 248, 150, '#9a3412'); 
    
    // Pilasters
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(20, 80, 10, 150); ctx.fillRect(258, 80, 10, 150);

    drawArchedWindow(ctx, 40, 110, 50, 80);
    drawArchedWindow(ctx, 200, 110, 50, 80);

    // Entrance
    ctx.fillStyle = '#451a03'; ctx.fillRect(125, 180, 40, 50);
    drawDoorMat(ctx, 129, 230);

    // Flat Cornice Roof
    ctx.fillStyle = '#78716c'; ctx.fillRect(15, 70, 258, 10);
    ctx.fillStyle = '#57534e'; ctx.beginPath(); ctx.moveTo(15, 70); ctx.lineTo(30, 40); ctx.lineTo(258, 40); ctx.lineTo(273, 70); ctx.fill();
    return cvs;
};

// 3. Lab (Projects) - North West
const generateLab = () => {
    const { cvs, ctx } = createCanvas(288, 200); 
    drawBrickTexture(ctx, 20, 60, 248, 130, '#b91c1c'); 
    
    // Garage Door
    ctx.fillStyle = '#57534e'; ctx.fillRect(110, 120, 68, 70);
    ctx.strokeStyle = '#292524'; ctx.lineWidth = 2; ctx.strokeRect(110, 120, 68, 70);

    drawArchedWindow(ctx, 40, 100, 40, 50);
    drawArchedWindow(ctx, 210, 100, 40, 50);

    // Sawtooth Roof
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(10, 60); ctx.lineTo(60, 20); ctx.lineTo(60, 60);
    ctx.lineTo(110, 20); ctx.lineTo(110, 60);
    ctx.lineTo(160, 20); ctx.lineTo(160, 60);
    ctx.lineTo(210, 20); ctx.lineTo(210, 60);
    ctx.lineTo(260, 20); ctx.lineTo(278, 60);
    ctx.fill();
    return cvs;
};

// 4. Office (Experience) - West Street
const generateOffice = () => {
    const { cvs, ctx } = createCanvas(240, 288); 
    // Stone Facade
    ctx.fillStyle = '#d6cba8'; ctx.fillRect(30, 60, 180, 220);
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; for(let i=0; i<100; i++) ctx.fillRect(30 + Math.random()*170, 60 + Math.random()*210, 5, 3);

    // Grand Entrance
    ctx.fillStyle = '#451a03'; ctx.fillRect(100, 210, 40, 70);
    ctx.strokeStyle = '#a8a29e'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(120, 210, 25, Math.PI, 0); ctx.stroke();
    drawDoorMat(ctx, 104, 280);

    drawArchedWindow(ctx, 60, 130, 30, 40); drawArchedWindow(ctx, 150, 130, 30, 40);
    drawSlateRoof(ctx, 20, 10, 200, 50);
    return cvs;
};

// 5. Post Office (Contact) - Plaza Corner
const generatePostOffice = () => {
    const { cvs, ctx } = createCanvas(192, 192);
    drawBrickTexture(ctx, 40, 80, 112, 100, '#7f1d1d');
    ctx.fillStyle = '#d6cba8'; ctx.fillRect(40, 80, 10, 100); ctx.fillRect(142, 80, 10, 100); // Quoins
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(76, 120, 40, 60);
    drawDoorMat(ctx, 76, 180);
    drawSlateRoof(ctx, 30, 40, 132, 40);
    return cvs;
};

// --- SIGNPOST ---
const generateSign = () => {
    const { cvs, ctx } = createCanvas(48, 48);
    ctx.fillStyle = '#171717'; ctx.fillRect(22, 10, 4, 38);
    ctx.fillStyle = '#fef3c7'; ctx.fillRect(6, 12, 36, 20);
    ctx.strokeStyle = '#78350f'; ctx.strokeRect(6, 12, 36, 20);
    ctx.fillStyle = '#451a03'; ctx.fillRect(10, 18, 28, 2); ctx.fillRect(10, 24, 20, 2);
    return cvs;
};

// --- INTERIORS (Standard) ---
const generateSofa = () => { const {cvs,ctx}=createCanvas(48,48); ctx.fillStyle='#b91c1c'; ctx.fillRect(4,20,40,24); ctx.fillStyle='#991b1b'; ctx.fillRect(4,12,40,8); ctx.fillStyle='#7f1d1d'; ctx.fillRect(4,20,6,24); ctx.fillRect(38,20,6,24); return cvs; };
const generateChair = () => { const {cvs,ctx}=createCanvas(48,48); ctx.fillStyle='#92400e'; ctx.fillRect(12,24,24,20); ctx.fillRect(12,10,24,14); ctx.fillStyle='#78350f'; ctx.fillRect(12,40,4,8); ctx.fillRect(32,40,4,8); return cvs; };
const generateWeights = () => { const {cvs,ctx}=createCanvas(48,48); ctx.fillStyle='#334155'; ctx.fillRect(10,30,28,4); ctx.fillStyle='#000'; ctx.fillRect(8,28,4,8); ctx.fillRect(36,28,4,8); return cvs; };
const generatePunchingBag = () => { const {cvs,ctx}=createCanvas(48,48); ctx.fillStyle='#dc2626'; ctx.beginPath(); ctx.ellipse(24,38,10,4,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#ef4444'; ctx.fillRect(14,10,20,30); ctx.fillStyle='#b91c1c'; ctx.fillRect(22,0,4,10); return cvs; };
const generateBookStack = () => { const {cvs,ctx}=createCanvas(48,48); const c=['#1d4ed8','#047857','#b91c1c']; for(let i=0;i<3;i++){ ctx.fillStyle=c[i]; ctx.fillRect(14,34-(i*6),20,6); ctx.fillStyle='#fff'; ctx.fillRect(14,36-(i*6),18,2); } return cvs; };
const generateStairs = () => { const {cvs,ctx}=createCanvas(48,48); const s=6; const h=48/s; for(let i=0;i<s;i++){ ctx.fillStyle=i%2===0?'#b45309':'#92400e'; ctx.fillRect(0,i*h,48,h); } ctx.fillStyle='#451a03'; ctx.fillRect(0,0,4,48); ctx.fillRect(44,0,4,48); return cvs; };

// Export
const imgFiller = new Image(); imgFiller.src = generateFillerHouse().toDataURL();
const imgCottage = new Image(); imgCottage.src = generateCottage().toDataURL();
const imgGym = new Image(); imgGym.src = generateGym().toDataURL();
const imgLab = new Image(); imgLab.src = generateLab().toDataURL();
const imgOffice = new Image(); imgOffice.src = generateOffice().toDataURL();
const imgPost = new Image(); imgPost.src = generatePostOffice().toDataURL();
const imgSign = new Image(); imgSign.src = generateSign().toDataURL();
const imgSofa = new Image(); imgSofa.src = generateSofa().toDataURL();
const imgChair = new Image(); imgChair.src = generateChair().toDataURL();
const imgWeights = new Image(); imgWeights.src = generateWeights().toDataURL();
const imgBag = new Image(); imgBag.src = generatePunchingBag().toDataURL();
const imgBooks = new Image(); imgBooks.src = generateBookStack().toDataURL();
const imgStairs = new Image(); imgStairs.src = generateStairs().toDataURL();

ASSETS.house_filler = imgFiller;
ASSETS.house_about = imgCottage;
ASSETS.house_skills = imgGym;
ASSETS.house_projects = imgLab;
ASSETS.house_experience = imgOffice;
ASSETS.house_contact = imgPost;
ASSETS.sign = imgSign;
ASSETS.sofa = imgSofa;
ASSETS.chair = imgChair;
ASSETS.weights = imgWeights;
ASSETS.punching_bag = imgBag;
ASSETS.books = imgBooks;
ASSETS.stairs = imgStairs;
