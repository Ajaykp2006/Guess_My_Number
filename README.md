# Guessing Game OS

![Guessing Game OS Screenshot]<img width="1917" height="1082" alt="Screenshot 2026-07-23 034227" src="https://github.com/user-attachments/assets/de66c154-4d2b-4a61-8cdc-98ccea200df3" />


A sleek, modern web-based guessing game designed with an operating system (OS) style interface. Test your intuition by guessing the secret number while tracking your stats, leveling up, and unlocking achievements!

## 🚀 Features

* **Interactive Gameplay:** Guess a secret number between 1 and 100 with dynamic high/low feedback.
* **Dashboard & Progression:** Earn XP for every win, level up your profile, and climb the ranks from Novice to Grandmaster.
* **Detailed Statistics:** Track your total games, win rate, best streaks, and average guesses per win.
* **Achievement System:** Unlock badges for milestones like flawless wins, long streaks, and specific play styles.
* **Persistent Storage:** All your progress, stats, and settings are saved automatically in your browser using `localStorage`.
* **Customization:** Toggle between Light and Dark mode themes seamlessly.
* **Polished UI/UX:** Enjoy smooth transitions, toast notifications, responsive sidebars, and celebratory confetti animations.

## 🛠️ Tech Stack

* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom variables for theming, CSS Grid/Flexbox for layout, and smooth keyframe animations.
* **Vanilla JavaScript (ES6+):** Object-oriented game engine and UI state management without external JS frameworks.
* **Third-Party Libraries:** 
  * [Canvas Confetti](https://github.com/catdad/canvas-confetti) (via CDN) for win celebrations.
  * [Google Fonts](https://fonts.google.com/specimen/Nunito) (Nunito).

## 📂 File Structure

* `index.html` - The main entry point containing the UI layout and SVG icons.
* `style.css` - Stylesheets containing themes, layout rules, and animations.
* `script.js` - The logic for the UI manager, game engine, and local storage state.
* `screenshot.png` - (Add a screenshot of your game UI with this name to the directory).

## 🎮 How to Run

1. Clone or download this repository to your local machine.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same directory.
3. Simply double-click the `index.html` file to open it in your default web browser. No local server or build tools are required!

## ⚙️ Settings & Data Management

You can customize your experience or completely wipe your progress by navigating to the **Settings** tab in the sidebar. 
* **Toggle Theme:** Switches the UI between light and dark modes.
* **Hard Reset:** Permanently deletes all saved progress, XP, and achievements from your browser.
