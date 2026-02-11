import '../css/style.css';
import HabitService from './HabitService.mjs';

console.log("Atomic Tracker: Motor iniciado correctamente.");

const appElement = document.querySelector('#app');

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
            <li>Cargando tus hábitos de Habitica...</li>
        </ul>
    </section>
</div>
`;

const USER_ID = '35e70abc-6ca4-4bd1-8139-7b5ad449eb7b';
const API_TOKEN = '8ec2b704-7eea-45f5-ad74-2c0e3fddb826';

const habitService = new HabitService(USER_ID, API_TOKEN);

function updateBars(stats) {
    const healthPercent = (stats.hp / stats.maxHealth) * 100;
    const xpPercent = (stats.exp / stats.toNextLevel) * 100;

    document.getElementById('hp-bar').style.width = `${healthPercent}%`;
    document.getElementById('xp-bar').style.width = `${xpPercent}%`;
    document.getElementById('level-display').innerText = `LVL: ${stats.lvl}`;
}

async function init() {
    console.log("Conectando con Habitica...");
    
    try {
        const stats = await habitService.getUserStats();
        if (stats) {
            updateBars(stats);
            console.log(`¡Stats cargados! Nivel: ${stats.lvl}`);
        }

        const habits = await habitService.getHabits();
        const habitListElement = document.getElementById('habit-list');
        
        if (habits && habits.length > 0) {
            habitListElement.innerHTML = ''; 
            
            habits.forEach(habit => {
                const li = document.createElement('li');
                li.className = 'habit-item';
                li.innerHTML = `
                    <span>${habit.text}</span>
                    <button class="score-btn" data-id="${habit.id}">+</button>
                `;
                habitListElement.appendChild(li);
            });

            document.querySelectorAll('.score-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const habitId = e.target.getAttribute('data-id');
                    const originalText = e.target.innerText;
                    
                    try {
                        e.target.innerText = "✨";
                        e.target.disabled = true;
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.border = "1px solid #ffd700";
                        e.target.style.boxShadow = "0 0 15px #ffd9005d";
                        e.target.style.transform = "scale(1.2)"; // Un poco más grande para que se vea la estrella

                        const newStats = await habitService.scoreTask(habitId);
                        
                        updateBars(newStats);

                        setTimeout(() => {
                            e.target.innerText = originalText;
                            e.target.disabled = false;
                            e.target.style = ""; 
                        }, 1000);

                    } catch (err) {
                        console.error("No se pudo subir el score:", err);
                        e.target.innerText = "❌";
                        setTimeout(() => {
                            e.target.innerText = originalText;
                            e.target.disabled = false;
                            e.target.style = "";
                        }, 1000);
                    }
                });
            });
        } else {
            habitListElement.innerHTML = '<li>No tienes hábitos configurados en Habitica.</li>';
        }

    } catch (error) {
        console.error("Error en la inicialización:", error);
        document.getElementById('habit-list').innerHTML = '<li>Error al conectar con Habitica. Revisa tus llaves.</li>';
    }
}

init();