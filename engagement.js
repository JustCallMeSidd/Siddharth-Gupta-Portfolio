/* ============================================================
   ENGAGEMENT & ANIMATION RUNTIME — SIDDHARTH GUPTA
   Zero external dependencies. Pure vanilla ES6+.
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // AUDIO SYNTHESIZER (Pure Web Audio API — Zero downloads)
  // ----------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = false;

  try {
    soundEnabled = localStorage.getItem('sound_enabled') === 'true';
  } catch (e) {}

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynth(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playSignalChime() {
    if (!soundEnabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => playSynth(freq, 'triangle', 0.15, 0.04), idx * 70);
    });
  }

  // ----------------------------------------------------------
  // B. SIGNALS DISCOVERY SYSTEM (12 Hidden Discoveries)
  // ----------------------------------------------------------
  const SIGNALS_CATALOG = [
    { id: 1, name: 'Quantum Origin', loc: 'Navbar', hint: 'Click the glowing dot in Siddharth.', text: 'The logo focal dot pulses with origin frequency.' },
    { id: 2, name: 'Syntactic Core', loc: 'Hero Typing', hint: 'Click the blinking terminal cursor in the role text.', text: 'The terminal cursor revealed an unspoken title.' },
    { id: 3, name: 'Neural Shockwave', loc: 'Hero Canvas', hint: 'Click anywhere on the ambient hero particle void.', text: 'Kinetic shockwave dispersed through the network.' },
    { id: 4, name: 'The Pathfinder', loc: 'Hero CTA', hint: 'Declare your path (Recruiter / Collaborator / Curious).', text: 'Persona mapped. Portfolio reorganized for your intent.' },
    { id: 5, name: 'TumorNet Diagnostic', loc: 'Lab Demos', hint: 'Drag the TumorNet segmentation slider past 50%.', text: '95.2% CNN segmentation boundary confirmed.' },
    { id: 6, name: 'Style Alchemist', loc: 'Lab Demos', hint: 'Draw a stroke and transform style in the sketch pad.', text: 'Neural style synthesis rendered from raw pixels.' },
    { id: 7, name: 'Seismic Telemetry', loc: 'Dashboards', hint: 'Hover or peek into the Seismic Risk dashboard preview.', text: 'USGS global seismic telemetry synchronized.' },
    { id: 8, name: 'Constellation Star', loc: 'Skills', hint: 'Click the anomalous star beside the Skills title.', text: 'Hidden constellation star anchored to skill matrix.' },
    { id: 9, name: 'Chrono Archive', loc: 'Timeline', hint: 'Click the B.Tech provisional credential or timeline year.', text: 'Bennett University academic milestone verified.' },
    { id: 10, name: 'Terminal Architect', loc: 'Global Terminal', hint: 'Summon terminal with [~] and run any command.', text: 'Command line kernel initialized.' },
    { id: 11, name: 'Konami Protocol', loc: 'Global Keys', hint: 'Enter the retro code: ↑ ↑ ↓ ↓ ← → ← → B A.', text: 'Lab Mode active! Grid coordinates & telemetry exposed.' },
    { id: 12, name: 'Direct Frequency', loc: 'Contact', hint: 'Copy Siddharth’s email address directly.', text: 'Communication frequency locked. Ready to connect.' }
  ];

  let discoveredSignals = [];
  try {
    const saved = localStorage.getItem('sidd_signals');
    if (saved) discoveredSignals = JSON.parse(saved);
  } catch (e) {}

  function updateSignalsHUD() {
    const countEl = document.getElementById('signals-count');
    const ringEl = document.getElementById('signals-ring-val');
    const count = discoveredSignals.length;
    if (countEl) countEl.textContent = `${count}/12`;
    if (ringEl) {
      const circ = 2 * Math.PI * 14; // r=14 -> ~88
      const offset = circ - (count / 12) * circ;
      ringEl.style.strokeDashoffset = offset;
    }

    const hud = document.getElementById('signals-hud');
    if (hud) {
      hud.setAttribute('title', `${count} of 12 Signals Discovered — Click to inspect`);
    }

    const rewardBtn = document.getElementById('behind-build-unlock-btn');
    if (rewardBtn) {
      if (count >= 12) {
        rewardBtn.style.display = 'block';
      } else {
        rewardBtn.style.display = 'none';
      }
    }
  }

  function discoverSignal(id) {
    if (discoveredSignals.includes(id)) return;
    discoveredSignals.push(id);
    try {
      localStorage.setItem('sidd_signals', JSON.stringify(discoveredSignals));
    } catch (e) {}

    const sig = SIGNALS_CATALOG.find(s => s.id === id);
    if (!sig) return;

    playSignalChime();

    const hud = document.getElementById('signals-hud');
    if (hud) {
      hud.classList.add('pulse');
      setTimeout(() => hud.classList.remove('pulse'), 600);
    }

    updateSignalsHUD();

    // Trigger toast notification
    if (typeof window.showToast === 'function') {
      window.showToast(`📡 Signal ${id}/12: ${sig.name} — ${sig.text}`);
    }

    if (discoveredSignals.length === 12) {
      setTimeout(() => {
        if (typeof window.showToast === 'function') {
          window.showToast(`🎉 All 12 Signals Found! "Behind the Build" unlocked in Radar.`);
        }
      }, 1500);
    }
  }

  // ----------------------------------------------------------
  // A. CHOOSE YOUR PATH (Recruiter / Collaborator / Curious)
  // ----------------------------------------------------------
  const PATH_CONTENT = {
    recruiter: {
      subline: "Tailored for hiring teams & BI leaders: 3NF relational schemas, 517K+ flight record modeling, automated pipelines, and interactive executive Power BI/Tableau dashboards.",
      focus: "Dashboards, SQL/Python analytics, Resume, and Quick Highlights."
    },
    collaborator: {
      subline: "Tailored for fellow engineers & AI researchers: Full-stack GANs, RAG chatbots, Electron desktop apps, and IEEE-published neural tensor research.",
      focus: "Projects universe, Vibe-coded tools, GitHub, and research publications."
    },
    curious: {
      subline: "Data & Business Analyst with hands-on experience turning large, messy datasets (500K+ records) into decision-ready dashboards and reports using SQL, Python, and Power BI/Tableau.",
      focus: "Full cinematic experience exploring all projects, demos, and signals."
    }
  };

  function applyPersona(persona, save = true) {
    const config = PATH_CONTENT[persona] || PATH_CONTENT.curious;
    document.body.setAttribute('data-persona', persona);

    const descEl = document.querySelector('.hero-content p:not(.greeting)');
    if (descEl) {
      descEl.textContent = config.subline;
    }

    document.querySelectorAll('.path-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-path') === persona);
    });

    if (save) {
      try {
        localStorage.setItem('sidd_persona', persona);
      } catch (e) {}
    }

    discoverSignal(4); // Signal 04: The Pathfinder
    if (typeof window.showToast === 'function') {
      window.showToast(`🧭 Persona set: ${persona.toUpperCase()} — Emphasis updated`);
    }
  }

  // ----------------------------------------------------------
  // C. "ASK SIDDHARTH'S PORTFOLIO" (Client-Side Search Palette)
  // ----------------------------------------------------------
  const KNOWLEDGE_BASE = [
    {
      keywords: ['best project', 'top project', 'highlight', 'featured'],
      answer: "Siddharth's headline projects include: (1) Airline Flight Delay & Operations Risk (3NF PostgreSQL, 517K+ records, Power BI), (2) Tumor X (CNN brain MRI classification with 95% accuracy), and (3) Infosys Equity Research (14-sheet institutional model & DCF).",
      target: '#projects'
    },
    {
      keywords: ['sql', 'database', 'postgres', 'postgresql', 'mysql', 'queries', 'schema'],
      answer: "Extensive SQL proficiency across PostgreSQL & MySQL: designed 3NF schemas, queried 517K+ flight rows, structured multi-table joins, window functions, and performed database modeling for Capstone business scenarios.",
      target: '#skills'
    },
    {
      keywords: ['dashboard', 'dashboards', 'power bi', 'tableau', 'powerbi', 'visualization', 'bi'],
      answer: "Siddharth has designed interactive live dashboards including the India EV Transition Intelligence, Global Seismic Earthquake Risk, and Airline Delay & Operations Risk. Check out the Interactive Dashboards section to open live deployments.",
      target: '#dashboards'
    },
    {
      keywords: ['resume', 'cv', 'hire', 'pdf', 'download resume'],
      answer: "Siddharth's latest resume is available for viewing and direct download via Google Drive. Click 'View Resume' to open it immediately.",
      target: '#hero',
      actionUrl: 'https://drive.google.com/file/d/1eFMfCdBcfc_VusScIMsm_FOXJkPUBycH/view?usp=sharing',
      actionText: 'Open Resume PDF ↗'
    },
    {
      keywords: ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'call'],
      answer: "You can reach Siddharth at justcallmesidd@gmail.com or +91 8318983400. You can also connect via LinkedIn (/in/justcallmesidd/) or explore his code on GitHub (/JustCallMeSidd).",
      target: '#contact'
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'cgpa', 'bennett'],
      answer: "B.Tech in Computer Science & Engineering with AI & ML Specialization from Bennett University (2022–2026), CGPA 8.48/10. View his provisional certificate in the Education section.",
      target: '#education'
    },
    {
      keywords: ['experience', 'internship', 'apponix', 'work'],
      answer: "Data Analytics Intern at Apponix Academy (Feb–Jun 2026): analyzed multi-table business schemas in PostgreSQL, built drill-down Power BI/Tableau dashboards, and prepared executive presentations.",
      target: '#experience'
    },
    {
      keywords: ['vibe', 'vibe code', 'invoicewise', 'vellum', 'desktop'],
      answer: "Siddharth vibe-coded two standalone Windows desktop applications: InvoiceWise 3.1.0 (an enterprise chemical/pharma ERP) and Vellum (a private AI desktop client routing 600+ models via OpenRouter).",
      target: '#projects'
    },
    {
      keywords: ['research', 'ieee', 'paper', 'publication', 'blood'],
      answer: "Published research at IEEE CISES 2025: 'Integrating Deep Learning Concepts with Blood Diagnosis', proposing a framework converting tabular blood metrics into image-like tensors for CNN diagnosis.",
      target: '#achievements'
    },
    {
      keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'nlp', 'langchain', 'rag'],
      answer: "Proficient in TensorFlow, PyTorch, LangChain, HuggingFace, OpenCV, and Scikit-Learn. Built RAG chatbots, GAN sketch converters, and computer vision segmentation pipelines.",
      target: '#skills'
    }
  ];

  function queryPortfolio(input) {
    const q = input.toLowerCase().trim();
    if (!q) return null;

    let bestMatch = null;
    let maxScore = 0;

    KNOWLEDGE_BASE.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        if (q === kw) score += 10;
        else if (q.includes(kw)) score += 5;
        else {
          const words = kw.split(' ');
          words.forEach(w => {
            if (q.includes(w) && w.length > 2) score += 2;
          });
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (maxScore > 0) return bestMatch;
    return {
      answer: "I couldn't find an exact match for that query. Try asking about: 'SQL experience', 'best project', 'show dashboards', 'resume', 'contact', 'vibe-coded apps', or 'education'.",
      target: '#about'
    };
  }

  // ----------------------------------------------------------
  // D. PLAYFUL LIVE DEMOS
  // ----------------------------------------------------------

  // 1. Mini TumorNet Simulator Canvas
  function initTumorNetDemo() {
    const canvas = document.getElementById('tumornet-demo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('tumornet-slider');
    const readout = document.getElementById('tumornet-readout');

    function renderScan(progress = 0) {
      const w = canvas.width = canvas.parentElement.offsetWidth || 300;
      const h = canvas.height = 220;
      ctx.clearRect(0, 0, w, h);

      // Background scan slice
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Simulated skull contour
      ctx.strokeStyle = 'rgba(163, 166, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 90, 80, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Brain parenchyma simulation
      ctx.fillStyle = 'rgba(70, 75, 120, 0.25)';
      ctx.beginPath();
      ctx.ellipse(cx - 35, cy, 40, 50, -0.1, 0, Math.PI * 2);
      ctx.ellipse(cx + 35, cy, 40, 50, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Ventricles
      ctx.fillStyle = '#0c1020';
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - 5, 8, 25, -0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 15, cy - 5, 8, 25, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Tumor anomaly region
      const tx = cx + 38;
      const ty = cy - 20;
      const tRadius = 24;

      // Raw hyperintensity
      ctx.fillStyle = 'rgba(230, 235, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(tx, ty, tRadius, 0, Math.PI * 2);
      ctx.fill();

      // AI Segmentation Mask Overlay (Revealed by slider)
      if (progress > 0) {
        ctx.save();
        ctx.beginPath();
        // Clip to reveal slider position
        const revealX = (progress / 100) * w;
        ctx.rect(0, 0, revealX, h);
        ctx.clip();

        // Neon segmentation boundary
        ctx.fillStyle = 'rgba(0, 229, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(tx, ty, tRadius + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.arc(tx, ty, tRadius + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Label on lesion
        ctx.setLineDash([]);
        ctx.fillStyle = '#00f5a0';
        ctx.font = '10px monospace';
        ctx.fillText('ROI: GLIOMA 95.2%', tx - 35, ty - 32);

        // Divider line for slider
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(revealX, 0);
        ctx.lineTo(revealX, h);
        ctx.stroke();

        ctx.restore();
      }
    }

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        renderScan(val);
        if (readout) {
          readout.textContent = val > 0 ? `AI Mask Reveal: ${val}% (Confidence: 95.2%)` : 'Raw MRI Slice';
        }
        if (val > 50) {
          discoverSignal(5); // Signal 05: TumorNet Diagnostic
        }
      });
      renderScan(slider.value);
    }
  }

  // 2. Canvas AI Neural Sketch Pad
  function initSketchPadDemo() {
    const canvas = document.getElementById('sketchpad-demo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasDrawn = false;

    function resetCanvas() {
      canvas.width = canvas.parentElement.offsetWidth || 300;
      canvas.height = 190;
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#141829' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#a3a6ff' : '#2f3a5f';
    }

    resetCanvas();
    window.addEventListener('resize', () => {
      if (!hasDrawn) resetCanvas();
    });

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function startDraw(e) {
      isDrawing = true;
      hasDrawn = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    // Filter transforms
    window.applySketchStyle = function (style) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (style === 'cyberpunk') {
          d[i] = 255 - r;       // Cyan/Magenta inversion
          d[i + 1] = Math.min(255, g * 1.5);
          d[i + 2] = 255;
        } else if (style === 'cubism') {
          const avg = (r + g + b) / 3;
          d[i] = avg > 128 ? 255 : 30;
          d[i + 1] = avg > 128 ? 160 : 200;
          d[i + 2] = 80;
        } else if (style === 'invert') {
          d[i] = 255 - r;
          d[i + 1] = 255 - g;
          d[i + 2] = 255 - b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      discoverSignal(6); // Signal 06: Style Alchemist
      playSynth(440, 'sawtooth', 0.1);
    };

    window.clearSketchCanvas = function () {
      hasDrawn = false;
      resetCanvas();
    };
  }

  // ----------------------------------------------------------
  // E. CURSOR & SCROLL-REACTIVE MAGIC
  // ----------------------------------------------------------

  // Particles shockwave on hero click
  function setupShockwave() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    heroSection.addEventListener('click', (e) => {
      // Avoid firing if clicking button
      if (e.target.closest('a, button, input')) return;

      discoverSignal(3); // Signal 03: Neural Shockwave
      playSynth(220, 'sine', 0.12, 0.08);

      if (window.particles && Array.isArray(window.particles)) {
        const rect = heroSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        window.particles.forEach(p => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 260) {
            const force = (1 - dist / 260) * 12;
            p.speedX += (dx / (dist || 1)) * force;
            p.speedY += (dy / (dist || 1)) * force;
          }
        });
      }
    });
  }

  // 3D Card Tilt & Specular Sheen
  function setupTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = document.querySelectorAll('.project-card, .dashboard-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Text Scramble / Hacker Decoder Effect
  function scrambleText(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const original = el.getAttribute('data-original-text') || el.textContent;
    el.setAttribute('data-original-text', original);

    const chars = '01#_*/><$[]%&';
    let iter = 0;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, index) => {
          if (index < iter || char === ' ') return original[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iter >= original.length) {
        clearInterval(interval);
        el.textContent = original;
      }
      iter += 1 / 2;
    }, 28);
  }

  function setupTextScramble() {
    document.querySelectorAll('.section-title').forEach(title => {
      title.addEventListener('mouseenter', () => scrambleText(title));
    });
  }

  // ----------------------------------------------------------
  // F. INTERACTIVE TERMINAL ENGINE
  // ----------------------------------------------------------
  const TERMINAL_COMMANDS = {
    help: () => `Available commands:
  whoami       - Executive summary & background
  projects     - Catalog of AI, ML & analytics projects
  skills       - Technical stack & capabilities
  dashboards   - Live interactive business intelligence dashboards
  resume       - Direct download & view links
  contact      - Communications channels & frequencies
  signals      - Radar discovery status (found / total)
  theme <name> - Change accent: cyan, emerald, amber, violet, peri
  bootos       - Boot SiddharthOS v1.0 Retro Workstation
  fix          - Emergency recovery: resets cursor, scroll locks & overlays
  safe         - Toggle fast, accessible Safe Mode
  cursor on|off- Toggle custom cursor follower
  smooth on|off- Toggle smooth scrolling
  effects on|off- Toggle heavy canvas animations
  scroll top   - Smoothly scroll page to top
  clear        - Clear console buffer
  reset        - Reset discovered signals and saved preferences
  sudo hire    - Quick transmission trigger
  coffee       - Brew a digital cup
  matrix       - Terminal code rain simulation
  exit         - Close terminal session`,

    whoami: () => `Siddharth Gupta — Data & Business Analyst | AI/ML Engineer
Bennett University (B.Tech CSE AI & ML, 8.48 CGPA)
Experience: 500K+ records analyzed, 3NF schema architecture, Power BI/Tableau,
Deep learning pipelines, IEEE research author, 2 vibe-coded desktop ERP/AI tools.`,

    fix: () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.querySelectorAll('.palette-backdrop, .signals-modal-backdrop').forEach(el => el.classList.remove('open'));
      if (typeof window.toggleCursorSetting === 'function') window.toggleCursorSetting(false);
      document.documentElement.style.scrollBehavior = 'smooth';
      if (typeof window.showToast === 'function') {
        window.showToast('🔧 [FIX COMPLETE] Scroll locks cleared, native cursor restored.');
      }
      return `[SYSTEM RECOVERY COMPLETED]
  • Viewport scroll locks cleared
  • Modal backdrops dismissed
  • Native cursor restored
  • Smooth scrolling enabled`;
    },

    safe: () => {
      if (typeof window.toggleSafeMode === 'function') {
        window.toggleSafeMode(true);
      }
      return `[OK] Safe Mode activated. Heavy effects, cursor follower & animations disabled.`;
    },

    'cursor on': () => {
      if (typeof window.toggleCursorSetting === 'function') window.toggleCursorSetting(true);
      return `[OK] Custom cursor follower enabled (fine pointer devices).`;
    },

    'cursor off': () => {
      if (typeof window.toggleCursorSetting === 'function') window.toggleCursorSetting(false);
      return `[OK] Custom cursor follower disabled. Native cursor active.`;
    },

    'smooth on': () => {
      document.documentElement.style.scrollBehavior = 'smooth';
      return `[OK] Smooth scrolling enabled.`;
    },

    'smooth off': () => {
      document.documentElement.style.scrollBehavior = 'auto';
      return `[OK] Smooth scrolling disabled.`;
    },

    'effects on': () => {
      document.documentElement.removeAttribute('data-safe-mode');
      return `[OK] Visual effects and particle systems enabled.`;
    },

    'effects off': () => {
      if (typeof window.toggleSafeMode === 'function') window.toggleSafeMode(true);
      return `[OK] Visual effects disabled.`;
    },

    'scroll top': () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return `[OK] Scrolling to top of page...`;
    },

    projects: () => `Headline Projects:
  1. Airline Flight Delay & Ops Risk (517K+ rows, 3NF PostgreSQL, Power BI)
  2. Tumor X (Brain Tumor MRI Classification & Segmentation - 95% Acc)
  3. Infosys Equity Research Initiation (14-Sheet Model, WACC/DCF)
  4. InvoiceWise 3.1.0 [Vibe-Coded Windows ERP]
  5. Vellum AI Desktop Client [Vibe-Coded Electron App]
  6. Water Stress & Heatwave Intelligence (NITI Aayog & IMD Data)`,

    skills: () => `Core Competencies:
  • Languages: Python, SQL (PostgreSQL, MySQL), R, C++, JavaScript
  • Analytics: Power BI (DAX), Tableau, Excel (Power Pivot, 3NF), Pandas
  • ML/AI: TensorFlow, PyTorch, OpenCV, LangChain, HuggingFace
  • DevOps: Docker, AWS (EC2), Linux (Ubuntu), Git/GitHub, Streamlit`,

    dashboards: () => `Interactive Live Dashboards:
  • India Vehicle & EV Transition: https://justcallmesidd.github.io/India-s-EV-vs-Fuel-dependency/
  • Global Seismic Risk: https://justcallmesidd.github.io/Global-Earthquake-dashboard/
  • Airline Flight Delay: https://justcallmesidd.github.io/Airline-Flight-Delay-Operations-Risk-Analysis/`,

    resume: () => {
      window.open('https://drive.google.com/file/d/1eFMfCdBcfc_VusScIMsm_FOXJkPUBycH/view?usp=sharing', '_blank');
      return `Opening resume document in a new tab...`;
    },

    contact: () => `Communication Channels:
  Email:    justcallmesidd@gmail.com
  Phone:    +91 8318983400
  LinkedIn: https://linkedin.com/in/justcallmesidd/
  GitHub:   https://github.com/JustCallMeSidd`,

    signals: () => {
      const count = discoveredSignals.length;
      return `Radar Telemetry: ${count}/12 signals captured. Run [help] to explore further.`;
    },

    coffee: () => `
       ( (
        ) )
      ........
      |      |]  Coffee brewed. Ready to build high-impact AI systems.
      \\      /
       \`----'`,

    bootos: () => {
      if (typeof window.bootRetroOS === 'function') {
        window.toggleTerminal(false);
        setTimeout(() => window.bootRetroOS(), 200);
        return `Initializing BIOS boot sequence for SiddharthOS v1.0...`;
      }
      return `Retro OS subsystem initializing...`;
    },

    reset: () => {
      discoveredSignals = [];
      try {
        localStorage.removeItem('sidd_signals');
        localStorage.removeItem('sidd_persona');
      } catch (e) {}
      updateSignalsHUD();
      return `[OK] Radar telemetry reset. All 12 signals re-hidden.`;
    },

    'sudo hire': () => {
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Access Granted: Welcome to the team! Opening email...`);
      }
      setTimeout(() => {
        window.location.href = 'mailto:justcallmesidd@gmail.com?subject=Opportunity%20Discussion';
      }, 800);
      return `Permission escalated. Initiating communication protocol...`;
    }
  };

  let commandHistory = [];
  let historyIndex = -1;

  function handleTerminalInput(cmd, outputEl) {
    const raw = cmd.trim();
    if (!raw) return;

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    // Append command line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="t-prompt">guest@siddharth:~$</span> ${escapeHTML(raw)}`;
    outputEl.appendChild(userLine);

    discoverSignal(10); // Signal 10: Terminal Architect

    const lower = raw.toLowerCase();

    if (lower === 'clear') {
      outputEl.innerHTML = '';
      return;
    }

    if (lower === 'exit') {
      window.toggleTerminal(false);
      return;
    }

    if (lower.startsWith('theme ')) {
      const tName = lower.replace('theme ', '').trim();
      const valid = ['peri', 'cyan', 'emerald', 'amber', 'violet'];
      if (valid.includes(tName)) {
        document.documentElement.setAttribute('data-accent', tName);
        try { localStorage.setItem('sidd_accent', tName); } catch (e) {}
        printTerminalOutput(`[OK] Accent theme set to '${tName}'.`, 't-success', outputEl);
      } else {
        printTerminalOutput(`Invalid theme. Choose: peri, cyan, emerald, amber, violet`, 't-warn', outputEl);
      }
      return;
    }

    if (lower === 'matrix') {
      startMatrixMode();
      printTerminalOutput(`Matrix digital rain triggered. Press [ESC] to exit matrix.`, 't-success', outputEl);
      return;
    }

    const handler = TERMINAL_COMMANDS[lower] || TERMINAL_COMMANDS[Object.keys(TERMINAL_COMMANDS).find(k => lower.startsWith(k))];

    if (handler) {
      const res = handler();
      printTerminalOutput(res, 't-out', outputEl);
    } else {
      printTerminalOutput(`Command not recognized: '${raw}'. Type 'help' for available commands.`, 't-warn', outputEl);
    }

    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printTerminalOutput(text, cls, container) {
    const line = document.createElement('div');
    line.className = `terminal-line ${cls}`;
    line.textContent = text;
    container.appendChild(line);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ----------------------------------------------------------
  // G. LAB MODE & KONAMI CODE
  // ----------------------------------------------------------
  const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiIdx = 0;

  document.addEventListener('keydown', (e) => {
    // Global Escape handler: closes any overlay and restores state
    if (e.key === 'Escape') {
      const term = document.getElementById('terminal-backdrop');
      const palette = document.getElementById('palette-backdrop');
      const signals = document.getElementById('signals-modal-backdrop');
      if (term && term.classList.contains('open')) window.toggleTerminal(false);
      if (palette && palette.classList.contains('open')) window.togglePalette(false);
      if (signals && signals.classList.contains('open')) window.toggleSignalsModal(false);
    }

    // Check palette shortcut (Ctrl+K or / when not typing)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.togglePalette(true);
      return;
    }

    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      window.togglePalette(true);
      return;
    }

    // Terminal shortcut (tilde `~`)
    if (e.key === '`' || e.key === '~') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        window.toggleTerminal();
        return;
      }
    }

    // Konami sequence tracking
    if (e.key.toLowerCase() === KONAMI_SEQUENCE[konamiIdx].toLowerCase()) {
      konamiIdx++;
      if (konamiIdx === KONAMI_SEQUENCE.length) {
        toggleLabMode();
        konamiIdx = 0;
      }
    } else {
      konamiIdx = 0;
    }
  });

  function toggleLabMode() {
    const overlay = document.getElementById('lab-mode-overlay');
    if (!overlay) return;
    const isActive = overlay.classList.toggle('active');
    if (isActive) {
      discoverSignal(11); // Signal 11: Konami Protocol
      playSynth(880, 'sawtooth', 0.2);
      if (typeof window.showToast === 'function') {
        window.showToast('🚀 [LAB MODE UNLOCKED] HUD Grid & Telemetry Online');
      }
    }
  }

  // ----------------------------------------------------------
  // MATRIX DIGITAL RAIN
  // ----------------------------------------------------------
  let matrixCanvas = null;
  let matrixInterval = null;

  function startMatrixMode() {
    if (matrixCanvas) return;
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;pointer-events:none;';
    document.body.appendChild(matrixCanvas);

    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const cols = Math.floor(matrixCanvas.width / 20);
    const ypos = Array(cols).fill(0);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = '#00f5a0';
      ctx.font = '14pt monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    }, 50);

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        clearInterval(matrixInterval);
        if (matrixCanvas) matrixCanvas.remove();
        matrixCanvas = null;
        document.removeEventListener('keydown', onEsc);
      }
    };
    document.addEventListener('keydown', onEsc);
  }

  // ----------------------------------------------------------
  // IDLE DETECTOR & HINTS
  // ----------------------------------------------------------
  let idleTimer = null;
  let idleBannerDismissed = false;

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (idleBannerDismissed) return;
      const banner = document.getElementById('idle-hint-banner');
      if (banner) banner.classList.add('show');
    }, 14000); // 14s idle
  }

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt => {
    window.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();

  // ----------------------------------------------------------
  // WINDOW EXPORTS & DOM BINDINGS
  // ----------------------------------------------------------
  window.togglePalette = function (open) {
    const modal = document.getElementById('palette-backdrop');
    if (!modal) return;
    const shouldOpen = open !== undefined ? open : !modal.classList.contains('open');
    modal.classList.toggle('open', shouldOpen);
    if (shouldOpen) {
      const input = document.getElementById('palette-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
      renderPaletteResults('');
    }
  };

  let lastTerminalOpener = null;

  window.toggleTerminal = function (open) {
    const modal = document.getElementById('terminal-backdrop');
    if (!modal) return;
    const shouldOpen = open !== undefined ? open : !modal.classList.contains('open');

    if (shouldOpen) {
      lastTerminalOpener = document.activeElement;
    }
    modal.classList.toggle('open', shouldOpen);

    if (shouldOpen) {
      const input = document.getElementById('terminal-input');
      if (input) setTimeout(() => input.focus(), 80);
      window.jumpTerminalBottom();
    } else {
      if (lastTerminalOpener && typeof lastTerminalOpener.focus === 'function') {
        lastTerminalOpener.focus();
      }
    }
  };

  window.handleTerminalScroll = function (bodyEl) {
    const jumpBtn = document.getElementById('terminal-jump-btn');
    if (!jumpBtn || !bodyEl) return;
    const distFromBottom = bodyEl.scrollHeight - bodyEl.scrollTop - bodyEl.clientHeight;
    jumpBtn.classList.toggle('show', distFromBottom > 60);
  };

  window.jumpTerminalBottom = function () {
    const bodyEl = document.getElementById('terminal-body');
    if (bodyEl) {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }
    const jumpBtn = document.getElementById('terminal-jump-btn');
    if (jumpBtn) jumpBtn.classList.remove('show');
  };

  window.toggleSignalsModal = function (open) {
    const modal = document.getElementById('signals-modal-backdrop');
    if (!modal) return;
    const shouldOpen = open !== undefined ? open : !modal.classList.contains('open');
    modal.classList.toggle('open', shouldOpen);
    if (shouldOpen) renderSignalsRadarGrid();
  };

  function renderSignalsRadarGrid() {
    const grid = document.getElementById('signals-radar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    SIGNALS_CATALOG.forEach(sig => {
      const isFound = discoveredSignals.includes(sig.id);
      const card = document.createElement('div');
      card.className = `signal-radar-item ${isFound ? 'unlocked' : ''}`;
      card.innerHTML = `
        <span class="sig-icon">${isFound ? '✅' : '🔒'}</span>
        <div class="sig-details">
          <div class="sig-title">${sig.name} <span style="font-size:0.7em; opacity:0.6">[${sig.loc}]</span></div>
          <div class="sig-hint">${isFound ? sig.text : `Hint: ${sig.hint}`}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderPaletteResults(query) {
    const resultsContainer = document.getElementById('palette-results');
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = `
        <div class="palette-suggestions-title">Suggested Inquiries</div>
        <button class="palette-suggestion-chip" onclick="searchFromChip('best project?')">🏆 What is your best project?</button>
        <button class="palette-suggestion-chip" onclick="searchFromChip('SQL experience')">💾 What is your SQL & database background?</button>
        <button class="palette-suggestion-chip" onclick="searchFromChip('show dashboards')">📊 Show me your interactive dashboards</button>
        <button class="palette-suggestion-chip" onclick="searchFromChip('resume')">📄 How do I view or download your resume?</button>
        <button class="palette-suggestion-chip" onclick="searchFromChip('vibe coded')">⚡ What are your vibe-coded apps?</button>
      `;
      return;
    }

    const match = queryPortfolio(query);
    if (match) {
      resultsContainer.innerHTML = `
        <div class="palette-answer-card">
          <div class="palette-answer-text">${match.answer}</div>
          <div style="display:flex; gap:8px;">
            ${match.target ? `<button class="palette-jump-btn" onclick="jumpToTarget('${match.target}')">Jump to Section →</button>` : ''}
            ${match.actionUrl ? `<a href="${match.actionUrl}" target="_blank" class="palette-jump-btn">${match.actionText || 'Open ↗'}</a>` : ''}
          </div>
        </div>
      `;
    }
  }

  window.searchFromChip = function (txt) {
    const input = document.getElementById('palette-input');
    if (input) {
      input.value = txt;
      renderPaletteResults(txt);
    }
  };

  window.jumpToTarget = function (selector) {
    window.togglePalette(false);
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.classList.add('project-highlight-flash');
      setTimeout(() => target.classList.remove('project-highlight-flash'), 2000);
    }
  };

  // ----------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // ----------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Accent Theme Restoration
    try {
      const savedAccent = localStorage.getItem('sidd_accent') || 'peri';
      document.documentElement.setAttribute('data-accent', savedAccent);
      document.querySelectorAll('.swatch-dot').forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-accent') === savedAccent);
      });
    } catch (e) {}

    // Swatch click handlers
    document.querySelectorAll('.swatch-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const accent = dot.getAttribute('data-accent');
        document.documentElement.setAttribute('data-accent', accent);
        document.querySelectorAll('.swatch-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        try { localStorage.setItem('sidd_accent', accent); } catch (e) {}
        playSynth(587.33, 'triangle', 0.1);
      });
    });

    // 2. Sound Toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('sound_enabled', String(soundEnabled)); } catch (e) {}
        soundBtn.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        if (soundEnabled) playSynth(659.25, 'sine', 0.1);
        if (typeof window.showToast === 'function') {
          window.showToast(soundEnabled ? '🔊 Interactive audio feedback enabled' : '🔇 Audio feedback muted');
        }
      });
    }

    // 3. Tab Title Switcher
    let originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.title = '🔬 Come back, the lab is still running...';
      } else {
        document.title = originalTitle;
      }
    });

    // 4. Logo Dot Click -> Signal 01
    const logoDot = document.querySelector('.logo span');
    if (logoDot) {
      logoDot.style.cursor = 'pointer';
      logoDot.setAttribute('title', 'Quantum core');
      logoDot.addEventListener('click', () => {
        discoverSignal(1);
        playSynth(1046.5, 'sine', 0.18, 0.08);
      });
    }

    // 5. Blinking cursor click -> Signal 02
    const typingCursor = document.querySelector('.typing-cursor');
    if (typingCursor) {
      typingCursor.style.cursor = 'pointer';
      typingCursor.addEventListener('click', () => {
        discoverSignal(2);
      });
    }

    // 6. Chrono Archive Click -> Signal 09
    document.querySelectorAll('#education a, #experience a, .timeline-item').forEach(el => {
      el.addEventListener('click', () => discoverSignal(9));
    });

    // 7. Seismic Dashboard Peek -> Signal 07
    document.querySelectorAll('.dashboard-card').forEach(card => {
      card.addEventListener('mouseenter', () => discoverSignal(7));
    });

    // 8. Copy Email -> Signal 12 & micro-animation
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          navigator.clipboard.writeText('justcallmesidd@gmail.com');
          discoverSignal(12);
          if (typeof window.showToast === 'function') {
            window.showToast('📋 Copied justcallmesidd@gmail.com to clipboard!');
          }
        } catch (err) {}
      });
    });

    // 9. Persona choice restoration
    try {
      const savedPersona = localStorage.getItem('sidd_persona');
      if (savedPersona) applyPersona(savedPersona, false);
    } catch (e) {}

    // Persona cards click
    document.querySelectorAll('.path-card').forEach(card => {
      card.addEventListener('click', () => {
        const persona = card.getAttribute('data-path');
        applyPersona(persona);
      });
    });

    const resetPathBtn = document.getElementById('path-reset-btn');
    if (resetPathBtn) {
      resetPathBtn.addEventListener('click', () => {
        applyPersona('curious');
      });
    }

    // 10. Command Palette input listener
    const pInput = document.getElementById('palette-input');
    if (pInput) {
      pInput.addEventListener('input', (e) => {
        renderPaletteResults(e.target.value);
      });
    }

    // 11. Terminal input listener
    const tInput = document.getElementById('terminal-input');
    const tOutput = document.getElementById('terminal-body');
    if (tInput && tOutput) {
      tInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = tInput.value;
          tInput.value = '';
          handleTerminalInput(val, tOutput);
        } else if (e.key === 'ArrowUp') {
          if (historyIndex > 0) {
            historyIndex--;
            tInput.value = commandHistory[historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            tInput.value = commandHistory[historyIndex] || '';
          } else {
            historyIndex = commandHistory.length;
            tInput.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const q = tInput.value.toLowerCase().trim();
          if (q) {
            const match = Object.keys(TERMINAL_COMMANDS).find(k => k.startsWith(q));
            if (match) tInput.value = match;
          }
        }
      });
    }

    // 12. Share button on project cards
    document.querySelectorAll('.project-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent || 'project';
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      card.id = `project-${slug}`;

      const shareBtn = document.createElement('button');
      shareBtn.className = 'card-share-btn';
      shareBtn.innerHTML = '🔗 Share';
      shareBtn.setAttribute('data-tooltip', 'Copy direct project link');
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}${window.location.pathname}#${card.id}`;
        try {
          navigator.clipboard.writeText(url);
          if (typeof window.showToast === 'function') {
            window.showToast(`🔗 Copied direct link for "${title}"!`);
          }
        } catch (err) {}
      });
      card.appendChild(shareBtn);
    });

    // 13. Deep-link anchor handling (only if user explicitly provided a project anchor, never on general reload)
    if (window.location.hash && window.location.hash.startsWith('#card-')) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          el.classList.add('project-highlight-flash');
        }
      }, 600);
    }

    // 14. Initialize Demos & Effects
    initTumorNetDemo();
    initSketchPadDemo();
    setupShockwave();
    setupTilt();
    setupTextScramble();
    updateSignalsHUD();

    // 15. Constellation Star click -> Signal 08
    const constStar = document.getElementById('constellation-hidden-star');
    if (constStar) {
      constStar.addEventListener('click', () => {
        discoverSignal(8);
      });
    }

    // 16. Idle Hint dismiss
    const idleClose = document.getElementById('idle-hint-close');
    if (idleClose) {
      idleClose.addEventListener('click', () => {
        idleBannerDismissed = true;
        const banner = document.getElementById('idle-hint-banner');
        if (banner) banner.classList.remove('show');
      });
    }

    // 17. Live FPS Telemetry for Lab Mode
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsMeter = document.getElementById('lab-fps');
    const coordMeter = document.getElementById('lab-coords');

    function updateTelemetry() {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        if (fpsMeter) fpsMeter.textContent = `FPS: ${frameCount}`;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateTelemetry);
    }
    requestAnimationFrame(updateTelemetry);

    document.addEventListener('mousemove', (e) => {
      if (coordMeter) {
        coordMeter.textContent = `X:${e.clientX} Y:${e.clientY} [RES:${window.innerWidth}x${window.innerHeight}]`;
      }
    });
  });
})();
