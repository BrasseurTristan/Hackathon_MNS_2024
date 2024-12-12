//===============================> Background style Matrix
var c = document.getElementById("c");
var ctx = c.getContext("2d");

c.height = window.innerHeight;
c.width = window.innerWidth;

var matrix =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
matrix = matrix.split("");

var font_size = 10;
var columns = c.width / font_size;
var drops = [];
for (var x = 0; x < columns; x++) drops[x] = 1;

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "#f4427d";
  ctx.font = font_size + "px arial";
  for (var i = 0; i < drops.length; i++) {
    var text = matrix[Math.floor(Math.random() * matrix.length)];
    ctx.fillText(text, i * font_size, drops[i] * font_size);

    if (drops[i] * font_size > c.height && Math.random() > 0.975) drops[i] = 0;

    drops[i]++;
  }
}
setInterval(draw, 35);

function showIntroImage() {
  const introImage = document.getElementById("intro-image");
  const countdownContainer = document.querySelector(".countdown-container");

  introImage.classList.remove("hidden");

  setTimeout(() => {
    introImage.classList.add("hidden");
    countdownContainer.classList.remove("hidden");
    updateCountdown();
  }, 3000);
}

showIntroImage();

function updateCountdown() {
  const countDownDate = new Date().getTime() + 15 * 60 * 1000;
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  const codeContainer = document.querySelector(".code-container");
  codeContainer.style.display = "block"; // Afficher le champ de code

  const x = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");

    if (distance < 0) {
      clearInterval(x);
      openModal("lose");
    }
  }, 1000);

  const submitButton = document.getElementById("submit-code");
  submitButton.addEventListener("click", () => {
    const codeInput = document.getElementById("code-input").value.trim();
    if (codeInput === "1969") {
      clearInterval(x);
      openModal("win");
    }
  });
}

function openModal(type) {
  const modalWin = document.getElementById("modal-win");
  const modalLose = document.getElementById("modal-lose");
  const modals = document.getElementById("modals");

  if (type === "win") {
    modalWin.classList.remove("hidden");
  } else if (type === "lose") {
    modalLose.classList.remove("hidden");
  }
  modals.style.display = "block";
}
