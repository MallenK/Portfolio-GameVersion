
/**
 * NPC Data
 */

export const NPCS = [
    // --- OVERWORLD ---
    {
        id: 'guide',
        mapId: 'overworld',
        type: 'npc',
        x: 30, y: 32, 
        dialogue: ["Welcome to the town center.", "The School is straight North.", "The Industrial Park is in the South-West."],
        aiConfig: { mode: 'options' }
    },

    // --- INTERIOR FÁBRICA (7 NPCs) ---
    {
        id: 'chief_engineer',
        mapId: 'experience_interior',
        type: 'npc',
        x: 15, y: 14, // MOVED: Now overseeing the central Data Core
        dialogue: ["Identification verified. Welcome, Architect.", "We are currently compiling the latest experience logs.", "The system is stable at 98.7% efficiency."],
        aiConfig: { mode: 'options' },
        panel: {
            title: "Senior Fullstack Engineer - Career Archive",
            html: `
                <div class="space-y-8 relative border-l-2 border-yellow-500/30 ml-4 pl-8">
                    <div class="relative">
                        <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] border-4 border-black"></span>
                        <h4 class="text-xl font-bold text-white tracking-tight">Lead Fullstack Architect</h4>
                        <p class="text-sm text-yellow-400 font-mono">Future Systems | 2022 - Present</p>
                        <p class="mt-2 text-gray-300 leading-relaxed">Developing core AI infrastructure and high-frequency data visualizations. Spearheaded the transition to modular micro-frontends.</p>
                    </div>
                    <div class="relative">
                        <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-black"></span>
                        <h4 class="text-xl font-bold text-white tracking-tight">Senior Web Engineer</h4>
                        <p class="text-sm text-blue-400 font-mono">Global Creative Agency | 2019 - 2022</p>
                        <p class="mt-2 text-gray-300 leading-relaxed">Delivered 50+ award-winning interactive sites. Optimized WebGL rendering pipelines for mobile browsers.</p>
                    </div>
                    <div class="relative">
                        <span class="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-gray-600 border-4 border-black"></span>
                        <h4 class="text-xl font-bold text-white tracking-tight">Frontend Specialist</h4>
                        <p class="text-sm text-gray-500 font-mono">StartUp Hub | 2017 - 2019</p>
                        <p class="mt-2 text-gray-300 leading-relaxed">Architected the initial MVP using React and Redux. Scaled the platform to 100k active users.</p>
                    </div>
                </div>
            `
        }
    },
    { id: 'bot_maintenance_1', mapId: 'experience_interior', x: 5, y: 11, dialogue: ["BEEP. Lubricating joints..."] },
    { id: 'bot_maintenance_2', mapId: 'experience_interior', x: 25, y: 11, dialogue: ["Sector 4 clear of bugs. Literal bugs."] },
    { id: 'worker_logistics', mapId: 'experience_interior', x: 10, y: 22, dialogue: ["Moving experience packets to the cloud."] },
    { id: 'worker_qc', mapId: 'experience_interior', x: 20, y: 22, dialogue: ["The code quality here is exceptional today."] },
    { id: 'drone_archiver', mapId: 'experience_interior', x: 27, y: 5, dialogue: ["*Whirrr* Backing up memories..."] },
    { id: 'security_droid', mapId: 'experience_interior', x: 15, y: 27, dialogue: ["Stand clear of the exit portal."] },

    // --- OTROS ---
    {
        id: 'me_avatar',
        mapId: 'about_interior',
        type: 'npc',
        x: 5, y: 4, 
        dialogue: ["Welcome to my workspace.", "Feel free to explore."],
        panel: {
            title: "Developer Identity",
            html: `<p>Creative Developer with a passion for logic and aesthetics.</p>`
        }
    }
];
