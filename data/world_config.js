
/**
 * World Configuration
 */

import { ASSETS } from './assets.js';

export const HOUSES = [
    // --- EDIFICIOS PRINCIPALES ---
    
    // Escuela (Habilidades)
    {
        id: 'house_skills',
        type: 'gym',
        x: 27, y: 4, 
        width: 6, height: 5,
        image: ASSETS.house_skills,
        doorOffset: { x: 144, y: 230 },
        targetMap: 'skills_interior',
        spawn: { x: 6, y: 8 }
    },
    // Casa Propia (Sobre mí)
    {
        id: 'house_about',
        type: 'cottage',
        x: 47, y: 24, 
        width: 5, height: 5, 
        image: ASSETS.house_about,
        doorOffset: { x: 120, y: 230 }, 
        targetMap: 'about_interior',
        spawn: { x: 5, y: 8 } 
    },
    // Fábrica (Experiencia) - Posición FINAL y: 37
    {
        id: 'house_experience',
        type: 'office',
        x: 1, y: 37, 
        width: 5, height: 15,
        image: ASSETS.house_experience,
        doorOffset: { x: 96, y: 672 }, // Offset calculado para puerta en (3, 51)
        targetMap: 'experience_interior', 
        spawn: { x: 15, y: 27 } 
    },
    // Hub: Oficina de Correos (Contacto)
    {
        id: 'house_contact',
        type: 'post',
        x: 34, y: 34, 
        width: 4, height: 4,
        image: ASSETS.house_contact,
        doorOffset: { x: 96, y: 180 },
        targetMap: 'contact_interior',
        spawn: { x: 5, y: 6 }
    },

    // --- RELLENO ---
    { x: 4, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 8, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 12, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' }
];

export const SIGNS = [
    {
        x: 31, y: 28, 
        text: ["Plaza Major", "North: School | South: Entrance", "West: Residential | East: My House"]
    },
    {
        x: 10, y: 54, 
        text: ["Industrial Sector C1", "Experience Factory and Lifetree"]
    }
];
