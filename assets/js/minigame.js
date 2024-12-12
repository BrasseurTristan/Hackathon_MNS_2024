// Sélection des éléments du DOM
const computer = document.getElementById('computer');
const projectilesContainer = document.getElementById('projectiles');
const virusesContainer = document.getElementById('viruses');
const scoreboard = document.getElementById('scoreboard');
const livesDisplay = document.getElementById('lives');
const gameContainer = document.getElementById('game-container');
const startOverlay = document.createElement('div');

let viruses = [];
let score = 0;
let lives = 3;
let gamePaused = true;
let canShoot = true; // Limitation des tirs
const WINNING_SCORE = 20; // Score requis pour gagner

// Configuration des virus
const VIRUS_MIN_SIZE = 30;
const VIRUS_MAX_SIZE = 60;
const VIRUS_MIN_SPEED = 1;
const VIRUS_MAX_SPEED = 4;
const VIRUS_HEALTH = 3; // Nombre de hits pour détruire un virus
const NUM_INITIAL_VIRUSES = 5;

// Fragments de code JavaScript pour les projectiles
const CODE_SNIPPETS = [
  "console.log();",
  "let virus",
  "destroyVirus()",
  "code = 'malware'",
  "if (virus.health)",
  "removeChild(virus);",
  "setInterval(() => 100);",
  "payload = 'Exploit';",
  "CodeProjectile {}",
  "alert('Virus');",
  "attak Théo",
  "Gamory push"
];

// Création de l'écran de démarrage
function createStartScreen() {
  startOverlay.id = 'start-overlay';
  startOverlay.style.position = 'fixed';
  startOverlay.style.top = '0';
  startOverlay.style.left = '0';
  startOverlay.style.width = '100%';
  startOverlay.style.height = '100%';
  startOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  startOverlay.style.color = 'white';
  startOverlay.style.display = 'flex';
  startOverlay.style.flexDirection = 'column';
  startOverlay.style.justifyContent = 'center';
  startOverlay.style.alignItems = 'center';
  startOverlay.style.zIndex = '1000';

  const title = document.createElement('h1');
  title.textContent = "Simulation d'attaque de virus";
  title.style.marginBottom = '20px';
  title.style.color = 'red';

  const rules = document.createElement('p');
  rules.textContent = "Règles : Tirez 3 fois sur les virus pour protéger votre ordinateur. Si un virus touche l'ordinateur, vous perdez une vie. Gagnez en détruisant 20 virus!";
  rules.style.textAlign = 'center';
  rules.style.marginBottom = '20px';

  const startButton = document.createElement('button');
  startButton.textContent = "Lancer la partie";
  startButton.style.padding = '10px 20px';
  startButton.style.fontSize = '18px';
  startButton.style.cursor = 'pointer';
  startButton.onclick = startGame;

  const animatedVirus = document.createElement('div');
  animatedVirus.classList.add('giant-virus');
  animatedVirus.style.width = '150px';
  animatedVirus.style.height = '150px';
  animatedVirus.style.backgroundColor = 'red';
  animatedVirus.style.borderRadius = '50%';
  animatedVirus.style.animation = 'bounce 2s infinite';

  startOverlay.appendChild(animatedVirus);
  startOverlay.appendChild(title);
  startOverlay.appendChild(rules);
  startOverlay.appendChild(startButton);
  document.body.appendChild(startOverlay);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    #start-overlay button {
      background-color: #333;
      color: white;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    #start-overlay button:hover {
      background-color: #555;
    }
  `;
  document.head.appendChild(style);
}

function startGame() {
  // Supprime l'overlay de démarrage
  startOverlay.remove();

  // Nettoyer les virus précédents
  viruses.forEach(virus => virus.element.remove());
  viruses = [];

  // Réinitialiser les variables
  gamePaused = false;
  score = 0;
  lives = 3;
  scoreboard.textContent = `Points: ${score}`;
  livesDisplay.textContent = `Vies: ${lives}`;

  // Rendre visible les éléments de jeu
  scoreboard.style.display = 'block';
  livesDisplay.style.display = 'block';
  computer.style.display = 'block';
  virusesContainer.style.display = 'block';

  // Générer les virus
  for (let i = 0; i < NUM_INITIAL_VIRUSES; i++) {
    const virus = new Virus();
    viruses.push(virus);
  }
}

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

    this.x = getRandomInt(0, window.innerWidth - this.size);
    this.y = getRandomInt(0, window.innerHeight - this.size - 120);
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    virusesContainer.appendChild(this.element);

    this.direction = this.getRandomDirection();
    this.move();
  }

  getRandomDirection() {
    const angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  }

  move() {
    if (gamePaused) return;

    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;

    if (this.x <= 0 || this.x + this.size >= window.innerWidth) {
      this.direction.x *= -1;
    }
    if (this.y <= 0 || this.y + this.size >= window.innerHeight) {
      this.direction.y *= -1;
    }

    // Vérification de la collision avec l'ordinateur
    const computerRect = computer.getBoundingClientRect();
    const virusRect = this.element.getBoundingClientRect();
    if (
      virusRect.right > computerRect.left &&
      virusRect.left < computerRect.right &&
      virusRect.bottom > computerRect.top &&
      virusRect.top < computerRect.bottom
    ) {
      this.hitComputer();
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
      this.element.style.backgroundColor = `rgba(255, 0, 0, ${this.health / VIRUS_HEALTH})`;
      this.element.classList.add('hit');
      setTimeout(() => {
        this.element.classList.remove('hit');
      }, 100);
    }
  }

  hitComputer() {
    lives -= 1;
    livesDisplay.textContent = `Vies: ${lives}`;
    this.element.remove();
    viruses = viruses.filter(v => v !== this);
    triggerScreenFlash();
    if (lives <= 0) {
      endGame(false);
    }
  }

  destroy() {
    this.element.classList.add('destroyed');
    setTimeout(() => {
      this.element.remove();
    }, 500);
    viruses = viruses.filter(v => v !== this);
    incrementScore();
    if (score >= WINNING_SCORE) {
      endGame(true);
    } else {
      setTimeout(() => {
        const newVirus = new Virus();
        viruses.push(newVirus);
      }, 1000);
    }
  }
}

// Classe Projectile
class Projectile {
  constructor(x, y, targetX, targetY) {
    this.size = 10;
    this.height = 10;
    this.speed = 5;

    this.element = document.createElement('div');
    this.element.classList.add('projectile');

    // Ajouter un fragment de code au projectile
    const codeSnippet = CODE_SNIPPETS[getRandomInt(0, CODE_SNIPPETS.length - 1)];
    this.element.textContent = codeSnippet;

    this.x = x - this.size / 2;
    this.y = y - this.height / 2;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    projectilesContainer.appendChild(this.element);

    const deltaX = targetX - x;
    const deltaY = targetY - y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    this.velocityX = (deltaX / distance) * this.speed;
    this.velocityY = (deltaY / distance) * this.speed;

    this.move();
  }

  move() {
    if (gamePaused) return;

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    for (let virus of viruses) {
      if (this.isCollidingWith(virus)) {
        virus.takeHit();
        this.destroy();
        break;
      }
    }

    if (
      this.x < 0 ||
      this.x > window.innerWidth ||
      this.y < 0 ||
      this.y > window.innerHeight
    ) {
      this.destroy();
      return;
    }

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

function shootProjectile(event) {
  if (!canShoot) return;
  canShoot = false;

  const computerRect = computer.getBoundingClientRect();
  const computerX = computerRect.left + computerRect.width / 2;
  const computerY = computerRect.top + computerRect.height / 2;

  const targetX = event.clientX;
  const targetY = event.clientY;

  new Projectile(computerX, computerY, targetX, targetY);

  setTimeout(() => {
    canShoot = true;
  }, 500);
}

function triggerScreenFlash() {
  document.body.style.animation = 'flashBody 0.5s 2';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes flashBody {
      0% { background-color: rgba(255, 0, 0, 0.6); }
      50% { background-color: #1e1e1e; }
      100% { background-color: rgba(255, 0, 0, 0.6); }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    document.body.style.animation = '';
  }, 1000);
}

function endGame(isWin) {
  // Supprimer les éléments du jeu
  computer.style.display = 'none';
  projectilesContainer.innerHTML = '';
  virusesContainer.innerHTML = '';

  const terminal = document.createElement('div');
  terminal.classList.add('terminal');
  terminal.style.position = 'fixed';
  terminal.style.top = '50%';
  terminal.style.left = '50%';
  terminal.style.transform = 'translate(-50%, -50%)';
  terminal.style.width = '80%';
  terminal.style.height = '50%';
  terminal.style.backgroundColor = 'black';
  terminal.style.color = isWin ? 'green' : 'red';
  terminal.style.fontFamily = 'monospace';
  terminal.style.fontSize = '20px';
  terminal.style.padding = '20px';
  terminal.style.overflow = 'hidden';
  terminal.style.display = 'flex';
  terminal.style.flexDirection = 'column';
  terminal.style.justifyContent = 'center';
  terminal.style.alignItems = 'center';
  terminal.style.zIndex = '100';

  const message = isWin
    ? 'VICTOIRE ! Vous avez contré l\'attaque des virus avec succès. Félicitations, votre système est sécurisé!'
    : 'DÉFAITE! Les virus ont pris le contrôle de votre système. Réessayez pour reprendre le contrôle!';

  document.body.appendChild(terminal);

  let index = 0;
  const interval = setInterval(() => {
    if (index < message.length) {
      terminal.textContent += message[index];
      index++;
    } else {
      clearInterval(interval);
      const blinkingCursor = document.createElement('span');
      blinkingCursor.textContent = '_';
      blinkingCursor.style.animation = 'blink 1s infinite';
      terminal.appendChild(blinkingCursor);

      // Ajouter des boutons
      const buttonContainer = document.createElement('div');
      buttonContainer.style.marginTop = '20px';

      if (isWin) {
        const mnsButton = document.createElement('button');
        mnsButton.textContent = 'Inscrivez-vous sur le site MNS';
        mnsButton.style.margin = '5px';
        mnsButton.onclick = () => {
          window.location.href = 'https://www.metz-numeric-school.fr/fr';
        };
        buttonContainer.appendChild(mnsButton);
      } else {
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Rejouer';
        retryButton.style.margin = '5px';
        retryButton.onclick = () => {
          window.location.reload();
        };

        const homeButton = document.createElement('button');
        homeButton.textContent = 'Accueil';
        homeButton.style.margin = '5px';
        homeButton.onclick = () => {
          window.location.href = 'index.html';
        };

        buttonContainer.appendChild(retryButton);
        buttonContainer.appendChild(homeButton);
      }

      terminal.appendChild(buttonContainer);
    }
  }, 100);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }

    button {
      background-color: #333;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #555;
    }
  `;
  document.head.appendChild(style);
}

computer.addEventListener('click', shootProjectile);

for (let i = 0; i < NUM_INITIAL_VIRUSES; i++) {
  const virus = new Virus();
  viruses.push(virus);
}

// Utilitaires
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  const colors = ['#ff4d4d', '#ff9999', '#ff6666', '#cc0000'];
  return colors[getRandomInt(0, colors.length - 1)];
}

function incrementScore() {
  score += 1;
  scoreboard.textContent = `Points: ${score}`;
}
// Initialisation
createStartScreen();
