const mainMenu = document.getElementById("mainMenu"); 
const store = document.getElementById("store"); 
const levelsView = document.getElementById("levels"); 
const gameView = document.getElementById("game");

function hideAll() { 
  mainMenu.style.display = "none"; 
  store.style.display = "none"; 
  levelsView.style.display = "none"; 
  gameView.style.display = "none"; 
}

function showMenu() { 
  hideAll(); 
  mainMenu.style.display = "flex"; 
}

function showStore() { 
  hideAll(); 
  store.style.display = "block"; 
}

function showLevels() { 
  hideAll(); 
  levelsView.style.display = "block"; 
  buildLevels(); 
}

function setSkin(skin) { 
  localStorage.setItem("selectedSkin", skin); 
  alert("تم اختيار السكن: " + skin); 
}

function buildLevels() {
  const grid = document.getElementById("levelGrid");
  grid.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("level");
  div.textContent = "مرحلة 1";

  div.onclick = () => {
    hideAll();
    gameView.style.display = "block";
    startGame(); // تشغيل المرحلة الأولى فقط
  };

  grid.appendChild(div);
}

// ✅ رسم preview للسكنات في المتجر 
function drawSkinPreview(canvas, skin) { 
  const ctx = canvas.getContext("2d"); 
  const x = canvas.width / 2; 
  const y = canvas.height / 2; 
  const radius = 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  ctx.beginPath(); 
  ctx.arc(x, y, radius, 0, Math.PI * 2);

  switch (skin) { 
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
      let g = ctx.createRadialGradient(x, y, 5, x, y, 20);
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
      let cosmicGradient = ctx.createRadialGradient(x, y, 5, x, y, 20);
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
  }

  ctx.closePath(); 
}

// ✅ تشغيل الرسم لكل Canvas في المتجر 
document.querySelectorAll(".skin-preview").forEach((canvas, index) => { 
  const skins = [ 
    "diamond", "fire", "forest", "rainbow", "blackgold", 
    "electric", "ice", "cosmic", "digital" 
  ]; 
  drawSkinPreview(canvas, skins[index]); 
}); 

// تشغيل القائمة الرئيسية عند فتح الصفحة 
showMenu();