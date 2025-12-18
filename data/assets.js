/**
 * Procedural Asset Generator
 */

export const ASSETS = {};

const createCanvas = (w, h) => {
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    return { cvs, ctx: cvs.getContext('2d') };
};

const drawBrickTexture = (ctx, x, y, w, h, color = '#a05440') => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for(let iy = y; iy < y+h; iy+=8) {
        const offset = (iy/8) % 2 === 0 ? 0 : 10;
        ctx.fillRect(x, iy, w, 1);
        for(let ix = x + offset; ix < x+w; ix+=20) {
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
    ctx.strokeStyle = '#d6cba8'; 
    ctx.lineWidth = 3;
    ctx.stroke();
};

const generateOffice = () => {
    const { cvs, ctx } = createCanvas(240, 720); // 15 tiles de alto (15 * 48 = 720)
    drawBrickTexture(ctx, 10, 20, 220, 700, '#451a03'); 
    
    // Muchas ventanas para un edificio alto
    for(let i=0; i<12; i++) {
        drawArchedWindow(ctx, 20, 40 + i*55, 30, 30);
        drawArchedWindow(ctx, 180, 40 + i*55, 30, 30);
    }

    // Puerta Industrial
    ctx.fillStyle = '#262626'; ctx.fillRect(70, 640, 100, 80);
    ctx.strokeStyle = '#a8a29e'; ctx.lineWidth=4; ctx.strokeRect(70, 640, 100, 80);

    // Silos decorativos
    ctx.fillStyle = '#737373';
    ctx.fillRect(180, 20, 40, 600);

    ctx.fillStyle = '#171717'; ctx.fillRect(0, 0, 240, 20);
    return cvs;
};

// ... Resto de generadores (mantenidos igual por brevedad) ...
const generateFillerHouse = () => { const {cvs,ctx} = createCanvas(144,144); drawBrickTexture(ctx,10,50,124,90,'#7f1d1d'); return cvs; };
const generateCottage = () => { const {cvs,ctx} = createCanvas(240,240); drawBrickTexture(ctx,40,100,160,130,'#c2410c'); return cvs; };
const generateGym = () => { const {cvs,ctx} = createCanvas(288,240); drawBrickTexture(ctx,20,80,248,150,'#9a3412'); return cvs; };
const generatePostOffice = () => { const {cvs,ctx} = createCanvas(192,192); drawBrickTexture(ctx,40,80,112,100,'#7f1d1d'); return cvs; };
const generateHugeTree = () => {
    const {cvs,ctx} = createCanvas(240,300);
    ctx.fillStyle='#451a03'; ctx.fillRect(100,150,40,150);
    ctx.fillStyle='#14532d'; ctx.beginPath(); ctx.arc(120,100,100,0,Math.PI*2); ctx.fill();
    return cvs;
};
const generateSign = () => { const {cvs,ctx} = createCanvas(48,48); ctx.fillStyle='#171717'; ctx.fillRect(22,10,4,38); return cvs; };

ASSETS.house_filler = generateFillerHouse();
ASSETS.house_about = generateCottage();
ASSETS.house_skills = generateGym();
ASSETS.house_experience = generateOffice();
ASSETS.house_contact = generatePostOffice();
ASSETS.huge_tree = generateHugeTree();
ASSETS.sign = generateSign();
