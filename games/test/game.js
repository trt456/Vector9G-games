const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
}

function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Vector9G", width / 2, height / 2 - 25);

    ctx.font = "18px Arial";
    ctx.fillStyle = "#a5b4fc";
    ctx.fillText("Your game is working!", width / 2, height / 2 + 15);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
