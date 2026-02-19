(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function i(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=i(t);fetch(t.href,s)}})();class h{constructor(e,i){this.userId=e,this.apiToken=i,this.baseUrl="https://habitica.com/api/v3"}getHeaders(){return{"x-api-user":String(this.userId).trim(),"x-api-key":String(this.apiToken).trim(),"Content-Type":"application/json","x-client":"AAAA-AtomicTracker-v1.0"}}async getUserStats(){const e=await fetch(`${this.baseUrl}/user`,{headers:this.getHeaders()});if(!e.ok)throw new Error(`Error Habitica: ${e.status} - No se pudo obtener stats`);return(await e.json()).data.stats}async getHabits(){const e=await fetch(`${this.baseUrl}/tasks/user?type=habits`,{headers:this.getHeaders()});if(!e.ok)throw new Error(`Error Habitica: ${e.status} - No se pudieron obtener hábitos`);return(await e.json()).data}async scoreTask(e,i="up"){const a=await fetch(`${this.baseUrl}/tasks/${e}/score/${i}`,{method:"POST",headers:this.getHeaders()});if(!a.ok)throw new Error(`No se pudo actualizar el hábito hacia: ${i}`);return(await a.json()).data}}console.log("Atomic Tracker: Engine started correctly.");const b=document.querySelector("#app");b.innerHTML=`
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
`;const f="35e70abc-6ca4-4bd1-8139-7b5ad449eb7b",g="8ec2b704-7eea-45f5-ad74-2c0e3fddb826",l=new h(f,g);function m(r,e,i,a){const t=document.createElement("div");t.className=`floating-text ${e==="xp"?"text-xp":"text-hp"}`,t.innerText=r,t.style.left=`${i}px`,t.style.top=`${a}px`,document.body.appendChild(t),setTimeout(()=>t.remove(),1e3)}let d=50;function p(r){const e=r.hp??50,i=r.maxHealth??50,a=r.exp??0,t=r.toNextLevel??100;if(e<d){const o=document.querySelector(".dashboard");o.classList.add("shake-effect"),setTimeout(()=>{o.classList.remove("shake-effect")},500)}d=e;const s=e/i*100,n=a/t*100;console.log(`Rendering: HP ${s}% | XP ${n}%`),document.getElementById("hp-bar").style.width=`${s}%`,document.getElementById("xp-bar").style.width=`${n}%`,r.lvl&&(document.getElementById("level-display").innerText=`LVL: ${r.lvl}`)}async function y(){console.log("Connecting to Habitica...");const r=document.getElementById("habit-list");try{const e=await l.getUserStats();e&&(d=e.hp,p(e),console.log(`Stats loaded! Level: ${e.lvl} | HP: ${e.hp}`));const i=await l.getHabits();i&&i.length>0?(r.innerHTML="",i.forEach(a=>{const t=document.createElement("li");t.className="habit-item";let s="";a.up&&(s+=`<button class="score-btn plus" data-id="${a.id}" data-direction="up">+</button>`),a.down&&(s+=`<button class="score-btn minus" data-id="${a.id}" data-direction="down">-</button>`),t.innerHTML=`
                    <span>${a.text}</span>
                    <div class="habit-buttons">
                        ${s}
                    </div>
                `,r.appendChild(t)}),document.querySelectorAll(".score-btn").forEach(a=>{a.addEventListener("click",async t=>{const s=t.target.getAttribute("data-id"),n=t.target.getAttribute("data-direction"),o=t.target.innerText;try{t.target.innerText=n==="up"?"✨":"💥",t.target.disabled=!0,t.target.classList.add("is-active");const c=await l.scoreTask(s,n),u=c.stats||c;u&&(p(u),m(n==="up"?"+ XP":"- HP",n==="up"?"xp":"hp",t.clientX,t.clientY)),setTimeout(()=>{t.target.innerText=o,t.target.disabled=!1,t.target.classList.remove("is-active")},800)}catch(c){console.error("Score update failed:",c),t.target.innerText="❌",setTimeout(()=>{t.target.innerText=o,t.target.disabled=!1},1e3)}})})):r.innerHTML="<li>No habits found in Habitica.</li>"}catch(e){console.error("Initialization error:",e),r.innerHTML="<li>Error connecting to Habitica. Check your keys.</li>"}}y();
