/**
 * NPC Data
 * Each NPC belongs to a specific mapId.
 */

export const NPCS = [
    // --- OVERWORLD ---
    {
        id: 'guide',
        mapId: 'overworld',
        type: 'npc',
        x: 30, y: 32, // Standing at the Plaza Fountain
        spriteKey: 'npc',
        dialogue: ["Welcome to the town center.", "The School is straight North.", "My friend in the West says the Factory is hiring."],
        aiConfig: { mode: 'options' }
    },
    {
        id: 'villager_1',
        mapId: 'overworld',
        type: 'npc',
        x: 32, y: 48, // Near Spawn road
        spriteKey: 'npc',
        dialogue: ["New around here?", "The Plaza is just up ahead."],
        aiConfig: { mode: 'options' }
    },
    {
        id: 'athlete',
        mapId: 'overworld',
        type: 'npc',
        x: 50, y: 16, // At Soccer Field (A3)
        spriteKey: 'npc',
        dialogue: ["Practice makes perfect!", "Check out the dev's skills in the school."],
        aiConfig: { mode: 'generic' }
    },

    // --- INTERIORS (Positions maintained) ---
    {
        id: 'me_avatar',
        mapId: 'about_interior',
        type: 'npc',
        x: 5, y: 4, 
        spriteKey: 'npc',
        dialogue: ["Welcome to my humble home.", "Small spaces spark creativity."],
        panel: {
            title: "About Me",
            html: `
                <div class="flex gap-6 items-start">
                    <div class="w-32 h-32 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-4xl">👨‍💻</div>
                    <div>
                        <h3 class="text-xl font-bold text-white mb-2">Creative Developer</h3>
                        <p class="mb-4">Passionate about clean code and interactive experiences.</p>
                        <ul class="list-disc pl-5 text-gray-400">
                            <li>5+ Years JS Experience</li>
                            <li>Full Stack Capable</li>
                            <li>Game Dev Enthusiast</li>
                        </ul>
                    </div>
                </div>
            `
        }
    },
    {
        id: 'skill_trainer_front',
        mapId: 'skills_interior',
        type: 'npc',
        x: 4, y: 4,
        spriteKey: 'npc',
        dialogue: ["Frontend requires precision."],
        panel: {
            title: "Frontend Skills",
            html: `<div class="grid grid-cols-2 gap-2"><span class="bg-blue-900 p-2 rounded">React</span><span class="bg-yellow-900 p-2 rounded">JavaScript</span></div>`
        }
    },
    {
        id: 'skill_trainer_back',
        mapId: 'skills_interior',
        type: 'npc',
        x: 8, y: 4,
        spriteKey: 'npc',
        dialogue: ["The backend is the backbone."],
        panel: {
            title: "Backend Skills",
            html: `<div class="grid grid-cols-2 gap-2"><span class="bg-green-900 p-2 rounded">Node.js</span><span class="bg-gray-700 p-2 rounded">SQL</span></div>`
        }
    },
    {
        id: 'project_bot_1',
        mapId: 'projects_interior',
        type: 'npc',
        x: 4, y: 5,
        spriteKey: 'npc',
        dialogue: ["Beep. Viewing ShopMaster 3000 data."],
        panel: {
            title: "ShopMaster 3000",
            html: `<h3 class="text-xl mb-2">Full Stack Shop</h3><p>Next.js + Stripe Integration.</p>`
        }
    },
    {
        id: 'project_bot_2',
        mapId: 'projects_interior',
        type: 'npc',
        x: 8, y: 5,
        spriteKey: 'npc',
        dialogue: ["Click. Accessing ChatGenius logs."],
        panel: {
            title: "ChatGenius",
            html: `<h3 class="text-xl mb-2">WebSocket Chat</h3><p>Socket.io + Redis adapter.</p>`
        }
    },
    {
        id: 'hr_manager',
        mapId: 'experience_interior_f2',
        type: 'npc',
        x: 5, y: 4,
        spriteKey: 'npc',
        dialogue: ["Archived employment records ready."],
        panel: {
            title: "Work History",
            html: `<p>Senior Dev @ TechCorp (2021-Present)</p><p>Junior Dev @ WebAgency (2018-2021)</p>`
        }
    },
    {
        id: 'contact_bot',
        mapId: 'contact_interior',
        type: 'npc',
        x: 5, y: 4,
        spriteKey: 'npc',
        dialogue: ["Ready to collaborate?"],
        panel: {
            title: "Contact Me",
            html: `<div class="text-center"><p class="mb-4">email@example.com</p></div>`
        }
    }
];
