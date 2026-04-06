/* ============================================================
   script.js — PortfolioForge
   Description: All JavaScript logic for the portfolio generator
   ============================================================ */

/* ===== GLOBAL STATE OBJECT =====
   Ek central jagah jahan saari user data store hoti hai */
let state = {
  name: '',
  role: '',
  email: '',
  bio: '',
  location: '',
  avatar: null,
  github: '',
  linkedin: '',
  twitter: '',
  website: '',
  skills: [],
  projects: [],
  experience: [],
  theme: 'dark',
  layout: 'card',
  colors: {
    accent:  '#6c63ff',
    accent2: '#ff6584',
    bg:      '#0a0a0f',
    text:    '#e8e8f0'
  }
};

/* Counter variables to give unique IDs to dynamic elements */
let projectCounter = 0;
let expCounter = 0;

/* ============================================================
   INIT — Page load par demo data dalta hai
   ============================================================ */
function init() {
  // Demo identity
  document.getElementById('inp_name').value     = 'Alex Rivera';
  document.getElementById('inp_role').value     = 'Frontend Engineer & Creative Coder';
  document.getElementById('inp_bio').value      = 'I craft beautiful, high-performance web experiences. Passionate about design systems, open source, and turning complex ideas into elegant interfaces.';
  document.getElementById('inp_location').value = 'San Francisco, CA';
  document.getElementById('inp_email').value    = 'alex@example.com';
  document.getElementById('inp_github').value   = 'https://github.com/alexrivera';
  document.getElementById('inp_linkedin').value = 'https://linkedin.com/in/alexrivera';

  // Demo Skills
  const demoSkills = [
    { name: 'React',      level: 'expert' },
    { name: 'TypeScript', level: 'expert' },
    { name: 'Node.js',    level: 'advanced' },
    { name: 'Figma',      level: 'advanced' },
    { name: 'Python',     level: 'intermediate' },
    { name: 'GraphQL',    level: 'intermediate' },
  ];
  demoSkills.forEach(skill => {
    state.skills.push(skill);
    renderSkillTag(skill);
  });

  // Demo Projects
  addProject({
    name:   'DevFlow',
    desc:   'A **real-time collaboration tool** for developers. Built with React, WebSockets, and Redis.',
    tech:   'React, Node.js, Redis, WebSockets',
    url:    'https://devflow.app',
    github: 'https://github.com/alex/devflow',
    emoji:  '🚀'
  });
  addProject({
    name:   'PixelCanvas',
    desc:   'A multiplayer pixel art editor. **50k+ concurrent users** at peak. Optimized with Canvas API.',
    tech:   'Canvas API, WebSockets, Rust',
    url:    'https://pixelcanvas.io',
    github: 'https://github.com/alex/pixelcanvas',
    emoji:  '🎨'
  });

  // Demo Experience
  addExperience({
    title: 'Senior Frontend Engineer',
    org:   'Stripe',
    date:  '2022 – Present',
    desc:  'Led the Dashboard redesign that improved user satisfaction by 34%. Mentored 3 junior engineers.'
  });
  addExperience({
    title: 'Software Engineer',
    org:   'Vercel',
    date:  '2020 – 2022',
    desc:  'Built the deployment pipeline UI used by 1M+ developers. Reduced build times by 60%.'
  });

  // First render
  updatePreview();
}

/* ============================================================
   THEME SYSTEM
   ============================================================ */

/**
 * setTheme — Theme change karta hai (dark/light/gradient/developer)
 * @param {string} theme - Theme name
 * @param {HTMLElement} el - Clicked pill button
 */
function setTheme(theme, el) {
  state.theme = theme;
  document.body.setAttribute('data-theme', theme);

  // Active class update
  document.querySelectorAll('.theme-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  // Har theme ke default colors
  const themeColors = {
    dark:      { accent: '#6c63ff', accent2: '#ff6584', bg: '#0a0a0f',  text: '#e8e8f0' },
    light:     { accent: '#6c63ff', accent2: '#ff6584', bg: '#f5f5f7',  text: '#1a1a2e' },
    gradient:  { accent: '#bf5af2', accent2: '#ff375f', bg: '#0d0221',  text: '#f5f0ff' },
    developer: { accent: '#39d353', accent2: '#58a6ff', bg: '#0d1117',  text: '#c9d1d9' },
  };

  const c = themeColors[theme];
  document.getElementById('col_accent').value  = c.accent;
  document.getElementById('col_accent2').value = c.accent2;
  document.getElementById('col_bg').value      = c.bg;
  document.getElementById('col_text').value    = c.text;
  state.colors = c;

  updateColors();
  updatePreview();
}

/* ============================================================
   LAYOUT SYSTEM
   ============================================================ */

/**
 * setLayout — Layout change karta hai (card/timeline/bars)
 * @param {string} layout - Layout name
 * @param {HTMLElement} el - Clicked pill button
 */
function setLayout(layout, el) {
  state.layout = layout;
  document.querySelectorAll('.layout-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  updatePreview();
}

/* ============================================================
   COLOR SYSTEM
   ============================================================ */

/**
 * updateColors — Color picker se CSS variables update karta hai
 */
function updateColors() {
  const accent  = document.getElementById('col_accent').value;
  const accent2 = document.getElementById('col_accent2').value;
  state.colors  = { accent, accent2 };

  // CSS variables live update
  document.documentElement.style.setProperty('--accent',  accent);
  document.documentElement.style.setProperty('--accent2', accent2);

  updatePreview();
}

/**
 * resetColors — Default colors par wapas jaata hai
 */
function resetColors() {
  document.getElementById('col_accent').value  = '#6c63ff';
  document.getElementById('col_accent2').value = '#ff6584';
  updateColors();
}

/* ============================================================
   AVATAR / IMAGE UPLOAD
   ============================================================ */

/**
 * handleAvatar — Profile image upload aur preview
 * @param {Event} e - File input change event
 */
function handleAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    state.avatar = ev.target.result; // Base64 string store

    // Preview update
    const preview = document.getElementById('avatarPreview');
    preview.innerHTML = `<img src="${state.avatar}" alt="Avatar">`;

    updatePreview();
  };
  reader.readAsDataURL(file); // Image ko Base64 mein convert karo
}

/* ============================================================
   SKILLS SYSTEM
   ============================================================ */

/**
 * addSkill — Naya skill add karta hai
 */
function addSkill() {
  const input = document.getElementById('skillInput');
  const level = document.getElementById('skillLevel').value;
  const name  = input.value.trim();

  if (!name) return; // Empty input ignore

  const skill = { name, level };
  state.skills.push(skill);
  renderSkillTag(skill);

  input.value = ''; // Clear input
  input.focus();
  updatePreview();
}

/**
 * renderSkillTag — Editor mein skill tag DOM element banata hai
 * @param {Object} skill - { name, level }
 */
function renderSkillTag(skill) {
  const tag = document.createElement('div');
  tag.className = 'skill-tag';
  tag.innerHTML = `
    <span>${skill.name}</span>
    <span class="level-badge level-${skill.level}">${skill.level}</span>
    <i class="fas fa-times remove"></i>
  `;

  // Remove button click handler
  tag.querySelector('.remove').addEventListener('click', () => {
    state.skills = state.skills.filter(s => s !== skill); // State se remove
    tag.style.animation = 'tagIn 0.2s ease reverse';
    setTimeout(() => {
      tag.remove();
      updatePreview();
    }, 200);
  });

  document.getElementById('skillsContainer').appendChild(tag);
}

/* ============================================================
   PROJECTS SYSTEM
   ============================================================ */

/**
 * addProject — Naya project form card add karta hai
 * @param {Object} data - Pre-fill data (optional, for demo)
 */
function addProject(data = {}) {
  const id        = ++projectCounter;
  const container = document.getElementById('projectsContainer');

  const card = document.createElement('div');
  card.className = 'project-card-edit';
  card.id        = `proj_${id}`;

  card.innerHTML = `
    <div class="project-header">
      <h4><i class="fas fa-folder" style="color:var(--accent);margin-right:6px;font-size:12px"></i>Project ${id}</h4>
      <button class="remove-btn" onclick="removeProject(${id})"><i class="fas fa-trash"></i></button>
    </div>

    <div class="field">
      <label>Project Name</label>
      <input type="text" id="proj_name_${id}" placeholder="e.g. DevFlow"
        value="${data.name || ''}" oninput="updatePreview()">
    </div>

    <div class="field">
      <label>Emoji / Icon</label>
      <input type="text" id="proj_emoji_${id}" placeholder="🚀"
        value="${data.emoji || '💡'}" oninput="updatePreview()" style="width:80px">
    </div>

    <div class="field">
      <label>Description <span style="color:var(--text-muted);font-size:11px">(Markdown supported)</span></label>
      <textarea id="proj_desc_${id}"
        placeholder="Describe what you built and the impact..."
        oninput="updatePreview()">${data.desc || ''}</textarea>
    </div>

    <div class="field">
      <label>Tech Stack <span style="color:var(--text-muted);font-size:11px">(comma separated)</span></label>
      <input type="text" id="proj_tech_${id}" placeholder="React, Node.js, PostgreSQL"
        value="${data.tech || ''}" oninput="updatePreview()">
    </div>

    <div class="two-col">
      <div class="field">
        <label>Live URL</label>
        <input type="url" id="proj_url_${id}" placeholder="https://..."
          value="${data.url || ''}" oninput="updatePreview()">
      </div>
      <div class="field">
        <label>GitHub URL</label>
        <input type="url" id="proj_github_${id}" placeholder="https://github.com/..."
          value="${data.github || ''}" oninput="updatePreview()">
      </div>
    </div>
  `;

  container.appendChild(card);
  updatePreview();
}

/**
 * removeProject — Project card remove karta hai
 * @param {number} id - Project ID
 */
function removeProject(id) {
  const card = document.getElementById(`proj_${id}`);
  card.style.animation = 'slideIn 0.2s ease reverse';
  setTimeout(() => {
    card.remove();
    updatePreview();
  }, 200);
}

/* ============================================================
   EXPERIENCE SYSTEM
   ============================================================ */

/**
 * addExperience — Naya experience form card add karta hai
 * @param {Object} data - Pre-fill data (optional)
 */
function addExperience(data = {}) {
  const id        = ++expCounter;
  const container = document.getElementById('experienceContainer');

  const card = document.createElement('div');
  card.className = 'exp-card';
  card.id        = `exp_${id}`;

  card.innerHTML = `
    <div class="exp-header">
      <h4 style="font-size:13px;font-weight:600;color:var(--text)">
        <i class="fas fa-building" style="color:var(--accent);margin-right:6px;font-size:12px"></i>Experience ${id}
      </h4>
      <button class="remove-btn" onclick="removeExperience(${id})"><i class="fas fa-trash"></i></button>
    </div>

    <div class="two-col">
      <div class="field">
        <label>Job Title</label>
        <input type="text" id="exp_title_${id}" placeholder="Senior Engineer"
          value="${data.title || ''}" oninput="updatePreview()">
      </div>
      <div class="field">
        <label>Company</label>
        <input type="text" id="exp_org_${id}" placeholder="Google"
          value="${data.org || ''}" oninput="updatePreview()">
      </div>
    </div>

    <div class="field">
      <label>Duration</label>
      <input type="text" id="exp_date_${id}" placeholder="2022 – Present"
        value="${data.date || ''}" oninput="updatePreview()">
    </div>

    <div class="field">
      <label>Description</label>
      <textarea id="exp_desc_${id}"
        placeholder="Key achievements and responsibilities..."
        oninput="updatePreview()">${data.desc || ''}</textarea>
    </div>
  `;

  container.appendChild(card);
  updatePreview();
}

/**
 * removeExperience — Experience card remove karta hai
 * @param {number} id - Experience ID
 */
function removeExperience(id) {
  const card = document.getElementById(`exp_${id}`);
  card.style.animation = 'slideIn 0.2s ease reverse';
  setTimeout(() => {
    card.remove();
    updatePreview();
  }, 200);
}

/* ============================================================
   STATE GATHERER — DOM se saari values padhta hai
   ============================================================ */

/**
 * gatherState — Saare form inputs se state object update karta hai
 */
function gatherState() {
  const get = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  // Identity
  state.name     = get('inp_name');
  state.role     = get('inp_role');
  state.email    = get('inp_email');
  state.bio      = get('inp_bio');
  state.location = get('inp_location');

  // Socials
  state.github   = get('inp_github');
  state.linkedin = get('inp_linkedin');
  state.twitter  = get('inp_twitter');
  state.website  = get('inp_website');

  // Avatar initial letter update
  const initial = document.getElementById('avatarInitial');
  if (initial && state.name) {
    initial.textContent = state.name.charAt(0).toUpperCase();
  }

  // Gather all projects dynamically
  state.projects = [];
  document.querySelectorAll('[id^="proj_name_"]').forEach(el => {
    const id = el.id.split('_').pop();
    state.projects.push({
      name:   get(`proj_name_${id}`),
      desc:   get(`proj_desc_${id}`),
      tech:   get(`proj_tech_${id}`),
      url:    get(`proj_url_${id}`),
      github: get(`proj_github_${id}`),
      emoji:  get(`proj_emoji_${id}`) || '💡'
    });
  });

  // Gather all experience entries dynamically
  state.experience = [];
  document.querySelectorAll('[id^="exp_title_"]').forEach(el => {
    const id = el.id.split('_').pop();
    state.experience.push({
      title: get(`exp_title_${id}`),
      org:   get(`exp_org_${id}`),
      date:  get(`exp_date_${id}`),
      desc:  get(`exp_desc_${id}`)
    });
  });
}

/* ============================================================
   LIVE PREVIEW RENDERER
   ============================================================ */

/**
 * updatePreview — Right panel mein portfolio HTML render karta hai
 * Har input change par call hota hai
 */
function updatePreview() {
  gatherState();

  const preview = document.getElementById('portfolioPreview');
  const name    = state.name || 'Your Name';
  const role    = state.role || 'Your Role';
  const bio     = state.bio  || 'Your bio will appear here...';
  const initial = name.charAt(0).toUpperCase();

  // Avatar HTML
  const avatarHTML = state.avatar
    ? `<img src="${state.avatar}" alt="${name}">`
    : `<span style="font-size:40px;color:white;font-family:var(--font-display);font-weight:700">${initial}</span>`;

  // Social links pills
  let socialsHTML = '';
  if (state.github)   socialsHTML += `<a href="${state.github}"   class="social-link-pill" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
  if (state.linkedin) socialsHTML += `<a href="${state.linkedin}" class="social-link-pill" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>`;
  if (state.twitter)  socialsHTML += `<a href="${state.twitter}"  class="social-link-pill" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>`;
  if (state.website)  socialsHTML += `<a href="${state.website}"  class="social-link-pill" target="_blank"><i class="fas fa-globe"></i> Website</a>`;

  // ===== BUILD SKILLS HTML =====
  let skillsHTML = '';
  if (state.skills.length > 0) {
    if (state.layout === 'bars') {
      // Progress bar layout
      const levelMap = { expert: 95, advanced: 80, intermediate: 60, beginner: 35 };
      skillsHTML = state.skills.map(s => `
        <div class="skill-bar-item">
          <div class="skill-bar-label">${s.name}<span>${s.level}</span></div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" style="width:${levelMap[s.level] || 70}%"></div>
          </div>
        </div>
      `).join('');
    } else {
      // Pill / tag layout
      skillsHTML = `<div class="skills-preview">
        ${state.skills.map(s => `
          <div class="skill-pill-preview">
            <div class="skill-dot"></div>
            ${s.name}
            <span class="level-badge level-${s.level}">${s.level}</span>
          </div>
        `).join('')}
      </div>`;
    }
  } else {
    skillsHTML = `<div class="empty-placeholder">
      <i class="fas fa-code"></i>
      <p>Add skills to showcase your expertise</p>
    </div>`;
  }

  // ===== BUILD PROJECTS HTML =====
  let projectsHTML = '';
  if (state.projects.length > 0) {
    if (state.layout === 'timeline') {
      // Timeline layout
      projectsHTML = `<div class="timeline">
        ${state.projects.map(p => `
          <div class="timeline-item">
            <div class="timeline-date">${p.emoji} Project</div>
            <div class="timeline-title">${p.name || 'Untitled'}</div>
            <div class="timeline-org">${p.tech || ''}</div>
            <div class="timeline-desc">${p.desc ? parseMarkdown(p.desc) : ''}</div>
            ${buildProjectLinks(p)}
          </div>
        `).join('')}
      </div>`;
    } else {
      // Card grid layout
      projectsHTML = `<div class="projects-grid">
        ${state.projects.map((p, i) => {
          const isSingle = state.projects.length === 1 ||
            (state.projects.length % 2 !== 0 && i === state.projects.length - 1);
          return `
            <div class="project-card-preview ${isSingle ? 'single' : ''}">
              <div class="project-emoji">${p.emoji || '💡'}</div>
              <div class="project-name">${p.name || 'Untitled Project'}</div>
              <div class="project-desc">${p.desc ? parseMarkdown(p.desc) : ''}</div>
              ${p.tech ? `<div class="project-tech">
                ${p.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
              </div>` : ''}
              ${buildProjectLinks(p)}
            </div>
          `;
        }).join('')}
      </div>`;
    }
  } else {
    projectsHTML = `<div class="empty-placeholder">
      <i class="fas fa-folder-open"></i>
      <p>Add projects to showcase your work</p>
    </div>`;
  }

  // ===== BUILD EXPERIENCE HTML =====
  let expHTML = '';
  if (state.experience.length > 0) {
    if (state.layout === 'card') {
      expHTML = `<div style="display:grid;gap:16px">
        ${state.experience.map(e => `
          <div class="project-card-preview">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <div class="project-name" style="margin-bottom:2px">${e.title || 'Title'}</div>
                <div style="font-size:14px;color:var(--accent);font-weight:500">${e.org || 'Company'}</div>
              </div>
              <div style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap;margin-left:12px">
                ${e.date || ''}
              </div>
            </div>
            <div class="project-desc">${e.desc || ''}</div>
          </div>
        `).join('')}
      </div>`;
    } else {
      // Timeline layout for experience
      expHTML = `<div class="timeline">
        ${state.experience.map(e => `
          <div class="timeline-item">
            <div class="timeline-date">${e.date || 'Date'}</div>
            <div class="timeline-title">${e.title || 'Title'}</div>
            <div class="timeline-org">${e.org || 'Company'}</div>
            <div class="timeline-desc">${e.desc || ''}</div>
          </div>
        `).join('')}
      </div>`;
    }
  } else {
    expHTML = `<div class="empty-placeholder">
      <i class="fas fa-briefcase"></i>
      <p>Add experience to highlight your career</p>
    </div>`;
  }

  // ===== BUILD CONTACT HTML =====
  let contactHTML = `<div class="contact-grid">`;
  if (state.email)    contactHTML += `<a href="mailto:${state.email}" class="contact-card"><div class="contact-icon"><i class="fas fa-envelope"></i></div><div><div class="contact-info">Email</div><div class="contact-value">${state.email}</div></div></a>`;
  if (state.location) contactHTML += `<div class="contact-card"><div class="contact-icon"><i class="fas fa-location-dot"></i></div><div><div class="contact-info">Location</div><div class="contact-value">${state.location}</div></div></div>`;
  if (state.github)   contactHTML += `<a href="${state.github}" class="contact-card" target="_blank"><div class="contact-icon"><i class="fab fa-github"></i></div><div><div class="contact-info">GitHub</div><div class="contact-value">View Profile</div></div></a>`;
  if (state.website)  contactHTML += `<a href="${state.website}" class="contact-card" target="_blank"><div class="contact-icon"><i class="fas fa-globe"></i></div><div><div class="contact-info">Website</div><div class="contact-value">Visit Site</div></div></a>`;
  contactHTML += `</div>`;

  if (!state.email && !state.location && !state.github && !state.website) {
    contactHTML = `<div class="empty-placeholder"><i class="fas fa-address-card"></i><p>Add contact information</p></div>`;
  }

  // ===== INJECT FINAL HTML INTO PREVIEW =====
  preview.innerHTML = `
    <div class="portfolio-hero">
      <div class="hero-inner">
        <div class="hero-avatar">${avatarHTML}</div>
        <div class="hero-content">
          <div class="hero-badge"><i class="fas fa-circle" style="font-size:6px"></i> Available for opportunities</div>
          <div class="hero-name">${name}</div>
          <div class="hero-role">${role}</div>
          <div class="hero-bio">${bio}</div>
          ${socialsHTML ? `<div class="hero-socials">${socialsHTML}</div>` : ''}
        </div>
      </div>
    </div>

    <div class="portfolio-section">
      <div class="section-title">Skills &amp; Expertise</div>
      ${skillsHTML}
    </div>

    <div class="portfolio-section">
      <div class="section-title">Featured Projects</div>
      ${projectsHTML}
    </div>

    <div class="portfolio-section">
      <div class="section-title">Experience</div>
      ${expHTML}
    </div>

    <div class="portfolio-section">
      <div class="section-title">Get In Touch</div>
      ${contactHTML}
    </div>

    <div class="preview-footer">
      Built with <span>PortfolioForge</span> · Your story, your way.
    </div>
  `;

  // Animate skill bars after DOM paint (bars layout only)
  if (state.layout === 'bars') {
    setTimeout(() => {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => { bar.style.width = targetWidth; });
      });
    }, 50);
  }
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/**
 * parseMarkdown — Markdown text ko HTML mein convert karta hai
 * @param {string} text - Markdown string
 * @returns {string} - HTML string
 */
function parseMarkdown(text) {
  if (typeof marked !== 'undefined') {
    return marked.parse(text);
  }
  return text; // Fallback if marked.js not loaded
}

/**
 * buildProjectLinks — Project ke Live / GitHub link buttons banata hai
 * @param {Object} p - Project object
 * @returns {string} - HTML string
 */
function buildProjectLinks(p) {
  if (!p.url && !p.github) return '';
  return `
    <div class="project-links" style="margin-top:10px">
      ${p.url    ? `<a href="${p.url}"    class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
      ${p.github ? `<a href="${p.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
    </div>
  `;
}

/* ============================================================
   EXPORT FUNCTIONS
   ============================================================ */

/**
 * getPortfolioHTML — Complete standalone HTML file generate karta hai
 * @returns {string} - Full HTML document as string
 */
function getPortfolioHTML() {
  gatherState();
  const accent     = document.getElementById('col_accent').value;
  const accent2    = document.getElementById('col_accent2').value;
  const bgColor    = document.getElementById('col_bg').value;
  const textColor  = document.getElementById('col_text').value;
  const themeAttr  = document.body.getAttribute('data-theme');
  const previewContent = document.getElementById('portfolioPreview').innerHTML;

  return `<!DOCTYPE html>
<html lang="en" data-theme="${themeAttr}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${state.name || 'Portfolio'}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
/* Minified styles for exported file */
:root{--accent:${accent};--accent2:${accent2};--bg:${bgColor};--surface:#13131a;--surface2:#1e1e2e;--border:rgba(255,255,255,0.07);--text:${textColor};--text-muted:#6b6b8a;--text-dim:#9898b8;--font-display:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;--font-mono:'JetBrains Mono',monospace;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);max-width:900px;margin:0 auto;}
.portfolio-hero{padding:60px 48px 48px;position:relative;overflow:hidden;}
.portfolio-hero::before{content:'';position:absolute;top:-40%;right:-10%;width:500px;height:500px;background:radial-gradient(circle,var(--accent) 0%,transparent 70%);opacity:0.08;pointer-events:none;}
.hero-inner{display:flex;align-items:flex-start;gap:32px;position:relative;z-index:1;}
.hero-avatar{width:100px;height:100px;border-radius:24px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:40px;color:white;overflow:hidden;flex-shrink:0;box-shadow:0 20px 60px rgba(108,99,255,0.3);border:2px solid rgba(255,255,255,0.1);}
.hero-avatar img{width:100%;height:100%;object-fit:cover;}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:rgba(108,99,255,0.12);border:1px solid rgba(108,99,255,0.2);border-radius:20px;font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;margin-bottom:12px;}
.hero-name{font-family:var(--font-display);font-size:42px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;background:linear-gradient(135deg,var(--text),var(--text-dim));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;}
.hero-role{font-size:18px;color:var(--accent);font-weight:500;margin-bottom:16px;font-family:var(--font-display);}
.hero-bio{font-size:15px;line-height:1.7;color:var(--text-dim);max-width:560px;}
.hero-socials{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;}
.social-link-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;background:var(--surface);border:1px solid var(--border);border-radius:20px;font-size:13px;color:var(--text-muted);text-decoration:none;font-weight:500;}
.portfolio-section{padding:40px 48px;border-top:1px solid var(--border);}
.section-title{font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--text);}
.section-title::after{content:'';flex:1;height:1px;background:var(--border);}
.skills-preview{display:flex;flex-wrap:wrap;gap:10px;}
.skill-pill-preview{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:var(--surface);border:1px solid var(--border);border-radius:30px;font-size:13px;font-weight:500;color:var(--text);}
.skill-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);}
.level-badge{font-size:10px;padding:2px 7px;border-radius:10px;font-weight:600;}
.level-expert{background:rgba(57,211,83,0.12);color:#39d353;}.level-advanced{background:rgba(108,99,255,0.12);color:var(--accent);}.level-intermediate{background:rgba(255,101,132,0.12);color:var(--accent2);}.level-beginner{background:rgba(255,200,0,0.12);color:#ffc800;}
.projects-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.project-card-preview{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;transition:all 0.3s;position:relative;overflow:hidden;}
.project-card-preview::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2));transform:scaleX(0);transition:transform 0.3s;}
.project-card-preview:hover::before{transform:scaleX(1);}
.project-card-preview:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.3);}
.project-card-preview.single{grid-column:1/-1;}
.project-emoji{font-size:32px;margin-bottom:12px;}.project-name{font-family:var(--font-display);font-size:17px;font-weight:700;margin-bottom:8px;color:var(--text);}.project-desc{font-size:13px;line-height:1.6;color:var(--text-dim);margin-bottom:14px;}.project-desc p{margin:0;}
.project-tech{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}.tech-tag{padding:3px 10px;background:var(--surface2);border-radius:20px;font-size:11px;font-weight:500;color:var(--text-muted);font-family:var(--font-mono);}
.project-links{display:flex;gap:8px;}.project-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--accent);text-decoration:none;font-weight:500;padding:4px 10px;border-radius:8px;border:1px solid rgba(108,99,255,0.2);}
.timeline{position:relative;padding-left:24px;}.timeline::before{content:'';position:absolute;left:4px;top:0;bottom:0;width:2px;background:var(--border);}
.timeline-item{position:relative;padding-bottom:32px;}.timeline-item::before{content:'';position:absolute;left:-24px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--bg),0 0 0 5px rgba(108,99,255,0.2);}
.timeline-date{font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-family:var(--font-mono);}.timeline-title{font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--text);margin-bottom:2px;}.timeline-org{font-size:14px;color:var(--text-muted);margin-bottom:8px;}.timeline-desc{font-size:13px;line-height:1.6;color:var(--text-dim);}
.skill-bar-item{margin-bottom:16px;}.skill-bar-label{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;font-weight:500;color:var(--text);}.skill-bar-label span{color:var(--text-muted);font-size:12px;}.skill-bar-track{height:6px;background:var(--surface2);border-radius:10px;overflow:hidden;}.skill-bar-fill{height:100%;border-radius:10px;background:linear-gradient(90deg,var(--accent),var(--accent2));}
.contact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}.contact-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:12px;text-decoration:none;color:var(--text);}
.contact-icon{font-size:20px;color:var(--accent);}.contact-info{font-size:12px;color:var(--text-muted);}.contact-value{font-size:14px;font-weight:500;color:var(--text);}
.preview-footer{padding:24px 48px;border-top:1px solid var(--border);text-align:center;font-size:12px;color:var(--text-muted);}
.preview-footer span{color:var(--accent);}
.empty-placeholder{text-align:center;padding:40px;color:var(--text-muted);}
@media(max-width:600px){.hero-inner{flex-direction:column;}.projects-grid{grid-template-columns:1fr;}.contact-grid{grid-template-columns:1fr;}.portfolio-hero,.portfolio-section{padding:32px 24px;}}
</style>
</head>
<body data-theme="${themeAttr}">
${previewContent}
</body>
</html>`;
}

/**
 * downloadHTML — Portfolio ko .html file ke roop mein download karta hai
 */
function downloadHTML() {
  const html  = getPortfolioHTML();
  const blob  = new Blob([html], { type: 'text/html' });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement('a');
  link.href     = url;
  link.download = `${state.name || 'portfolio'}-portfolio.html`;
  link.click();
  URL.revokeObjectURL(url);
  toast('Portfolio downloaded!', 'fa-download');
  closeDropdown();
}

/**
 * exportJSON — State object ko JSON file ke roop mein download karta hai
 */
function exportJSON() {
  gatherState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${state.name || 'portfolio'}-data.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast('JSON exported!', 'fa-file-code');
  closeDropdown();
}

/**
 * copyEmbed — State ko encode karke clipboard mein copy karta hai 
 */
function copyEmbed() {
  gatherState();
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  const link    = `${location.href}#data=${encoded}`;
  navigator.clipboard.writeText(link).then(() => {
    toast('Link copied to clipboard!', 'fa-link');
  });
  closeDropdown();
}

/* ============================================================
   DROPDOWN MENU
   ============================================================ */

function toggleDropdown() {
  document.getElementById('exportMenu').classList.toggle('open');
}

function closeDropdown() {
  document.getElementById('exportMenu').classList.remove('open');
}

// Click bahar ho to dropdown band ho
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    closeDropdown();
  }
});

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */

/**
 * toast — Bottom-right mein notification dikhata hai
 * @param {string} msg  - Message text
 * @param {string} icon - FontAwesome icon class
 */
function toast(msg, icon = 'fa-check') {
  const t = document.createElement('div');
  t.className   = 'toast';
  t.innerHTML   = `<i class="fas ${icon}"></i>${msg}`;
  document.getElementById('toastContainer').appendChild(t);

  // 3 seconds baad remove karo
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ============================================================
   START THE APP
   ============================================================ */
init();