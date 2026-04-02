const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const optionsInput = document.getElementById("optionsInput");
const updateBtn = document.getElementById("updateBtn");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");

let options = [...initialOptions];
let currentAngle = 0;
let isSpinning = false;

const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#84cc16",
    "#14b8a6"
];

function getOptionsFromTextarea() {
    return optionsInput.value
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 220;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (options.length === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ddd";
        ctx.fill();
        return;
    }

    const arcSize = (Math.PI * 2) / options.length;

    for (let i = 0; i < options.length; i++) {
        const startAngle = currentAngle + i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);

        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.fillText(options[i], radius - 20, 8);

        ctx.restore();
    }

    // 中心圓
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

async function spinWheel() {
    if (isSpinning) return;

    options = getOptionsFromTextarea();
    if (options.length === 0) {
        alert("請至少輸入一個選項");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    updateBtn.disabled = true;
    resultText.textContent = "抽獎中...";

    try {
        const response = await fetch("/spin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ options })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "抽獎失敗");
            isSpinning = false;
            spinBtn.disabled = false;
            updateBtn.disabled = false;
            return;
        }

        const winnerIndex = data.winner_index;
        const winnerText = data.winner_text;

        const arcSize = (Math.PI * 2) / options.length;

        // 指針在正上方，所以得把中獎區塊旋轉到正上方
        const targetAngle =
            (Math.PI * 2 * 6) +
            (Math.PI * 1.5) -
            (winnerIndex * arcSize + arcSize / 2);

        const startAngle = currentAngle;
        const duration = 4000;
        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            currentAngle = startAngle + (targetAngle - startAngle) * eased;
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentAngle = targetAngle % (Math.PI * 2);
                drawWheel();
                resultText.textContent = `🎉 抽中：${winnerText}`;
                isSpinning = false;
                spinBtn.disabled = false;
                updateBtn.disabled = false;
            }
        }

        requestAnimationFrame(animate);

    } catch (error) {
        alert("發生錯誤：" + error);
        isSpinning = false;
        spinBtn.disabled = false;
        updateBtn.disabled = false;
    }
}

updateBtn.addEventListener("click", () => {
    options = getOptionsFromTextarea();
    drawWheel();
    resultText.textContent = "轉盤已更新";
});

spinBtn.addEventListener("click", spinWheel);

drawWheel();
