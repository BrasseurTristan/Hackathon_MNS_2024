// Sélection des éléments du DOM
const computer = document.getElementById('computer');
const projectilesContainer = document.getElementById('projectiles');
const virusesContainer = document.getElementById('viruses');
const scoreboard = document.getElementById('scoreboard');
const livesDisplay = document.getElementById('lives');

// Sélection du curseur de visée et de la ligne de visée
const aimCursor = document.getElementById('aimCursor');
const aimLine = document.getElementById('aimLine');

let viruses = [];
let score = 0;
let lives = 3;

// Configuration des virus
const VIRUS_MIN_SIZE = 30;
const VIRUS_MAX_SIZE = 60;
const VIRUS_MIN_SPEED = 1;
const VIRUS_MAX_SPEED = 3;
const VIRUS_HEALTH = 3; // Nombre de hits pour détruire un virus
const NUM_INITIAL_VIRUSES = 5;

// Fragments de code JavaScript pour les projectiles
const CODE_SNIPPETS = [
  "console.log('Hacking...');",
  "let virus = null;",
  "function destroyVirus() { /* ... */ }",
  "const code = 'malware';",
  "if (virus) { virus.health--; }",
  "document.body.removeChild(virus.element);",
  "setInterval(() => { /* ... */ }, 1000);",
  "const payload = 'Exploit';",
  "class CodeProjectile { /* ... */ }",
  "alert('Virus destroyed!');"
];

// Classe Virus
class Virus {
  constructor() {
    this.size = getRandomInt(VIRUS_MIN_SIZE, VIRUS_MAX_SIZE);
    this.speed = getRandomFloat(VIRUS_MIN_SPEED, VIRUS_MAX_SPEED);
    this.health = VIRUS_HEALTH;

    this.element = document.createElement('div');
    this.element.classList.add('virus');
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.backgroundColor = getRandomColor();

    // Position initiale aléatoire
    this.x = getRandomInt(0, window.innerWidth - this.size);
    this.y = getRandomInt(0, window.innerHeight - this.size - 120); // Éviter la zone de l'ordinateur
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    virusesContainer.appendChild(this.element);

    // Direction aléatoire initiale
    this.direction = this.getRandomDirection();

    this.move();
  }

  getRandomDirection() {
    // Génère une direction aléatoire entre -1 et 1 pour X et Y
    const angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  move() {
    // Mise à jour de la position
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;

    // Bordures de l'écran
    if (this.x <= 0 || this.x + this.size >= window.innerWidth) {
      this.direction.x *= -1;
    }
    if (this.y <= 0 || this.y + this.size >= window.innerHeight - 120) { // Éviter la zone de l'ordinateur
      this.direction.y *= -1;
    }

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    requestAnimationFrame(this.move.bind(this));
  }

  takeHit() {
    this.health -= 1;
    if (this.health <= 0) {
      this.destroy();
    } else {
      // Change de couleur pour indiquer les dégâts
      this.element.style.backgroundColor = `rgba(255, 0, 0, ${this.health / VIRUS_HEALTH})`;
      this.element.classList.add('hit');
      setTimeout(() => {
        this.element.classList.remove('hit');
      }, 100);
    }
  }

  destroy() {
    this.element.remove();
    viruses = viruses.filter(v => v !== this);
    incrementScore();
    // Optionnel : Réapparaître après un certain temps
    setTimeout(() => {
      const newVirus = new Virus();
      viruses.push(newVirus);
    }, 2000);
  }

  attack() {
    this.element.style.backgroundColor = 'grey';
    // Réduire les vies
    reduceLives();
    // Détruire le virus après l'attaque
    setTimeout(() => {
      this.destroy();
    }, 2000);
  }
}

// Classe Projectile
class Projectile {
  constructor(x, y, targetX, targetY) {
    this.size = 60; // Largeur maximale du fragment de code
    this.height = 20; // Hauteur du fragment de code
    this.speed = 5;

    this.element = document.createElement('div');
    this.element.classList.add('projectile');

    // Choisir un fragment de code aléatoire
    const codeSnippet = CODE_SNIPPETS[getRandomInt(0, CODE_SNIPPETS.length - 1)];
    this.element.textContent = codeSnippet;

    this.x = x - this.size / 2;
    this.y = y - this.height / 2;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    projectilesContainer.appendChild(this.element);

    // Calcul de la direction
    const deltaX = targetX - x;
    const deltaY = targetY - y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    this.velocityX = (deltaX / distance) * this.speed;
    this.velocityY = (deltaY / distance) * this.speed;

    console.log(`Projectile initialisé avec velocityX: ${this.velocityX}, velocityY: ${this.velocityY}`);

    this.move();
  }

  move() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    // Vérifier les collisions avec les virus
    for (let virus of viruses) {
      if (this.isCollidingWith(virus)) {
        virus.takeHit();
        this.destroy();
        break;
      }
    }

    // Supprimer le projectile s'il sort de l'écran
    if (
      this.x < 0 ||
      this.x > window.innerWidth ||
      this.y < 0 ||
      this.y > window.innerHeight
    ) {
      this.destroy();
      return;
    }

    // Log de la position actuelle du projectile
    console.log(`Projectile en mouvement à (${this.x}, ${this.y})`);

    requestAnimationFrame(this.move.bind(this));
  }

  isCollidingWith(virus) {
    return (
      this.x < virus.x + virus.size &&
      this.x + this.size > virus.x &&
      this.y < virus.y + virus.size &&
      this.y + this.height > virus.y
    );
  }

  destroy() {
    if (this.element.parentElement) {
      this.element.remove();
    }
  }
}

// Fonction pour tirer un projectile
function shootProjectile(event) {
  console.log('Clic détecté sur l\'ordinateur');
  const computerRect = computer.getBoundingClientRect();
  const computerX = computerRect.left + computerRect.width / 2;
  const computerY = computerRect.top + computerRect.height / 2; // Centre vertical

  const targetX = event.clientX;
  const targetY = event.clientY;

  console.log(`Tir vers (${targetX}, ${targetY}) depuis (${computerX}, ${computerY})`);

  new Projectile(computerX, computerY, targetX, targetY);
}

// Ajouter un écouteur d'événement de clic pour tirer
computer.addEventListener('click', shootProjectile);

// Initialiser les virus
for (let i = 0; i < NUM_INITIAL_VIRUSES; i++) {
  const virus = new Virus();
  viruses.push(virus);
}

// Fonctions Utilitaires
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  const colors = ['#ff4d4d', '#ff9999', '#ff6666', '#cc0000', '#e60000'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function incrementScore() {
  score += 1;
  scoreboard.textContent = `Points: ${score}`;
}

function reduceLives() {
  lives -= 1;
  livesDisplay.textContent = `Vies: ${lives}`;
  if (lives <= 0) {
    endGame();
  }
}

function endGame() {
  alert('Game Over!');
  // Réinitialiser le jeu ou rediriger vers une autre page
  window.location.reload();
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  // Vous pouvez ajuster les positions des éléments si nécessaire
});

// Fonction pour mettre à jour la position du curseur de visée et de la ligne de visée
function updateAimCursor(event) {
  const computerRect = computer.getBoundingClientRect();
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Calcul de l'angle entre le centre de l'ordinateur et le curseur
  const centerX = computerRect.left + computerRect.width / 2;
  const centerY = computerRect.top + computerRect.height / 2;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  const angle = Math.atan2(deltaY, deltaX);

  // Calcul de la distance entre le centre et la souris
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Positionner le curseur de visée à une certaine distance du centre
  const cursorDistance = 40; // Distance du centre pour le curseur
  const cursorX = centerX + cursorDistance * Math.cos(angle);
  const cursorY = centerY + cursorDistance * Math.sin(angle);

  aimCursor.style.left = `${cursorX}px`;
  aimCursor.style.top = `${cursorY}px`;

  // Positionner et orienter la ligne de visée
  aimLine.style.left = `${centerX}px`;
  aimLine.style.top = `${centerY}px`;
  aimLine.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
  aimLine.style.height = `${distance - cursorDistance}px`;
}

// Ajouter un écouteur d'événement pour suivre le mouvement de la souris
window.addEventListener('mousemove', updateAimCursor);
