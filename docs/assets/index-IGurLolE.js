(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();class d{constructor(e,a){this.userId=e,this.apiToken=a,this.baseUrl="https://habitica.com/api/v3"}getHeaders(){return{"x-api-user":String(this.userId).trim(),"x-api-key":String(this.apiToken).trim(),"Content-Type":"application/json","x-client":"AAAA-AtomicTracker-v1.0"}}async getUserStats(){const e=await fetch(`${this.baseUrl}/user`,{headers:this.getHeaders()});if(!e.ok)throw new Error(`Error Habitica: ${e.status} - No se pudo obtener stats`);return(await e.json()).data.stats}async getHabits(){const e=await fetch(`${this.baseUrl}/tasks/user?type=habits`,{headers:this.getHeaders()});if(!e.ok)throw new Error(`Error Habitica: ${e.status} - No se pudieron obtener hábitos`);return(await e.json()).data}async scoreTask(e){const a=await fetch(`${this.baseUrl}/tasks/${e}/score/up`,{method:"POST",headers:this.getHeaders()});if(!a.ok)throw new Error("No se pudo actualizar el hábito");return(await a.json()).data}}console.log("Atomic Tracker: Motor iniciado correctamente.");const u=document.querySelector("#app");u.innerHTML=`
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
`;const h="35e70abc-6ca4-4bd1-8139-7b5ad449eb7b",p="8ec2b704-7eea-45f5-ad74-2c0e3fddb826",c=new d(h,p);function l(r){const e=r.hp/r.maxHealth*100,a=r.exp/r.toNextLevel*100;document.getElementById("hp-bar").style.width=`${e}%`,document.getElementById("xp-bar").style.width=`${a}%`,document.getElementById("level-display").innerText=`LVL: ${r.lvl}`}async function b(){console.log("Conectando con Habitica...");try{const r=await c.getUserStats();r&&(l(r),console.log(`¡Stats cargados! Nivel: ${r.lvl}`));const e=await c.getHabits(),a=document.getElementById("habit-list");e&&e.length>0?(a.innerHTML="",e.forEach(i=>{const t=document.createElement("li");t.className="habit-item",t.innerHTML=`
                    <span>${i.text}</span>
                    <button class="score-btn" data-id="${i.id}">+</button>
                `,a.appendChild(t)}),document.querySelectorAll(".score-btn").forEach(i=>{i.addEventListener("click",async t=>{const s=t.target.getAttribute("data-id"),o=t.target.innerText;try{t.target.innerText="✨",t.target.disabled=!0,t.target.style.backgroundColor="transparent",t.target.style.border="1px solid #ffd700",t.target.style.boxShadow="0 0 15px #ffd9005d",t.target.style.transform="scale(1.2)";const n=await c.scoreTask(s);l(n),setTimeout(()=>{t.target.innerText=o,t.target.disabled=!1,t.target.style=""},1e3)}catch(n){console.error("No se pudo subir el score:",n),t.target.innerText="❌",setTimeout(()=>{t.target.innerText=o,t.target.disabled=!1,t.target.style=""},1e3)}})})):a.innerHTML="<li>No tienes hábitos configurados en Habitica.</li>"}catch(r){console.error("Error en la inicialización:",r),document.getElementById("habit-list").innerHTML="<li>Error al conectar con Habitica. Revisa tus llaves.</li>"}}b();
