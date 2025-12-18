/**
 * Configuration for Portfolio Zones and NPCs.
 * Positions are relative to the 40x30 tile map.
 */

export const ZONES = [
    {
        id: 'about',
        type: 'zone', // Invisible trigger area
        x: 6, y: 5, width: 1, height: 1, // Doorway of House
        dialogue: ["Entering Developer's Home..."],
        panel: {
            title: "About Me",
            html: `
                <div class="flex gap-6 items-start">
                    <div class="w-32 h-32 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-4xl">👨‍💻</div>
                    <div>
                        <h3 class="text-xl font-bold text-white mb-2">Hello, I'm a Creative Developer</h3>
                        <p class="mb-4">I specialize in building interactive web experiences using modern technologies. I love bridging the gap between game design and functional web applications.</p>
                        <ul class="list-disc pl-5 text-gray-400">
                            <li>5+ Years Experience</li>
                            <li>Problem Solver</li>
                            <li>Pixel Art Enthusiast</li>
                        </ul>
                    </div>
                </div>
            `
        }
    },
    {
        id: 'skills',
        type: 'zone',
        x: 34, y: 7, width: 1, height: 1, // Gym Area
        dialogue: ["Analyzing Technical Skills..."],
        panel: {
            title: "Technical Skills",
            html: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-800 p-4 rounded">
                        <h4 class="text-yellow-400 font-bold mb-2">Frontend</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-2 py-1 bg-blue-900 rounded text-xs">React</span>
                            <span class="px-2 py-1 bg-yellow-900 rounded text-xs">JavaScript (ES6+)</span>
                            <span class="px-2 py-1 bg-teal-900 rounded text-xs">Tailwind</span>
                            <span class="px-2 py-1 bg-orange-900 rounded text-xs">HTML5 Canvas</span>
                        </div>
                    </div>
                    <div class="bg-gray-800 p-4 rounded">
                        <h4 class="text-green-400 font-bold mb-2">Backend</h4>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-2 py-1 bg-green-900 rounded text-xs">Node.js</span>
                            <span class="px-2 py-1 bg-gray-600 rounded text-xs">SQL</span>
                            <span class="px-2 py-1 bg-red-900 rounded text-xs">Redis</span>
                        </div>
                    </div>
                    <div class="bg-gray-800 p-4 rounded col-span-2">
                        <h4 class="text-purple-400 font-bold mb-2">Tools & Architecture</h4>
                        <p class="text-sm">Git, Docker, AWS, Clean Architecture, CI/CD Pipelines</p>
                    </div>
                </div>
            `
        }
    },
    {
        id: 'experience',
        type: 'zone',
        x: 6, y: 24, width: 1, height: 1, // Office Building
        dialogue: ["Accessing Career Records..."],
        panel: {
            title: "Work Experience",
            html: `
                <div class="space-y-6 relative border-l-2 border-gray-700 ml-3 pl-6">
                    <div class="relative">
                        <span class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-500"></span>
                        <h4 class="text-lg font-bold text-white">Senior Frontend Engineer</h4>
                        <p class="text-sm text-green-400">TechCorp Inc. | 2021 - Present</p>
                        <p class="text-sm mt-1">Leading the migration of legacy monoliths to micro-frontends. Improved site performance by 40%.</p>
                    </div>
                    <div class="relative">
                        <span class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gray-600"></span>
                        <h4 class="text-lg font-bold text-white">Web Developer</h4>
                        <p class="text-sm text-gray-400">Creative Agency | 2018 - 2021</p>
                        <p class="text-sm mt-1">Developed award-winning marketing sites for Fortune 500 clients using WebGL and GSAP.</p>
                    </div>
                </div>
            `
        }
    },
    {
        id: 'contact',
        type: 'zone',
        x: 35, y: 25, width: 1, height: 1, // Park Exit
        dialogue: ["Opening Communication Channels..."],
        panel: {
            title: "Contact Me",
            html: `
                <div class="text-center space-y-4">
                    <p class="text-xl">Ready to start a new adventure together?</p>
                    <a href="#" class="block w-full py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition">Send Email</a>
                    <div class="flex justify-center gap-4 mt-4">
                        <a href="#" class="text-blue-400 hover:text-white">LinkedIn</a>
                        <span class="text-gray-600">|</span>
                        <a href="#" class="text-gray-400 hover:text-white">GitHub</a>
                        <span class="text-gray-600">|</span>
                        <a href="#" class="text-blue-300 hover:text-white">Twitter</a>
                    </div>
                </div>
            `
        }
    }
];

export const NPCS = [
    {
        id: 'project_bot_1',
        type: 'npc',
        x: 18, y: 15, // City Center
        spriteKey: 'npc',
        dialogue: ["Beep boop! I am Project Unit #1.", "I monitor the E-Commerce Systems."],
        panel: {
            title: "Project: ShopMaster",
            html: `
                <h3 class="text-xl text-yellow-400 font-bold">Full Stack E-Commerce</h3>
                <p class="my-2">A comprehensive shopping platform featuring real-time inventory and Stripe integration.</p>
                <div class="bg-black/30 p-4 rounded mb-4">
                    <code class="text-green-400 text-sm">Stack: Next.js, GraphQL, PostgreSQL</code>
                </div>
                <button class="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">View Live Demo</button>
            `
        }
    },
    {
        id: 'project_bot_2',
        type: 'npc',
        x: 22, y: 15,
        spriteKey: 'npc',
        dialogue: ["Greetings traveler!", "Ask me about the Real-time Chat App."],
        panel: {
            title: "Project: ChatGenius",
            html: `
                <h3 class="text-xl text-yellow-400 font-bold">WebSocket Chat Application</h3>
                <p class="my-2">Scalable chat infrastructure supporting 10k+ concurrent connections.</p>
                <div class="bg-black/30 p-4 rounded mb-4">
                    <code class="text-green-400 text-sm">Stack: Socket.io, Redis, Express</code>
                </div>
                <button class="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">View GitHub</button>
            `
        }
    },
    {
        id: 'guide',
        type: 'npc',
        x: 20, y: 12,
        spriteKey: 'npc',
        dialogue: ["Welcome to my Portfolio World!", "Explore the buildings to learn about me.", "NORTH: Home (About)\nEAST: Gym (Skills)\nWEST: Office (Exp)\nSOUTH: Park (Contact)"],
        panel: null // Just dialog
    }
];