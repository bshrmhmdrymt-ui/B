const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// اللاعب
let player = {
  x: 300,
  y: 200,
  radius: 20,
  dx: 0,
  dy: 0,
  skin: localStorage.getItem("selectedSkin") || "default"
};
let speed = 4;

// النقاط
let score = parseInt(localStorage.getItem("savedScore")) || 0;

// الأعداء والعملات
let enemiesCount = 0;
let enemies = [];
let coins = [];

let animationId;
let gameOver = false;
let paused = false;
let startTime = null;
let pausedTime = 0;

// مانع التداخل
function isOverlapping(obj1, obj2) {
  return !(
    obj1.x + obj1.size < obj2.x ||
    obj1.x > obj2.x + obj2.size ||
    obj1.y + obj1.size < obj2.y ||
    obj1.y > obj2.y + obj2.size
  );
}

// بدء اللعبة
function startGame() {
  gameOver = false;
  paused = false;
  enemies = [];
  coins = [];
  enemiesCount = 0;

  // استرجاع السكن
  const selectedSkin = localStorage.getItem("selectedSkin") || "default";
  player = { x: 300, y: 200, radius: 20, dx: 0, dy: 0, skin: selectedSkin };

  score = parseInt(localStorage.getItem("savedScore")) || 0;
  startTime = Date.now();
  pausedTime = 0;

  // أول عدو
  let firstEnemy = {
    x: 100,
    y: 100,
    size: player.radius * 2,
    color: "red",
    speed: 2,
    type: "red",
    dx: 2,
    dy: 2
  };
  enemies.push(firstEnemy);
  enemiesCount++;

  updateGame();
}

// التحكم باللاعب
document.addEventListener("keydown", e => {
  if (gameOver || paused) return;
  if (e.key === "ArrowUp") player.dy = -speed;
  if (e.key === "ArrowDown") player.dy = speed;
  if (e.key === "ArrowLeft") player.dx = -speed;
  if (e.key === "ArrowRight") player.dx = speed;
});

document.addEventListener("keyup", e => {
  if (gameOver || paused) return;
  if (["ArrowUp", "ArrowDown"].includes(e.key)) player.dy = 0;
  if (["ArrowLeft", "ArrowRight"].includes(e.key)) player.dx = 0;
});

// تحديث اللاعب
function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  if (player.x - player.radius < 0) player.x = player.radius;
  if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
  if (player.y - player.radius < 0) player.y = player.radius;
  if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;
}

// ✅ رسم اللاعب بالسكنات الاحترافية
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);

  switch (player.skin) {
    case "diamond":
      ctx.fillStyle = "lightblue";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case "fire":
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 4;
      ctx.stroke();
      break;

    case "forest":
      ctx.fillStyle = "darkgreen";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.stroke();
      break;

    case "rainbow":
      let g = ctx.createRadialGradient(player.x, player.y, 5, player.x, player.y, 20);
      g.addColorStop(0, "red");
      g.addColorStop(0.3, "yellow");
      g.addColorStop(0.6, "green");
      g.addColorStop(1, "blue");
      ctx.fillStyle = g;
      ctx.fill();
      break;

    case "blackgold":
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 4;
      ctx.stroke();
      break;

    case "electric":
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();
      break;

    case "ice":
      ctx.fillStyle = "lightblue";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.stroke();
      break;

    case "cosmic":
      let cosmicGradient = ctx.createRadialGradient(player.x, player.y, 5, player.x, player.y, 20);
      cosmicGradient.addColorStop(0, "purple");
      cosmicGradient.addColorStop(0.5, "black");
      cosmicGradient.addColorStop(1, "blue");
      ctx.fillStyle = cosmicGradient;
      ctx.fill();
      break;

    case "digital":
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.stroke();
      break;

    default:
      ctx.fillStyle = "blue";
      ctx.fill();
  }

  ctx.closePath();
}

// رسم الأعداء
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });
}

// تحديث الأعداء
function updateEnemies() {
  enemies.forEach(enemy => {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.hypot(dx, dy);

    if (enemy.type === "red") {
      if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }
    }

    if (enemy.type === "lightblue") {
      let futureX = player.x + player.dx * 10;
      let futureY = player.y + player.dy * 10;
      let fdx = futureX - enemy.x;
      let fdy = futureY - enemy.y;
      let fdist = Math.hypot(fdx, fdy);
      if (fdist > 0) {
        enemy.x += (fdx / fdist) * (enemy.speed * 1.5);
        enemy.y += (fdy / fdist) * (enemy.speed * 1.5);
      }
    }

    if (enemy.type === "green") {
      enemy.x += enemy.dx;
      enemy.y += enemy.dy;
      if (enemy.x < 0 || enemy.x + enemy.size > canvas.width) enemy.dx *= -1;
      if (enemy.y < 0 || enemy.y + enemy.size > canvas.height) enemy.dy *= -1;
    }

    if (enemy.type === "yellow") {
      if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }
    }

    if (enemy.type === "purple") {
      if (dist > 0) {
        enemy.x += (dx / dist) * (enemy.speed * 0.5);
        enemy.y += (dy / dist) * (enemy.speed * 0.5);
      }
    }
  });

  // منع التداخل
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      let e1 = enemies[i];
      let e2 = enemies[j];
      let dx = e2.x - e1.x;
      let dy = e2.y - e1.y;
      let dist = Math.hypot(dx, dy);
      if (dist < e1.size) {
        let overlap = e1.size - dist;
        let pushX = (dx / dist) * (overlap / 2);
        let pushY = (dy / dist) * (overlap / 2);
        e1.x -= pushX;
        e1.y -= pushY;
        e2.x += pushX;
        e2.y += pushY;
      }
    }
  }
}
// توليد أعداء كل 20 ثانية
setInterval(() => {
  if (gameOver || paused) return;
  const types = ["red", "lightblue", "green", "yellow", "purple"];
  const type = types[Math.floor(Math.random() * types.length)];
  let tries = 0;
  let placed = false;

  while (!placed && tries < 20) {
    let newEnemy = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: player.radius * 2,
      color: type,
      speed: 2,
      type: type,
      dx: 2,
      dy: 2
    };

    let overlap = enemies.some(e => isOverlapping(newEnemy, e));
    let playerOverlap =
      player.x - player.radius < newEnemy.x + newEnemy.size &&
      player.x + player.radius > newEnemy.x &&
      player.y - player.radius < newEnemy.y + newEnemy.size &&
      player.y + player.radius > newEnemy.y;

    if (!overlap && !playerOverlap) {
      enemies.push(newEnemy);
      enemiesCount++;
      placed = true;
    }
    tries++;
  }
}, 20000);

// العملات
function spawnCoin() {
  let coin = {
    x: Math.random() * (canvas.width - 15),
    y: Math.random() * (canvas.height - 15),
    radius: 8,
    color: ""
  };
  coins.push(coin);
}

function drawCoins() {
  coins.forEach(coin => {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = coin.color;
    ctx.fill();
    ctx.closePath();
  });
}

function checkCoinCollision() {
  coins = coins.filter(coin => {
    let dx = player.x - coin.x;
    let dy = player.y - coin.y;
    let dist = Math.hypot(dx, dy);
    if (dist < player.radius + coin.radius) {
      score += 10;
      localStorage.setItem("savedScore", score);
      return false;
    }
    return true;
  });
}

// توليد عملة كل 10 ثواني
setInterval(() => {
  if (!gameOver && !paused) spawnCoin();
}, 10000);

// فحص التصادم مع الأعداء
function checkCollision() {
  enemies.forEach(enemy => {
    if (
      player.x - player.radius < enemy.x + enemy.size &&
      player.x + player.radius > enemy.x &&
      player.y - player.radius < enemy.y + enemy.size &&
      player.y + player.radius > enemy.y
    ) {
      endGame(false);
    }
  });
}

// إنهاء اللعبة
function endGame(win) {
  gameOver = true;
  localStorage.setItem("savedScore", score);

  ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(win ? "🎉 ربحت!" : "💥 خسرت!", canvas.width / 2, canvas.height / 2 - 40);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.position = "absolute";
  buttonsDiv.style.top = "50%";
  buttonsDiv.style.left = "50%";
  buttonsDiv.style.transform = "translate(-50%, -50%)";
  buttonsDiv.style.textAlign = "center";

  const homeBtn = document.createElement("button");
  homeBtn.textContent = "🏠 الرئيسية";
  homeBtn.onclick = () => {
    document.body.removeChild(buttonsDiv);
    showMenu();
  };

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "🔄 إعادة";
  restartBtn.onclick = () => {
    document.body.removeChild(buttonsDiv);
    startGame();
  };

  buttonsDiv.appendChild(homeBtn);
  buttonsDiv.appendChild(restartBtn);

  if (win) {
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "▶️ استمرار";
    continueBtn.onclick = () => {
      document.body.removeChild(buttonsDiv);
      gameOver = false;
      bgMusic.play();
      updateGame();
    };
    buttonsDiv.appendChild(continueBtn);
  }

  document.body.appendChild(buttonsDiv);
}

// تحديث اللعبة
function updateGame() {
  if (gameOver || paused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  updateEnemies();
  drawPlayer();
  drawEnemies();
  drawCoins();
  checkCollision();
  checkCoinCollision();

  let elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (elapsed >= 60 && !gameOver) {
    endGame(true);
    return;
  }

  document.getElementById("score").textContent = "النقاط: " + score;
  document.getElementById("timer").textContent = "الوقت: " + elapsed + " ثانية";
  document.getElementById("enemyCount").textContent = "الأعداء: " + enemiesCount;

  animationId = requestAnimationFrame(updateGame);
}

// أزرار الإيقاف والاستمرار
document.getElementById("pauseBtn").onclick = () => {
  if (!gameOver && !paused) {
    paused = true;
    cancelAnimationFrame(animationId);
    pausedTime = Date.now() - startTime;
    bgMusic.pause();
  }
};

document.getElementById("resumeBtn").onclick = () => {
  if (!gameOver && paused) {
    paused = false;
    startTime = Date.now() - pausedTime;
    bgMusic.play();
    updateGame();
  }
};