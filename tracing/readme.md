🖊️ Kids Line Tracer — Phaser Game

A fun, interactive line tracing game built with **Phaser 4** for young children (ages 3–8). Kids trace glowing paths using their finger or mouse, building fine motor skills through play.

---

## What the Game Does

Children see a glowing path on screen and must trace along it from start to finish. The closer they follow the line, the more stars they earn. Wrong turns and going off the path give gentle feedback to try again — no scary "fail" screens, just encouragement.

**Skills it builds:**

- Hand-eye coordination
- Fine motor control
- Shape and pattern recognition
- Focus and patience

---

## Project Structure

```
linetracing/
├── public/
│   └── assets/
│       ├── background.png
│       ├── cc-logo.png
│       ├── coin.json
│       ├── coin.png
│       └── preloader.png
├── src/
│   └── scenes/
│       ├── Boot.js          — first scene, loads minimal assets
│       ├── Preloader.js     — loading screen with progress bar
│       ├── MainMenu.js      — title screen with Play button
│       ├── ClickerGame.js   — main tracing gameplay
│       └── GameOver.js      — results screen with stars
├── main.js                  — Phaser config, scene list, canvas setup
├── index.html
├── package.json
└── README.md
```

---

## Prerequisites

Make sure you have these installed before you start:

| Tool | Version | Download |
| --- | --- | --- |
| Node.js | 18 or later | https://nodejs.org |
| npm | comes with Node | —   |
| A code editor | VS Code recommended | https://code.visualstudio.com |

Check your versions in a terminal:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone or download the project

```bash
git clone https://github.com/your-username/linetracing.git
cd linetracing
```

Or unzip the downloaded folder and open a terminal inside it.

### 2. Install dependencies

```bash
npm install
```

This installs Phaser and Vite (the dev server). It only needs to run once.

### 3. Start the development server

```bash
npm run dev
```

Open your browser at **http://localhost:5173** — the game loads immediately.

Any file you save auto-refreshes the browser. No manual reload needed.

### 4. Build for production

```bash
npm run build
```

Output goes into the `dist/` folder. Upload those files to any static web host (GitHub Pages, Netlify, Vercel) to share the game.

---

## How the Game Works

### Scene flow

```
Boot → Preloader → MainMenu → ClickerGame → GameOver → MainMenu
```

Each scene is a separate file in `src/scenes/`. They hand off to each other using:

```js
this.scene.start('GameOver', { stars: 3, score: 250 });
```

### Tracing mechanic (ClickerGame.js)

The path is defined as a series of points. The game:

1. Draws the glowing guide path on a `Graphics` object
2. Listens for pointer/touch input
3. Checks if the player's position is close enough to the path
4. Accumulates accuracy to calculate a 1–3 star score

```js
// Define a path
const path = new Phaser.Curves.Path(100, 300);
path.lineTo(700, 300);          // straight line
path.cubicBezierTo(...)         // smooth curve
```

### Star rating

| Accuracy | Stars |
| --- | --- |
| 85% or above | ⭐⭐⭐ |
| 60–84% | ⭐⭐  |
| Below 60% | ⭐   |

Stars are shown on the GameOver scene. The child always gets at least 1 star — no zero-star outcomes.

### Levels

Levels are defined as an array in `ClickerGame.js`. To add a new level, add an entry:

```js
const LEVELS = [
  { name: 'Straight Line', color: 0x4f8ef7, path: straightPath },
  { name: 'Gentle Curve',  color: 0xa78bfa, path: curvePath   },
  { name: 'Zigzag',        color: 0xf59e0b, path: zigzagPath  },
  // add yours here
];
```

---

## Adding New Paths

Create a function that returns a `Phaser.Curves.Path`:

```js
function myNewPath(scene) {
  const path = new Phaser.Curves.Path(80, 400);
  path.cubicBezierTo(400, 100, 200, 50, 600, 150);
  path.lineTo(720, 400);
  return path;
}
```

Then add it to the `LEVELS` array. That's it — the rest of the game handles drawing, tracing detection, and scoring automatically.

---

## Touch Screen Support

The game works on tablets and phones out of the box. Phaser's input system handles both mouse and touch. For best results on iPads:

- Use `width: 1024, height: 768` in `main.js` (already set)
- Set `scale.mode` to `Phaser.Scale.FIT` (already set)
- Test on Safari iOS — it handles canvas touch events slightly differently than Chrome

---

## Customising for Kids

### Change path colours

Each level has a `color` property (hex number). Use bright, friendly colours:

```js
{ color: 0xff6b6b }  // coral red
{ color: 0x51cf66 }  // mint green
{ color: 0xffd43b }  // sunny yellow
```

### Change background

Replace `public/assets/background.png` with any image. Recommended size: **1024 × 768 px**.

### Adjust difficulty (tolerance zone)

The `tolerance` value controls how far off the path a child can go before failing. Increase it to make the game easier for younger children:

```js
const TOLERANCE = 40;  // larger = easier (default is 28–32)
```

### Sound effects

Add audio in `Preloader.js`:

```js
this.load.audio('success', 'assets/sounds/success.mp3');
this.load.audio('fail',    'assets/sounds/fail.mp3');
```

Play them in `ClickerGame.js`:

```js
this.sound.play('success');
```

---

## Common Problems

**Game doesn't open in the browser**
Make sure `npm run dev` is running and there are no errors in the terminal. Try a different browser if the page is blank.

**Tracing feels too strict**
Increase `TOLERANCE` in `ClickerGame.js`. Values between 30 and 50 work well for young children.

**Assets not loading**
All image and audio files must be inside the `public/` folder. Phaser loads them relative to that folder, not `src/`.

**Touch doesn't work on iPad**
Check that `parent: 'game-container'` is set in `main.js` and the container div exists in `index.html`.

**White screen after build**
Open `dist/index.html` via a local server, not directly as a file. Use `npx serve dist` or deploy to a host.

---

## Scripts Reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Tech Stack

- **[Phaser 4](https://phaser.io)** — game framework
- **[Vite](https://vitejs.dev)** — fast dev server and bundler
- **Vanilla JavaScript** — no extra frameworks needed

---