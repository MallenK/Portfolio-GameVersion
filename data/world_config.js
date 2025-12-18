/**
 * World Configuration
 * Defines the placement and properties of structures (Houses) and interactables (Signs).
 */

import { ASSETS } from './assets.js';

export const HOUSES = [
    // --- MAIN BUILDINGS (BY BLOCK) ---
    
    // A2: School (Skills)
    {
        id: 'house_skills',
        type: 'gym',
        x: 27, y: 4, 
        width: 6, height: 5,
        image: ASSETS.house_skills,
        doorOffset: { x: 144, y: 230 },
        targetMap: 'skills_interior',
        spawn: { x: 6, y: 7 }
    },
    // B3: Own House (About)
    {
        id: 'house_about',
        type: 'cottage',
        x: 47, y: 24, 
        width: 5, height: 5, 
        image: ASSETS.house_about,
        doorOffset: { x: 120, y: 230 }, 
        targetMap: 'about_interior',
        spawn: { x: 5, y: 7 } 
    },
    // C1: Factory (Experience + Projects Lab)
    {
        id: 'house_experience',
        type: 'office',
        x: 4, y: 44, 
        width: 5, height: 6,
        image: ASSETS.house_experience,
        doorOffset: { x: 120, y: 278 },
        targetMap: 'experience_interior',
        spawn: { x: 6, y: 9 }
    },
    {
        id: 'house_projects',
        type: 'lab',
        x: 10, y: 46, 
        width: 6, height: 4, 
        image: ASSETS.house_projects,
        doorOffset: { x: 144, y: 190 },
        targetMap: 'projects_interior',
        spawn: { x: 6, y: 9 }
    },
    // Near Plaza Hub: Post Office (Contact)
    {
        id: 'house_contact',
        type: 'post',
        x: 34, y: 34, 
        width: 4, height: 4,
        image: ASSETS.house_contact,
        doorOffset: { x: 96, y: 180 },
        targetMap: 'contact_interior',
        spawn: { x: 5, y: 5 }
    },

    // --- FILLER HOUSES (Density Zones) ---
    // B1: Residential Block
    { x: 4, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 8, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 12, y: 22, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 4, y: 34, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 8, y: 34, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },

    // C3: Residential Block
    { x: 44, y: 42, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 52, y: 42, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 44, y: 52, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' },
    { x: 52, y: 52, width: 3, height: 3, image: ASSETS.house_filler, type: 'filler' }
];

export const SIGNS = [
    {
        x: 31, y: 28, // Near Plaza Hub
        text: ["Plaza Major", "N: School | S: Entrance", "W: Residential | E: My House"]
    },
    {
        x: 12, y: 52, // Factory entrance
        text: ["Industrial District", "Experience & Project Labs"]
    },
    {
        x: 32, y: 54, // Spawn / Main Road
        text: ["Welcome to the Portfolio Village", "Follow the road North to the Plaza"]
    }
];
