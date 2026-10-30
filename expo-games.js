(function () {
  const panel = document.getElementById('expoGame');
  const stage = document.getElementById('gameStage');
  const closeBtn = document.getElementById('closeGame');
  const pills = Array.from(document.querySelectorAll('.game-pill'));
  const sceneButtons = Array.from(document.querySelectorAll('.scene-btn'));

  if (!panel || !stage) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  const state = {
    mode: 'pulse',
    particles: [],
    pointer: { x: 0, y: 0, active: false },
    rafId: null,
    beat: 0,
    frame: 0,
    open: false
  };

  function setMode(nextMode) {
    state.mode = nextMode;
    pills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.mode === nextMode);
    });

    const labelMap = {
      pulse: 'Pulsar · energía gestual',
      arena: 'Arena · reacción rápida',
      luz: 'Luz · creatividad en movimiento'
    };

    const title = document.querySelector('.game-header h2');
    if (title) title.textContent = labelMap[nextMode] || 'Estación de energía gestual';
  }

  function createParticle() {
    const rect = stage.getBoundingClientRect();
    const radius = rand(8, 24);
    const angle = rand(0, Math.PI * 2);
    const speed = rand(0.3, 1.5);
    return {
      x: rand(0, rect.width || 600),
      y: rand(0, rect.height || 400),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      color: ['#6bffb2', '#38f3ff', '#9f7bff', '#ff5fbf', '#ffd76a'][Math.floor(Math.random() * 5)],
      phase: rand(0, Math.PI * 2),
      glow: rand(10, 28),
      alpha: rand(0.45, 1)
    };
  }

  function seedParticles() {
    state.particles = [];
    for (let i = 0; i < 32; i++) {
      state.particles.push(createParticle());
    }
  }

  function createOrb() {
    const orb = document.createElement('div');
    orb.className = 'game-orb';
    return orb;
  }

  function spawnBurst(x, y, count = 10) {
    const rect = stage.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.x = clamp(x + rand(-24, 24), 0, rect.width || 600);
      p.y = clamp(y + rand(-24, 24), 0, rect.height || 400);
      p.vx *= rand(2.1, 4.2);
      p.vy *= rand(2.1, 4.2);
      state.particles.push(p);
    }
    if (state.particles.length > 80) {
      state.particles.splice(0, state.particles.length - 80);
    }
  }

  function updateParticles() {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (const p of state.particles) {
      if (state.mode === 'pulse') {
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;

        if (state.pointer.active) {
          const tx = state.pointer.x - p.x;
          const ty = state.pointer.y - p.y;
          const d = Math.hypot(tx, ty) || 1;
          if (d < 170) {
            p.vx += (tx / d) * 0.26;
            p.vy += (ty / d) * 0.26;
          }
        }
      }

      if (state.mode === 'arena') {
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const swirl = 0.42;
        p.vx += (-dy / dist) * swirl + (dx / dist) * 0.06;
        p.vy += (dx / dist) * swirl + (dy / dist) * 0.06;

        if (state.pointer.active) {
          const tx = state.pointer.x - p.x;
          const ty = state.pointer.y - p.y;
          const d = Math.hypot(tx, ty) || 1;
          if (d < 150) {
            p.vx += (tx / d) * 0.32;
            p.vy += (ty / d) * 0.32;
          }
        }
      }

      if (state.mode === 'luz') {
        const targetX = state.pointer.active ? state.pointer.x : centerX;
        const targetY = state.pointer.active ? state.pointer.y : centerY;
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 230) {
          p.vx += (dx / dist) * 0.12;
          p.vy += (dy / dist) * 0.12;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;

      if (p.x < 0 || p.x > rect.width) p.vx *= -0.9;
      if (p.y < 0 || p.y > rect.height) p.vy *= -0.9;
      p.x = clamp(p.x, 0, rect.width);
      p.y = clamp(p.y, 0, rect.height);
    }
  }

  function renderParticles() {
    const existing = Array.from(stage.querySelectorAll('.game-particle'));
    const needed = Math.max(24, state.particles.length);

    while (existing.length < needed) {
      const el = document.createElement('div');
      el.className = 'game-particle';
      stage.appendChild(el);
      existing.push(el);
    }

    while (existing.length > needed) {
      const last = existing.pop();
      if (last) last.remove();
    }

    for (let i = 0; i < state.particles.length; i++) {
      const p = state.particles[i];
      const el = existing[i];
      const size = p.radius * (1 + Math.sin(state.beat + p.phase) * 0.16);
      el.style.left = `${p.x}px`;
      el.style.top = `${p.y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = String(p.alpha);
      el.style.background = `radial-gradient(circle, rgba(255,255,255,0.95), ${p.color} 32%, rgba(255,255,255,0.08) 100%)`;
      el.style.boxShadow = `0 0 ${p.glow}px ${p.color}`;
      el.style.borderRadius = '50%';
      el.style.transform = 'translate(-50%, -50%)';
    }
  }

  function renderOrb() {
    const existing = stage.querySelector('.game-orb');
    const orb = existing || createOrb();
    const rect = stage.getBoundingClientRect();
    const targetX = state.pointer.active ? state.pointer.x : rect.width / 2;
    const targetY = state.pointer.active ? state.pointer.y : rect.height / 2;
    orb.style.left = `${targetX}px`;
    orb.style.top = `${targetY}px`;
    orb.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(state.beat * 2.2) * 0.2})`;
    orb.style.opacity = state.mode === 'luz' ? '1' : '0.58';
    if (!existing) stage.appendChild(orb);
  }

  function tick() {
    if (!state.open) return;

    state.frame += 1;
    state.beat += 0.08;

    updateParticles();
    renderParticles();
    renderOrb();

    state.rafId = requestAnimationFrame(tick);
  }

  function openGame(nextMode = state.mode) {
    setMode(nextMode);
    state.open = true;
    panel.classList.remove('hidden');
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(tick);
    }
  }

  function closeGame() {
    state.open = false;
    panel.classList.add('hidden');
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.scene;
      if (next === 'game') {
        openGame(state.mode);
      } else {
        openGame(next);
      }
    });
  });

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      openGame(pill.dataset.mode);
    });
  });

  closeBtn.addEventListener('click', closeGame);

  stage.addEventListener('pointerdown', (event) => {
    const rect = stage.getBoundingClientRect();
    state.pointer.active = true;
    state.pointer.x = clamp(event.clientX - rect.left, 0, rect.width);
    state.pointer.y = clamp(event.clientY - rect.top, 0, rect.height);
    spawnBurst(state.pointer.x, state.pointer.y, 16);
  });

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    state.pointer.active = true;
    state.pointer.x = clamp(event.clientX - rect.left, 0, rect.width);
    state.pointer.y = clamp(event.clientY - rect.top, 0, rect.height);
  }, { passive: true });

  stage.addEventListener('pointerleave', () => {
    state.pointer.active = false;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGame();
    if (event.key === '1') openGame('pulse');
    if (event.key === '2') openGame('arena');
    if (event.key === '3') openGame('luz');
  });

  seedParticles();
  setMode(state.mode);
  openGame('pulse');
})();
