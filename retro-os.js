/* ============================================================
   SIDDHARTH_OS v1.0 — RETRO WORKSTATION RUNTIME ENGINE
   100% Original Windows-Inspired Window Manager & Apps.
   Zero external dependencies.
   ============================================================ */

(function () {
  'use strict';

  let isRetroActive = false;
  let savedScrollY = 0;
  let highestZ = 100;
  let openWindows = {};
  let activeWindowId = null;
  let screensaverTimer = null;
  let crtEnabled = true;

  // ------------------------------------------------------------
  // AUDIO HELPER FOR RETRO OS (PC Speaker Clicks & Chimes)
  // ------------------------------------------------------------
  function retroBeep(freq = 800, duration = 0.05, type = 'square') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // ------------------------------------------------------------
  // RETRO OS SIGNALS DISCOVERY (Signals 13, 14, 15)
  // ------------------------------------------------------------
  function triggerOsSignal(num, name, text) {
    if (typeof window.showToast === 'function') {
      window.showToast(`💾 Retro Signal [${num}/15]: ${name} — ${text}`);
    }
    retroBeep(1200, 0.1);
  }

  // ------------------------------------------------------------
  // BOOT POST & BIOS TRANSITION
  // ------------------------------------------------------------
  window.bootRetroOS = function () {
    if (isRetroActive) return;
    savedScrollY = window.scrollY;

    const bootScreen = document.getElementById('retro-boot-screen');
    const osContainer = document.getElementById('retro-os-container');
    if (!bootScreen || !osContainer) return;

    bootScreen.classList.add('active');
    retroBeep(440, 0.1, 'sawtooth');

    const progressFill = document.getElementById('boot-progress-fill');
    let progress = 0;

    const bootInterval = setInterval(() => {
      progress += 25;
      if (progressFill) progressFill.style.width = progress + '%';
      retroBeep(600 + progress * 5, 0.03, 'square');

      if (progress >= 100) {
        clearInterval(bootInterval);
        finishBoot();
      }
    }, 400);

    function finishBoot() {
      bootScreen.classList.remove('active');
      osContainer.classList.add('active');
      isRetroActive = true;

      // Play retro startup chord
      setTimeout(() => {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          setTimeout(() => retroBeep(freq, 0.2, 'triangle'), idx * 80);
        });
      }, 200);

      // Ensure wallpaper is properly applied and rendered
      try {
        const saved = localStorage.getItem('retro_wallpaper');
        const activeWp = (!saved || saved === 'teal') ? 'bliss' : saved;
        applyWallpaper(activeWp);
      } catch (e) {
        applyWallpaper('bliss');
      }

      // Open centerpiece Profile window on first boot
      if (Object.keys(openWindows).length === 0) {
        openApp('profile');
      }

      resetScreensaverTimer();
    }

    // Skip BIOS boot on any click or keypress
    const skipHandler = (e) => {
      clearInterval(bootInterval);
      document.removeEventListener('keydown', skipHandler);
      document.removeEventListener('click', skipHandler);
      finishBoot();
    };
    document.addEventListener('keydown', skipHandler, { once: true });
    document.addEventListener('click', skipHandler, { once: true });
  };

  // ------------------------------------------------------------
  // SHUT DOWN & EXIT TO MODERN SITE
  // ------------------------------------------------------------
  window.shutdownRetroOS = function () {
    const shutdownScreen = document.getElementById('retro-shutdown-screen');
    const osContainer = document.getElementById('retro-os-container');
    if (!shutdownScreen || !osContainer) return;

    osContainer.classList.remove('active');
    shutdownScreen.classList.add('active');
    retroBeep(300, 0.2, 'sawtooth');

    setTimeout(() => {
      shutdownScreen.classList.remove('active');
      isRetroActive = false;
      document.body.style.overflow = '';
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }, 1200);
  };

  // ------------------------------------------------------------
  // WINDOW MANAGER ENGINE
  // ------------------------------------------------------------
  function bringToFront(winId) {
    highestZ += 2;
    const win = document.getElementById(`retro-win-${winId}`);
    if (win) {
      win.style.zIndex = highestZ;
      activeWindowId = winId;
      document.querySelectorAll('.retro-window').forEach(w => w.classList.add('inactive'));
      win.classList.remove('inactive');
      win.classList.remove('minimized');
    }
    updateTaskbar();
  }

  function makeDraggable(winEl, handleEl) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    handleEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('.retro-titlebar-controls')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = winEl.offsetLeft;
      initialTop = winEl.offsetTop;
      bringToFront(winEl.getAttribute('data-win-id'));

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Desktop bounds clamping
        newLeft = Math.max(0, Math.min(window.innerWidth - winEl.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - 40 - winEl.offsetHeight, newTop));

        winEl.style.left = newLeft + 'px';
        winEl.style.top = newTop + 'px';

        // Edge snapping preview (half screen)
        if (ev.clientX <= 5) {
          winEl.style.left = '0px';
          winEl.style.top = '0px';
          winEl.style.width = '50%';
          winEl.style.height = 'calc(100% - 34px)';
        } else if (ev.clientX >= window.innerWidth - 5) {
          winEl.style.left = '50%';
          winEl.style.top = '0px';
          winEl.style.width = '50%';
          winEl.style.height = 'calc(100% - 34px)';
        }
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Double click title to maximize/restore
    handleEl.addEventListener('dblclick', (e) => {
      if (e.target.closest('.retro-titlebar-controls')) return;
      toggleMaximize(winEl.getAttribute('data-win-id'));
    });
  }

  function toggleMaximize(winId) {
    const win = document.getElementById(`retro-win-${winId}`);
    if (!win) return;
    win.classList.toggle('maximized');
    retroBeep(700, 0.04);
  }

  function minimizeWindow(winId) {
    const win = document.getElementById(`retro-win-${winId}`);
    if (!win) return;
    win.classList.add('minimized');
    if (activeWindowId === winId) activeWindowId = null;
    updateTaskbar();
    retroBeep(500, 0.04);
  }

  function closeWindow(winId) {
    const win = document.getElementById(`retro-win-${winId}`);
    if (win) win.remove();
    delete openWindows[winId];
    if (activeWindowId === winId) activeWindowId = null;
    updateTaskbar();
    retroBeep(400, 0.05);
  }

  function updateTaskbar() {
    const taskbarRow = document.getElementById('retro-taskbar-tasks');
    if (!taskbarRow) return;
    taskbarRow.innerHTML = '';

    Object.keys(openWindows).forEach(winId => {
      const info = openWindows[winId];
      const win = document.getElementById(`retro-win-${winId}`);
      const isMinimized = win && win.classList.contains('minimized');
      const isActive = activeWindowId === winId && !isMinimized;

      const btn = document.createElement('div');
      btn.className = `retro-task-btn ${isActive ? 'active' : ''}`;
      btn.innerHTML = `<span>${info.icon}</span> <span>${info.title}</span>`;
      btn.addEventListener('click', () => {
        if (isActive) {
          minimizeWindow(winId);
        } else {
          bringToFront(winId);
        }
      });
      taskbarRow.appendChild(btn);
    });
  }

  // ------------------------------------------------------------
  // APPLICATION CATALOG & WINDOW CREATION
  // ------------------------------------------------------------
  const APPS = {
    profile: {
      title: "User Properties — Siddharth Gupta",
      icon: "👤",
      width: 580,
      height: 480,
      render: renderProfileApp
    },
    projects: {
      title: "Projects Explorer — C:\\Projects",
      icon: "📁",
      width: 680,
      height: 460,
      render: renderProjectsApp
    },
    dashboards: {
      title: "SiddharthOS NetNavigator — Business Intelligence",
      icon: "📊",
      width: 640,
      height: 450,
      render: renderDashboardsApp
    },
    skills: {
      title: "Device & Skills Manager",
      icon: "⚙️",
      width: 540,
      height: 440,
      render: renderSkillsApp
    },
    lab: {
      title: "Lab Control Panel — Active Processes",
      icon: "🧪",
      width: 520,
      height: 400,
      render: renderLabApp
    },
    resume: {
      title: "Resume.pdf Document Viewer",
      icon: "📄",
      width: 460,
      height: 380,
      render: renderResumeApp
    },
    contact: {
      title: "SiddharthMail — Direct Transmission",
      icon: "✉️",
      width: 480,
      height: 400,
      render: renderContactApp
    },
    recycle: {
      title: "Recycle Bin — Discarded Experiments",
      icon: "🗑️",
      width: 520,
      height: 380,
      render: renderRecycleBinApp
    },
    readme: {
      title: "Readme.txt — Notepad",
      icon: "📝",
      width: 450,
      height: 340,
      render: renderReadmeApp
    },
    minesweeper: {
      title: "Minesweeper",
      icon: "💣",
      width: 250,
      height: 310,
      render: renderMinesweeperApp
    },
    terminal: {
      title: "Command Prompt — MS-DOS Kernel",
      icon: "💻",
      width: 600,
      height: 420,
      render: renderTerminalApp
    }
  };

  function openApp(appId) {
    const def = APPS[appId];
    if (!def) return;

    // Check if already open
    if (openWindows[appId]) {
      bringToFront(appId);
      return;
    }

    const win = document.createElement('div');
    win.className = 'retro-window';
    win.id = `retro-win-${appId}`;
    win.setAttribute('data-win-id', appId);
    win.style.width = Math.min(def.width, window.innerWidth - 20) + 'px';
    win.style.height = Math.min(def.height, window.innerHeight - 60) + 'px';

    // Stagger window position
    const offset = Object.keys(openWindows).length * 25;
    win.style.left = Math.min(40 + offset, window.innerWidth - def.width) + 'px';
    win.style.top = Math.min(30 + offset, window.innerHeight - def.height - 40) + 'px';

    win.innerHTML = `
      <div class="retro-titlebar" id="retro-title-${appId}">
        <div class="retro-titlebar-title">
          <span>${def.icon}</span>
          <span>${def.title}</span>
        </div>
        <div class="retro-titlebar-controls">
          <button class="retro-btn-sys minimize" aria-label="Minimize">_</button>
          <button class="retro-btn-sys maximize" aria-label="Maximize">□</button>
          <button class="retro-btn-sys close" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="retro-menubar">
        <span class="retro-menu-item">File</span>
        <span class="retro-menu-item">Edit</span>
        <span class="retro-menu-item">View</span>
        <span class="retro-menu-item">Help</span>
      </div>
      <div class="retro-win-body" id="retro-body-${appId}">
        <!-- App content rendered here -->
      </div>
      <div class="retro-statusbar">
        <span>Ready</span>
        <span>SiddharthOS v1.0</span>
      </div>
    `;

    document.getElementById('retro-os-desktop').appendChild(win);
    openWindows[appId] = { title: def.title, icon: def.icon };

    // Bind window controls
    const titlebar = win.querySelector(`#retro-title-${appId}`);
    makeDraggable(win, titlebar);

    win.querySelector('.minimize').addEventListener('click', () => minimizeWindow(appId));
    win.querySelector('.maximize').addEventListener('click', () => toggleMaximize(appId));
    win.querySelector('.close').addEventListener('click', () => closeWindow(appId));

    win.addEventListener('mousedown', () => bringToFront(appId));

    def.render(win.querySelector(`#retro-body-${appId}`));
    bringToFront(appId);
    retroBeep(750, 0.04);
  }

  // ------------------------------------------------------------
  // APP 1: MY PROFILE (User Properties Centerpiece)
  // ------------------------------------------------------------
  function renderProfileApp(container) {
    container.innerHTML = `
      <div style="display:flex; gap:16px; margin-bottom:12px;">
        <div style="width:110px; height:120px; border:2px solid #808080; padding:3px; background:#c0c0c0; text-align:center;">
          <img src="profile.png" alt="Siddharth" style="width:100%; height:100%; object-fit:cover; filter:contrast(1.15) brightness(1.05);" />
        </div>
        <div style="flex:1;">
          <h2 style="font-size:1.15rem; margin:0 0 4px 0; color:#000080;">Siddharth Gupta</h2>
          <div style="font-size:0.82rem; font-weight:600; color:#404040; margin-bottom:6px;">Data & Business Analyst | AI/ML Engineer</div>
          <div style="background:#e8ffe8; border:1px solid #008000; padding:4px 8px; font-size:0.75rem; color:#006400; display:inline-block; font-weight:700;">
            ● Status: Available for Opportunities
          </div>
          <div style="margin-top:8px; font-size:0.76rem; color:#404040; line-height:1.4;">
            Bennett University | B.Tech CSE (AI & ML) | CGPA: 8.48/10
          </div>
        </div>
      </div>

      <div class="retro-tabs" id="profile-tabs">
        <button class="retro-tab active" data-tab="general">General</button>
        <button class="retro-tab" data-tab="exp">Experience</button>
        <button class="retro-tab" data-tab="hardware">System Specs</button>
        <button class="retro-tab" data-tab="research">Research</button>
      </div>

      <div class="retro-field-inset" id="profile-tab-content" style="height:210px; overflow-y:auto; font-size:0.82rem;">
        <!-- Default General Tab -->
        <p><strong>Career Objective:</strong> Hands-on data and business analyst transforming 500K+ records into decision-ready dashboards and pipelines using PostgreSQL, Python, and Power BI/Tableau.</p>
        <p style="margin-top:8px;"><strong>Academic Background:</strong></p>
        <ul style="margin-left:18px; line-height:1.5;">
          <li>Bennett University (2022–2026)</li>
          <li>B.Tech Computer Science & Engineering (AI & ML Specialization)</li>
          <li>CGPA: 8.48 / 10.0</li>
        </ul>
        <p style="margin-top:8px;"><strong>Languages:</strong> English, Hindi, Japanese (Beginner/Learning)</p>
      </div>
    `;

    // Tab switching logic
    container.querySelectorAll('#profile-tabs button').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('#profile-tabs button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.getAttribute('data-tab');
        const contentBox = container.querySelector('#profile-tab-content');

        if (which === 'general') {
          contentBox.innerHTML = `
            <p><strong>Career Objective:</strong> Hands-on data and business analyst transforming 500K+ records into decision-ready dashboards and pipelines using PostgreSQL, Python, and Power BI/Tableau.</p>
            <p style="margin-top:8px;"><strong>Academic Background:</strong></p>
            <ul style="margin-left:18px; line-height:1.5;">
              <li>Bennett University (2022–2026)</li>
              <li>B.Tech Computer Science & Engineering (AI & ML Specialization)</li>
              <li>CGPA: 8.48 / 10.0</li>
            </ul>
            <p style="margin-top:8px;"><strong>Languages:</strong> English, Hindi, Japanese (Beginner/Learning)</p>
          `;
        } else if (which === 'exp') {
          contentBox.innerHTML = `
            <p><strong>Data Analytics Intern</strong> | Apponix Academy (Feb 2026 – Jun 2026)</p>
            <ul style="margin-left:18px; line-height:1.6; margin-top:6px;">
              <li>Analyzed relational business data in PostgreSQL using complex joins and window functions.</li>
              <li>Engineered interactive Power BI & Tableau dashboards with drill-downs and custom DAX measures.</li>
              <li>Cleaned missing and inconsistent records in Excel and Pandas before reporting handoff.</li>
            </ul>
          `;
        } else if (which === 'hardware') {
          contentBox.innerHTML = `
            <div style="font-family:monospace; line-height:1.6;">
              <div>[SYSTEM DIAGNOSTICS READOUT]</div>
              <div>------------------------------------</div>
              <div>CPU: Curiosity Overdrive @ 100% Core Load</div>
              <div>RAM: 32 GB Ideas Allocated</div>
              <div>DATABASE ENGINE: PostgreSQL 3NF Cluster</div>
              <div>ANALYTICS ACCELERATOR: Power BI / Tableau DAX</div>
              <div>UPTIME: Coding & Building Continuously</div>
              <div>------------------------------------</div>
              <div style="color:#008000; font-weight:700;">ALL SUB-SYSTEMS VERIFIED READY FOR HIRE.</div>
            </div>
          `;
        } else if (which === 'research') {
          contentBox.innerHTML = `
            <p><strong>IEEE CISES 2025 Published Paper:</strong></p>
            <p style="margin-top:4px;"><em>"Integrating Deep Learning Concepts with Blood Diagnosis"</em></p>
            <p style="margin-top:6px;">Transforms tabular hematological test reports into image-like tensors to train CNN models for assisted clinical classification.</p>
            <p style="margin-top:10px;"><strong>Certifications:</strong></p>
            <ul style="margin-left:18px;">
              <li>Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate</li>
              <li>IBM Data Analysis for Machine Learning</li>
              <li>Deep Learning Specialization (DeepLearning.AI)</li>
            </ul>
          `;
        }
        retroBeep(650, 0.03);
      });
    });
  }

  // ------------------------------------------------------------
  // APP 2: PROJECTS (Windows 95 File Explorer)
  // ------------------------------------------------------------
  function renderProjectsApp(container) {
    container.innerHTML = `
      <div style="display:flex; height:100%; gap:8px;">
        <!-- Left folder tree -->
        <div class="retro-field-inset" style="width:160px; overflow-y:auto; font-size:0.78rem;">
          <div style="font-weight:700; margin-bottom:4px;">📁 C:\\Projects</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="airline">📂 Airline-Risk</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="tumorx">📂 Tumor-X-MRI</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="infosys">📂 Infosys-Equity</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="invoicewise">📂 InvoiceWise-ERP</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="vellum">📂 Vellum-Desktop</div>
          <div style="padding-left:10px; cursor:pointer;" class="proj-tree-item" data-proj="water">📂 Climate-Water</div>
        </div>

        <!-- Right file list & preview -->
        <div class="retro-field-inset" id="projects-detail-pane" style="flex:1; overflow-y:auto; font-size:0.82rem;">
          <p style="color:#606060;">Select a project folder on the left to inspect files and architecture details.</p>
        </div>
      </div>
    `;

    const PROJ_DETAILS = {
      airline: {
        title: "Airline Flight Delay & Operations Risk Analysis",
        files: [
          { name: "README.txt", text: "3NF PostgreSQL database analyzing 517K+ flight rows across 341 airports. Surfaces delay bottlenecks and operational risk factors in Power BI." },
          { name: "schema_3nf.sql", text: "Normalized schema featuring carrier, airport, flight, and delay causality tables." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/Airline-Flight-Delay-and-Operations-Risk-Analysis" }
        ]
      },
      tumorx: {
        title: "Tumor X — Brain Tumor MRI Classification",
        files: [
          { name: "README.txt", text: "⚠️ Educational Simulation: CNN classification + segmentation pipeline achieving 95% accuracy on 4,500+ MRI scans. Deployed in Docker & Streamlit." },
          { name: "model_weights.h5", text: "TensorFlow model weights with Grad-CAM visual interpretability." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/Tumor-X.git" }
        ]
      },
      infosys: {
        title: "Infosys Equity Research Initiation Package",
        files: [
          { name: "README.txt", text: "Institutional-grade equity research package on Infosys Limited with 14-sheet integrated financial model, WACC/CAPM, DCF, and Monte Carlo simulation." },
          { name: "model_14sheets.xlsx", text: "Dynamic financial forecast linking Income Statement, Balance Sheet and Cash Flow Statement." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/Infosys-Equity-Research-Initiation-Project" }
        ]
      },
      invoicewise: {
        title: "InvoiceWise 3.1.0 [Vibe-Coded Desktop ERP]",
        files: [
          { name: "README.txt", text: "Standalone Windows desktop ERP for chemical and pharma labs. Features BOM formula engineering, multi-batch traceability, and Rule 46 GST invoicing." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/InvoiceWise-3.1.0" }
        ]
      },
      vellum: {
        title: "Vellum AI Desktop Client [Vibe-Coded Electron App]",
        files: [
          { name: "README.txt", text: "Open-source desktop AI client connecting to 600+ models via OpenRouter with zero telemetry and local-only API keys." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/Vellum" }
        ]
      },
      water: {
        title: "Water Stress & Climate Intelligence",
        files: [
          { name: "README.txt", text: "Consolidated groundwater and climate datasets from NITI Aayog and IMD with interactive Power BI dashboards." },
          { name: "github_link.url", url: "https://github.com/JustCallMeSidd/Water-Stress-Groundwater-Rainfall-Heatwave-Intelligence" }
        ]
      }
    };

    container.querySelectorAll('.proj-tree-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.proj-tree-item').forEach(i => i.style.background = '');
        item.style.background = '#000080';
        item.style.color = '#ffffff';

        const pKey = item.getAttribute('data-proj');
        const data = PROJ_DETAILS[pKey];
        const detailPane = container.querySelector('#projects-detail-pane');

        detailPane.innerHTML = `
          <h3 style="font-size:0.95rem; margin-bottom:8px; color:#000080;">${data.title}</h3>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${data.files.map(f => `
              <div style="background:#f4f4f4; border:1px solid #d0d0d0; padding:6px 10px;">
                <div style="font-weight:700; color:#000080;">📄 ${f.name}</div>
                <div style="font-size:0.78rem; color:#404040; margin-top:3px;">${f.text || ''}</div>
                ${f.url ? `<a href="${f.url}" target="_blank" class="retro-button" style="display:inline-block; margin-top:6px; text-decoration:none;">Open GitHub Repository ↗</a>` : ''}
              </div>
            `).join('')}
          </div>
        `;
        retroBeep(700, 0.03);
      });
    });
  }

  // ------------------------------------------------------------
  // APP 3: DASHBOARDS (NetNavigator Faux-Browser)
  // ------------------------------------------------------------
  function renderDashboardsApp(container) {
    container.innerHTML = `
      <div style="background:#c0c0c0; border-bottom:1px solid #808080; padding:4px 8px; display:flex; align-items:center; gap:8px; font-size:0.8rem;">
        <span>Location:</span>
        <input type="text" value="https://justcallmesidd.github.io/dashboards" readonly style="flex:1; background:#ffffff; border:1px solid #808080; padding:2px 6px; font-family:monospace;" />
        <button class="retro-button" onclick="retroBeep(800,0.05)">Go</button>
      </div>

      <div style="padding:10px; display:flex; flex-direction:column; gap:12px;">
        <div style="border:1px solid #808080; padding:8px; background:#f8f8f8;">
          <h4 style="margin:0 0 4px 0; color:#000080;">1. India Vehicle & EV Transition Intelligence</h4>
          <p style="font-size:0.78rem; color:#404040; margin-bottom:6px;">RTO-level EV registration and market penetration curves analyzing India's fuel transition.</p>
          <a href="https://justcallmesidd.github.io/India-s-EV-vs-Fuel-dependency/" target="_blank" class="retro-button" style="text-decoration:none;">Launch Dashboard ↗</a>
        </div>

        <div style="border:1px solid #808080; padding:8px; background:#f8f8f8;">
          <h4 style="margin:0 0 4px 0; color:#000080;">2. Seismic Risk Dashboard</h4>
          <p style="font-size:0.78rem; color:#404040; margin-bottom:6px;">Global earthquake risk mapping, magnitude-depth curves, and chronological USGS incident telemetry.</p>
          <a href="https://justcallmesidd.github.io/Global-Earthquake-dashboard/" target="_blank" class="retro-button" style="text-decoration:none;">Launch Dashboard ↗</a>
        </div>

        <div style="border:1px solid #808080; padding:8px; background:#f8f8f8;">
          <h4 style="margin:0 0 4px 0; color:#000080;">3. Airline Flight Delay & Operations Risk</h4>
          <p style="font-size:0.78rem; color:#404040; margin-bottom:6px;">Flight delays, causality metrics, and operations analysis across 517K+ domestic flights.</p>
          <a href="https://justcallmesidd.github.io/Airline-Flight-Delay-Operations-Risk-Analysis/" target="_blank" class="retro-button" style="text-decoration:none;">Launch Dashboard ↗</a>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 4: SKILLS (Device & Task Manager)
  // ------------------------------------------------------------
  function renderSkillsApp(container) {
    container.innerHTML = `
      <div style="margin-bottom:8px; font-weight:700; color:#000080;">Hardware & Technology Driver Stack:</div>
      <div class="retro-field-inset" style="height:310px; overflow-y:auto; font-size:0.8rem;">
        <div style="font-weight:700; margin-bottom:4px;">💻 Languages & Databases:</div>
        <div style="margin-left:14px; margin-bottom:8px;">
          <div>• Python Driver [v3.11] — Advanced (Data modeling, Pandas, NumPy, OpenCV)</div>
          <div>• SQL / PostgreSQL [v15] — 3NF Normalization, Complex Window Aggregations</div>
          <div>• R Language [v4.3] — Intermediate Statistical Computing</div>
          <div>• C++ Engine — Data structures and algorithms</div>
          <div>• MongoDB NoSQL — Document storage & indexing</div>
        </div>

        <div style="font-weight:700; margin-bottom:4px;">📊 Business Intelligence & Analytics:</div>
        <div style="margin-left:14px; margin-bottom:8px;">
          <div>• Microsoft Power BI — Advanced DAX, Star Schema, Dynamic KPI Cards</div>
          <div>• Tableau Desktop — Interactive Visuals & Geospatial GIS Mapping</div>
          <div>• Microsoft Excel — Power Pivot, Dimensional Modeling, VLOOKUP</div>
        </div>

        <div style="font-weight:700; margin-bottom:4px;">🤖 Machine Learning & AI Accelerators:</div>
        <div style="margin-left:14px; margin-bottom:8px;">
          <div>• TensorFlow / Keras — CNN image classification & segmentation</div>
          <div>• PyTorch — Neural tensor transformations</div>
          <div>• LangChain & Gemini APIs — Retrieval-Augmented Generation (RAG)</div>
        </div>

        <div style="font-weight:700; margin-bottom:4px;">☁️ Cloud & Infrastructure:</div>
        <div style="margin-left:14px;">
          <div>• Docker Containers — Containerized ML deployments</div>
          <div>• AWS (EC2) — Linux VM configuration and headless jobs</div>
          <div>• Git & GitHub — CI/CD automation pipelines</div>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 5: LAB (Control Panel Processes)
  // ------------------------------------------------------------
  function renderLabApp(container) {
    container.innerHTML = `
      <div style="margin-bottom:10px; font-size:0.82rem; color:#404040;">
        Active research threads and developmental experiments:
      </div>
      <div class="retro-field-inset" style="height:280px; overflow-y:auto; font-size:0.8rem;">
        <div style="border-bottom:1px solid #d0d0d0; padding:6px 0;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>Cognify AI Browser Extension</span>
            <span style="color:#008000;">[STATUS: SHIPPED]</span>
          </div>
          <div style="font-size:0.75rem; color:#606060;">Live on Microsoft Edge Add-ons with LLM real-time chat & PDF export.</div>
        </div>

        <div style="border-bottom:1px solid #d0d0d0; padding:6px 0;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>Blood Diagnosis Neural Tensors</span>
            <span style="color:#008080;">[STATUS: PUBLISHED]</span>
          </div>
          <div style="font-size:0.75rem; color:#606060;">IEEE CISES 2025 conference proceedings research paper.</div>
        </div>

        <div style="border-bottom:1px solid #d0d0d0; padding:6px 0;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>Ayurvedic Botanical RAG System</span>
            <span style="color:#d97706;">[STATUS: EXPERIMENTING]</span>
          </div>
          <div style="font-size:0.75rem; color:#606060;">Vector embedding search linking traditional herbal texts with modern pharmacology.</div>
        </div>

        <div style="padding:6px 0;">
          <div style="display:flex; justify-content:space-between; font-weight:700;">
            <span>Generative Drawing GAN Pipeline</span>
            <span style="color:#7c3aed;">[STATUS: RESEARCHING]</span>
          </div>
          <div style="font-size:0.75rem; color:#606060;">Latency optimization for sketch-to-color synthesis under 1.5 seconds.</div>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 6: RESUME.PDF (Document Viewer)
  // ------------------------------------------------------------
  function renderResumeApp(container) {
    container.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <div style="font-size:2.8rem; margin-bottom:10px;">📄</div>
        <h3 style="margin:0 0 6px 0; color:#000080;">Siddharth_Gupta_Resume.pdf</h3>
        <p style="font-size:0.8rem; color:#404040; margin-bottom:16px;">
          Verified B.Tech (AI & ML) & Data Analyst Curriculum Vitae.
        </p>
        <div style="display:flex; justify-content:center; gap:10px;">
          <a href="https://drive.google.com/file/d/1eFMfCdBcfc_VusScIMsm_FOXJkPUBycH/view?usp=sharing" target="_blank" class="retro-button" style="text-decoration:none; padding:8px 16px;">
            Open Resume PDF ↗
          </a>
          <button class="retro-button" onclick="navigator.clipboard.writeText('https://drive.google.com/file/d/1eFMfCdBcfc_VusScIMsm_FOXJkPUBycH/view?usp=sharing'); if(typeof window.showToast==='function') window.showToast('📋 Copied resume link!');">
            Copy Link
          </button>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 7: CONTACT (SiddharthMail Client)
  // ------------------------------------------------------------
  function renderContactApp(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div>
          <label style="font-weight:700; font-size:0.78rem;">To:</label>
          <input type="text" value="justcallmesidd@gmail.com" readonly style="width:100%; padding:3px; background:#f4f4f4; border:1px solid #808080;" />
        </div>
        <div>
          <label style="font-weight:700; font-size:0.78rem;">Phone / Cellular:</label>
          <input type="text" value="+91 8318983400" readonly style="width:100%; padding:3px; background:#f4f4f4; border:1px solid #808080;" />
        </div>
        <div>
          <label style="font-weight:700; font-size:0.78rem;">Subject:</label>
          <input type="text" value="Data / AI Opportunity Discussion" style="width:100%; padding:3px; border:1px solid #808080;" />
        </div>
        <div>
          <label style="font-weight:700; font-size:0.78rem;">Social Transmitters:</label>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <a href="https://linkedin.com/in/justcallmesidd/" target="_blank" class="retro-button" style="text-decoration:none;">LinkedIn ↗</a>
            <a href="https://github.com/JustCallMeSidd" target="_blank" class="retro-button" style="text-decoration:none;">GitHub ↗</a>
            <a href="https://leetcode.com/u/SagedWithSid/" target="_blank" class="retro-button" style="text-decoration:none;">LeetCode ↗</a>
          </div>
        </div>
        <div style="margin-top:10px;">
          <a href="mailto:justcallmesidd@gmail.com?subject=Opportunity%20Inquiry" class="retro-button" style="display:inline-block; padding:6px 16px; text-decoration:none;">
            🚀 Send via Mail Client
          </a>
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 8: RECYCLE BIN (Deleted Ideas & Lessons)
  // ------------------------------------------------------------
  function renderRecycleBinApp(container) {
    triggerOsSignal(14, 'Archaeology of Code', 'Recycle Bin opened. Deleted ideas hold valuable lessons.');

    container.innerHTML = `
      <div style="font-size:0.8rem; color:#505050; margin-bottom:8px;">
        Archived experiments, rejected architectures, and lessons learned:
      </div>
      <div class="retro-field-inset" style="height:260px; overflow-y:auto; font-size:0.78rem;">
        <div style="border-bottom:1px solid #e0e0e0; padding:6px 0;">
          <div style="font-weight:700; color:#800000;">🗑️ Over-Engineered Microservices Prototype (2024)</div>
          <div style="color:#505050;">Lesson: Distributed complexity for a small pipeline kills iteration velocity. Monoliths first!</div>
        </div>

        <div style="border-bottom:1px solid #e0e0e0; padding:6px 0;">
          <div style="font-weight:700; color:#800000;">🗑️ 150-Epoch GAN Without Checkpoint Pruning (2024)</div>
          <div style="color:#505050;">Lesson: Mode collapse occurred at epoch 112. Always log FID scores and save gradient checkpoints.</div>
        </div>

        <div style="border-bottom:1px solid #e0e0e0; padding:6px 0;">
          <div style="font-weight:700; color:#800000;">🗑️ Un-indexed 1M Row SQL Join Script (2025)</div>
          <div style="color:#505050;">Lesson: Execution time plummeted from 42s to 180ms after proper composite B-Tree indexing.</div>
        </div>

        <div style="padding:6px 0; color:#008000; font-style:italic;">
          "Sometimes experiments fail. Both outcomes are necessary to master engineering."
        </div>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 9: README.TXT (Notepad)
  // ------------------------------------------------------------
  function renderReadmeApp(container) {
    container.innerHTML = `
      <div class="retro-field-inset" style="height:250px; font-family:'Courier New', monospace; font-size:0.85rem; line-height:1.5;">
=====================================================
SIDDHARTH_OS v1.0 README.TXT
=====================================================

Welcome to my retro workstation. 

I built this operating system layer to remind myself (and visitors) 
why we fell in love with computing in the first place: 
the sheer joy of discovering what happens when you click something.

Whether you are looking at my 3NF PostgreSQL pipelines, 
my 95% accuracy TumorNet model, or my institutional equity research,
every line was written with focus and care.

Made with curiosity.

— Siddharth Gupta
Bennett University '26
      </div>
    `;
  }

  // ------------------------------------------------------------
  // APP 10: MINESWEEPER RETRO GAME
  // ------------------------------------------------------------
  function renderMinesweeperApp(container) {
    container.classList.add('gray-bg');
    container.innerHTML = `
      <div class="minesweeper-frame">
        <div class="ms-header">
          <div class="ms-counter" id="ms-flags">010</div>
          <button class="ms-smiley" id="ms-reset-btn">🙂</button>
          <div class="ms-counter" id="ms-timer">000</div>
        </div>
        <div class="ms-grid" id="ms-grid"></div>
      </div>
    `;

    const gridEl = container.querySelector('#ms-grid');
    const resetBtn = container.querySelector('#ms-reset-btn');
    const timerEl = container.querySelector('#ms-timer');
    const flagsEl = container.querySelector('#ms-flags');

    const rows = 9, cols = 9, totalMines = 10;
    let board = [];
    let revealedCount = 0;
    let gameOver = false;
    let timer = 0, timerId = null;

    function initBoard() {
      board = [];
      revealedCount = 0;
      gameOver = false;
      clearInterval(timerId);
      timer = 0;
      if (timerEl) timerEl.textContent = '000';
      if (flagsEl) flagsEl.textContent = '010';
      if (resetBtn) resetBtn.textContent = '🙂';
      gridEl.innerHTML = '';

      // Initialize empty cells
      for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
          board[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
        }
      }

      // Plant mines
      let planted = 0;
      while (planted < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
          board[r][c].mine = true;
          planted++;
        }
      }

      // Calculate adjacent numbers
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c].mine) continue;
          let cnt = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                cnt++;
              }
            }
          }
          board[r][c].count = cnt;
        }
      }

      // Render cells
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.className = 'ms-cell';
          cell.setAttribute('data-r', r);
          cell.setAttribute('data-c', c);

          cell.addEventListener('click', () => clickCell(r, c));
          cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFlag(r, c);
          });
          gridEl.appendChild(cell);
        }
      }

      timerId = setInterval(() => {
        timer++;
        if (timerEl) timerEl.textContent = String(Math.min(999, timer)).padStart(3, '0');
      }, 1000);
    }

    function clickCell(r, c) {
      if (gameOver || board[r][c].revealed || board[r][c].flagged) return;

      const cell = board[r][c];
      cell.revealed = true;
      revealedCount++;

      const el = gridEl.children[r * cols + c];
      el.classList.add('revealed');

      if (cell.mine) {
        el.textContent = '💣';
        el.style.background = '#ff0000';
        endGame(false);
        return;
      }

      if (cell.count > 0) {
        el.textContent = cell.count;
        const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
        el.style.color = colors[cell.count] || '#000';
      } else {
        // Flood fill empty neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !board[nr][nc].revealed) {
              clickCell(nr, nc);
            }
          }
        }
      }

      retroBeep(700, 0.02);

      // Check win
      if (revealedCount === rows * cols - totalMines) {
        endGame(true);
      }
    }

    function toggleFlag(r, c) {
      if (gameOver || board[r][c].revealed) return;
      board[r][c].flagged = !board[r][c].flagged;
      const el = gridEl.children[r * cols + c];
      el.textContent = board[r][c].flagged ? '🚩' : '';
      retroBeep(900, 0.02);
    }

    function endGame(won) {
      gameOver = true;
      clearInterval(timerId);
      if (resetBtn) resetBtn.textContent = won ? '😎' : '😵';
      if (won) {
        retroBeep(1000, 0.2, 'triangle');
        if (typeof window.showToast === 'function') {
          window.showToast('🏆 Minesweeper cleared! Curiosity pays off.');
        }
      } else {
        retroBeep(200, 0.3, 'sawtooth');
      }
    }

    resetBtn.addEventListener('click', initBoard);
    initBoard();
  }

  // ------------------------------------------------------------
  // APP 11: TERMINAL (MS-DOS Style Command Prompt)
  // ------------------------------------------------------------
  function renderTerminalApp(container) {
    container.style.background = '#000000';
    container.style.color = '#00f5a0';
    container.style.fontFamily = "'Courier New', monospace";
    container.style.padding = '10px';

    container.innerHTML = `
      <div id="dos-output" style="height:310px; overflow-y:auto; line-height:1.4; white-space:pre-wrap;">
Microsoft Windows-DOS [Version 6.22 - SiddharthOS Kernel]
(C) Copyright Siddharth Gupta 2026. All rights reserved.

Type 'DIR' for directory listing, 'VER' for version, or 'HELP' for commands.
      </div>
      <div style="display:flex; align-items:center; gap:6px; margin-top:6px; border-top:1px solid #333; padding-top:4px;">
        <span style="color:#ffffff;">C:\\&gt;</span>
        <input type="text" id="dos-input" autocomplete="off" spellcheck="false" style="flex:1; background:transparent; border:none; outline:none; color:#00f5a0; font-family:inherit; font-size:0.9rem;" />
      </div>
    `;

    const out = container.querySelector('#dos-output');
    const inp = container.querySelector('#dos-input');

    const DOS_COMMANDS = {
      dir: () => `
 Volume in drive C is SIDDHARTH_OS
 Directory of C:\\

PROJECTS       <DIR>          02-10-26  10:00p
DASHBOARDS     <DIR>          02-10-26  10:00p
RESUME   PDF        428,102   02-10-26  10:00p
README   TXT          1,024   02-10-26  10:00p
SECRET   TXT             42   02-10-26  10:00p
       3 File(s)        429,168 bytes
       2 Dir(s)   34,209,112,000 bytes free`,

      ver: () => `SiddharthOS [Version 1.0.4 - Built with Pure Vanilla JavaScript]`,

      date: () => `Current date is: ${new Date().toLocaleDateString()}`,

      tree: () => `
C:\\
├── PROJECTS
│   ├── AIRLINE_RISK
│   ├── TUMOR_X_MRI
│   ├── INFOSYS_EQUITY
│   ├── INVOICEWISE_ERP
│   └── VELLUM_AI
├── DASHBOARDS
│   ├── INDIA_EV
│   ├── SEISMIC_RISK
│   └── FLIGHT_DELAY
└── SYSTEM`,

      'ping hire.me': () => `
Pinging hire.me [127.0.0.1] with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Ping statistics for hire.me:
    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)
Result: Candidate available. Reach via justcallmesidd@gmail.com!`,

      'format c:': () => `Access denied: Drive C contains valuable engineering knowledge. Nice try! 🙂`,

      cls: () => { out.innerHTML = ''; return ''; },

      'type secret.txt': () => {
        triggerOsSignal(15, 'Kernel Decryption', 'You discovered secret.txt hidden inside the filesystem!');
        return `SECRET TELEMETRY KEY: [SIDDHARTH_2026_ML_RESEARCH_PROT]`;
      },

      help: () => `Supported Commands:
  DIR, VER, DATE, TREE, TYPE <file>, PING HIRE.ME, FORMAT C:, CLS, EXIT, SHUTDOWN, HELP`
    };

    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = inp.value.trim();
        inp.value = '';
        if (!cmd) return;

        out.innerHTML += `\nC:\\&gt; ${cmd}`;
        const lower = cmd.toLowerCase();

        if (DOS_COMMANDS[lower]) {
          const res = DOS_COMMANDS[lower]();
          if (res) out.innerHTML += `\n${res}`;
        } else if (lower === 'exit' || lower === 'shutdown') {
          window.shutdownRetroOS();
        } else {
          out.innerHTML += `\nBad command or file name. Type 'HELP'.`;
        }

        out.scrollTop = out.scrollHeight;
        retroBeep(700, 0.02);
      }
    });
  }

  // ------------------------------------------------------------
  // DESKTOP CONTEXT MENU & WALLPAPER SWITCHER
  // ------------------------------------------------------------
  function initContextMenu() {
    const desktop = document.getElementById('retro-os-desktop');
    const ctxMenu = document.getElementById('retro-ctx-menu');
    if (!desktop || !ctxMenu) return;

    desktop.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      triggerOsSignal(13, 'Direct Terminal Pointer', 'Right-clicked the retro desktop.');

      ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 180) + 'px';
      ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 150) + 'px';
      ctxMenu.classList.add('open');
      retroBeep(850, 0.03);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#retro-ctx-menu')) {
        ctxMenu.classList.remove('open');
      }
    });

    // Context menu actions
    document.getElementById('ctx-refresh')?.addEventListener('click', () => {
      ctxMenu.classList.remove('open');
      retroBeep(900, 0.04);
    });

    document.getElementById('ctx-terminal')?.addEventListener('click', () => {
      ctxMenu.classList.remove('open');
      openApp('terminal');
    });

    document.getElementById('ctx-wallpaper')?.addEventListener('click', () => {
      ctxMenu.classList.remove('open');
      cycleWallpaper();
    });

    document.getElementById('ctx-properties')?.addEventListener('click', () => {
      ctxMenu.classList.remove('open');
      openApp('profile');
    });
  }

  function applyWallpaper(name) {
    const container = document.getElementById('retro-os-container');
    if (!container) return;
    const safeName = (name === 'bliss' || name === 'teal' || name === 'cyber' || name === 'charcoal') ? name : 'bliss';
    container.setAttribute('data-wallpaper', safeName);
    if (safeName === 'bliss') {
      container.style.backgroundImage = "url('retro-wallpaper.jpg?v=3')";
      container.style.backgroundColor = "#245edb";
      container.style.backgroundSize = "cover";
      container.style.backgroundPosition = "center bottom";
      container.style.backgroundRepeat = "no-repeat";
    } else {
      container.style.backgroundImage = "";
      container.style.backgroundColor = "";
      container.style.backgroundSize = "";
      container.style.backgroundPosition = "";
      container.style.backgroundRepeat = "";
    }
  }

  function cycleWallpaper() {
    const container = document.getElementById('retro-os-container');
    if (!container) return;
    const current = container.getAttribute('data-wallpaper') || 'bliss';
    const wallpapers = ['bliss', 'teal', 'cyber', 'charcoal'];
    const idx = wallpapers.indexOf(current);
    const next = wallpapers[(idx + 1) % wallpapers.length];
    applyWallpaper(next);
    try {
      localStorage.setItem('retro_wallpaper', next);
    } catch (e) {}
    if (typeof window.showToast === 'function') {
      const names = { bliss: 'Classic Bliss Hill', teal: 'Retro Teal Grid', cyber: 'Cyber Midnight', charcoal: 'Charcoal Dark' };
      window.showToast(`🖼️ Desktop wallpaper: ${names[next] || next}`);
    }
  }

  // ------------------------------------------------------------
  // START MENU CONTROLS
  // ------------------------------------------------------------
  function initStartMenu() {
    const startBtn = document.getElementById('retro-start-btn');
    const startMenu = document.getElementById('retro-start-menu');
    if (!startBtn || !startMenu) return;

    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = startMenu.classList.toggle('open');
      startBtn.classList.toggle('active', isOpen);
      retroBeep(700, 0.03);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#retro-start-menu') && !e.target.closest('#retro-start-btn')) {
        startMenu.classList.remove('open');
        startBtn.classList.remove('active');
      }
    });

    // Start menu item bindings
    document.querySelectorAll('[data-os-app]').forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.getAttribute('data-os-app');
        openApp(appId);
        startMenu.classList.remove('open');
        startBtn.classList.remove('active');
      });
    });

    document.getElementById('start-shutdown-btn')?.addEventListener('click', () => {
      startMenu.classList.remove('open');
      startBtn.classList.remove('active');
      window.shutdownRetroOS();
    });
  }

  // ------------------------------------------------------------
  // SCREENSAVER (Bouncing Text after 60s idle)
  // ------------------------------------------------------------
  let ssX = 50, ssY = 50, ssDx = 2, ssDy = 2;
  let ssAnimId = null;

  function resetScreensaverTimer() {
    clearTimeout(screensaverTimer);
    const ssEl = document.getElementById('retro-screensaver');
    if (ssEl) ssEl.classList.remove('active');
    cancelAnimationFrame(ssAnimId);

    if (isRetroActive) {
      screensaverTimer = setTimeout(() => {
        if (!isRetroActive) return;
        launchScreensaver();
      }, 60000); // 60s
    }
  }

  function launchScreensaver() {
    const ssEl = document.getElementById('retro-screensaver');
    const textEl = document.getElementById('screensaver-text');
    if (!ssEl || !textEl) return;

    ssEl.classList.add('active');

    function step() {
      ssX += ssDx;
      ssY += ssDy;

      if (ssX <= 0 || ssX >= window.innerWidth - textEl.offsetWidth) ssDx *= -1;
      if (ssY <= 0 || ssY >= window.innerHeight - textEl.offsetHeight) ssDy *= -1;

      textEl.style.left = ssX + 'px';
      textEl.style.top = ssY + 'px';
      ssAnimId = requestAnimationFrame(step);
    }
    step();

    const stopHandler = () => {
      ssEl.classList.remove('active');
      cancelAnimationFrame(ssAnimId);
      resetScreensaverTimer();
      document.removeEventListener('keydown', stopHandler);
      document.removeEventListener('mousemove', stopHandler);
    };
    document.addEventListener('keydown', stopHandler, { once: true });
    document.addEventListener('mousemove', stopHandler, { once: true });
  }

  // ------------------------------------------------------------
  // REAL-TIME SYSTEM TRAY CLOCK
  // ------------------------------------------------------------
  function updateClock() {
    const clockEl = document.getElementById('retro-tray-clock');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ------------------------------------------------------------
  // GLOBAL HOTKEYS (Alt+R, Alt+Tab, Escape)
  // ------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Alt + R toggles Retro OS
    if (e.altKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      if (isRetroActive) window.shutdownRetroOS();
      else window.bootRetroOS();
    }

    if (!isRetroActive) return;

    // Escape closes menus & dialogs
    if (e.key === 'Escape') {
      document.getElementById('retro-start-menu')?.classList.remove('open');
      document.getElementById('retro-start-btn')?.classList.remove('active');
      document.getElementById('retro-ctx-menu')?.classList.remove('open');
    }
  });

  // ------------------------------------------------------------
  // INITIALIZATION ON SCRIPT LOAD
  // ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initStartMenu();
    initContextMenu();
    updateClock();
    setInterval(updateClock, 1000);

    // Restore saved wallpaper (migrating legacy 'teal' to new default 'bliss')
    try {
      const savedWp = localStorage.getItem('retro_wallpaper');
      const activeWp = (!savedWp || savedWp === 'teal') ? 'bliss' : savedWp;
      localStorage.setItem('retro_wallpaper', activeWp);
      applyWallpaper(activeWp);
    } catch (e) {
      applyWallpaper('bliss');
    }

    // Desktop icons binding (double click on desktop, single on touch)
    document.querySelectorAll('.retro-desktop-icon').forEach(icon => {
      const appId = icon.getAttribute('data-app');
      icon.addEventListener('dblclick', () => openApp(appId));
      icon.addEventListener('touchend', (e) => {
        e.preventDefault();
        openApp(appId);
      });
    });

    // CRT Toggle button in system tray
    document.getElementById('retro-tray-crt')?.addEventListener('click', () => {
      crtEnabled = !crtEnabled;
      const overlay = document.querySelector('.retro-crt-overlay');
      if (overlay) overlay.classList.toggle('disabled', !crtEnabled);
      retroBeep(crtEnabled ? 800 : 400, 0.05);
      if (typeof window.showToast === 'function') {
        window.showToast(crtEnabled ? '📺 CRT Scanlines: ON' : '📺 CRT Scanlines: OFF');
      }
    });

    ['mousemove', 'keydown', 'click'].forEach(evt => {
      document.addEventListener(evt, resetScreensaverTimer, { passive: true });
    });
  });

})();
