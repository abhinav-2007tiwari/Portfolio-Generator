/* ===== STATE ===== */
let state = {
  name:'',role:'',email:'',bio:'',location:'',avatar:null,
  github:'',linkedin:'',twitter:'',website:'',
  skills:[],projects:[],experience:[],
  theme:'dark',layout:'card',
  colors:{accent:'#6c63ff',accent2:'#ff6584',bg:'#0a0a0f',text:'#e8e8f0'}
};
let projectCounter=0,expCounter=0;

/* ===== LOADING SCREEN ===== */
(function initLoader(){
  const canvas=document.getElementById('ldCanvas');
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize);

  for(let i=0;i<80;i++){
    particles.push({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,
      r:Math.random()*1.5+0.3,
      opacity:Math.random()*0.4+0.1,
      color:Math.random()>0.5?'108,99,255':'0,229,255'
    });
  }

  function drawCanvas(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    // Draw connecting lines
    particles.forEach((p,i)=>{
      particles.slice(i+1).forEach(q=>{
        const d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(108,99,255,${0.06*(1-d/100)})`;
          ctx.lineWidth=0.5;
          ctx.stroke();
        }
      });
    });
  }

  let raf;
  function loop(){raf=requestAnimationFrame(loop);drawCanvas();}
  loop();

  // Progress animation
  const statuses=[
    'INITIALIZING SYSTEM...','LOADING ASSETS...','CONFIGURING ENGINE...',
    'MOUNTING COMPONENTS...','RENDERING INTERFACE...','SYSTEM READY ✓'
  ];
  let pct=0;
  const fill=document.getElementById('ldFill');
  const num=document.getElementById('ldNum');
  const stat=document.getElementById('ldStat');

  function animateLoader(){
    const target=100;
    const step=()=>{
      if(pct>=target){
        stat.textContent='SYSTEM READY ✓';
        setTimeout(()=>{
          const loader=document.getElementById('loader');
          loader.classList.add('hide');
          cancelAnimationFrame(raf);
          setTimeout(()=>{loader.style.display='none';},700);
        },400);
        return;
      }
      const inc=Math.random()*3+0.5;
      pct=Math.min(pct+inc,target);
      fill.style.width=pct+'%';
      num.innerHTML=Math.floor(pct)+'<sup>%</sup>';
      const si=Math.floor((pct/100)*(statuses.length-1));
      stat.textContent=statuses[si];
      setTimeout(step,30+Math.random()*40);
    };
    step();
  }

  // Start after tiny delay so fonts load
  setTimeout(animateLoader,300);
})();

/* ===== INIT ===== */
function init(){
  document.getElementById('inp_name').value='Vikram Adhikari';
  document.getElementById('inp_role').value='Full Stack Developer & Digital Architect';
  document.getElementById('inp_bio').value="I'm a full-stack developer obsessed with building experiences at the intersection of art and engineering. From pixel-perfect frontends to distributed backend systems — I build things that are fast, beautiful, and built to last.";
  document.getElementById('inp_location').value='India';
  document.getElementById('inp_email').value='vikram@adhikari.dev';
  document.getElementById('inp_github').value='https://github.com/vikramadhikari';
  document.getElementById('inp_linkedin').value='https://linkedin.com/in/vikramadhikari';
  document.getElementById('inp_twitter').value='https://twitter.com/vikramadhikari';
  document.getElementById('inp_website').value='https://vikramadhikari.dev';

  const demoSkills=[
    {name:'JavaScript / TypeScript',level:'expert'},
    {name:'React / Next.js',level:'expert'},
    {name:'Node.js / Backend',level:'advanced'},
    {name:'Three.js / WebGL',level:'advanced'},
    {name:'Python / AI·ML',level:'intermediate'},
    {name:'Rust / Go',level:'intermediate'},
  ];
  demoSkills.forEach(s=>{state.skills.push(s);renderSkillTag(s);});

 addProject({name:'PORTOFOLIO GENERATOR',desc:'Responsive personal portfolio with modern UI and smooth animations to showcase projects and skills.',emoji:'💼'});
  addProject({name:'To-Do List App',desc:'Task management app with add, delete, and completion tracking using local storage.',emoji:'✅'});
  addProject({name:'Weather App ',desc:'Fetches real-time weather data using API and displays temperature and conditions.',emoji:'🌦️'});
  addProject({name:'Basic Chat App',desc:' Simple real-time chat application using WebSocket for instant messaging',emoji:'📱'});


  addExperience({title:'Senior Frontend Engineer',org:'Tech Startup',date:'2023 – Present',desc:'Led the Dashboard redesign improving user satisfaction by 34%. Built real-time collaboration features used by 50k+ developers. Mentored 4 junior engineers.'});
  addExperience({title:'Full Stack Developer',org:'Freelance / Open Source',date:'2021 – 2023',desc:'Shipped 24+ projects across web, backend, and AI domains. Built distributed systems handling millions of events/day. 12+ happy clients globally.'});
  addExperience({title:'Web Developer Intern',org:'IT Firm',date:'2020 – 2021',desc:'Developed responsive web applications and REST APIs. Contributed to open-source projects. Built internal tools that reduced team workflow by 40%.'});

  updatePreview();
}

/* ===== THEME ===== */
function setTheme(theme,el){
  state.theme=theme;
  document.body.setAttribute('data-theme',theme);
  document.querySelectorAll('.theme-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  const tc={
    dark:{accent:'#6c63ff',accent2:'#ff6584',bg:'#0a0a0f',text:'#e8e8f0'},
    light:{accent:'#6c63ff',accent2:'#ff6584',bg:'#f5f5f7',text:'#1a1a2e'},
    gradient:{accent:'#bf5af2',accent2:'#ff375f',bg:'#0d0221',text:'#f5f0ff'},
    developer:{accent:'#39d353',accent2:'#58a6ff',bg:'#0d1117',text:'#c9d1d9'},
  };
  const c=tc[theme];
  document.getElementById('col_accent').value=c.accent;
  document.getElementById('col_accent2').value=c.accent2;
  document.getElementById('col_bg').value=c.bg;
  document.getElementById('col_text').value=c.text;
  state.colors=c;
  updateColors();updatePreview();
}

/* ===== LAYOUT ===== */
function setLayout(layout,el){
  state.layout=layout;
  document.querySelectorAll('.layout-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  updatePreview();
}

/* ===== COLORS ===== */
function updateColors(){
  const accent=document.getElementById('col_accent').value;
  const accent2=document.getElementById('col_accent2').value;
  state.colors={accent,accent2};
  document.documentElement.style.setProperty('--accent',accent);
  document.documentElement.style.setProperty('--accent2',accent2);
  updatePreview();
}
function resetColors(){
  document.getElementById('col_accent').value='#6c63ff';
  document.getElementById('col_accent2').value='#ff6584';
  updateColors();
}

/* ===== AVATAR ===== */
function handleAvatar(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=(ev)=>{
    state.avatar=ev.target.result;
    document.getElementById('avatarPreview').innerHTML=`<img src="${state.avatar}" alt="Avatar">`;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

/* ===== SKILLS ===== */
function addSkill(){
  const input=document.getElementById('skillInput');
  const level=document.getElementById('skillLevel').value;
  const name=input.value.trim();
  if(!name)return;
  const skill={name,level};
  state.skills.push(skill);
  renderSkillTag(skill);
  input.value='';input.focus();
  updatePreview();
}
function renderSkillTag(skill){
  const tag=document.createElement('div');
  tag.className='skill-tag';
  tag.innerHTML=`<span>${skill.name}</span><span class="level-badge level-${skill.level}">${skill.level}</span><i class="fas fa-times remove"></i>`;
  tag.querySelector('.remove').addEventListener('click',()=>{
    state.skills=state.skills.filter(s=>s!==skill);
    tag.style.animation='tagIn 0.2s ease reverse';
    setTimeout(()=>{tag.remove();updatePreview();},200);
  });
  document.getElementById('skillsContainer').appendChild(tag);
}

/* ===== PROJECTS ===== */
function addProject(data={}){
  const id=++projectCounter;
  const container=document.getElementById('projectsContainer');
  const card=document.createElement('div');
  card.className='project-card-edit';card.id=`proj_${id}`;
  card.innerHTML=`
    <div class="project-header">
      <h4><i class="fas fa-folder" style="color:var(--accent);margin-right:6px;font-size:12px"></i>Project ${id}</h4>
      <button class="remove-btn" onclick="removeProject(${id})"><i class="fas fa-trash"></i></button>
    </div>
    <div class="field"><label>Project Name</label><input type="text" id="proj_name_${id}" placeholder="e.g. DevFlow" value="${data.name||''}" oninput="updatePreview()"></div>
    <div class="field"><label>Emoji / Icon</label><input type="text" id="proj_emoji_${id}" placeholder="🚀" value="${data.emoji||'💡'}" oninput="updatePreview()" style="width:80px"></div>
    <div class="field"><label>Description <span style="color:var(--text-muted);font-size:11px">(Markdown ok)</span></label><textarea id="proj_desc_${id}" placeholder="Describe your project..." oninput="updatePreview()">${data.desc||''}</textarea></div>
    <div class="field"><label>Tech Stack <span style="color:var(--text-muted);font-size:11px">(comma separated)</span></label><input type="text" id="proj_tech_${id}" placeholder="React, Node.js" value="${data.tech||''}" oninput="updatePreview()"></div>
    <div class="two-col">
      <div class="field"><label>Live URL</label><input type="url" id="proj_url_${id}" placeholder="https://..." value="${data.url||''}" oninput="updatePreview()"></div>
      <div class="field"><label>GitHub URL</label><input type="url" id="proj_github_${id}" placeholder="https://github.com/..." value="${data.github||''}" oninput="updatePreview()"></div>
    </div>`;
  container.appendChild(card);updatePreview();
}
function removeProject(id){
  const card=document.getElementById(`proj_${id}`);
  card.style.animation='slideIn 0.2s ease reverse';
  setTimeout(()=>{card.remove();updatePreview();},200);
}

/* ===== EXPERIENCE ===== */
function addExperience(data={}){
  const id=++expCounter;
  const container=document.getElementById('experienceContainer');
  const card=document.createElement('div');
  card.className='exp-card';card.id=`exp_${id}`;
  card.innerHTML=`
    <div class="exp-header">
      <h4 style="font-size:13px;font-weight:600;color:var(--text)"><i class="fas fa-building" style="color:var(--accent);margin-right:6px;font-size:12px"></i>Experience ${id}</h4>
      <button class="remove-btn" onclick="removeExperience(${id})"><i class="fas fa-trash"></i></button>
    </div>
    <div class="two-col">
      <div class="field"><label>Job Title</label><input type="text" id="exp_title_${id}" placeholder="Senior Engineer" value="${data.title||''}" oninput="updatePreview()"></div>
      <div class="field"><label>Company</label><input type="text" id="exp_org_${id}" placeholder="Google" value="${data.org||''}" oninput="updatePreview()"></div>
    </div>
    <div class="field"><label>Duration</label><input type="text" id="exp_date_${id}" placeholder="2022 – Present" value="${data.date||''}" oninput="updatePreview()"></div>
    <div class="field"><label>Description</label><textarea id="exp_desc_${id}" placeholder="Key achievements..." oninput="updatePreview()">${data.desc||''}</textarea></div>`;
  container.appendChild(card);updatePreview();
}
function removeExperience(id){
  const card=document.getElementById(`exp_${id}`);
  card.style.animation='slideIn 0.2s ease reverse';
  setTimeout(()=>{card.remove();updatePreview();},200);
}

/* ===== GATHER STATE ===== */
function gatherState(){
  const get=(id)=>{const el=document.getElementById(id);return el?el.value.trim():'';};
  state.name=get('inp_name');state.role=get('inp_role');state.email=get('inp_email');
  state.bio=get('inp_bio');state.location=get('inp_location');
  state.github=get('inp_github');state.linkedin=get('inp_linkedin');
  state.twitter=get('inp_twitter');state.website=get('inp_website');
  const initial=document.getElementById('avatarInitial');
  if(initial&&state.name)initial.textContent=state.name.charAt(0).toUpperCase();
  state.projects=[];
  document.querySelectorAll('[id^="proj_name_"]').forEach(el=>{
    const id=el.id.split('_').pop();
    state.projects.push({name:get(`proj_name_${id}`),desc:get(`proj_desc_${id}`),tech:get(`proj_tech_${id}`),url:get(`proj_url_${id}`),github:get(`proj_github_${id}`),emoji:get(`proj_emoji_${id}`)||'💡'});
  });
  state.experience=[];
  document.querySelectorAll('[id^="exp_title_"]').forEach(el=>{
    const id=el.id.split('_').pop();
    state.experience.push({title:get(`exp_title_${id}`),org:get(`exp_org_${id}`),date:get(`exp_date_${id}`),desc:get(`exp_desc_${id}`)});
  });
}

/* ===== UPDATE PREVIEW ===== */
function updatePreview(){
  gatherState();
  const preview=document.getElementById('portfolioPreview');
  const name=state.name||'Your Name';
  const role=state.role||'Your Role';
  const bio=state.bio||'Your bio will appear here...';
  const initial=name.charAt(0).toUpperCase();
  const avatarHTML=state.avatar?`<img src="${state.avatar}" alt="${name}">`:`<span style="font-size:40px;color:white;font-family:var(--font-display);font-weight:700">${initial}</span>`;

  let socialsHTML='';
  if(state.github)socialsHTML+=`<a href="${state.github}" class="social-link-pill" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
  if(state.linkedin)socialsHTML+=`<a href="${state.linkedin}" class="social-link-pill" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>`;
  if(state.twitter)socialsHTML+=`<a href="${state.twitter}" class="social-link-pill" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>`;
  if(state.website)socialsHTML+=`<a href="${state.website}" class="social-link-pill" target="_blank"><i class="fas fa-globe"></i> Website</a>`;

  let skillsHTML='';
  if(state.skills.length>0){
    if(state.layout==='bars'){
      const lm={expert:95,advanced:80,intermediate:60,beginner:35};
      skillsHTML=state.skills.map(s=>`<div class="skill-bar-item"><div class="skill-bar-label">${s.name}<span>${s.level}</span></div><div class="skill-bar-track"><div class="skill-bar-fill" style="width:${lm[s.level]||70}%"></div></div></div>`).join('');
    }else{
      skillsHTML=`<div class="skills-preview">${state.skills.map(s=>`<div class="skill-pill-preview"><div class="skill-dot"></div>${s.name}<span class="level-badge level-${s.level}">${s.level}</span></div>`).join('')}</div>`;
    }
  }else{skillsHTML=`<div class="empty-placeholder"><i class="fas fa-code"></i><p>Add skills to showcase your expertise</p></div>`;}

  let projectsHTML='';
  if(state.projects.length>0){
    if(state.layout==='timeline'){
      projectsHTML=`<div class="timeline">${state.projects.map(p=>`<div class="timeline-item"><div class="timeline-date">${p.emoji} Project</div><div class="timeline-title">${p.name||'Untitled'}</div><div class="timeline-org">${p.tech||''}</div><div class="timeline-desc">${p.desc?parseMarkdown(p.desc):''}</div>${buildProjectLinks(p)}</div>`).join('')}</div>`;
    }else{
      projectsHTML=`<div class="projects-grid">${state.projects.map((p,i)=>{
        const isSingle=state.projects.length===1||(state.projects.length%2!==0&&i===state.projects.length-1);
        return `<div class="project-card-preview ${isSingle?'single':''}"><div class="project-emoji">${p.emoji||'💡'}</div><div class="project-name">${p.name||'Untitled Project'}</div><div class="project-desc">${p.desc?parseMarkdown(p.desc):''}</div>${p.tech?`<div class="project-tech">${p.tech.split(',').map(t=>`<span class="tech-tag">${t.trim()}</span>`).join('')}</div>`:''} ${buildProjectLinks(p)}</div>`;
      }).join('')}</div>`;
    }
  }else{projectsHTML=`<div class="empty-placeholder"><i class="fas fa-folder-open"></i><p>Add projects to showcase your work</p></div>`;}

  let expHTML='';
  if(state.experience.length>0){
    if(state.layout==='card'){
      expHTML=`<div style="display:grid;gap:16px">${state.experience.map(e=>`<div class="project-card-preview"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px"><div><div class="project-name" style="margin-bottom:2px">${e.title||'Title'}</div><div style="font-size:14px;color:var(--accent);font-weight:500">${e.org||'Company'}</div></div><div style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap;margin-left:12px">${e.date||''}</div></div><div class="project-desc">${e.desc||''}</div></div>`).join('')}</div>`;
    }else{
      expHTML=`<div class="timeline">${state.experience.map(e=>`<div class="timeline-item"><div class="timeline-date">${e.date||'Date'}</div><div class="timeline-title">${e.title||'Title'}</div><div class="timeline-org">${e.org||'Company'}</div><div class="timeline-desc">${e.desc||''}</div></div>`).join('')}</div>`;
    }
  }else{expHTML=`<div class="empty-placeholder"><i class="fas fa-briefcase"></i><p>Add experience to highlight your career</p></div>`;}

  let contactHTML=`<div class="contact-grid">`;
  if(state.email)contactHTML+=`<a href="mailto:${state.email}" class="contact-card"><div class="contact-icon"><i class="fas fa-envelope"></i></div><div><div class="contact-info">Email</div><div class="contact-value">${state.email}</div></div></a>`;
  if(state.location)contactHTML+=`<div class="contact-card"><div class="contact-icon"><i class="fas fa-location-dot"></i></div><div><div class="contact-info">Location</div><div class="contact-value">${state.location}</div></div></div>`;
  if(state.github)contactHTML+=`<a href="${state.github}" class="contact-card" target="_blank"><div class="contact-icon"><i class="fab fa-github"></i></div><div><div class="contact-info">GitHub</div><div class="contact-value">View Profile</div></div></a>`;
  if(state.website)contactHTML+=`<a href="${state.website}" class="contact-card" target="_blank"><div class="contact-icon"><i class="fas fa-globe"></i></div><div><div class="contact-info">Website</div><div class="contact-value">Visit Site</div></div></a>`;
  contactHTML+=`</div>`;
  if(!state.email&&!state.location&&!state.github&&!state.website)contactHTML=`<div class="empty-placeholder"><i class="fas fa-address-card"></i><p>Add contact information</p></div>`;

  preview.innerHTML=`
    <div class="portfolio-hero">
      <div class="hero-inner">
        <div class="hero-avatar">${avatarHTML}</div>
        <div class="hero-content">
          <div class="hero-badge"><i class="fas fa-circle" style="font-size:6px"></i> Available for opportunities</div>
          <div class="hero-name">${name}</div>
          <div class="hero-role">${role}</div>
          <div class="hero-bio">${bio}</div>
          ${socialsHTML?`<div class="hero-socials">${socialsHTML}</div>`:''}
        </div>
      </div>
    </div>
    <div class="portfolio-section"><div class="section-title">Skills &amp; Expertise</div>${skillsHTML}</div>
    <div class="portfolio-section"><div class="section-title">Featured Projects</div>${projectsHTML}</div>
    <div class="portfolio-section"><div class="section-title">Experience</div>${expHTML}</div>
    <div class="portfolio-section"><div class="section-title">Get In Touch</div>${contactHTML}</div>
    <div class="preview-footer">Built with <span>Portfolio_Generator</span> · Crafted by Team NEPHTHYS</div>`;

  if(state.layout==='bars'){
    setTimeout(()=>{
      document.querySelectorAll('.skill-bar-fill').forEach(bar=>{
        const tw=bar.style.width;bar.style.width='0';
        requestAnimationFrame(()=>{bar.style.width=tw;});
      });
    },50);
  }
}

/* ===== UTILS ===== */
function parseMarkdown(text){
  if(typeof marked!=='undefined')return marked.parse(text);
  return text;
}
function buildProjectLinks(p){
  if(!p.url&&!p.github)return'';
  return`<div class="project-links" style="margin-top:10px">${p.url?`<a href="${p.url}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>`:''} ${p.github?`<a href="${p.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>`:''}</div>`;
}

/* ===== EXPORT ===== */
function getPortfolioHTML(){
  gatherState();
  const accent=document.getElementById('col_accent').value;
  const accent2=document.getElementById('col_accent2').value;
  const bgColor=document.getElementById('col_bg').value;
  const textColor=document.getElementById('col_text').value;
  const themeAttr=document.body.getAttribute('data-theme');
  const previewContent=document.getElementById('portfolioPreview').innerHTML;
  return`<!DOCTYPE html>
<html lang="en" data-theme="${themeAttr}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${state.name||'Portfolio'} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
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
.project-card-preview{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;position:relative;overflow:hidden;}
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
</style></head>
<body data-theme="${themeAttr}">${previewContent}</body></html>`;
}

function downloadHTML(){
  const html=getPortfolioHTML();
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=`${state.name||'portfolio'}-portfolio.html`;
  link.click();URL.revokeObjectURL(url);
  toast('Portfolio downloaded! 🚀','fa-download');closeDropdown();
}
function exportJSON(){
  gatherState();
  const json=JSON.stringify(state,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=`${state.name||'portfolio'}-data.json`;
  link.click();URL.revokeObjectURL(url);
  toast('JSON exported!','fa-file-code');closeDropdown();
}
function copyEmbed(){
  gatherState();
  const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  const link=`${location.href}#data=${encoded}`;
  navigator.clipboard.writeText(link).then(()=>{toast('Link copied!','fa-link');});
  closeDropdown();
}

/* ===== DROPDOWN ===== */
function toggleDropdown(){document.getElementById('exportMenu').classList.toggle('open');}
function closeDropdown(){document.getElementById('exportMenu').classList.remove('open');}
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown'))closeDropdown();});

/* ===== TOAST ===== */
function toast(msg,icon='fa-check'){
  const t=document.createElement('div');
  t.className='toast';t.innerHTML=`<i class="fas ${icon}"></i>${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},3000);
}

/* ===== START ===== */
init();
