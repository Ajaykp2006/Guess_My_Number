//  <!-- ==========================================================================
//          JAVASCRIPT: ARCHITECTURE, STATE, & LOGIC
//          ========================================================================== -->
/**
 * 1. STATE MANAGEMENT (LocalStorage)
 */
const defaultState = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGuesses: 0,
  flawlessWins: 0, // Wins in 5 guesses or less
  xp: 0,
  level: 1,
  unlockedAchievements: [],
  theme: "light",
};

let db = JSON.parse(localStorage.getItem("GuessOS_Data")) || {
  ...defaultState,
};

const saveDB = () => localStorage.setItem("GuessOS_Data", JSON.stringify(db));

// Define Ranks based on level
const getRank = (lvl) => {
  if (lvl < 5) return "Novice";
  if (lvl < 10) return "Apprentice";
  if (lvl < 20) return "Adept";
  if (lvl < 30) return "Expert";
  if (lvl < 50) return "Master";
  return "Grandmaster";
};

const xpForNextLevel = (lvl) => 100 * Math.pow(1.5, lvl - 1); // Exponential XP scaling

/**
 * 2. ACHIEVEMENTS CONFIGURATION
 */
const achievementsData = [
  {
    id: "first_win",
    icon: "🏆",
    title: "First Blood",
    desc: "Win your first game.",
  },
  {
    id: "streak_3",
    icon: "🔥",
    title: "On Fire",
    desc: "Win 3 games in a row.",
  },
  {
    id: "streak_10",
    icon: "☄️",
    title: "Unstoppable",
    desc: "Win 10 games in a row.",
  },
  {
    id: "flawless",
    icon: "⚡",
    title: "Flawless Logic",
    desc: "Win in 5 guesses or fewer.",
  },
  {
    id: "games_50",
    icon: "🎮",
    title: "Addict",
    desc: "Play 50 total games.",
  },
  {
    id: "level_10",
    icon: "⭐",
    title: "Rising Star",
    desc: "Reach Level 10.",
  },
  {
    id: "first_try",
    icon: "🤯",
    title: "Psychic",
    desc: "Guess it on the first try.",
  },
  {
    id: "dedication",
    icon: "🧠",
    title: "Overthinker",
    desc: "Make 20 guesses in one game.",
  },
];

/**
 * 3. UI RENDERER & LOGIC MANAGER
 */
class UIManager {
  constructor() {
    this.initNavigation();
    this.initTheme();
    this.renderDashboard();
    this.renderStats();
    this.renderAchievements();

    // Settings Binds
    document
      .getElementById("toggle-theme")
      .addEventListener("click", () => this.toggleTheme());
    document.getElementById("reset-data").addEventListener("click", () => {
      if (confirm("Are you sure? This cannot be undone.")) {
        localStorage.removeItem("GuessOS_Data");
        window.location.reload();
      }
    });
  }

  initNavigation() {
    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-target");
        if (!targetId) return;

        // Update active states
        document
          .querySelectorAll(".nav-btn")
          .forEach((b) => b.classList.remove("active"));
        // If clicked from sidebar, highlight it. (Skip if it's the dashboard button in main view)
        if (e.currentTarget.classList.contains("nav-btn"))
          e.currentTarget.classList.add("active");

        // Switch views
        document
          .querySelectorAll(".view-section")
          .forEach((view) => view.classList.remove("active"));
        document.getElementById(targetId).classList.add("active");

        // Refresh data on switch
        this.renderDashboard();
        this.renderStats();
        this.renderAchievements();
      });
    });
  }

  initTheme() {
    if (db.theme === "dark")
      document.documentElement.setAttribute("data-theme", "dark");
  }

  toggleTheme() {
    if (db.theme === "light") {
      db.theme = "dark";
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      db.theme = "light";
      document.documentElement.removeAttribute("data-theme");
    }
    saveDB();
  }

  showToast(message, type = "normal", icon = "🔔") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="font-size: 1.5rem;">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  renderDashboard() {
    document.getElementById("dash-rank").textContent = getRank(db.level);
    document.getElementById("dash-level").textContent = `Level ${db.level}`;

    const nextXP = Math.floor(xpForNextLevel(db.level));
    document.getElementById("dash-xp").textContent =
      `${Math.floor(db.xp)} / ${nextXP} XP`;

    const percent = Math.min((db.xp / nextXP) * 100, 100);
    document.getElementById("dash-xp-bar").style.width = `${percent}%`;

    document.getElementById("dash-wins").textContent = db.wins;
    document.getElementById("dash-streak").textContent = db.bestStreak;

    let winrate =
      db.gamesPlayed === 0 ? 0 : Math.round((db.wins / db.gamesPlayed) * 100);
    document.getElementById("dash-winrate").textContent = `${winrate}%`;
  }

  renderStats() {
    document.getElementById("stat-total-games").textContent = db.gamesPlayed;
    document.getElementById("stat-total-guesses").textContent = db.totalGuesses;
    document.getElementById("stat-flawless").textContent = db.flawlessWins;

    let avg = db.wins === 0 ? 0 : (db.totalGuesses / db.wins).toFixed(1);
    document.getElementById("stat-avg-guesses").textContent = avg;
  }

  renderAchievements() {
    const container = document.getElementById("achievements-container");
    container.innerHTML = "";

    achievementsData.forEach((ach) => {
      const isUnlocked = db.unlockedAchievements.includes(ach.id);
      const card = document.createElement("div");
      card.className = `achievement-card ${isUnlocked ? "unlocked" : ""}`;
      card.innerHTML = `
                        <div class="ach-icon">${ach.icon}</div>
                        <div class="ach-title">${ach.title}</div>
                        <div class="ach-desc">${ach.desc}</div>
                    `;
      container.appendChild(card);
    });
  }

  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
  }
}

const ui = new UIManager();

/**
 * 4. GAME ENGINE LOGIC
 */
class GameEngine {
  constructor() {
    this.MAX = 100;
    this.secret = this.generateSecret();
    this.attempts = 0;
    this.playing = true;
    this.history = [];

    // DOM Bindings
    this.input = document.getElementById("game-input");
    this.btn = document.getElementById("game-btn");
    this.feedback = document.getElementById("game-feedback");
    this.historyContainer = document.getElementById("game-history");
    this.attemptsText = document.getElementById("game-attempts");

    // Events
    this.btn.addEventListener("click", () => this.handleGuess());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleGuess();
    });

    this.resetUI();
  }

  generateSecret() {
    return Math.floor(Math.random() * this.MAX) + 1;
  }

  resetUI() {
    this.secret = this.generateSecret();
    this.attempts = 0;
    this.playing = true;
    this.history = [];

    this.input.value = "";
    this.input.disabled = false;
    this.btn.textContent = "SUBMIT GUESS";
    this.btn.style.backgroundColor = "var(--primary)";

    this.updateFeedback(
      "Waiting for your first move...",
      "var(--bg-input)",
      "var(--text-main)",
    );
    this.historyContainer.innerHTML = "";
    this.attemptsText.textContent = "0";

    this.input.focus();
  }

  updateFeedback(msg, bgColor, borderColor) {
    this.feedback.innerHTML = msg;
    this.feedback.style.backgroundColor = bgColor;
    this.feedback.style.borderColor = borderColor;

    // Trigger pop animation
    this.feedback.classList.remove("pop");
    void this.feedback.offsetWidth; // reflow
    this.feedback.classList.add("pop");
  }

  addHistoryChip(guess, direction) {
    const chip = document.createElement("div");
    chip.className = `history-chip ${direction === "high" ? "chip-high" : "chip-low"}`;
    chip.innerHTML = `${guess} ${direction === "high" ? "↓" : "↑"}`;
    this.historyContainer.prepend(chip); // Add to front
  }

  handleWin() {
    this.playing = false;
    this.input.disabled = true;
    this.btn.textContent = "PLAY AGAIN";
    this.btn.style.backgroundColor = "var(--success)";

    this.updateFeedback(
      `🎉 Correct! The number was ${this.secret}.`,
      "rgba(16, 217, 129, 0.1)",
      "var(--success)",
    );
    ui.triggerConfetti();

    this.processProgression(true);
  }

  handleLoss() {
    // Not technically a loss since infinite guesses, but used if we implement survival later
  }

  processProgression(isWin) {
    db.gamesPlayed++;
    db.totalGuesses += this.attempts;

    if (isWin) {
      db.wins++;
      db.currentStreak++;
      if (db.currentStreak > db.bestStreak) db.bestStreak = db.currentStreak;
      if (this.attempts <= 5) db.flawlessWins++;

      // Award XP (Base 50 + bonus for fewer attempts)
      let xpGained = 50 + Math.max(0, (20 - this.attempts) * 5);
      db.xp += xpGained;
      ui.showToast(`+${xpGained} XP Gained!`, "success");

      this.checkLevelUp();
    } else {
      db.currentStreak = 0; // Broke streak
    }

    this.checkAchievements();
    saveDB();
    ui.renderDashboard(); // Refresh UI in background
    ui.renderStats();
  }

  checkLevelUp() {
    let nextXP = xpForNextLevel(db.level);
    let leveledUp = false;

    while (db.xp >= nextXP) {
      db.xp -= nextXP;
      db.level++;
      leveledUp = true;
      nextXP = xpForNextLevel(db.level);
    }

    if (leveledUp) {
      ui.showToast(`Level Up! You are now Level ${db.level}!`, "gold", "⭐");
      ui.triggerConfetti();
    }
  }

  checkAchievements() {
    const unlock = (id) => {
      if (!db.unlockedAchievements.includes(id)) {
        db.unlockedAchievements.push(id);
        const ach = achievementsData.find((a) => a.id === id);
        ui.showToast(`Achievement Unlocked: ${ach.title}`, "gold", "🏆");
      }
    };

    if (db.wins >= 1) unlock("first_win");
    if (db.currentStreak >= 3) unlock("streak_3");
    if (db.currentStreak >= 10) unlock("streak_10");
    if (this.attempts <= 5 && this.playing === false) unlock("flawless");
    if (this.attempts === 1 && this.playing === false) unlock("first_try");
    if (this.attempts >= 20) unlock("dedication");
    if (db.gamesPlayed >= 50) unlock("games_50");
    if (db.level >= 10) unlock("level_10");
  }

  handleGuess() {
    if (!this.playing) {
      this.resetUI();
      return;
    }

    const guess = Number(this.input.value);

    // Validation
    if (!guess || guess < 1 || guess > this.MAX) {
      this.input.classList.add("error-shake");
      setTimeout(() => this.input.classList.remove("error-shake"), 400);
      this.updateFeedback(
        `⚠️ Error: Must be between 1 and ${this.MAX}.`,
        "rgba(239, 68, 68, 0.1)",
        "var(--danger)",
      );
      this.input.value = "";
      return;
    }

    this.attempts++;
    this.attemptsText.textContent = this.attempts;

    if (guess === this.secret) {
      this.handleWin();
    } else {
      const dir = guess > this.secret ? "high" : "low";
      this.addHistoryChip(guess, dir);

      const msg = guess > this.secret ? "📉 Too High!" : "📈 Too Low!";
      const color = guess > this.secret ? "var(--danger)" : "var(--secondary)";

      this.updateFeedback(
        msg,
        `rgba(${guess > this.secret ? "239, 68, 68" : "56, 189, 248"}, 0.1)`,
        color,
      );

      this.input.value = "";
      this.input.focus();

      // Continual achievement check for things like 'dedication'
      if (this.attempts === 20) this.checkAchievements();
    }
  }
}

// Initialize Engine
const game = new GameEngine();
