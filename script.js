const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const historyBody = document.getElementById('history-body');
let currentRotation = 0;
let historyCount = 0;

function drawWheel() {
    // Get items from the PRIZES list to define the wheel slices
    const items = document.getElementById('prizes').value.split('\n').filter(i => i.trim() !== "");
    if (items.length === 0) return;

    const arc = (2 * Math.PI) / items.length;
    const colors = ["#ff4757", "#2bcbba", "#4a90e2", "#ff9f43", "#a29bfe", "#fed330"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    items.forEach((text, i) => {
        const angle = i * arc;
        
        // Draw Slice
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(225, 225);
        ctx.arc(225, 225, 210, angle, angle + arc);
        ctx.lineTo(225, 225);
        ctx.fill();
        
        // Draw White Border Lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add Text to Slices
        ctx.save();
        ctx.translate(225, 225);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Microsoft JhengHei, Arial";
        ctx.textAlign = "right";
        ctx.fillText(text, 190, 10);
        ctx.restore();
    });

    // Center White Hole
    ctx.beginPath();
    ctx.arc(225, 225, 45, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
}

function spin() {
    const prizes = document.getElementById('prizes').value.split('\n').filter(i => i.trim() !== "");
    const participants = document.getElementById('participants').value.split('\n').filter(i => i.trim() !== "");
    
    if (prizes.length === 0 || participants.length === 0) {
        alert("請輸入名單！");
        return;
    }

    // Spin animation logic
    const extraSpin = Math.floor(Math.random() * 360) + 1800; // 5 full rotations + random
    currentRotation += extraSpin;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Calculate result after spin stops
    setTimeout(() => {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        
        document.getElementById('res-prize').innerText = prize;
        document.getElementById('res-name').innerText = winner;

        historyCount++;
        const row = `<tr><td>${historyCount}</td><td>${prize}</td><td>${winner}</td></tr>`;
        historyBody.innerHTML += row;
    }, 4000);
}

function clearHistory() {
    historyBody.innerHTML = "";
    historyCount = 0;
}

// Draw the wheel immediately on load
window.onload = drawWheel;
