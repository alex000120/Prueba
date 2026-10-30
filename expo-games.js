(function () {
  const panel = document.getElementById('expoGame');
  const stage = document.getElementById('gameStage');
  const closeBtn = document.getElementById('closeGame');
  const pills = document.querySelectorAll('.game-pill');
  const sceneButtons = document.querySelectorAll('.scene-btn');

  if (!panel || !stage) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  let mode = 'pulse';
  let particles = [];
  let pointer = { x: 0, y: 0, active: false };
  let rafId = null;
  let pulseBeat = 0;

  function setMode(nextMode) {
    mode = nextMode;
    pills.forEach((pill) => pill.classList.toggle('active', pill.dataset.mode === nextMode));

    const labelMap = {
      pulse: 'Pulsar · energía gestual',
      arena: 'Arena · reacción rápida',
      luz: 'Luz · creatividad en movimiento'
    };

    const title = document.querySelector('.game-header h2');
    if (title) title.textContent = labelMap[nextMode] || 'Estación de energía gestual';
  }

  function addParticle() {
    const rect = stage.getBoundingClientRect();
    const size = rand(8, 18);
    particles.push({
      x: rand(0, rect.width),
      y: rand(0, rect.height),
      vx: rand(-0.9, 0.9),
      vy: rand(-0.9, 0.9),
      radius: size,
      color: ['#6bffb2', '#38f3ff', '#9f7bff', '#ff5fbf'][Math.floor(Math.random() * 4)],
      alpha: rand(0.4, 1),
      phase: rand(0, Math.PI * 2),
      glow: rand(8, 20)
    });

    if (particles.length > 42) particles.shift();
  }

  function drawParticle(particle, el) {
    const size = particle.radius * (1 + Math.sin(pulseBeat + particle.phase) * 0.12);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = particle.x + 'px';
    el.style.top = particle.y + 'px';
    el.style.color = particle.color;
    el.style.opacity = particle.alpha;
    el.style.boxShadow = `0 0 ${particle.glow}px ${particle.color}`;
    el.style.background = `radial-gradient(circle, rgba(255,255,255,0.95), ${particle.color} 35%, rgba(255,255,255,0.15) 100%)`;
  }

  function updatePulse(delta) {
    const rect = stage.getBoundingClientRect();
    const orb = document.createElement('div');
    orb.className = 'game-orb';
    orb.style.left = rect.width * 0.5 + 'px';
    orb.style.top = rect.height * 0.5 + 'px';
    orb.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(pulseBeat * 1.8) * 0.12})`;
    stage.querySelector('.game-orb')?.remove();
    stage.appendChild(orb);

    if (pointer.active) {
      particles.forEach((p) => {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 160) {
          p.vx += (dx / dist) * 0.12;
          p.vy += (dy / dist) * 0.12;
        }
      });
    }

    particles.forEach((p) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vx *= 0.995;
      p.vy *= 0.995;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const d = Math.hypot(dx, dy) || 1;
      const pull = 0.03;
      p.vx -= (dx / d) * pull * 8;
      p.vy -= (dy / d) * pull * 8;

      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;
      p.x = clamp(p.x, 0, rect.width);
      p.y = clamp(p.y, 0, rect.height);
    });
  }

  function updateArena(delta) {
    const rect = stage.getBoundingClientRect();
    stage.querySelector('.game-orb')?.remove();

    particles.forEach((p) => {
      p.x += p.vx * delta * 1.6;
      p.y += p.vy * delta * 1.6;

      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;

      p.x = clamp(p.x, 0, rect.width);
      p.y = clamp(p.y, 0, rect.height);

      if (pointer.active) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 120) {
          p.vx += (dx / dist) * 0.14;
          p.vy += (dy / dist) * 0.14;
        }
      }
    });
  }

  function updateLuz(delta) {
    const rect = stage.getBoundingClientRect();
    const orb = document.createElement('div');
    orb.className = 'game-orb';
    orb.style.left = pointer.active ? pointer.x + 'px' : rect.width * 0.5 + 'px';
    orb.style.top = pointer.active ? pointer.y + 'px' : rect.height * 0.5 + 'px';
    orb.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(pulseBeat) * 0.18})`;
    stage.querySelector('.game-orb')?.remove();
    stage.appendChild(orb);

    particles.forEach((p) => {
      const dx = pointer.active ? pointer.x - p.x : rect.width / 2 - p.x;
      const dy = pointer.active ? pointer.y - p.y : rect.height / 2 - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 220) {
        p.vx += (dx / dist) * 0.18;
        p.vy += (dy / dist) * 0.18;
      }
      p.x += p.vx * delta * 0.9;
      p.y += p.vy * delta * 0.9;
      p.vx *= 0.985;
      p.vy *= 0.985;
    });
  }

  function render() {
    const existing = [...stage.querySelectorAll('.game-particle')];
    const needed = Math.max(18, particles.length);

    while (existing.length < needed) {
      const el = document.createElement('div');
      el.className = 'game-particle';
      stage.appendChild(el);
      existing.push(el);
    }

    while (existing.length > needed) {
      const old = existing.pop();
      old.remove();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      drawParticle(p, existing[i]);
    }
  }

  function tick() {
    const now = performance.now();
    pulseBeat = now * 0.006;
    const delta = 1;

    if (mode === 'pulse') updatePulse(delta);
    if (mode === 'arena') updateArena(delta);
    if (mode === 'luz') updateLuz(delta);

    render();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    stage.innerHTML = '';
    particles = [];
    for (let i = 0; i < 30; i++) addParticle();
    render();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function openGame(nextMode = mode) {
    panel.classList.remove('hidden');
    setMode(nextMode);
    start();
  }

  function closeGame() {
    panel.classList.add('hidden');
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.active = true;
    pointer.x = clamp(event.clientX - rect.left, 0, rect.width);
    pointer.y = clamp(event.clientY - rect.top, 0, rect.height);
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    pointer.active = false;
  }, { passive: true });

  stage.addEventListener('pointerdown', (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.active = true;
    pointer.x = clamp(event.clientX - rect.left, 0, rect.width);
    pointer.y = clamp(event.clientY - rect.top, 0, rect.height);
    for (let i = 0; i < 10; i++) addParticle();
  });

  closeBtn.addEventListener('click', closeGame);

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setMode(pill.dataset.mode);
      if (!panel.classList.contains('hidden')) start();
    });
  });

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.scene === 'game') {
        openGame(mode);
      } else {
        setMode(button.dataset.scene);
        openGame(button.dataset.scene);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGame();
    if (event.key === '1') { setMode('pulse'); openGame('pulse'); }
    if (event.key === '2') { setMode('arena'); openGame('arena'); }
    if (event.key === '3') { setMode('luz'); openGame('luz'); }
  });

  setMode(mode);
  start();
  openGame('pulse');
})();
