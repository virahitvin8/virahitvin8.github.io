// ══════════════════════════════════════════════════════════
//  PORTFOLIO ADMIN CMS & LIVE EDITOR ENGINE
//  Protected Owner Mode for N. Akshit Vinay
// ══════════════════════════════════════════════════════════

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_custom_data';
  const PHOTO_STORAGE_KEY = 'portfolio_custom_photo';
  const PIN_STORAGE_KEY = 'portfolio_admin_pin';
  const CERTS_STORAGE_KEY = 'portfolio_certs';            // live certificate grid
  const CERTS_PRISTINE_KEY = 'portfolio_certs_pristine';  // untouched originals
  // Kept identical to the React build's DEFAULT_PIN (and documented in
  // certificates/README.md) so the owner has one PIN for the whole site instead of
  // having to remember which build serves which page.
  const DEFAULT_PIN = '2080';

  let currentPhotoDataUrl = null;

  // ─── Initialize on DOM Load ───
  document.addEventListener('DOMContentLoaded', () => {
    buildAdminUI();
    loadSavedData();
    loadCertSnapshot();
    setupKeyboardShortcut();
  });

  // ─── Build All Admin DOM Elements ───
  function buildAdminUI() {
    // 1. Auth Modal
    const authOverlay = document.createElement('div');
    authOverlay.id = 'adminAuthModal';
    authOverlay.className = 'admin-auth-overlay';
    authOverlay.innerHTML = `
      <div class="admin-auth-box">
        <div class="admin-auth-icon"><i class="fas fa-lock"></i></div>
        <h3>Owner Administration</h3>
        <p>Enter your secret PIN to access the visual content editor.</p>
        <div class="admin-input-wrap">
          <input type="password" id="adminPinInput" placeholder="••••" maxlength="8" autofocus />
        </div>
        <div class="admin-auth-error" id="adminAuthError">Incorrect PIN. Please try again.</div>
        <div class="admin-btn-group">
          <button class="admin-btn-secondary" onclick="window.portfolioAdmin.closeAuth()">Cancel</button>
          <button class="admin-btn-primary" onclick="window.portfolioAdmin.verifyAuth()">Unlock Editor</button>
        </div>
      </div>
    `;
    document.body.appendChild(authOverlay);

    // 2. Floating Admin Bar
    const adminBar = document.createElement('div');
    adminBar.id = 'adminBar';
    adminBar.className = 'admin-bar';
    adminBar.innerHTML = `
      <div class="admin-badge">
        <span class="admin-badge-dot"></span>
        <span>Owner Mode</span>
      </div>
      <button class="admin-action-btn" onclick="window.portfolioAdmin.openDrawer()">
        <i class="fas fa-edit"></i> Edit Content
      </button>
      <button class="admin-action-btn export-btn" onclick="window.portfolioAdmin.exportHtml()">
        <i class="fas fa-download"></i> Save &amp; Export Site
      </button>
      <button class="admin-action-btn logout-btn" onclick="window.portfolioAdmin.logout()">
        <i class="fas fa-sign-out-alt"></i> Exit
      </button>
    `;
    document.body.appendChild(adminBar);

    // 3. Admin Editor Drawer
    const adminDrawer = document.createElement('div');
    adminDrawer.id = 'adminDrawer';
    adminDrawer.className = 'admin-drawer';
    adminDrawer.innerHTML = `
      <div class="admin-drawer-header">
        <div class="admin-drawer-title">
          <i class="fas fa-sliders-h"></i>
          <span>Portfolio Content Editor</span>
        </div>
        <button class="admin-close-btn" onclick="window.portfolioAdmin.closeDrawer()">&times;</button>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="tabProfile"><i class="fas fa-user"></i> Profile</button>
        <button class="admin-tab" data-tab="tabPhoto"><i class="fas fa-camera"></i> Photo</button>
        <button class="admin-tab" data-tab="tabAcad"><i class="fas fa-graduation-cap"></i> Academics</button>
        <button class="admin-tab" data-tab="tabCerts"><i class="fas fa-certificate"></i> Certs</button>
        <button class="admin-tab" data-tab="tabSettings"><i class="fas fa-cog"></i> Settings</button>
      </div>

      <div class="admin-drawer-body">
        <!-- TAB 1: Profile & Headers -->
        <div class="admin-tab-content active" id="tabProfile">
          <div class="admin-field">
            <label>Full Name</label>
            <input type="text" id="editName" value="N. Akshit Vinay" />
          </div>
          <div class="admin-field">
            <label>Hero Greeting</label>
            <input type="text" id="editGreeting" value="Hello, I am" />
          </div>
          <div class="admin-field">
            <label>Tagline / Headline</label>
            <textarea id="editTagline" rows="3"></textarea>
          </div>
          <div class="admin-field">
            <label>Location</label>
            <input type="text" id="editLocation" value="Nellore, Andhra Pradesh / Prayagraj, UP, India" />
          </div>
          <div class="admin-field">
            <label>Email Address</label>
            <input type="email" id="editEmail" value="akshitvinay4636@gmail.com" />
          </div>
          <div class="admin-field">
            <label>Phone Number</label>
            <input type="text" id="editPhone" value="+91 7396222207" />
          </div>
        </div>

        <!-- TAB 2: Photo Upload -->
        <div class="admin-tab-content" id="tabPhoto">
          <div class="admin-field">
            <label>Profile Picture</label>
            <div class="admin-photo-dropzone" id="adminPhotoDropzone">
              <img src="assets/profile.png" alt="Preview" class="admin-photo-preview" id="adminPhotoPreview" />
              <p>Click or Drag &amp; Drop to Change Photo</p>
              <span>Supports JPG, PNG, WEBP (Instant Live Update)</span>
              <input type="file" id="adminPhotoFileInput" class="admin-photo-input" accept="image/*" />
            </div>
            <p class="admin-help-text">Your photo immediately updates both the Hero circular frame and Navbar thumbnail.</p>
          </div>
        </div>

        <!-- TAB 3: Academics & Scores -->
        <div class="admin-tab-content" id="tabAcad">
          <div class="admin-field">
            <label>Current Degree</label>
            <input type="text" id="editDegree" value="M.Sc Remote Sensing &amp; GIS" />
          </div>
          <div class="admin-field">
            <label>Current University</label>
            <input type="text" id="editUniversity" value="Sam Higginbottom University of Agriculture, Technology and Sciences (SHUATS), Prayagraj" />
          </div>
          <div class="admin-field">
            <label>Current Status / Semester</label>
            <input type="text" id="editSemester" value="3rd Semester (Batch 2025–27)" />
          </div>
          <div class="admin-field">
            <label>1st Sem CGPA</label>
            <input type="text" id="editCgpaMsc" value="10.0" />
            <p class="admin-help-text">Updates the hero stat counter and academic badges.</p>
          </div>
          <div class="admin-field">
            <label>Undergraduate Degree</label>
            <input type="text" id="editDegreeBsc" value="B.Sc (Hons) Agriculture" />
          </div>
          <div class="admin-field">
            <label>B.Sc CGPA</label>
            <input type="text" id="editCgpaBsc" value="8.71" />
          </div>
        </div>

        <!-- TAB 4: Certifications -->
        <div class="admin-tab-content" id="tabCerts">
          <p class="admin-help-text" style="margin-bottom:1rem;">Add a new certificate or training programme below. It will immediately appear in your Certifications grid.</p>
          
          <div class="admin-field">
            <label>Certificate / Training Title</label>
            <input type="text" id="newCertTitle" placeholder="e.g. Advanced Geospatial Analysis" />
          </div>
          <div class="admin-field">
            <label>Issuing Organization</label>
            <input type="text" id="newCertIssuer" placeholder="e.g. ISRO / IIRS / CSIR" />
          </div>
          <div class="admin-field">
            <label>Dates / Duration</label>
            <input type="text" id="newCertDate" placeholder="e.g. September 2026" />
          </div>
          <div class="admin-field">
            <label>Ribbon Tag</label>
            <input type="text" id="newCertRibbon" placeholder="e.g. Certified or 2-Wk FDP" />
          </div>
          <div class="admin-field">
            <label>Skills / Tags (comma separated)</label>
            <input type="text" id="newCertSkills" placeholder="Remote Sensing, GIS, Earth Science" />
          </div>
          <button type="button" class="admin-btn-primary" style="width:100%; padding:0.75rem; border-radius:8px; margin-bottom:1.5rem;" onclick="window.portfolioAdmin.addNewCert()">
            <i class="fas fa-plus-circle"></i> Insert New Certificate
          </button>

          <p class="admin-help-text" style="margin-bottom:0.8rem;">
            Additions and removals are saved on this device and survive a reload.
            Use <strong>Save &amp; Export Site</strong> to make them permanent for every visitor.
          </p>
          <label>Manage Active Certifications</label>
          <div id="adminCertList"></div>
          <button type="button" class="admin-btn-secondary" style="width:100%; padding:0.6rem; border-radius:8px; margin-top:0.8rem;"
                  onclick="window.portfolioAdmin.restoreDefaultCerts()">
            <i class="fas fa-rotate-left"></i> Restore Original Certificates
          </button>
        </div>

        <!-- TAB 5: Settings -->
        <div class="admin-tab-content" id="tabSettings">
          <div class="admin-field">
            <label>Change Secret Admin PIN</label>
            <input type="password" id="newAdminPin" placeholder="New 4-digit PIN" />
            <button type="button" class="admin-btn-secondary" style="margin-top:0.5rem; width:100%; padding:0.6rem;" onclick="window.portfolioAdmin.changePin()">Update PIN</button>
          </div>
          <div class="admin-field" style="margin-top:2rem;">
            <label>Reset to Factory Defaults</label>
            <button type="button" style="background:#ff4d4f; color:#fff; border:none; padding:0.7rem; border-radius:8px; width:100%; cursor:pointer; font-weight:600;" onclick="window.portfolioAdmin.resetDefaults()">
              <i class="fas fa-trash-alt"></i> Reset All Custom Data
            </button>
          </div>
        </div>
      </div>

      <div class="admin-drawer-footer">
        <button class="admin-save-btn" onclick="window.portfolioAdmin.saveChanges()">
          <i class="fas fa-check"></i> Apply Changes Live
        </button>
        <button class="admin-download-btn" onclick="window.portfolioAdmin.exportHtml()">
          <i class="fas fa-download"></i> Download Updated index.html
        </button>
      </div>
    `;
    document.body.appendChild(adminDrawer);

    // 4. Toast Notification
    const toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span id="adminToastMsg">Success</span>`;
    document.body.appendChild(toast);

    // Setup Tab Events
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });

    // Setup Photo Upload Events
    setupPhotoUpload();

    // Check if session was already authenticated
    if (sessionStorage.getItem('portfolio_admin_auth') === 'true') {
      adminBar.classList.add('active');
    }
  }

  // ─── Setup Photo Upload & Drag/Drop ───
  function setupPhotoUpload() {
    const dropzone = document.getElementById('adminPhotoDropzone');
    const fileInput = document.getElementById('adminPhotoFileInput');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handlePhotoFile(file);
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#c9a84c';
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      if (e.dataTransfer.files.length) {
        handlePhotoFile(e.dataTransfer.files[0]);
      }
    });
  }

  function handlePhotoFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      currentPhotoDataUrl = event.target.result;
      updatePhotoDOM(currentPhotoDataUrl);
      localStorage.setItem(PHOTO_STORAGE_KEY, currentPhotoDataUrl);
      showToast('Profile photo updated live!');
    };
    reader.readAsDataURL(file);
  }

  function updatePhotoDOM(src) {
    const preview = document.getElementById('adminPhotoPreview');
    const heroPhoto = document.getElementById('heroPhoto') || document.querySelector('.hero-photo');
    const navAvatar = document.querySelector('.nav-avatar');

    if (preview) preview.src = src;
    if (heroPhoto) heroPhoto.src = src;
    if (navAvatar) navAvatar.src = src;
  }

  // ─── Keyboard Shortcut: Ctrl + Shift + A ───
  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.portfolioAdmin.openAuth();
      }
      if (e.key === 'Escape') {
        window.portfolioAdmin.closeAuth();
        window.portfolioAdmin.closeDrawer();
      }
    });

    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) {
      pinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.portfolioAdmin.verifyAuth();
      });
    }
  }

  // ─── Show Toast ───
  function showToast(msg) {
    const toast = document.getElementById('adminToast');
    const toastMsg = document.getElementById('adminToastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  }

  // ─── Load Saved Custom Data ───
  function loadSavedData() {
    // 1. Photo
    const savedPhoto = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (savedPhoto) {
      currentPhotoDataUrl = savedPhoto;
      updatePhotoDOM(savedPhoto);
    }

    // 2. Content Data
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      applyDataToDOM(data);
      populateDrawerFields(data);
    } catch (e) {
      console.warn('Could not parse portfolio custom data', e);
    }
  }

  function applyDataToDOM(data) {
    if (data.name) {
      document.querySelectorAll('.hero-name').forEach(el => el.textContent = data.name);
      document.querySelectorAll('.logo-text').forEach(el => el.textContent = data.name);
      document.title = `${data.name} | Remote Sensing & GIS | Agriculturist`;
    }
    if (data.greeting) {
      const g = document.querySelector('.hero-greeting');
      if (g) g.textContent = data.greeting;
    }
    if (data.tagline) {
      const t = document.querySelector('.hero-tagline');
      if (t) t.textContent = data.tagline;
    }
    if (data.location) {
      document.querySelectorAll('.contact-card .contact-value').forEach(el => {
        if (el.textContent.includes('Pradesh') || el.textContent.includes('India')) el.textContent = data.location;
      });
    }
    if (data.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = `mailto:${data.email}`;
        if (a.textContent.includes('@')) a.textContent = data.email;
      });
    }
    if (data.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = `tel:${data.phone}`;
        if (a.textContent.includes('+') || a.textContent.includes('739')) a.textContent = data.phone;
      });
    }
    if (data.cgpaMsc) {
      const mscStat = document.querySelectorAll('.stat-item')[2];
      if (mscStat) {
        const num = mscStat.querySelector('.stat-number');
        if (num) num.textContent = data.cgpaMsc;
      }
    }
  }

  function populateDrawerFields(data) {
    if (data.name && document.getElementById('editName')) document.getElementById('editName').value = data.name;
    if (data.greeting && document.getElementById('editGreeting')) document.getElementById('editGreeting').value = data.greeting;
    if (data.tagline && document.getElementById('editTagline')) document.getElementById('editTagline').value = data.tagline;
    if (data.location && document.getElementById('editLocation')) document.getElementById('editLocation').value = data.location;
    if (data.email && document.getElementById('editEmail')) document.getElementById('editEmail').value = data.email;
    if (data.phone && document.getElementById('editPhone')) document.getElementById('editPhone').value = data.phone;
    if (data.cgpaMsc && document.getElementById('editCgpaMsc')) document.getElementById('editCgpaMsc').value = data.cgpaMsc;
  }

  /* ══════════════════════════════════════════════════════════
     CERTIFICATE PERSISTENCE
     The grid is snapshotted to localStorage after every add or
     remove, so drawer edits survive a reload instead of vanishing.
     A pristine copy of the original six is kept as a safety net.
  ══════════════════════════════════════════════════════════ */

  const textEsc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const attrEsc = (s) => textEsc(s).replace(/"/g, '&quot;');

  /* read the live grid back into plain records */
  function snapshotCertCards() {
    return Array.from(document.querySelectorAll('.cert-card')).map((card) => {
      const q = (sel) => card.querySelector(sel);
      const iconWrap = q('.cert-icon-wrap');
      const iconI = iconWrap ? iconWrap.querySelector('i') : null;
      const issuerEl = q('.cert-issuer');
      const dateEl = q('.cert-date span') || q('.cert-date');
      const ribbonEl = q('.cert-ribbon');
      const topEl = q('.cert-top');
      const issuerIcon = issuerEl ? issuerEl.querySelector('i') : null;

      return {
        ribbon: ribbonEl ? ribbonEl.textContent.trim() : '',
        ribbonStyle: ribbonEl ? (ribbonEl.getAttribute('style') || '') : '',
        topStyle: topEl ? (topEl.getAttribute('style') || '') : '',
        icon: iconI ? iconI.className : '',
        iconText: iconI ? '' : (iconWrap ? iconWrap.textContent.trim() : ''),
        iconStyle: iconWrap ? (iconWrap.getAttribute('style') || '') : '',
        title: q('.cert-title') ? q('.cert-title').textContent.trim() : '',
        issuer: issuerEl ? issuerEl.textContent.trim() : '',
        issuerIcon: issuerIcon ? issuerIcon.className : 'fas fa-building',
        date: dateEl ? dateEl.textContent.trim() : '',
        skills: Array.from(card.querySelectorAll('.cert-skills span')).map((s) => s.textContent.trim())
      };
    });
  }

  /* rebuild one card from a record, mirroring the original markup exactly */
  function buildCertCard(rec, index) {
    const card = document.createElement('div');
    /* .reveal is observed by futurist.js, which runs after this script */
    card.className = 'cert-card reveal';

    const ribbonStyle = rec.ribbonStyle ? ` style="${attrEsc(rec.ribbonStyle)}"` : '';
    const topStyle = rec.topStyle ? ` style="${attrEsc(rec.topStyle)}"` : '';
    const iconStyle = rec.iconStyle ? ` style="${attrEsc(rec.iconStyle)}"` : '';
    const iconInner = rec.icon
      ? `<i class="${attrEsc(rec.icon)}"></i>`
      : textEsc(rec.iconText);
    const skillsHtml = (rec.skills || []).map((s) => `<span>${textEsc(s)}</span>`).join('');

    card.innerHTML = `
      ${rec.ribbon ? `<div class="cert-ribbon"${ribbonStyle}>${textEsc(rec.ribbon)}</div>` : ''}
      <div class="cert-top"${topStyle}>
        <div class="cert-icon-wrap"${iconStyle}>${iconInner}</div>
        <div class="cert-glow"></div>
      </div>
      <div class="cert-body">
        <h3 class="cert-title">${textEsc(rec.title)}</h3>
        <p class="cert-issuer"><i class="${attrEsc(rec.issuerIcon || 'fas fa-building')}"></i> ${textEsc(rec.issuer)}</p>
        <div class="cert-date"><i class="far fa-calendar-alt"></i><span>${textEsc(rec.date || 'Recent')}</span></div>
        <div class="cert-skills">${skillsHtml}</div>
        <a href="#" class="cert-btn" onclick="showCertModal(&quot;${attrEsc(rec.title)}&quot;, &quot;${attrEsc(rec.issuer)}&quot;, &quot;${attrEsc(rec.date)}&quot;); return false;">
          <i class="fas fa-external-link-alt"></i> View Certificate
        </a>
      </div>
    `;

    card.style.setProperty('--delay', (0.1 * (index + 1)).toFixed(1) + 's');
    return card;
  }

  function renderCertGrid(records) {
    const grid = document.querySelector('.cert-grid');
    if (!grid) return;
    grid.innerHTML = '';
    records.forEach((rec, i) => grid.appendChild(buildCertCard(rec, i)));
  }

  function saveCertSnapshot() {
    try {
      localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(snapshotCertCards()));
    } catch (e) {
      console.warn('Could not save certificate snapshot', e);
    }
  }

  function loadCertSnapshot() {
    const grid = document.querySelector('.cert-grid');
    if (!grid) return;

    /* keep one untouched copy of the original six, on first ever run */
    try {
      if (!localStorage.getItem(CERTS_PRISTINE_KEY)) {
        localStorage.setItem(CERTS_PRISTINE_KEY, grid.innerHTML);
      }
    } catch (e) { /* storage unavailable — snapshots simply stay off */ }

    let records = null;
    try {
      const raw = localStorage.getItem(CERTS_STORAGE_KEY);
      if (raw) records = JSON.parse(raw);
    } catch (e) { records = null; }

    if (!Array.isArray(records)) return;
    if (!records.length) {
      grid.innerHTML = '<p class="admin-help-text">No certificates in the grid. Use the button below to restore the originals.</p>';
      return;
    }
    renderCertGrid(records);
  }

  // ─── Public API ───
  window.portfolioAdmin = {
    openAuth() {
      const modal = document.getElementById('adminAuthModal');
      const err = document.getElementById('adminAuthError');
      const pinInput = document.getElementById('adminPinInput');
      if (err) err.classList.remove('show');
      if (modal) modal.classList.add('active');
      if (pinInput) { pinInput.value = ''; setTimeout(() => pinInput.focus(), 150); }
    },

    closeAuth() {
      const modal = document.getElementById('adminAuthModal');
      if (modal) modal.classList.remove('active');
    },

    verifyAuth() {
      const pinInput = document.getElementById('adminPinInput');
      const err = document.getElementById('adminAuthError');
      const correctPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;

      if (pinInput && pinInput.value.trim() === correctPin) {
        sessionStorage.setItem('portfolio_admin_auth', 'true');
        this.closeAuth();
        const bar = document.getElementById('adminBar');
        if (bar) bar.classList.add('active');
        this.openDrawer();
        showToast('Welcome back, Akshit! Admin mode active.');
      } else {
        if (err) err.classList.add('show');
        if (pinInput) {
          pinInput.style.borderColor = '#ff6b6b';
          setTimeout(() => pinInput.style.borderColor = '', 1000);
        }
      }
    },

    logout() {
      sessionStorage.removeItem('portfolio_admin_auth');
      const bar = document.getElementById('adminBar');
      if (bar) bar.classList.remove('active');
      this.closeDrawer();
      showToast('Exited Admin mode.');
    },

    openDrawer() {
      const drawer = document.getElementById('adminDrawer');
      if (drawer) {
        // Prepopulate current values if empty
        const taglineEl = document.querySelector('.hero-tagline');
        const editTagline = document.getElementById('editTagline');
        if (taglineEl && editTagline && !editTagline.value) {
          editTagline.value = taglineEl.textContent.trim();
        }
        this.renderCertManagerList();
        drawer.classList.add('open');
      }
    },

    closeDrawer() {
      const drawer = document.getElementById('adminDrawer');
      if (drawer) drawer.classList.remove('open');
    },

    saveChanges() {
      const name = document.getElementById('editName')?.value.trim() || 'N. Akshit Vinay';
      const greeting = document.getElementById('editGreeting')?.value.trim() || 'Hello, I am';
      const tagline = document.getElementById('editTagline')?.value.trim() || '';
      const location = document.getElementById('editLocation')?.value.trim() || '';
      const email = document.getElementById('editEmail')?.value.trim() || '';
      const phone = document.getElementById('editPhone')?.value.trim() || '';
      const cgpaMsc = document.getElementById('editCgpaMsc')?.value.trim() || '10.0';

      const data = { name, greeting, tagline, location, email, phone, cgpaMsc };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      applyDataToDOM(data);
      showToast('Changes applied live & saved!');
    },

    addNewCert() {
      const title = document.getElementById('newCertTitle')?.value.trim();
      const issuer = document.getElementById('newCertIssuer')?.value.trim();
      const date = document.getElementById('newCertDate')?.value.trim();
      const ribbon = document.getElementById('newCertRibbon')?.value.trim() || 'Certified';
      const skillsRaw = document.getElementById('newCertSkills')?.value.trim() || '';

      if (!title || !issuer) {
        showToast('Please enter both Certificate Title and Issuer');
        return;
      }

      const certGrid = document.querySelector('.cert-grid');

      if (certGrid) {
        const card = buildCertCard({
          ribbon: ribbon,
          ribbonStyle: 'background: var(--accent); color: var(--primary);',
          topStyle: 'background: linear-gradient(135deg, #0d3b2e 0%, #1b5e47 50%, #38a37f 100%);',
          icon: 'fas fa-certificate',
          iconText: '',
          iconStyle: '',
          title: title,
          issuer: issuer,
          issuerIcon: 'fas fa-building',
          date: date || 'Recent',
          skills: skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
        }, 0);

        /* created after futurist.js set up its observer, so reveal it at once */
        card.classList.add('custom-cert', 'in');
        certGrid.insertBefore(card, certGrid.firstChild);
        saveCertSnapshot();
        showToast(`Certificate "${title}" added to grid!`);

        // Clear input fields
        document.getElementById('newCertTitle').value = '';
        document.getElementById('newCertIssuer').value = '';
        document.getElementById('newCertDate').value = '';
        document.getElementById('newCertSkills').value = '';

        this.renderCertManagerList();
      }
    },

    renderCertManagerList() {
      const container = document.getElementById('adminCertList');
      if (!container) return;
      const cards = document.querySelectorAll('.cert-card');
      container.innerHTML = '';
      cards.forEach((card, index) => {
        const title = card.querySelector('.cert-title')?.textContent || `Certificate ${index + 1}`;
        const issuer = card.querySelector('.cert-issuer')?.textContent || '';
        const item = document.createElement('div');
        item.className = 'admin-cert-item';
        item.innerHTML = `
          <div class="admin-cert-info">
            <h4>${title}</h4>
            <p>${issuer}</p>
          </div>
          <button class="admin-cert-delete" title="Remove Certificate" onclick="window.portfolioAdmin.removeCert(${index})">
            <i class="fas fa-trash"></i>
          </button>
        `;
        container.appendChild(item);
      });
    },

    removeCert(index) {
      const cards = document.querySelectorAll('.cert-card');
      if (cards[index]) {
        cards[index].remove();
        saveCertSnapshot();
        this.renderCertManagerList();
        showToast('Certificate removed — saved for this device.');
      }
    },

    /* rebuild the grid from the untouched copy taken on the first visit */
    restoreDefaultCerts() {
      let pristine = null;
      try { pristine = localStorage.getItem(CERTS_PRISTINE_KEY); } catch (e) {}
      const grid = document.querySelector('.cert-grid');
      if (!grid || !pristine) {
        showToast('No original copy of the certificates is stored on this device.');
        return;
      }
      if (!confirm('Restore the original six certificates? This replaces the current grid.')) return;

      grid.innerHTML = pristine;
      grid.querySelectorAll('.cert-card').forEach(card => card.classList.add('animated'));
      localStorage.removeItem(CERTS_STORAGE_KEY);
      saveCertSnapshot();
      this.renderCertManagerList();
      showToast('Original certificates restored.');
    },

    changePin() {
      const newPin = document.getElementById('newAdminPin')?.value.trim();
      if (!newPin || newPin.length < 4) {
        showToast('PIN must be at least 4 digits');
        return;
      }
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
      document.getElementById('newAdminPin').value = '';
      showToast('Admin PIN updated successfully!');
    },

    resetDefaults() {
      if (confirm('Are you sure you want to reset all custom edits to original portfolio defaults?')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PHOTO_STORAGE_KEY);
        localStorage.removeItem(CERTS_STORAGE_KEY);
        localStorage.removeItem(CERTS_PRISTINE_KEY);
        sessionStorage.removeItem('portfolio_admin_auth');
        location.reload();
      }
    },

    // ─── Export HTML: Serializes the current live page into a clean downloadable file ───
    exportHtml() {
      this.saveChanges();

      // Clone current document
      const clone = document.documentElement.cloneNode(true);

      // Remove admin injected UI elements from the export so visitor code stays ultra-clean
      const elIdsToRemove = ['adminAuthModal', 'adminBar', 'adminDrawer', 'adminToast'];
      elIdsToRemove.forEach(id => {
        const el = clone.querySelector(`#${id}`);
        if (el) el.remove();
      });

      // Construct clean HTML string
      const htmlContent = '<!DOCTYPE html>\n' + clone.outerHTML;

      // Trigger download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('📥 index.html downloaded! Replace your file to make it permanent.');
    }
  };

  // Helper alias for footer button
  window.openAdminAuth = () => window.portfolioAdmin.openAuth();

})();
