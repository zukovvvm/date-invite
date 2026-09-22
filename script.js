// === Фоновые сердечки ===
const heartsContainer = document.getElementById("hearts");
const heartEmojis = ["💖", "💕", "💗", "💓", "🌸"];

function createHeart() {
  const heart = document.createElement("span");
  heart.textContent =
    heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 16 + Math.random() * 20 + "px";
  heart.style.animationDuration = 6 + Math.random() * 6 + "s";
  heart.style.animationDelay = Math.random() * 2 + "s";
  heartsContainer.appendChild(heart);

  setTimeout(function () {
    heart.remove();
  }, 12000);
}

setInterval(createHeart, 500);
for (let i = 0; i < 8; i++) createHeart();

// === Кнопка "Нет", которая убегает ОТ курсора ===
const btnNo = document.getElementById("btn-no");

let isEscaping = false;

function escapeFromCursor(mouseX, mouseY) {
  const rect = btnNo.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  // Вектор от курсора к центру кнопки
  let dx = btnCenterX - mouseX;
  let dy = btnCenterY - mouseY;
  let distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const safeDistance = 120; // на каком расстоянии начинает убегать
  const step = 60; // на сколько пикселей отпрыгивает

  if (distance < safeDistance) {
    const nx = dx / distance;
    const ny = dy / distance;

    let newLeft = rect.left + nx * step;
    let newTop = rect.top + ny * step;

    // Не даём кнопке улететь за пределы экрана
    const padding = 20;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;
    newLeft = Math.max(padding, Math.min(newLeft, maxX));
    newTop = Math.max(padding, Math.min(newTop, maxY));

    btnNo.classList.add("runaway");
    btnNo.style.left = newLeft + "px";
    btnNo.style.top = newTop + "px";
  }
}

// Реакция на движение мыши по всей странице
document.addEventListener("mousemove", function (e) {
  if (isEscaping) return;
  isEscaping = true;
  requestAnimationFrame(function () {
    escapeFromCursor(e.clientX, e.clientY);
    isEscaping = false;
  });
});

// На случай мобильных — на тач тоже убегает
document.addEventListener(
  "touchmove",
  function (e) {
    const touch = e.touches[0];
    if (touch) escapeFromCursor(touch.clientX, touch.clientY);
  },
  { passive: true },
);

// Клик по кнопке "Нет" ничего не делает
btnNo.addEventListener("click", function (e) {
  e.preventDefault();
});

// === Переключение шагов ===
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-3");
const btnYes = document.getElementById("btn-yes");
const btnRestart = document.getElementById("btn-restart");
const finalText = document.getElementById("final-text");

function showStep(step) {
  [step1, step2, step3].forEach(function (s) {
    s.classList.remove("step-active");
  });
  step.classList.add("step-active");
}

btnYes.addEventListener("click", function () {
  showStep(step2);
});

// === Выбор места ===
const places = document.querySelectorAll(".place");

places.forEach(function (place) {
  place.addEventListener("click", function () {
    const chosen = place.getAttribute("data-place");
    finalText.textContent = "Ты выбрала: " + chosen + ". Договорились! 💕";
    showStep(step3);
  });
});

// === Начать заново ===
btnRestart.addEventListener("click", function () {
  btnNo.classList.remove("runaway");
  btnNo.style.left = "";
  btnNo.style.top = "";
  showStep(step1);
});
