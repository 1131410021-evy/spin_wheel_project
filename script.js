const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const historyBody = document.getElementById('history-body');
let currentRotation = 0;
let historyCount = 0;

function drawWheel() {
    // We use the "Prizes" list to draw the wheel slices
    const items = document.getElementById('prizes').value.split('\n').filter(i => i.trim());
    if (items.length === 0) return;

    const arc = (2 * Math.PI) / items.length;
    const colors = ["#ff4757", "#ff9f43", "#ffcd3c", "#2bcbba", "#0984e3", "#a29bfe"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    items.forEach((text, i) => {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(225, 225);
        ctx.arc(225, 225, 210, angle, angle + arc);
        ctx.lineTo(225, 225);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(225, 225);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(text, 180, 8);
        ctx.restore();
    });

    // Draw center white circle
    ctx.beginPath();
    ctx.arc(225, 225, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

function spin() {
    const prizes = document.getElementById('prizes').value.split('\n').filter(i => i.trim());
    const participants = document.getElementById('participants').value.split('\n').filter(i => i.trim());
    
    if (prizes.length === 0 || participants.length === 0) return;

    const extraSpin = Math.floor(Math.random() * 360) + 1800; 
    currentRotation += extraSpin;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        
        document.getElementById('res-prize').innerText = prize;
        document.getElementById('res-name').innerText = winner;

        // Add to history
        historyCount++;
        const row = `<tr><td>${historyCount}</td><td>${prize}</td><td>${winner}</td></tr>`;
        historyBody.innerHTML += row;
    }, 4000);
}

function clearHistory() {
    historyBody.innerHTML = "";
    historyCount = 0;
}

drawWheel();
