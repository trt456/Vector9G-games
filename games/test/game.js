const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- HERNÍ KONFIGURACE A STAV ---
const GAME_TICK_RATE = 1000 / 60; // 60 aktualizací logiky za sekundu (fixní delta time)
let lastTime = 0;
let accumulator = 0;
let currentDpr = 1;

// Správa stisknutých kláves
const keys = {};

// Příklad herního objektu (Hráč)
const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    speed: 200, // rychlost v pixelech za sekundu
    color: "#a5b4fc"
};

// --- OVLÁDÁNÍ ---
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

// --- LOGIKA HRY (Aktualizace stavu, fyzika, kolize) ---
// dt = delta time v sekundách (zde vždy fixní 1/60 sekundy)
function update(dt) {
    // Pohyb hráče podle stisknutých kláves
    if (keys["ArrowUp"] || keys["KeyW"]) player.y -= player.speed * dt;
    if (keys["ArrowDown"] || keys["KeyS"]) player.y += player.speed * dt;
    if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= player.speed * dt;
    if (keys["ArrowRight"] || keys["KeyD"]) player.x += player.speed * dt;

    // Zde můžeš přidat kolize s okraji obrazovky
    const logWidth = canvas.width / currentDpr;
    const logHeight = canvas.height / currentDpr;
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > logWidth) player.x = logWidth - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > logHeight) player.y = logHeight - player.height;
}

// --- VYKRESLOVÁNÍ (Renderování scény) ---
function render() {
    // Získání správné logické šířky a výšky po započtení setTransform
    const width = canvas.width / currentDpr;
    const height = canvas.height / currentDpr;

    // 1. Vymazání plátna (pozadí)
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    // 2. Vykreslení textů platformy
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Vector9G Engine", width / 2, 40);

    // 3. Vykreslení hráče
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// --- HERNÍ SMYČKA (Game Loop) ---
// Zajišťuje plynulý chod nezávislý na FPS monitoru
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    let elapsed = timestamp - lastTime;
    lastTime = timestamp;

    // Ochrana proti "spirále smrti" při záseku prohlížeče
    if (elapsed > 250) elapsed = 250;

    accumulator += elapsed;

    // Aktualizujeme logiku tolikrát, kolikrát je potřeba pro zachování stability
    while (accumulator >= GAME_TICK_RATE) {
        update(GAME_TICK_RATE / 1000); // Předáváme delta time v sekundách
        accumulator -= GAME_TICK_RATE;
    }

    // Vykreslíme aktuální stav hry
    render();

    // Požádáme o další snímek
    requestAnimationFrame(gameLoop);
}

// --- RESPONSIVITA ---
function resizeCanvas() {
    currentDpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(canvas.clientWidth * currentDpr);
    canvas.height = Math.round(canvas.clientHeight * currentDpr);

    ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
}

// Inicializace platformy
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Spuštění samotné hry
requestAnimationFrame(gameLoop);
