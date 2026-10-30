:root {
  --bg-0: #020814;
  --bg-1: #071827;
  --bg-2: #0a2036;
  --cyan: #38f3ff;
  --green: #6bffb2;
  --violet: #9f7bff;
  --pink: #ff5fbf;
  --amber: #ffd76a;
  --panel: rgba(10, 18, 30, 0.66);
  --panel-strong: rgba(12, 22, 35, 0.9);
  --line: rgba(99, 230, 255, 0.38);
  --text: #ebf8ff;
  --muted: #9bc0d7;
}

body {
  background:
    radial-gradient(circle at 18% 20%, rgba(87, 201, 255, 0.18), transparent 25%),
    radial-gradient(circle at 80% 15%, rgba(155, 123, 255, 0.18), transparent 30%),
    radial-gradient(circle at 50% 85%, rgba(39, 255, 164, 0.12), transparent 35%),
    var(--bg-0);
}

.sci-fi-backdrop {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.sci-fi-backdrop .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(28px);
  opacity: 0.5;
  animation: drift 16s ease-in-out infinite alternate;
}

.sci-fi-backdrop .orb-a {
  width: 42vmax;
  height: 42vmax;
  left: -8vmax;
  top: -12vmax;
  background: radial-gradient(circle, rgba(56,243,255,0.45), transparent 60%);
}

.sci-fi-backdrop .orb-b {
  width: 52vmax;
  height: 52vmax;
  right: -10vmax;
  bottom: -16vmax;
  background: radial-gradient(circle, rgba(159,123,255,0.38), transparent 62%);
  animation-delay: 2s;
}

.sci-fi-backdrop .grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(120, 203, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 203, 255, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  transform: perspective(700px) rotateX(60deg) scale(1.5);
  transform-origin: center center;
  opacity: 0.6;
}

.sci-fi-backdrop .scan-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255,255,255,0.025),
    rgba(255,255,255,0.025) 1px,
    transparent 1px,
    transparent 4px
  );
  opacity: 0.7;
}

@keyframes drift {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(2vmax, -3vmax, 0) scale(1.12); }
}

#app {
  position: relative;
  z-index: 1;
  isolation: isolate;
}

#videoStage {
  border: 1px solid rgba(113, 199, 255, 0.32);
  box-shadow:
    0 0 0 1px rgba(103, 214, 255, 0.1),
    0 0 28px rgba(58, 241, 255, 0.15),
    inset 0 0 54px rgba(11, 17, 31, 0.8);
  background: linear-gradient(180deg, rgba(3, 9, 20, 0.86), rgba(2, 6, 14, 0.96));
  backdrop-filter: blur(6px);
}

#videoStage::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(103, 214, 255, 0.12);
  border-radius: 12px;
  pointer-events: none;
  z-index: 7;
}

#mensajeVideo {
  background: rgba(3, 8, 18, 0.52);
  border: 1px solid rgba(103, 214, 255, 0.16);
  backdrop-filter: blur(5px);
}

#welcome {
  background: rgba(4, 8, 16, 0.82);
  border: 1px solid rgba(113, 199, 255, 0.18);
  box-shadow: inset 0 0 30px rgba(52, 219, 255, 0.08);
}

#welcome h1 {
  letter-spacing: 0.04em;
  text-shadow: 0 0 24px rgba(80, 255, 196, 0.35);
}

.gestos-grid > div {
  background: linear-gradient(180deg, rgba(13, 23, 34, 0.82), rgba(5, 12, 19, 0.9));
  border: 1px solid rgba(103, 214, 255, 0.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 18px rgba(0,0,0,0.18);
  transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
}

.gestos-grid > div:hover,
.gestos-grid > div:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(99, 230, 255, 0.5);
  box-shadow: 0 0 16px rgba(56, 243, 255, 0.16);
}

.gestos-grid > div.juego {
  border-color: rgba(255, 95, 191, 0.34);
}

.chip {
  background: rgba(7, 18, 28, 0.72);
  border: 1px solid rgba(103, 214, 255, 0.25);
  box-shadow: inset 0 0 12px rgba(56, 243, 255, 0.06);
  backdrop-filter: blur(5px);
}

#progreso {
  background: rgba(7, 18, 28, 0.8);
  border: 1px solid rgba(113, 199, 255, 0.25);
  box-shadow: 0 0 18px rgba(56, 243, 255, 0.12);
}

#camPiP {
  border: 1px solid rgba(103, 214, 255, 0.38);
  box-shadow: 0 0 20px rgba(56, 243, 255, 0.18), 0 10px 28px rgba(0,0,0,0.45);
  background: rgba(3, 8, 16, 0.92);
}

#camPiP::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(56,243,255,0.12), rgba(159,123,255,0.06), transparent 60%);
  pointer-events: none;
  z-index: 3;
}

.btn-flotante,
#welcome button,
#inicio button,
#rendimiento button,
#config button,
#juegoUI button {
  border: 1px solid rgba(103, 214, 255, 0.25);
  background: linear-gradient(180deg, rgba(11, 19, 36, 0.96), rgba(7, 13, 22, 0.96));
  box-shadow: 0 0 14px rgba(56, 243, 255, 0.08);
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
}

.btn-flotante:hover,
#welcome button:hover,
#inicio button:hover,
#rendimiento button:hover,
#config button:hover,
#juegoUI button:hover {
  transform: translateY(-1px) scale(1.01);
  border-color: rgba(103, 214, 255, 0.5);
  box-shadow: 0 0 18px rgba(56, 243, 255, 0.18);
}

body.low-power .sci-fi-backdrop .orb,
body.low-power .sci-fi-backdrop .grid,
body.low-power .sci-fi-backdrop .scan-lines {
  opacity: 0.25;
}

body.low-power #videoStage,
body.low-power #camPiP,
body.low-power #welcome,
body.low-power #progreso,
body.low-power .chip {
  box-shadow: none;
}

body.low-power .gestos-grid > div,
body.low-power .btn-flotante,
body.low-power #welcome button,
body.low-power #inicio button,
body.low-power #rendimiento button,
body.low-power #config button,
body.low-power #juegoUI button {
  transition: none;
}

@media (max-width: 560px) {
  #welcome {
    padding: 18px 12px 24px;
  }

  .gestos-grid {
    gap: 6px;
  }

  .gestos-grid > div {
    padding: 8px 7px;
  }

  .chip {
    padding-inline: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
