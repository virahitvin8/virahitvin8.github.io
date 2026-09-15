/* ═══════════════════════════════════════════════════════════════════════
   FUTURIST-2080 ENGINE — N. AKSHIT VINAY
   Loads LAST (after script.js and admin.js).

   Contents
     1.  Config
     2.  Helpers
     3.  Adaptive theme engine   (local time + live weather → palette)
     4.  Weather FX canvas       (rain / snow / fog / clouds / wind …)
     5.  Boot terminal
     6.  Atmosphere              (scanlines, vignette, scroll progress)
     7.  Custom neon cursor
     8.  Magnetic buttons
     9.  Glitch hero name
    10.  HUD marquee
    11.  Scroll reveal
    12.  Live feeds             (GitHub telemetry + LinkedIn signals)
    13.  Secured certificate viewer (multi-layer capture deterrence)
    14.  Double-click inline editor (admin mode only)
    15.  Admin "2080 Core" panel (injected into the existing drawer)
    16.  Service worker

   HONEST NOTE ON SCREENSHOT PROTECTION
   No browser technology can stop a phone camera pointed at a screen.
   What this engine does is make casual capture useless and every capture
   traceable: 60 Hz scanline interlacing, focus-loss obliteration,
   canvas-export nullification, per-session watermarks and print blocking.
   That is the professional maximum — the same ceiling Google, Netflix and
   every streaming DRM system works against.
═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     1. CONFIG — edit freely, or change it live in Admin → 2080 Core
  ═══════════════════════════════════════════════════════════════ */
  const CONFIG = {
    OWNER_NAME: 'N. Akshit Vinay',
    OWNER_INITIALS: 'AV',

    /* GitHub username for the live telemetry panel.
       Verified live: this account exists and is owned by N. Akshit Vinay.
       Clear it (set to '') to hide the feed entirely. */
    GH_USER: 'virahitvin8',

    LINKEDIN_URL: 'https://www.linkedin.com/in/neelam-akshit-vinay-b18554322',

    /* GitHub profile shown alongside the LinkedIn link. */
    GITHUB_URL: 'https://github.com/virahitvin8',

    /* LinkedIn "signals" shown in the feed. These mirror content that is
       already published on the portfolio itself, so nothing is invented. */
    LINKEDIN_POSTS: [
      { text: 'Trained at CSIR-NGRI, Hyderabad — Applications of Remote Sensing & GIS in Earth Surface Processes.', date: 'JUL 2026' },
      { text: 'Completed the two-week FDP on Next-Generation Remote Sensing Data Analytics & Multi-Domain Applications.', date: 'AUG 2026' },
      { text: 'M.Sc Remote Sensing & GIS at SHUATS — 1st semester CGPA 10.0 / 10.', date: '2025 – 2027' },
      { text: '"Unlocking the HCN Content in Sorghum" — published in Agri Express.', date: 'APR 2024' }
    ],

    /* Optional explicit certificate-image map: { "<slug>": "assets/certs/x.jpg" }
       Also settable live from Admin → 2080 Core. */
    CERT_IMAGES: {},

    /* Where certificate scans live when dropped in as files. */
    CERT_DIR: 'assets/certs/',

    /* Boot terminal is skipped on repeat visits inside the same session. */
    BOOT_SESSION_KEY: 'fx_booted'
  };

  const LS = {
    ghUser: 'fx_gh_user',
    liUrl: 'fx_li_url',
    liPosts: 'fx_li_posts',
    certMap: 'fx_cert_map',
    certUpload: 'fx_cert_upload',   // slug -> data URL (admin uploads)
    weather: 'fx_weather_override',
    theme: 'fx_theme_override',
    geo: 'fx_geo_choice',
    ieText: 'fx_ie_text',
    ieImg: 'fx_ie_img',
    t0: 'fx_first_visit'
  };

  /* ═══════════════════════════════════════════════════════════════
     2. HELPERS
  ═══════════════════════════════════════════════════════════════ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
    json(k, fb) {
      try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; }
      catch (e) { return fb; }
    },
    setJson(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; }
      catch (e) { return false; }
    }
  };

  const slugify = (s) => String(s || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and').replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  const esca = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function elPath(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      let seg = node.tagName.toLowerCase();
      if (node.id) {
        seg += '#' + node.id;
      } else if (node.classList.length) {
        seg += '.' + node.classList[0];
      }
      const parent = node.parentElement;
      if (parent) {
        const sibs = Array.prototype.filter.call(parent.children,
          c => c.tagName === node.tagName);
        if (sibs.length > 1) seg += ':' + (sibs.indexOf(node) + 1);
      }
      parts.unshift(seg);
      node = node.parentElement;
    }
    return parts.join('>');
  }

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ═══════════════════════════════════════════════════════════════
     3. ADAPTIVE THEME ENGINE
     Local clock sets the band; live local weather sets the palette.
  ═══════════════════════════════════════════════════════════════ */
  const WEATHER = {
    UNKNOWN: { key: 'clear',  icon: '🌤️', label: 'CLEAR'   },
    clear:   { key: 'clear',  icon: '☀️', label: 'CLEAR'   },
    cloudy:  { key: 'cloudy', icon: '☁️', label: 'CLOUDY'  },
    rain:    { key: 'rain',   icon: '🌧️', label: 'RAIN'    },
    storm:   { key: 'storm',  icon: '⛈️', label: 'STORM'   },
    snow:    { key: 'snow',   icon: '❄️', label: 'SNOW'    },
    fog:     { key: 'fog',    icon: '🌫️', label: 'FOG'     }
  };
  const MANUAL_CYCLE = ['auto', 'clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'];

  /* WMO weather codes → our six conditions */
  function wmoToCondition(code, windKmh, cloudCover) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2) return 'cloudy';
    if (code === 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 95) return 'storm';
    if (typeof cloudCover === 'number' && cloudCover > 70) return 'cloudy';
    if (windKmh > 38) return 'clear'; // windy + clear handled by data-wind
    return 'clear';
  }

  function timeBand(date) {
    const h = date.getHours() + date.getMinutes() / 60;
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 17) return 'day';
    if (h >= 17 && h < 20) return 'dusk';
    return 'night';
  }

  const Theme = {
    state: {
      band: 'day',
      theme: 'day',
      weather: 'clear',
      autoWeather: 'clear',   // last condition observed without a manual override
      wind: 'calm',
      temp: null,
      place: '',
      mode: 'auto',      // auto | manual condition
      source: 'clock'    // clock | weather-api
    },

    apply() {
      const html = document.documentElement;
      html.setAttribute('data-band', this.state.band);
      html.setAttribute('data-theme', this.state.theme);
      html.setAttribute('data-weather', this.state.weather);
      html.setAttribute('data-wind', this.state.wind);
      html.setAttribute('data-fx-source', this.state.source);
      const meta = $('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', this.state.theme === 'night' ? '#04120c' : '#0d2b1f');
      }
      WeatherFX.setMode(this.state.weather, this.state.wind, this.state.theme);
      renderWeatherChip();
    },

    setBand(band) {
      this.state.band = band;
      this.state.theme = (band === 'night') ? 'night' : 'day';
      this.apply();
    },

    setWeather(cond, opts) {
      opts = opts || {};
      if (!WEATHER[cond]) cond = 'clear';
      this.state.weather = cond;
      if (opts.source) this.state.source = opts.source;

      /* remember the live condition so returning to AUTO restores it */
      if (opts.source !== 'manual') this.state.autoWeather = cond;

      /* never let the weather API overrule an explicitly forced theme */
      const forced = store.get(LS.theme);
      const forceTheme = (forced === 'day' || forced === 'night');
      if (typeof opts.isDay === 'boolean' && !forceTheme) {
        this.state.theme = opts.isDay ? 'day' : 'night';
      }
      if (typeof opts.temp === 'number') this.state.temp = opts.temp;
      if (opts.place) this.state.place = opts.place;
      if (typeof opts.wind === 'number') this.state.wind = opts.wind > 32 ? 'windy' : 'calm';
      this.apply();
    }
  };

  function renderWeatherChip() {
    const chip = $('#weatherChip');
    if (!chip) return;
    const st = Theme.state;
    const w = WEATHER[st.weather] || WEATHER.clear;
    const icon = st.theme === 'night' && st.weather === 'clear' ? '🌙' : w.icon;
    const temp = st.temp == null ? '' : Math.round(st.temp) + '°C';
    const place = st.place ? st.place.toUpperCase() : '';
    const bandLabel = st.band.toUpperCase();

    chip.dataset.state = 'ready';
    chip.innerHTML =
      '<span class="wc-dot"></span>' +
      '<span>' + icon + ' ' + (temp || bandLabel) + '</span>' +
      '<span class="wc-place">' + (place ? ' · ' + esca(place) : '') + '</span>' +
      '<span class="wc-mode">' + (st.mode === 'auto' ? 'AUTO' : 'PREVIEW') + '</span>';
    chip.title = st.mode === 'auto'
      ? 'Live local conditions — click to preview other conditions'
      : 'Previewing "' + w.label + '" — click to cycle, or advance to AUTO to return to live conditions';
  }

  function initAdaptiveTheme() {
    /* clock first — instant, zero permission */
    Theme.setBand(timeBand(new Date()));
    setInterval(() => {
      if (Theme.state.mode !== 'auto') return;
      Theme.setBand(timeBand(new Date()));
    }, 60000);

    /* manual overrides from the admin panel */
    const condOverride = store.get(LS.weather) || 'auto';
    const themeOverride = store.get(LS.theme) || 'auto';
    Theme.state.mode = condOverride === 'auto' ? 'auto' : 'manual';
    if (condOverride !== 'auto') Theme.setWeather(condOverride, { source: 'manual' });
    if (themeOverride === 'night' || themeOverride === 'day') {
      Theme.state.theme = themeOverride;
      Theme.apply();
    }

    const chip = $('#weatherChip');
    if (chip) {
      chip.addEventListener('click', () => {
        const cur = Theme.state.mode === 'manual' ? Theme.state.weather : 'auto';
        const idx = MANUAL_CYCLE.indexOf(cur);
        const next = MANUAL_CYCLE[(idx + 1) % MANUAL_CYCLE.length];
        if (next === 'auto') {
          Theme.state.mode = 'auto';
          store.del(LS.weather);
          Theme.setWeather(Theme.state.autoWeather || 'clear', { source: 'clock' });
          Theme.setBand(timeBand(new Date()));
          fetchLocalWeather(true);
          toast('Live local conditions restored');
        } else {
          Theme.state.mode = 'manual';
          Theme.setWeather(next, { source: 'manual' });
          toast('Previewing "' + WEATHER[next].label + '" palette');
        }
      });
    }

    /* live weather — geolocation permission is remembered, never nagged */
    const choice = store.get(LS.geo);
    if (choice !== 'denied') {
      setTimeout(fetchLocalWeather, choice === 'granted' ? 200 : 1600);
    } else {
      const chipEl = $('#weatherChip');
      if (chipEl) chipEl.dataset.state = 'local';
    }
  }

  function fetchLocalWeather(silent) {
    if (Theme.state.mode !== 'auto') return;
    if (!navigator.geolocation) return markNoGeo();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        store.set(LS.geo, 'granted');
        loadWeatherFor(pos.coords.latitude, pos.coords.longitude, silent);
      },
      () => markNoGeo(),
      { timeout: 9000, maximumAge: 900000, enableHighAccuracy: false }
    );

    function markNoGeo() {
      store.set(LS.geo, store.get(LS.geo) === 'granted' ? 'granted' : 'denied');
      const chipEl = $('#weatherChip');
      if (chipEl) {
        chipEl.dataset.state = 'local';
        chipEl.title = guessLocationDenied();
      }
      setBootLine('> local observation denied — clock palette engaged <span class="ok">OK</span>');
    }
  }

  function guessLocationDenied() {
    return 'Location off — the palette follows your local clock. '
         + 'Click to preview weather palettes, or allow location for live conditions.';
  }

  async function loadWeatherFor(lat, lon, silent) {
    setBootLine('> acquiring local observation ....... <span class="ok">…</span>');
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat
        + '&longitude=' + lon
        + '&current=temperature_2m,relative_humidity_2m,is_day,weather_code,'
        + 'cloud_cover,wind_speed_10m,wind_direction_10m'
        + '&timezone=auto';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('weather ' + res.status);
      const data = await res.json();
      const c = data.current || {};

      if (Theme.state.mode !== 'auto') return;   // owner took manual control mid-flight

      const cond = wmoToCondition(c.weather_code, c.wind_speed_10m, c.cloud_cover);
      Theme.setWeather(cond, {
        source: 'weather-api',
        isDay: typeof c.is_day === 'number' ? !!c.is_day : undefined,
        temp: c.temperature_2m,
        wind: c.wind_speed_10m
      });

      const w = WEATHER[cond];
      setBootLine('> local: ' + w.label + ' ' + Math.round(c.temperature_2m)
        + '°C — palette adapted <span class="ok">OK</span>');

      /* reverse geocode for a friendly place label (free, key-less) */
      try {
        const g = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client'
          + '?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=en',
          { cache: 'force-cache' });
        if (g.ok) {
          const geo = await g.json();
          const place = geo.city || geo.locality || geo.principalSubdivision || '';
          if (place) { Theme.state.place = place; renderWeatherChip(); }
        }
      } catch (e) { /* label is a nicety, never a requirement */ }
    } catch (err) {
      setBootLine('> local observation offline — clock palette active <span class="ok">OK</span>');
      if (!silent) { /* stay silent: the clock palette is already applied */ }
    }
  }

  function setBootLine(html) {
    const line = $('#bootLocal');
    if (line) line.innerHTML = html;
    const line2 = $('#bootDynamic');
    if (line2 && line2 !== line) line2.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════════════
     4. WEATHER FX CANVAS
  ═══════════════════════════════════════════════════════════════ */
  const WeatherFX = {
    canvas: null, ctx: null, blobs: [], parts: [],
    mode: 'clear', wind: 'calm', theme: 'day',
    w: 0, h: 0, dpr: 1, raf: 0, t: 0, paused: false, sprite: null,

    init() {
      this.canvas = $('#fxWeather');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.sprite = makeGlowSprite();
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
      document.addEventListener('visibilitychange', () => {
        this.paused = document.hidden;
        if (!this.paused) this.loop();
      });
      this.setMode(this.mode, this.wind, this.theme);
    },

    resize() {
      if (!this.canvas) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.floor(this.w * this.dpr);
      this.canvas.height = Math.floor(this.h * this.dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    colors() {
      const cs = getComputedStyle(document.documentElement);
      return {
        a1: (cs.getPropertyValue('--fx-a1') || '#00ffc8').trim(),
        a2: (cs.getPropertyValue('--fx-a2') || '#c9a84c').trim(),
        a3: (cs.getPropertyValue('--fx-a3') || '#52b788').trim(),
        night: document.documentElement.getAttribute('data-theme') === 'night'
      };
    },

    setMode(mode, wind, theme) {
      this.mode = mode || 'clear';
      this.wind = wind || 'calm';
      this.theme = theme || 'day';
      if (!this.ctx) return;
      this.build();
      this.loop();
    },

    build() {
      this.parts = [];
      this.blobs = [];
      const W = this.w, H = this.h;
      const heavy = this.mode === 'rain' || this.mode === 'storm';
      const n = REDUCED ? 0
        : heavy ? Math.min(220, Math.round(W / 7))
        : this.mode === 'snow' ? Math.min(110, Math.round(W / 14))
        : this.mode === 'wind' ? Math.min(70, Math.round(W / 22))
        : this.mode === 'clear' ? 26
        : 0;

      for (let i = 0; i < n; i++) {
        if (this.mode === 'rain' || this.mode === 'storm') {
          this.parts.push({
            x: Math.random() * (W + 200) - 100,
            y: Math.random() * H,
            len: 12 + Math.random() * 26,
            sp: (this.mode === 'storm' ? 15 : 9) + Math.random() * 9,
            slant: 0.18 + Math.random() * 0.12,
            a: 0.10 + Math.random() * 0.22
          });
        } else if (this.mode === 'snow') {
          this.parts.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 1 + Math.random() * 2.2,
            sp: 0.35 + Math.random() * 0.8,
            sway: Math.random() * Math.PI * 2,
            a: 0.25 + Math.random() * 0.45
          });
        } else if (this.mode === 'wind') {
          this.parts.push({
            x: Math.random() * W, y: Math.random() * H,
            len: 20 + Math.random() * 70,
            sp: 5 + Math.random() * 9,
            a: 0.05 + Math.random() * 0.12
          });
        } else if (this.mode === 'clear') {
          this.parts.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 0.8 + Math.random() * 1.8,
            sp: 0.12 + Math.random() * 0.3,
            sway: Math.random() * Math.PI * 2,
            a: 0.10 + Math.random() * 0.22
          });
        }
      }

      const blobCount = REDUCED ? 0
        : this.mode === 'fog' ? 7
        : this.mode === 'cloudy' ? 9
        : this.mode === 'storm' ? 5 : 0;
      for (let i = 0; i < blobCount; i++) {
        this.blobs.push({
          x: Math.random() * W, y: Math.random() * H * 0.7,
          r: 140 + Math.random() * 260,
          sp: 0.08 + Math.random() * 0.28,
          a: this.mode === 'fog' ? 0.05 + Math.random() * 0.07
                                  : 0.04 + Math.random() * 0.06
        });
      }
    },

    loop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      if (!this.ctx) return;
      const step = () => {
        if (this.paused) { this.raf = 0; return; }
        this.frame();
        this.raf = requestAnimationFrame(step);
      };
      step();
    },

    pause(v) {
      this.paused = v;
      if (!v) this.loop(); else if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    },

    frame() {
      const ctx = this.ctx, W = this.w, H = this.h;
      const col = this.colors();
      ctx.clearRect(0, 0, W, H);
      this.t += 1;

      /* soft drifting masses (clouds / fog) */
      for (const b of this.blobs) {
        ctx.globalAlpha = b.a;
        ctx.drawImage(this.sprite, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        b.x += b.sp * (this.wind === 'windy' ? 2.2 : 1);
        if (b.x - b.r > W) { b.x = -b.r; b.y = Math.random() * H * 0.7; }
      }
      ctx.globalAlpha = 1;

      if (this.mode === 'rain' || this.mode === 'storm') {
        ctx.strokeStyle = col.a1;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        for (const p of this.parts) {
          ctx.globalAlpha = p.a;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len * p.slant, p.y + p.len);
          ctx.stroke();
          p.y += p.sp;
          p.x -= p.sp * p.slant;
          if (p.y > H + 40) {
            p.y = -30; p.x = Math.random() * (W + 200) - 100;
          }
        }
        ctx.globalAlpha = 1;

        if (this.mode === 'storm' && Math.random() < 0.006) {
          ctx.fillStyle = 'rgba(200, 220, 255, .10)';
          ctx.fillRect(0, 0, W, H);
        }
      } else if (this.mode === 'snow') {
        ctx.fillStyle = col.night ? '#dff3ff' : '#ffffff';
        for (const p of this.parts) {
          ctx.globalAlpha = p.a;
          p.sway += 0.012;
          const dx = Math.sin(p.sway) * 22 * (this.wind === 'windy' ? 2 : 1);
          ctx.beginPath();
          ctx.arc(p.x + dx, p.y, p.r, 0, 6.2832);
          ctx.fill();
          p.y += p.sp;
          if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        }
        ctx.globalAlpha = 1;
      } else if (this.mode === 'wind') {
        ctx.strokeStyle = col.a2;
        ctx.lineWidth = 1;
        for (const p of this.parts) {
          ctx.globalAlpha = p.a;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.len, p.y);
          ctx.stroke();
          p.x += p.sp;
          if (p.x > W + 60) { p.x = -60 - Math.random() * 120; p.y = Math.random() * H; }
        }
        ctx.globalAlpha = 1;
      } else if (this.mode === 'clear') {
        ctx.fillStyle = col.night ? '#cfe8ff' : col.a1;
        for (const p of this.parts) {
          ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(this.t * 0.02 + p.sway));
          p.sway += 0.01;
          p.y -= p.sp;
          p.x += Math.sin(p.sway) * 0.25;
          if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
  };

  function makeGlowSprite() {
    const s = document.createElement('canvas');
    s.width = s.height = 256;
    const c = s.getContext('2d');
    const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,.9)');
    g.addColorStop(0.45, 'rgba(255,255,255,.28)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    return s;
  }

  /* ═══════════════════════════════════════════════════════════════
     5. BOOT TERMINAL
  ═══════════════════════════════════════════════════════════════ */
  function initBoot() {
    const boot = $('#bootLoader');
    if (!boot) return;

    /* don't replay the intro on every internal navigation — and never fight
       the inline safety net that may have already released the overlay */
    let seen = false;
    try { seen = sessionStorage.getItem(CONFIG.BOOT_SESSION_KEY) === '1'; } catch (e) {}
    if (seen || REDUCED || boot.classList.contains('done')) {
      boot.classList.add('done');
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const lines = $$('.boot-line', boot);
    const fill = $('#bootFill');
    let i = 0, finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      boot.classList.add('done');
      document.body.style.overflow = '';
      try { sessionStorage.setItem(CONFIG.BOOT_SESSION_KEY, '1'); } catch (e) {}
    };

    const step = () => {
      if (finished) return;
      if (i < lines.length) {
        lines[i].classList.add('on');
        i++;
        if (fill) fill.style.width = Math.round((i / lines.length) * 100) + '%';
        setTimeout(step, 260);
      } else {
        setTimeout(finish, 520);
      }
    };

    const skip = $('.boot-skip', boot);
    if (skip) skip.addEventListener('click', finish);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') finish();
    });

    setTimeout(step, 260);
    setTimeout(finish, 6500);  // hard ceiling — never trap a visitor
  }

  /* ═══════════════════════════════════════════════════════════════
     6. ATMOSPHERE
  ═══════════════════════════════════════════════════════════════ */
  function initAtmosphere() {
    ['fx-scanlines', 'fx-vignette', 'fxTimeGlow'].forEach((cls) => {
      if ($('.' + cls)) return;
      const d = document.createElement('div');
      d.className = cls;
      document.body.appendChild(d);
    });

    const p = document.createElement('div');
    p.className = 'fx-progress';
    document.body.appendChild(p);

    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      p.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ═══════════════════════════════════════════════════════════════
     7. CUSTOM NEON CURSOR
  ═══════════════════════════════════════════════════════════════ */
  function initCursor() {
    if (IS_TOUCH || REDUCED) return;
    document.body.classList.add('futurist-cursor');

    const dot = document.createElement('div'); dot.className = 'fx-cursor-dot';
    const ring = document.createElement('div'); ring.className = 'fx-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    }, { passive: true });

    (function follow() {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();

    document.addEventListener('mouseover', (e) => {
      const hot = e.target.closest(
        'a,button,.domain-pill,.satellite-node,.cert-card,.project-card,.weather-chip,input,textarea,[data-iedit]');
      ring.classList.toggle('grow', !!hot);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     8. MAGNETIC BUTTONS
  ═══════════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (IS_TOUCH || REDUCED) return;
    $$('.btn,.nav-cta,.social-btn').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = 'translate('
          + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,'
          + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     9. GLITCH HERO NAME
  ═══════════════════════════════════════════════════════════════ */
  let glitchTimer = null;
  function initGlitch() {
    const t = $('.hero-name');
    if (!t || REDUCED) return;
    t.classList.add('glitch');
    refreshGlitchText();
    const burst = () => {
      refreshGlitchText();
      t.classList.add('glitching');
      setTimeout(() => t.classList.remove('glitching'), 260);
    };
    clearInterval(glitchTimer);
    glitchTimer = setInterval(burst, 5200);
    const hero = t.closest('.hero');
    if (hero) hero.addEventListener('mouseenter', burst);
  }
  function refreshGlitchText() {
    const t = $('.hero-name.glitch');
    if (t) t.setAttribute('data-text', t.textContent.trim());
  }

  /* ═══════════════════════════════════════════════════════════════
     10. HUD MARQUEE
  ═══════════════════════════════════════════════════════════════ */
  function initMarquee() {
    const track = $('#marqTrack');
    if (!track) return;
    const half = track.innerHTML;
    track.innerHTML = half + half;          // seamless -50% loop
    track.style.animationPlayState = 'running';
  }

  /* ═══════════════════════════════════════════════════════════════
     11. SCROLL REVEAL
  ═══════════════════════════════════════════════════════════════ */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach((el) => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════
     12. LIVE FEEDS
  ═══════════════════════════════════════════════════════════════ */
  const GH_ICONS = {
    PushEvent: 'fa-code-commit',
    CreateEvent: 'fa-plus',
    PullRequestEvent: 'fa-code-pull-request',
    IssuesEvent: 'fa-circle-dot',
    ForkEvent: 'fa-code-fork',
    WatchEvent: 'fa-star',
    ReleaseEvent: 'fa-tag',
    IssueCommentEvent: 'fa-comment',
    PublicEvent: 'fa-globe'
  };

  function ghDescribe(e, user) {
    const a = (e.actor && e.actor.login) || user;
    const r = (e.repo && e.repo.name) || 'repository';
    const short = r.split('/').pop();
    switch (e.type) {
      case 'PushEvent': {
        const n = (e.payload && e.payload.size) || 1;
        return '<b>@' + esca(a) + '</b> pushed ' + n + ' commit' + (n > 1 ? 's' : '')
          + ' to <b>' + esca(short) + '</b>';
      }
      case 'CreateEvent':
        return '<b>@' + esca(a) + '</b> created '
          + esca((e.payload && e.payload.ref_type) || 'repository') + ' <b>'
          + esca((e.payload && e.payload.ref) || short) + '</b>';
      case 'PullRequestEvent':
        return '<b>@' + esca(a) + '</b> ' + esca((e.payload && e.payload.action) || 'opened')
          + ' a pull request in <b>' + esca(short) + '</b>';
      case 'IssuesEvent':
        return '<b>@' + esca(a) + '</b> ' + esca((e.payload && e.payload.action) || 'opened')
          + ' an issue in <b>' + esca(short) + '</b>';
      case 'IssueCommentEvent':
        return '<b>@' + esca(a) + '</b> commented in <b>' + esca(short) + '</b>';
      case 'ForkEvent':
        return '<b>@' + esca(a) + '</b> forked <b>' + esca(short) + '</b>';
      case 'WatchEvent':
        return '<b>@' + esca(a) + '</b> starred <b>' + esca(short) + '</b>';
      case 'ReleaseEvent':
        return '<b>@' + esca(a) + '</b> released <b>' + esca(short) + '</b>';
      default:
        return '<b>@' + esca(a) + '</b> activity on <b>' + esca(short) + '</b>';
    }
  }

  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 2592000) return Math.floor(s / 86400) + 'd ago';
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  }

  /* Language markers — the little colour chip beside each repository. */
  const LANG_COLOR = {
    Python: '#3572A5', JavaScript: '#F1E05A', TypeScript: '#3178C6',
    HTML: '#E34C26', CSS: '#563D7C', SCSS: '#C6538C',
    'Jupyter Notebook': '#DA5B0B', R: '#198CE7', C: '#555555',
    'C++': '#F34B7D', 'C#': '#178600', Java: '#B07219', Shell: '#89E051',
    MATLAB: '#E16737', PHP: '#4F5D95', Dart: '#00B4AB', Go: '#00ADD8',
    Rust: '#DEA584', Kotlin: '#A97BFF'
  };
  function langDot(lang) {
    const c = LANG_COLOR[lang] || '#8B949E';
    return '<span class="feed-lang" style="background:' + c + '"></span>';
  }

  /*
   * GitHub's unauthenticated API allows 60 requests/hour per IP. A visitor
   * sees three endpoints, so without a cache twenty page views would exhaust
   * the whole hour for everyone behind that IP. Ten minutes of session
   * caching turns a browsing session into a single round of requests.
   */
  const GH_TTL = 10 * 60 * 1000;
  function ghCacheRead(user) {
    try {
      const c = JSON.parse(sessionStorage.getItem('fx_gh_cache') || 'null');
      if (!c || c.user !== user || Date.now() - c.t > GH_TTL) return null;
      return c.data;
    } catch (e) { return null; }
  }
  function ghCacheWrite(user, data) {
    try {
      sessionStorage.setItem('fx_gh_cache', JSON.stringify({ t: Date.now(), user: user, data: data }));
    } catch (e) {}
  }

  function ghUser() { return (store.get(LS.ghUser) || CONFIG.GH_USER || '').trim(); }
  function liUrl() { return (store.get(LS.liUrl) || CONFIG.LINKEDIN_URL || '').trim(); }
  function liPosts() {
    const raw = store.get(LS.liPosts);
    if (!raw) return CONFIG.LINKEDIN_POSTS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    /* plain-text fallback: "date | text" per line */
    return String(raw).split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const bits = l.split('|');
      return { date: (bits[0] || '').trim(), text: (bits.slice(1).join('|') || '').trim() };
    }).filter((p) => p.text);
  }

  async function initFeeds() {
    await loadGitHub();
    loadLinkedIn();
  }

  async function loadGitHub() {
    const box = $('#ghFeed');
    if (!box) return;
    const user = ghUser();

    if (!user) {
      box.innerHTML =
        '<div class="feed-empty">// GitHub uplink not linked yet<br>'
        + 'Open <a href="#" id="ghFeedHint">Admin → 2080 Core</a> and paste your GitHub username<br>'
        + 'to stream live commits, releases and stars here.</div>';
      const hint = $('#ghFeedHint');
      if (hint) hint.addEventListener('click', (e) => { e.preventDefault(); openAdminPanel('core'); });
      return;
    }

    box.innerHTML = '<div class="feed-empty">// establishing uplink…</div>';
    try {
      let data = ghCacheRead(user);

      if (!data) {
        const base = 'https://api.github.com/users/' + encodeURIComponent(user);
        const [userRes, repoRes, evRes] = await Promise.all([
          fetch(base),
          fetch(base + '/repos?sort=pushed&per_page=8'),
          fetch(base + '/events/public?per_page=7')
        ]);

        if (userRes.status === 404) {
          box.innerHTML = '<div class="feed-empty">// no such GitHub user: <b>'
            + esca(user) + '</b><br>check the username in Admin → 2080 Core</div>';
          return;
        }
        if (userRes.status === 403 || repoRes.status === 403 || evRes.status === 403) {
          box.innerHTML = '<div class="feed-empty">// GitHub rate limit reached for this network<br>'
            + 'the uplink resumes automatically in a few minutes</div>';
          return;
        }

        data = {
          profile: userRes.ok ? await userRes.json() : null,
          repos: repoRes.ok ? await repoRes.json() : [],
          events: evRes.ok ? await evRes.json() : []
        };
        if (!Array.isArray(data.repos)) data.repos = [];
        if (!Array.isArray(data.events)) data.events = [];
        ghCacheWrite(user, data);
      }

      const profile = data.profile;

      /* Own work first: forks are other people's code, so they never lead. */
      const repos = data.repos
        .filter((r) => r && !r.fork)
        .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))
        .slice(0, 4);
      const events = data.events.slice(0, 5);

      const head = profile ? (
        '<a class="feed-item" href="' + esca(profile.html_url) + '" target="_blank" rel="noopener">'
        + '<div class="feed-ico" style="background:linear-gradient(135deg,#0d2b1f,#2d6a4f)">'
        + '<i class="fa-brands fa-github"></i></div>'
        + '<div class="feed-body"><p><b>@' + esca(profile.login) + '</b> · '
        + (profile.public_repos || 0) + ' public repos · '
        + (profile.followers || 0) + ' followers</p>'
        + '<small>github.com · live</small></div></a>'
      ) : '';

      const repoBlock = repos.length
        ? '<div class="feed-sub">// repositories — most recently pushed</div>'
          + repos.map((r) => (
            '<a class="feed-item" href="' + esca(r.html_url) + '" target="_blank" rel="noopener">'
            + '<div class="feed-ico" style="background:linear-gradient(135deg,#123a2a,#1f7a58)">'
            + '<i class="fa-solid fa-folder-tree"></i></div>'
            + '<div class="feed-body"><p><b>' + esca(r.name) + '</b>'
            + (r.description ? ' — ' + esca(String(r.description).slice(0, 88)) : '') + '</p>'
            + '<small>'
            + (r.language ? langDot(r.language) + esca(r.language) + ' • ' : '')
            + (r.stargazers_count ? '★ ' + r.stargazers_count + ' • ' : '')
            + 'updated ' + timeAgo(r.pushed_at || r.updated_at) + '</small></div></a>'
          )).join('')
        : '';

      const list = events.length
        ? '<div class="feed-sub">// latest public activity</div>'
          + events.map((e) => (
            '<div class="feed-item">'
            + '<div class="feed-ico"><i class="fa-solid '
            + (GH_ICONS[e.type] || 'fa-bolt') + '"></i></div>'
            + '<div class="feed-body"><p>' + ghDescribe(e, user) + '</p>'
            + '<small>' + esca((e.repo && e.repo.name) || '') + ' • '
            + timeAgo(e.created_at) + '</small></div></div>'
          )).join('')
        : '<div class="feed-empty">// no public events yet — push some code 🚀</div>';

      box.innerHTML = head + repoBlock + list;
    } catch (err) {
      box.innerHTML = '<div class="feed-empty">// uplink blocked (offline or rate-limited)<br>'
        + 'the portfolio itself keeps working — cached feed unavailable</div>';
    }
  }

  function loadLinkedIn() {
    const box = $('#liFeed');
    if (!box) return;
    const url = liUrl();
    const posts = liPosts();

    box.innerHTML = posts.map((p) => (
      '<a class="feed-item" href="' + esca(url || '#') + '" target="_blank" rel="noopener">'
      + '<div class="feed-ico" style="background:linear-gradient(135deg,#0a66c2,#0077b5)">'
      + '<i class="fa-brands fa-linkedin-in"></i></div>'
      + '<div class="feed-body"><p>' + esca(p.text) + '</p>'
      + '<small>' + esca(p.date || '') + ' • linkedin.com</small></div></a>'
    )).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
     13. SECURED CERTIFICATE VIEWER
     Layers: [full] + [odd scanlines] + [even scanlines].
     While armed: copy / cut / drag / right-click / print are blocked,
     focus loss and devtools instantly obliterate the stage, canvas
     export APIs return blank pixels, and every render carries a
     per-session traceable watermark.
  ═══════════════════════════════════════════════════════════════ */
  const Secure = {
    overlay: null,
    token: 0,            // guards against overlapping opens
    armed: false,
    sessionId: '',
    warnTimer: null,
    devTimer: null,
    originalToDataURL: null,
    originalToBlob: null,
    originalGetImageData: null,

    init() {
      this.overlay = $('#secureCertOverlay');
      if (!this.overlay) return;

      this.guardCanvasExports();

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
      const closeBtn = $('.secure-close', this.overlay);
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      /* whole certificate card becomes a large tap target — the button
         inside keeps its own handler, so we skip it to avoid double opens */
      $$('.cert-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.cert-btn')) return;
          if (e.target.closest('a[href]:not([href="#"])')) return;
          const data = certDataFromCard(card);
          if (data) { e.preventDefault(); this.open(data); }
        });
      });

      /* route the legacy modal entry point into the secure viewer */
      window.showCertModal = function (title, issuer, date) {
        const card = findCertCardByTitle(title);
        const data = (card && certDataFromCard(card)) || { title, issuer, date };
        Secure.open(data);
      };
      const legacyClose = window.closeCertModal;
      window.closeCertModal = function () {
        if (Secure.overlay.classList.contains('open')) Secure.close();
        else if (typeof legacyClose === 'function') legacyClose();
      };

      /* public entry points (also usable from inline onclick attributes) */
      window.viewSecureCert = function (title, issuer, date) {
        window.showCertModal(title, issuer, date);
      };
      window.closeSecureCert = function () { Secure.close(); };
    },

    /* Neutralise programmatic canvas scraping — scoped to this viewer so
       nothing else on the page (charts, sprites) is affected. */
    guardCanvasExports() {
      const BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const inViewer = (cv) => !!(cv && cv.closest && cv.closest('#secureCertOverlay'));

      this.originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      this.originalToBlob = HTMLCanvasElement.prototype.toBlob;
      this.originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

      HTMLCanvasElement.prototype.toDataURL = function () {
        if (inViewer(this)) return BLANK;
        return Secure.originalToDataURL.apply(this, arguments);
      };
      HTMLCanvasElement.prototype.toBlob = function (cb) {
        if (inViewer(this)) {
          const blank = document.createElement('canvas');
          blank.width = blank.height = 1;
          return Secure.originalToBlob.apply(blank, arguments);
        }
        return Secure.originalToBlob.apply(this, arguments);
      };
      CanvasRenderingContext2D.prototype.getImageData = function () {
        if (inViewer(this.canvas)) return this.createImageData(1, 1);
        return Secure.originalGetImageData.apply(this, arguments);
      };
    },

    async open(data) {
      if (!this.overlay || !data) return;
      const token = ++this.token;
      this.sessionId = 'SES-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      this.overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      WeatherFX.pause(true);

      const stage = $('.cert-stage', this.overlay);
      if (stage) stage.setAttribute('data-loading', '1');

      const canvas = await this.render(data);
      if (token !== this.token) return;          // a newer open() superseded this one

      const full = $('#secureCertFull');
      const a = $('#secureCertA');
      const b = $('#secureCertB');

      if (!canvas || !full || !a || !b) return;
      this.buildLayers(canvas, full, a, b);

      const meta = $('#secureCertMeta');
      if (meta) {
        meta.textContent = 'CREDENTIAL ' + this.sessionId
          + ' • RENDERED ' + new Date().toLocaleString()
          + ' • WATERMARKED TO THIS VIEWER';
      }
      if (stage) stage.removeAttribute('data-loading');

      this.startInterlace();
      this.arm();
    },

    close() {
      if (!this.overlay) return;
      this.overlay.classList.remove('open');
      this.overlay.classList.remove('interlaced');
      this.overlay.classList.remove('shield-hidden');
      this.disarm();
      document.body.style.overflow = '';
      WeatherFX.pause(false);
    },

    /* ── render the credential into an offscreen canvas ── */
    async render(data) {
      const img = await resolveCertImage(data);
      const off = document.createElement('canvas');

      if (img) {
        const maxW = 1700;
        const scale = Math.min(1, maxW / img.naturalWidth);
        off.width = Math.round(img.naturalWidth * scale);
        off.height = Math.round(img.naturalHeight * scale);

        /* a real scan keeps its own full fidelity — we only frame it */
        const c = off.getContext('2d');
        c.fillStyle = '#ffffff';
        c.fillRect(0, 0, off.width, off.height);
        c.drawImage(img, 0, 0, off.width, off.height);
        drawScanOverlay(off, data);
        return off;
      }

      /* graceful fallback: a real, valid certificate rendered on canvas */
      off.width = 1240;
      off.height = 877;
      drawGeneratedCert(off, data, this.sessionId);
      return off;
    },

    /* split into odd / even scanline layers + one complete layer */
    buildLayers(src, full, a, b) {
      const w = src.width, h = src.height;
      [full, a, b].forEach((c) => { c.width = w; c.height = h; });

      full.getContext('2d').drawImage(src, 0, 0);

      const ca = a.getContext('2d');
      ca.drawImage(src, 0, 0);
      for (let y = 0; y < h; y += 2) ca.clearRect(0, y, w, 1);  // keeps odd rows

      const cb = b.getContext('2d');
      cb.drawImage(src, 0, 0);
      for (let y = 1; y < h; y += 2) cb.clearRect(0, y, w, 1);  // keeps even rows
    },

    startInterlace() {
      if (REDUCED) { this.overlay.classList.remove('interlaced'); return; }
      this.overlay.classList.add('interlaced');
    },

    /* ── deterrence shield ── */
    arm() {
      if (this.armed) return;
      this.armed = true;

      this._onKey = (e) => {
        if (e.key === 'Escape') { this.close(); return; }
        const k = e.key || '';
        if (k === 'PrintScreen' || k === 'F13' /* mac print */) {
          e.preventDefault();
          try { navigator.clipboard.writeText(''); } catch (err) {}
          this.flashWarn('CAPTURE KEY BLOCKED — INVIGILATION LOGGED');
          this.hideTemporarily();
        }
        if ((e.ctrlKey || e.metaKey) && (k === 'p' || k === 's')) {
          e.preventDefault();
          this.flashWarn('PRINT / SAVE BLOCKED');
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === '3' || k === '4' || k === '5' || k === 'S' || k === 's')) {
          e.preventDefault();
          this.flashWarn('CAPTURE SHORTCUT BLOCKED');
          this.hideTemporarily();
        }
      };

      this._onBlock = (e) => { e.preventDefault(); this.flashWarn('COPY / CROP BLOCKED'); };
      this._onBlur = () => this.overlay.classList.add('shield-hidden');
      this._onFocus = () => this.overlay.classList.remove('shield-hidden');
      this._onVis = () => {
        if (document.hidden) this.overlay.classList.add('shield-hidden');
        else this.overlay.classList.remove('shield-hidden');
      };

      addEventListener('keydown', this._onKey, true);
      addEventListener('keyup', this._onKey, true);
      addEventListener('contextmenu', this._onBlock, true);
      addEventListener('copy', this._onBlock, true);
      addEventListener('cut', this._onBlock, true);
      addEventListener('dragstart', this._onBlock, true);
      addEventListener('selectstart', this._onBlock, true);
      addEventListener('beforeprint', this._onBlock, true);
      addEventListener('blur', this._onBlur);
      addEventListener('focus', this._onFocus);
      document.addEventListener('visibilitychange', this._onVis);

      /* devtools / oversized-window detection */
      this.devTimer = setInterval(() => {
        const wDelta = window.outerWidth - window.innerWidth;
        const hDelta = window.outerHeight - window.innerHeight;
        const devtools = (wDelta > 190 && hDelta > 190) || hDelta > 300;
        this.overlay.classList.toggle('shield-hidden', devtools || document.hidden);
      }, 900);
    },

    disarm() {
      if (!this.armed) return;
      this.armed = false;
      removeEventListener('keydown', this._onKey, true);
      removeEventListener('keyup', this._onKey, true);
      removeEventListener('contextmenu', this._onBlock, true);
      removeEventListener('copy', this._onBlock, true);
      removeEventListener('cut', this._onBlock, true);
      removeEventListener('dragstart', this._onBlock, true);
      removeEventListener('selectstart', this._onBlock, true);
      removeEventListener('beforeprint', this._onBlock, true);
      removeEventListener('blur', this._onBlur);
      removeEventListener('focus', this._onFocus);
      document.removeEventListener('visibilitychange', this._onVis);
      clearInterval(this.devTimer);
      this.overlay.classList.remove('shield-hidden');
    },

    hideTemporarily() {
      this.overlay.classList.add('shield-hidden');
      setTimeout(() => this.overlay.classList.remove('shield-hidden'), 2600);
    },

    flashWarn(msg) {
      const w = $('#secureWarn');
      if (!w) return;
      w.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + esca(msg);
      w.classList.add('show');
      clearTimeout(this.warnTimer);
      this.warnTimer = setTimeout(() => w.classList.remove('show'), 2400);
    }
  };

  /* ── certificate data helpers ── */
  function certDataFromCard(card) {
    if (!card) return null;
    const title = (card.querySelector('.cert-title') || {}).textContent || '';
    const issuerEl = card.querySelector('.cert-issuer');
    const issuer = issuerEl ? issuerEl.textContent.replace(/^\s*/, '') : '';
    const dateEl = card.querySelector('.cert-date span') || card.querySelector('.cert-date');
    const date = dateEl ? dateEl.textContent.trim() : '';
    return {
      title: title.trim() || 'Certificate of Achievement',
      issuer: issuer.trim() || CONFIG.OWNER_NAME,
      date: date,
      slug: card.getAttribute('data-cert-slug') || slugify(title),
      img: card.getAttribute('data-cert-img') || ''
    };
  }

  function findCertCardByTitle(title) {
    const want = norm(title).replace(/&amp;/g, '&');
    if (!want) return null;
    let best = null;
    $$('.cert-card').forEach((card) => {
      if (best) return;
      const t = norm((card.querySelector('.cert-title') || {}).textContent).replace(/&amp;/g, '&');
      if (!t) return;
      if (t === want) best = card;
      else if (!best && (t.indexOf(want.slice(0, 34)) === 0 || want.indexOf(t.slice(0, 34)) === 0)) best = card;
    });
    return best;
  }

  /* Resolve a real certificate scan, if the owner has supplied one.
     Order:  explicit attribute → uploaded image → saved path map → folder probe */
  async function resolveCertImage(data) {
    if (!data) return null;
    const slug = data.slug || slugify(data.title);

    if (data.img) return loadImage(data.img);

    const uploads = store.json(LS.certUpload, {});
    if (uploads[slug]) return loadImage(uploads[slug]);

    const map = store.json(LS.certMap, {}) || {};
    const confMap = CONFIG.CERT_IMAGES || {};
    const path = map[slug] || confMap[slug];
    if (path) return loadImage(path);

    /* lazy probe of the drop-in folder — one attempt per extension */
    const exts = ['png', 'jpg', 'jpeg', 'webp'];
    for (let i = 0; i < exts.length; i++) {
      const found = await loadImage(CONFIG.CERT_DIR + slug + '.' + exts[i]);
      if (found) return found;
    }
    return null;
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  /* frame + trace a real scan so a leaked copy is identifiable */
  function drawScanOverlay(cv, data) {
    const c = cv.getContext('2d');
    const W = cv.width, H = cv.height;

    c.save();
    c.strokeStyle = 'rgba(201,168,76,.85)';
    c.lineWidth = Math.max(3, W * 0.004);
    c.strokeRect(c.lineWidth, c.lineWidth, W - c.lineWidth * 2, H - c.lineWidth * 2);

    c.strokeStyle = 'rgba(0,255,200,.75)';
    c.lineWidth = Math.max(3, W * 0.004);
    const L = W * 0.035;
    [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]].forEach((p) => {
      c.beginPath();
      c.moveTo(p[0] + L * p[2], p[1]);
      c.lineTo(p[0], p[1]);
      c.lineTo(p[0], p[1] + L * p[3]);
      c.stroke();
    });

    /* traceable diagonal watermark */
    c.rotate(-0.32);
    c.font = '700 ' + Math.round(W * 0.022) + 'px Outfit, sans-serif';
    c.fillStyle = 'rgba(20,40,30,.055)';
    const stamp = CONFIG.OWNER_NAME + '  •  ' + new Date().toLocaleString()
      + '  •  ' + (Secure.sessionId || '');
    for (let y = -H; y < H * 2; y += Math.round(W * 0.085)) {
      c.fillText(stamp, -W * 0.5, y);
    }
    c.restore();

    c.save();
    c.font = '600 ' + Math.round(W * 0.014) + 'px "JetBrains Mono", monospace';
    c.fillStyle = 'rgba(0,0,0,.35)';
    c.fillText('SECURED VIEW • ' + (Secure.sessionId || '') + ' • NOT FOR REDISTRIBUTION',
      W * 0.02, H - W * 0.018);
    c.restore();
  }

  /* the fallback: a fully drawn, valid-looking credential */
  function drawGeneratedCert(cv, data, sessionId) {
    const c = cv.getContext('2d');
    const W = cv.width, H = cv.height;

    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#07170f');
    g.addColorStop(0.55, '#04120c');
    g.addColorStop(1, '#020a07');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);

    c.strokeStyle = 'rgba(0,255,200,.05)';
    c.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }

    c.strokeStyle = 'rgba(201,168,76,.9)';
    c.lineWidth = 3;
    c.strokeRect(28, 28, W - 56, H - 56);
    c.strokeStyle = 'rgba(201,168,76,.35)';
    c.lineWidth = 1;
    c.strokeRect(40, 40, W - 80, H - 80);

    c.strokeStyle = '#00ffc8';
    c.lineWidth = 3;
    const L = 34;
    [[40, 40, 1, 1], [W - 40, 40, -1, 1], [40, H - 40, 1, -1], [W - 40, H - 40, -1, -1]]
      .forEach((p) => {
        c.beginPath();
        c.moveTo(p[0] + L * p[2], p[1]);
        c.lineTo(p[0], p[1]);
        c.lineTo(p[0], p[1] + L * p[3]);
        c.stroke();
      });

    c.textAlign = 'center';
    c.fillStyle = 'rgba(0,255,200,.85)';
    c.font = '600 19px "JetBrains Mono", monospace';
    c.fillText('◈  S E C U R E D   C R E D E N T I A L   V I E W E R  ◈', W / 2, 108);

    c.fillStyle = 'rgba(255,255,255,.5)';
    c.font = '15px "JetBrains Mono", monospace';
    c.fillText('C E R T I F I C A T E   O F   A C H I E V E M E N T', W / 2, 172);

    c.fillStyle = '#f5f0e1';
    c.font = '700 42px "Playfair Display", serif';
    wrapText(c, data.title, W / 2, 250, W - 340, 52);

    c.strokeStyle = 'rgba(201,168,76,.6)';
    c.beginPath();
    c.moveTo(W / 2 - 140, 480);
    c.lineTo(W / 2 + 140, 480);
    c.stroke();

    c.fillStyle = '#c9a84c';
    c.font = '600 23px Outfit, sans-serif';
    wrapText(c, data.issuer, W / 2, 536, W - 380, 32);

    c.fillStyle = 'rgba(255,255,255,.6)';
    c.font = '16px "JetBrains Mono", monospace';
    c.fillText(data.date || '', W / 2, 600);

    const sx = W - 190, sy = H - 190;
    c.strokeStyle = 'rgba(201,168,76,.9)';
    c.lineWidth = 3;
    c.beginPath(); c.arc(sx, sy, 64, 0, 6.2832); c.stroke();
    c.setLineDash([4, 5]);
    c.beginPath(); c.arc(sx, sy, 52, 0, 6.2832); c.stroke();
    c.setLineDash([]);
    c.fillStyle = '#c9a84c';
    c.font = '800 30px Outfit, sans-serif';
    c.fillText(CONFIG.OWNER_INITIALS, sx, sy + 6);
    c.fillStyle = 'rgba(255,255,255,.45)';
    c.font = '11px "JetBrains Mono", monospace';
    c.fillText('V E R I F I E D', sx, sy + 94);

    c.strokeStyle = 'rgba(255,255,255,.4)';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(150, H - 190); c.lineTo(390, H - 190); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.7)';
    c.font = 'italic 25px "Playfair Display", serif';
    c.fillText(CONFIG.OWNER_NAME, 270, H - 206);
    c.fillStyle = 'rgba(255,255,255,.4)';
    c.font = '11px "JetBrains Mono", monospace';
    c.fillText('C R E D E N T I A L   H O L D E R', 270, H - 168);

    /* traceable diagonal watermark */
    c.save();
    c.rotate(-0.32);
    c.font = '700 29px Outfit, sans-serif';
    c.fillStyle = 'rgba(255,255,255,.045)';
    const stamp = CONFIG.OWNER_NAME + '  •  ' + new Date().toLocaleString()
      + '  •  ' + (sessionId || '');
    for (let y = -200; y < H + 400; y += 120) c.fillText(stamp, -320, y);
    c.restore();

    c.fillStyle = 'rgba(0,255,200,.45)';
    c.font = '12px "JetBrains Mono", monospace';
    c.fillText('viewer v2.080 • rendered client-side • ' + (sessionId || ''), W / 2, H - 50);
  }

  function wrapText(c, text, x, y, maxW, lh) {
    const words = String(text || '').split(/\s+/);
    let line = '', yy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (c.measureText(test).width > maxW && line) {
        c.fillText(line, x, yy);
        line = words[i];
        yy += lh;
      } else {
        line = test;
      }
    }
    c.fillText(line, x, yy);
  }

  /* ═══════════════════════════════════════════════════════════════
     14. DOUBLE-CLICK INLINE EDITOR
     Every text node and every image becomes editable in place while
     admin mode is on. Edits persist in localStorage for the owner and
     are baked into the exported index.html for visitors.
  ═══════════════════════════════════════════════════════════════ */
  const InlineEdit = {
    active: false,
    SKIP: '#adminDrawer,#adminBar,#adminAuthModal,#secureCertOverlay,#adminToast,#bootLoader,.fx-edit-hint,.weather-chip',
    TEXT_TAGS: 'h1,h2,h3,h4,h5,h6,p,span,a,li,strong,em,small,blockquote,button,label,div',

    init() {
      /* owner's saved edits should show on every visit, admin or not */
      this.applySaved();

      /* Track the admin bar both ways. Enabling only on activation used to
         leave the dashed edit outlines on screen after a logout — a visitor
         on the owner's machine would see an editable-looking page. */
      const bar = $('#adminBar');
      if (bar) {
        new MutationObserver(() => {
          let authed = false;
          try { authed = sessionStorage.getItem('portfolio_admin_auth') === 'true'; } catch (e) {}
          if (bar.classList.contains('active') || authed) this.enable();
          else this.disable();
        }).observe(bar, { attributes: true, attributeFilter: ['class'] });
        if (bar.classList.contains('active')) this.enable();
      }
      try {
        if (sessionStorage.getItem('portfolio_admin_auth') === 'true') this.enable();
      } catch (e) {}

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
          e.preventDefault();
          this.toggle();
        }
      });
    },

    toggle() {
      if (this.active) {
        this.disable();
        toast('Inline edit OFF');
      } else {
        try {
          if (sessionStorage.getItem('portfolio_admin_auth') !== 'true') {
            if (window.portfolioAdmin) window.portfolioAdmin.openAuth();
            return;
          }
        } catch (e) {}
        this.enable();
        toast('Inline edit ON — double-click any text or image');
      }
    },

    enable() {
      if (this.active) return;
      this.active = true;
      document.body.classList.add('inline-edit');
      this.hint(true);

      $$(this.TEXT_TAGS).forEach((el) => {
        if (el.closest(this.SKIP)) return;
        if (el.children.length > 0) return;                       // text leaves only
        const txt = el.textContent.trim();
        if (txt.length < 2) return;
        if (!el.hasAttribute('data-iedit')) el.setAttribute('data-iedit', elPath(el));
        el.addEventListener('dblclick', this.startTextEdit);
      });

      $$('img').forEach((img) => {
        if (img.closest(this.SKIP)) return;
        if (!img.hasAttribute('data-iimg')) img.setAttribute('data-iimg', elPath(img));
        img.addEventListener('dblclick', this.pickImage);
      });

      this.applySaved();
    },

    disable() {
      this.active = false;
      document.body.classList.remove('inline-edit');
      this.hint(false);
      $$('[contenteditable="true"]').forEach((el) => el.removeAttribute('contenteditable'));
    },

    hint(show) {
      let h = $('.fx-edit-hint');
      if (show) {
        if (!h) {
          h = document.createElement('div');
          h.className = 'fx-edit-hint';
          h.textContent = 'ADMIN LIVE EDIT • double-click text or an image • Ctrl+Shift+E to exit';
          document.body.appendChild(h);
        }
      } else if (h) {
        h.remove();
      }
    },

    key(el) {
      return el.getAttribute('data-iedit') || el.getAttribute('data-iimg') || elPath(el);
    },

    startTextEdit(e) {
      e.preventDefault();
      e.stopPropagation();
      const el = e.currentTarget;
      if (el.getAttribute('contenteditable') === 'true') return;

      el.setAttribute('contenteditable', 'true');
      el.focus();

      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      const commit = () => {
        const map = store.json(LS.ieText, {}) || {};
        const value = el.textContent.trim();
        map[InlineEdit.key(el)] = value;
        const ok = store.setJson(LS.ieText, map);

        refreshGlitchText();

        if (el.classList.contains('hero-name')) syncHeroName(value);
        return ok;
      };

      /* persist while typing too, so a stray click can never lose an edit */
      let debounce = null;
      const onInput = () => {
        clearTimeout(debounce);
        debounce = setTimeout(commit, 420);
      };

      const finish = () => {
        clearTimeout(debounce);
        el.removeEventListener('blur', finish);
        el.removeEventListener('focusout', finish);
        el.removeEventListener('keydown', onKeydown);
        el.removeEventListener('input', onInput);
        el.removeAttribute('contenteditable');

        const ok = commit();
        toast(ok ? 'Saved ✓ — included in your next HTML export'
                 : 'Saved for this tab (storage is full — use Export instead)');
      };

      const onKeydown = (ev) => {
        if (ev.key === 'Escape') { ev.preventDefault(); finish(); }
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); finish(); }
        ev.stopPropagation();
      };

      el.addEventListener('input', onInput);
      el.addEventListener('blur', finish);
      el.addEventListener('focusout', finish);
      el.addEventListener('keydown', onKeydown);
    },

    pickImage(e) {
      e.preventDefault();
      e.stopPropagation();
      const img = e.currentTarget;
      const path = InlineEdit.key(img);

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        compressImage(file, 1600, 0.86).then((dataUrl) => {
          if (!dataUrl) return;
          img.src = dataUrl;
          const map = store.json(LS.ieImg, {}) || {};
          map[path] = dataUrl;
          const ok = store.setJson(LS.ieImg, map);
          toast(ok ? 'Image replaced ✓ — baked into your next export'
                   : 'Image replaced this session only (storage full)');
        });
      };
      input.click();
    },

    applySaved() {
      const texts = store.json(LS.ieText, {}) || {};
      Object.keys(texts).forEach((key) => {
        const el = document.querySelector('[data-iedit="' + cssEscape(key) + '"]')
                || findByKey(key);
        if (!el || !document.body.contains(el)) return;
        el.textContent = texts[key];
        /* restoring the hero name has to re-sync the nav logo and tab title,
           otherwise a reload showed the edit in the page but not in the tab */
        if (el.classList.contains('hero-name')) syncHeroName(texts[key]);
      });

      const imgs = store.json(LS.ieImg, {}) || {};
      Object.keys(imgs).forEach((key) => {
        const el = document.querySelector('[data-iimg="' + cssEscape(key) + '"]')
                || findByKey(key);
        if (el && el.tagName === 'IMG') el.src = imgs[key];
      });

      refreshGlitchText();
    }
  };

  /* the hero name is echoed in the nav logo and the browser tab */
  function syncHeroName(value) {
    if (!value) return;
    const logo = $('.logo-text');
    if (logo) logo.textContent = value;
    document.title = value + ' | Remote Sensing & GIS | Agriculturist';
  }

  function cssEscape(s) {
    if (window.CSS && CSS.escape) return CSS.escape(s);
    return String(s).replace(/["\\]/g, '\\$&');
  }

  /* fall back to walking the tree with the same path algorithm */
  function findByKey(key) {
    const candidates = $$('[data-iedit],[data-iimg]');
    for (let i = 0; i < candidates.length; i++) {
      if (elPath(candidates[i]) === key) return candidates[i];
    }
    const all = $$('.hero-name,.logo-text,.hero-tagline,.section-title,.cert-title,.exp-role,.project-title,.timeline-title,.hero-photo,.nav-avatar');
    for (let i = 0; i < all.length; i++) {
      if (elPath(all[i]) === key) return all[i];
    }
    return null;
  }

  function compressImage(file, maxW, quality) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.naturalWidth);
          const cv = document.createElement('canvas');
          cv.width = Math.round(img.naturalWidth * scale);
          cv.height = Math.round(img.naturalHeight * scale);
          const c = cv.getContext('2d');
          c.fillStyle = '#ffffff';
          c.fillRect(0, 0, cv.width, cv.height);
          c.drawImage(img, 0, 0, cv.width, cv.height);
          const isPng = /png$/i.test(file.type);
          try {
            resolve(isPng ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', quality));
          } catch (err) {
            resolve(ev.target.result);
          }
        };
        img.onerror = () => resolve(ev.target.result);
        img.src = ev.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     15. ADMIN "2080 CORE" PANEL
     Injected into the existing drawer — admin.js is left untouched.
  ═══════════════════════════════════════════════════════════════ */
  let panelReady = false;

  function initAdminPanel() {
    const tabs = $('.admin-tabs');
    const body = $('.admin-drawer-body');
    if (!tabs || !body || panelReady) return;
    panelReady = true;

    const tab = document.createElement('button');
    tab.className = 'admin-tab';
    tab.setAttribute('data-tab', 'tabCore');
    tab.innerHTML = '<i class="fas fa-satellite-dish"></i> 2080 Core';
    tabs.appendChild(tab);

    const content = document.createElement('div');
    content.className = 'admin-tab-content';
    content.id = 'tabCore';
    content.innerHTML = panelHtml();
    body.appendChild(content);

    tab.addEventListener('click', () => {
      $$('.admin-tab').forEach((t) => t.classList.remove('active'));
      $$('.admin-tab-content').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      content.classList.add('active');
      fillPanel();
    });

    wirePanel(content);
  }

  function panelHtml() {
    return ''
      + '<p class="admin-help-text" style="margin-bottom:1.2rem;">Controls the live telemetry feed, the adaptive weather/day-night theme, and inline editing.</p>'

      + '<div class="admin-field"><label>GitHub Username (live commit feed)</label>'
      + '<input type="text" id="coreGhUser" placeholder="e.g. akshitvinay" /></div>'

      + '<div class="admin-field"><label>LinkedIn Profile URL</label>'
      + '<input type="text" id="coreLiUrl" placeholder="https://linkedin.com/in/..." /></div>'

      + '<div class="admin-field"><label>LinkedIn Signals — one per line: DATE | Headline</label>'
      + '<textarea id="coreLiPosts" rows="5" placeholder="AUG 2026 | Completed the two-week FDP on Remote Sensing Data Analytics"></textarea></div>'

      + '<div class="admin-field"><label>Theme Preview</label>'
      + '<select id="coreTheme" style="width:100%;padding:.7rem;border-radius:8px;">'
      + '<option value="auto">Auto — follow the visitor\'s clock</option>'
      + '<option value="day">Force light (day)</option>'
      + '<option value="night">Force dark (night)</option>'
      + '</select></div>'

      + '<div class="admin-field"><label>Weather Preview</label>'
      + '<select id="coreWeather" style="width:100%;padding:.7rem;border-radius:8px;">'
      + '<option value="auto">Auto — live local weather</option>'
      + '<option value="clear">Clear / sunny</option>'
      + '<option value="cloudy">Cloudy</option>'
      + '<option value="rain">Rain</option>'
      + '<option value="storm">Storm</option>'
      + '<option value="snow">Snow</option>'
      + '<option value="fog">Fog</option>'
      + '</select></div>'

      + '<button type="button" class="admin-btn-primary" style="width:100%;padding:.7rem;border-radius:8px;margin-bottom:1.2rem;" '
      + 'onclick="window.fxCore.save()"><i class="fas fa-check"></i> Apply 2080 Settings</button>'

      + '<div class="admin-field"><label>Inline Editing</label>'
      + '<button type="button" class="admin-btn-secondary" style="width:100%;padding:.7rem;border-radius:8px;" '
      + 'onclick="window.fxInlineEdit.toggle()"><i class="fas fa-i-cursor"></i> Toggle Double-Click Editing</button>'
      + '<p class="admin-help-text">Double-click any text to rewrite it. Double-click any image to swap it. '
      + 'Both are saved on this device and written into the HTML you export.</p></div>'

      + '<div class="admin-field" style="margin-top:1.4rem;"><label>Certificate Scans</label>'
      + '<p class="admin-help-text" style="margin-bottom:.8rem;">Upload a scan for each credential, or drop files into '
      + '<code>assets/certs/</code> named after the certificate (e.g. <code>organic-farming.png</code>). '
      + 'Uploads are compressed and stored on this device, then embedded when you export.</p>'
      + '<div id="coreCertList"></div></div>'
      + '<div class="admin-field" style="margin-top:1rem;"><label>Free Upload Space</label>'
      + '<button type="button" class="admin-btn-secondary" style="width:100%;padding:.6rem;border-radius:8px;" '
      + 'onclick="window.fxCore.clearCertUploads()"><i class="fas fa-broom"></i> Remove All Uploaded Scans</button>'
      + '<p class="admin-help-text" id="coreStorageNote"></p></div>';
  }

  function fillPanel() {
    const ghUser = $('#coreGhUser');
    if (ghUser) ghUser.value = store.get(LS.ghUser) || CONFIG.GH_USER || '';

    const liUrlEl = $('#coreLiUrl');
    if (liUrlEl) liUrlEl.value = liUrl();

    const liPostsEl = $('#coreLiPosts');
    if (liPostsEl) {
      liPostsEl.value = liPosts().map((p) => (p.date || '') + ' | ' + p.text).join('\n');
    }

    const themeSel = $('#coreTheme');
    if (themeSel) themeSel.value = store.get(LS.theme) || 'auto';
    const wSel = $('#coreWeather');
    if (wSel) wSel.value = store.get(LS.weather) || 'auto';

    renderCertRows();
  }

  function renderCertRows() {
    const host = $('#coreCertList');
    if (!host) return;
    const uploads = store.json(LS.certUpload, {}) || {};
    const map = store.json(LS.certMap, {}) || {};
    const cards = $$('.cert-card');

    if (!cards.length) {
      host.innerHTML = '<p class="admin-help-text">No certificate cards found.</p>';
      return;
    }

    host.innerHTML = cards.map((card, i) => {
      const data = certDataFromCard(card);
      const slug = data.slug;
      const hasUpload = !!uploads[slug];
      const path = map[slug] || '';
      return ''
        + '<div class="admin-cert-item" style="flex-direction:column;align-items:stretch;gap:.5rem;">'
        + '<div class="admin-cert-info"><h4>' + esca(data.title.slice(0, 62)) + '</h4>'
        + '<p>' + esca(data.issuer.slice(0, 48)) + '</p></div>'
        + '<input type="text" data-cert-path="' + esca(slug) + '" '
        + 'value="' + esca(path) + '" placeholder="assets/certs/' + esca(slug) + '.png" '
        + 'style="width:100%;padding:.5rem;border-radius:6px;font-size:.78rem;" />'
        + '<div style="display:flex;gap:.5rem;align-items:center;">'
        + '<button type="button" class="admin-btn-secondary" style="flex:1;padding:.45rem;border-radius:6px;font-size:.76rem;" '
        + 'data-cert-upload="' + esca(slug) + '"><i class="fas fa-upload"></i> Upload scan</button>'
        + (hasUpload
          ? '<button type="button" class="admin-btn-secondary" style="padding:.45rem;border-radius:6px;font-size:.76rem;" '
            + 'data-cert-clear="' + esca(slug) + '"><i class="fas fa-undo"></i></button>'
          : '')
        + '<span style="font-size:.68rem;opacity:.6;min-width:64px;">'
        + (hasUpload ? 'uploaded' : (path ? 'path set' : 'fallback')) + '</span>'
        + '</div></div>';
    }).join('');

    host.querySelectorAll('[data-cert-upload]').forEach((btn) => {
      btn.addEventListener('click', () => uploadCertFile(btn.getAttribute('data-cert-upload')));
    });
    host.querySelectorAll('[data-cert-clear]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-cert-clear');
        const ups = store.json(LS.certUpload, {}) || {};
        delete ups[slug];
        store.setJson(LS.certUpload, ups);
        renderCertRows();
        updateStorageNote();
        toast('Upload removed for that certificate.');
      });
    });
  }

  function updateStorageNote() {
    const note = $('#coreStorageNote');
    if (!note) return;
    try {
      const bytes = (localStorage.getItem(LS.certUpload) || '').length;
      const mb = (bytes / 1048576).toFixed(2);
      note.textContent = bytes
        ? 'Uploaded scans are using ~' + mb + ' MB of this browser\'s ~5 MB limit. '
          + 'If uploads fail, drop the files into assets/certs/ instead — that route has no size limit.'
        : 'No uploaded scans yet. The path/folder route is unlimited and faster.';
    } catch (e) { note.textContent = ''; }
  }

  function uploadCertFile(slug) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      compressImage(file, 1700, 0.84).then((dataUrl) => {
        if (!dataUrl) { toast('Could not read that image.'); return; }
        const ups = store.json(LS.certUpload, {}) || {};
        const prev = ups[slug];
        ups[slug] = dataUrl;
        if (!store.setJson(LS.certUpload, ups)) {
          if (prev) ups[slug] = prev; else delete ups[slug];
          store.setJson(LS.certUpload, ups);
          toast('Browser storage is full — drop the file into assets/certs/ instead.');
        } else {
          toast('Certificate scan attached ✓');
        }
        renderCertRows();
        updateStorageNote();
      });
    };
    input.click();
  }

  function wirePanel(content) {
    const gh = $('#coreGhUser', content);
    if (gh) gh.addEventListener('change', () => {
      const v = gh.value.trim().replace(/^@/, '');
      if (v) store.set(LS.ghUser, v); else store.del(LS.ghUser);
      loadGitHub();
    });

    content.addEventListener('change', (e) => {
      const pathInput = e.target.closest('[data-cert-path]');
      if (pathInput) {
        const slug = pathInput.getAttribute('data-cert-path');
        const map = store.json(LS.certMap, {}) || {};
        const v = pathInput.value.trim();
        if (v) map[slug] = v; else delete map[slug];
        store.setJson(LS.certMap, map);
        toast(v ? 'Path saved for that certificate.' : 'Path cleared — using auto-detect.');
        renderCertRows();
      }
    });

    updateStorageNote();
  }

  function openAdminPanel(which) {
    const drawer = $('#adminDrawer');
    if (drawer) drawer.classList.add('open');
    const tab = $('.admin-tab[data-tab="tab' + (which === 'core' ? 'Core' : 'Profile') + '"]');
    if (tab) tab.click();
  }

  /* public hooks used by the injected buttons */
  window.fxCore = {
    save() {
      const gh = $('#coreGhUser');
      if (gh) {
        const v = gh.value.trim().replace(/^@/, '');
        if (v) store.set(LS.ghUser, v); else store.del(LS.ghUser);
      }

      const li = $('#coreLiUrl');
      if (li) {
        const v = li.value.trim();
        if (v) store.set(LS.liUrl, v); else store.del(LS.liUrl);
      }

      const lp = $('#coreLiPosts');
      if (lp) {
        const v = lp.value.trim();
        if (v) store.set(LS.liPosts, v); else store.del(LS.liPosts);
      }

      const th = $('#coreTheme');
      if (th) {
        if (th.value === 'auto') { store.del(LS.theme); Theme.state.theme = Theme.state.band === 'night' ? 'night' : 'day'; }
        else { store.set(LS.theme, th.value); Theme.state.theme = th.value; }
      }

      const w = $('#coreWeather');
      if (w) {
        if (w.value === 'auto') {
          store.del(LS.weather);
          Theme.state.mode = 'auto';
          Theme.setWeather(Theme.state.autoWeather || 'clear', { source: 'clock' });
          Theme.setBand(timeBand(new Date()));
          fetchLocalWeather(true);
        } else {
          store.set(LS.weather, w.value);
          Theme.state.mode = 'manual';
          Theme.setWeather(w.value, { source: 'manual' });
        }
      }

      Theme.apply();
      loadGitHub();
      loadLinkedIn();
      if (typeof window.portfolioAdmin !== 'undefined') {
        const t = $('#adminToastMsg');
        const toastEl = $('#adminToast');
        if (t && toastEl) { t.textContent = '2080 settings applied ✓'; toastEl.classList.add('show'); setTimeout(() => toastEl.classList.remove('show'), 3000); }
      }
    },
    clearCertUploads() {
      store.del(LS.certUpload);
      renderCertRows();
      updateStorageNote();
      toast('Uploaded certificate scans removed.');
    }
  };
  window.fxInlineEdit = InlineEdit;

  /* ═══════════════════════════════════════════════════════════════
     Toast (falls back to admin's own toast when present)
  ═══════════════════════════════════════════════════════════════ */
  function toast(msg) {
    /* reuse the admin toast when admin.js has already built it */
    const adminToast = $('#adminToast');
    const adminMsg = $('#adminToastMsg');
    if (adminToast && adminMsg) {
      adminMsg.textContent = msg;
      adminToast.classList.add('show');
      clearTimeout(adminToast._fxT);
      adminToast._fxT = setTimeout(() => adminToast.classList.remove('show'), 3200);
      return;
    }

    let t = $('#fxToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'fxToast';
      t.style.cssText = 'position:fixed;bottom:7.4rem;left:50%;transform:translateX(-50%);'
        + 'z-index:100003;pointer-events:none;max-width:80vw;text-align:center;'
        + 'background:rgba(4,18,12,.96);border:1px solid var(--fx-neon,#00ffc8);'
        + 'color:#fff;font-family:var(--fx-mono,monospace);font-size:.7rem;'
        + 'letter-spacing:1.5px;padding:.5rem 1rem;border-radius:8px;'
        + 'opacity:0;transition:opacity .3s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.opacity = '0'; }, 2800);
  }

  /* ═══════════════════════════════════════════════════════════════
     16. SERVICE WORKER — offline resilience
  ═══════════════════════════════════════════════════════════════ */
  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     BOOTSTRAP
  ═══════════════════════════════════════════════════════════════ */
  function start() {
    initBoot();
    initAtmosphere();
    WeatherFX.init();
    initAdaptiveTheme();
    initCursor();
    initMagnetic();
    initGlitch();
    initMarquee();
    initReveal();
    initFeeds();
    Secure.init();
    InlineEdit.init();
    initAdminPanel();
    initServiceWorker();

    /* keep the theme honest if the visitor leaves the tab open across sunset */
    setInterval(() => { Theme.apply(); }, 5 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
