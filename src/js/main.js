import '../css/style.css';
import HabitService from './HabitService.mjs';

console.log("Atomic Tracker: Engine started correctly.");

const appElement = document.querySelector('#app');

// 1. UI Rendering
appElement.innerHTML = `
<div class="dashboard">
    <header class="game-header">
        <h1 class="orbitron">ATOMIC TRACKER</h1>
        <p>Level Up Your Life</p>
    </header>

    <section class="character-stats">
        <div class="stat-row">
            <span class="label">HP</span>
            <div class="bar-container">
                <div id="hp-bar" class="bar hp" style="width: 0%;"></div>
            </div>
        </div>
        <div class="stat-row">
            <span class="label">XP</span>
            <div class="bar-container">
                <div id="xp-bar" class="bar xp" style="width: 0%;"></div>
            </div>
        </div>
        <p id="level-display" class="orbitron" style="font-size: 0.8rem; text-align: right; margin-top: 5px;">LVL: --</p>
    </section>

    <section class="habit-list-container">
        <h2>Your Habits</h2>
        <ul id="habit-list">
            <li>Loading your Habitica habits...</li>
        </ul>
    </section>
</div>
`;

// 2. Configuration & Service Init
const USER_ID = '35e70abc-6ca4-4bd1-8139-7b5ad449eb7b';
const API_TOKEN = '8ec2b704-7eea-45f5-ad74-2c0e3fddb826';
const habitService = new HabitService(USER_ID, API_TOKEN);


// Floating Combat Text
function showFloatingText(text, type, x, y) {
    const el = document.createElement('div');
    el.className = `floating-text ${type === 'xp' ? 'text-xp' : 'text-hp'}`;
    el.innerText = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), 1000);
}


// 3. Update UI Bars

let lastHP = 50;

function updateBars(stats) {
    const currentHP = stats.hp ?? 50;
    const maxHP = stats.maxHealth ?? 50;
    const currentXP = stats.exp ?? 0;
    const nextLevelXP = stats.toNextLevel ?? 100;
        
        if (currentHP < lastHP) {
            const dashboard = document.querySelector('.dashboard');
            dashboard.classList.add('shake-effect');
            
            setTimeout(() => {
                dashboard.classList.remove('shake-effect');
            }, 500);
        }
    
    lastHP = currentHP;

    const healthPercent = (currentHP / maxHP) * 100;
    const xpPercent = (currentXP / nextLevelXP) * 100;

    console.log(`Rendering: HP ${healthPercent}% | XP ${xpPercent}%`);

    document.getElementById('hp-bar').style.width = `${healthPercent}%`;
    document.getElementById('xp-bar').style.width = `${xpPercent}%`;
    
    if (stats.lvl) {
        document.getElementById('level-display').innerText = `LVL: ${stats.lvl}`;
    }
}

// 4. Main Application Logic
async function init() {
    console.log("Connecting to Habitica...");
    const habitListElement = document.getElementById('habit-list');
    
    try {
        // --- INITIAL LOAD: Stats ---
        const stats = await habitService.getUserStats();
        if (stats) {
            lastHP = stats.hp; 
            updateBars(stats);
            console.log(`Stats loaded! Level: ${stats.lvl} | HP: ${stats.hp}`);
        }

        // --- INITIAL LOAD: Habits ---
        const habits = await habitService.getHabits();
        
        if (habits && habits.length > 0) {
            habitListElement.innerHTML = ''; 
            
            habits.forEach(habit => {
                const li = document.createElement('li');
                li.className = 'habit-item';
                
                let buttonsHTML = '';
                if (habit.up) {
                    buttonsHTML += `<button class="score-btn plus" data-id="${habit.id}" data-direction="up">+</button>`;
                }
                if (habit.down) {
                    buttonsHTML += `<button class="score-btn minus" data-id="${habit.id}" data-direction="down">-</button>`;
                }

                li.innerHTML = `
                    <span>${habit.text}</span>
                    <div class="habit-buttons">
                        ${buttonsHTML}
                    </div>
                `;
                habitListElement.appendChild(li);
            });

            // Set up Click Events for Buttons
            document.querySelectorAll('.score-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                const habitId = e.target.getAttribute('data-id');
                const direction = e.target.getAttribute('data-direction');
                    const originalText = e.target.innerText;
                    
                    try {
                        // 1. Visual Feedback dinámico
                        e.target.innerText = direction === 'up' ? "✨" : "💥"; 
                        e.target.disabled = true;
                        e.target.classList.add('is-active');

                        // 2. API CALL enviando la dirección (up/down)
                        const response = await habitService.scoreTask(habitId, direction);
                        
                        // 3. ACTUALIZACIÓN SMART
                        const newStats = response.stats || response; 
                        
                        if (newStats) {
                            updateBars(newStats); 
                            
                            const label = direction === 'up' ? '+ XP' : '- HP';
                            const type = direction === 'up' ? 'xp' : 'hp';
                            showFloatingText(label, type, e.clientX, e.clientY);
                        }

                        setTimeout(() => {
                            e.target.innerText = originalText;
                            e.target.disabled = false;
                            e.target.classList.remove('is-active');
                        }, 800);

                    } catch (err) {
                        console.error("Score update failed:", err);
                        e.target.innerText = "❌";
                        setTimeout(() => {
                            e.target.innerText = originalText;
                            e.target.disabled = false;
                        }, 1000);
                    }
                });
            });
        } else {
            habitListElement.innerHTML = '<li>No habits found in Habitica.</li>';
        }

    } catch (error) {
        console.error("Initialization error:", error);
        habitListElement.innerHTML = '<li>Error connecting to Habitica. Check your keys.</li>';
    }
}

init();