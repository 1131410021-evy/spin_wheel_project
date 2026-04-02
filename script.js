const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let currentRotation = 0;

function drawWheel() {
    const items = document.getElementById('participants').value.split('\n').filter(i => i.trim());
    const arc = (2 * Math.PI) / items.length;
    const colors = ["#ff9f43", "#ee5253", "#10ac84", "#2e86de", "#f368e0", "#ff9f43"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    items.forEach((text, i) => {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arc);
        ctx.lineTo(200, 200);
        ctx.fill();
        
        // Add text
        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(200, 200);
        ctx.rotate(angle + arc / 2);
        ctx.font = "bold 18px Arial";
        ctx.fillText(text, 100, 10);
        ctx.restore();
    });
}

function spin() {
    const prizes = document.getElementById('prizes').value.split('\n').filter(i => i.trim());
    const participants = document.getElementById('participants').value.split('\n').filter(i => i.trim());
    
    const randomSpin = Math.floor(Math.random() * 360) + 1440; // 4 full spins + random
    currentRotation += randomSpin;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        document.getElementById('winner-text').innerText = `${winner} 獲得了 ${prize}!`;
    }, 4000);
}

// Draw initial wheel
drawWheel();
// Update wheel when typing
document.getElementById('participants').addEventListener('input', drawWheel);
