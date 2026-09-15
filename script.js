const portfolio = {
  profile: {
    name: "Zhang Ruimiao",
    title: "Media Operations Manager",
    availability: "Graduate student",
    location: "Hong Kong",
    email: "524679116@qq.com",
    bio: "I graduated with a bachelor's degree in Arts Management from Sichuan University of Media and Communications, and I have 2.5 years of experience in content operations and content safety at Bilibili. I'm good at analyzing content data and coming up with strategies to boost user engagement."
  },
  experience: [
    { role: "Media Operations Manager", company: "Bilibili", dates: "June 2022-December 2024", bullets: [
      "Responsible for supporting content safety reviews, coordinating with various public opinion monitoring, review rules, and operational strategies to ensure the platform's content safety and compliance rate.",
      "Manage daily operations of the project content pool and optimize distribution strategies. By adjusting AI labeling systems and recommendation placements, improve the quality of content in different sections and enhance user engagement.",
      "Help build content data monitoring dashboards, compile weekly content trend analysis reports, and use metrics like views, interactions, and completion rates to guide topic selection and boost exposure for signed UP creators.",
      "Collaborate with product and algorithm teams on content recommendation strategy iterations, providing content quality tags based on feedback from operations."
    ] }
  ],
  projects: [
    { title: "Community Operations", type: "Web Application", date: "2022.7.9-2024.12", status: "Live", image: "project-cover.png", symbol: "< />", description: "Operations team live analysis dashboard, used to monitor customer behavior and business metrics.", tags: [] }
  ],
  education: [
    { school: "Lingnan University", dates: "2026-Present", degree: "Master of Science in Art, Technology, and Business" },
    { school: "Sichuan University of Media and Communications", dates: "2018 - 2022", degree: "Bachelor of Arts" }
  ],
  skills: [
    { name: "Content planning", category: "Strategy", note: "Planning content themes, formats and publishing schedules around audience needs." },
    { name: "Copywriting and rewriting", category: "Writing", note: "Writing and refining clear, engaging copy for different content formats." },
    { name: "Platform rules and distribution", category: "Distribution", note: "Applying platform policies and distribution principles to improve content reach." },
    { name: "User insight", category: "Audience", note: "Understanding user needs and behavior to guide content decisions." },
    { name: "Data analysis", category: "Analytics", note: "Using content and audience data to evaluate performance and identify opportunities." },
    { name: "Basic visual aesthetics", category: "Visual", note: "Applying fundamental visual principles to improve content presentation." },
    { name: "Interaction and community management", category: "Community", note: "Managing interactions and communities to encourage participation and trust." },
    { name: "Topic selection and trend tracking", category: "Trends", note: "Selecting relevant topics and tracking trends for timely content planning." },
    { name: "Project collaboration", category: "Operations", note: "Coordinating with stakeholders to deliver content projects efficiently." },
    { name: "Risk control and compliance", category: "Compliance", note: "Identifying content risks and applying appropriate review and compliance controls." }
  ]
};

const $ = (selector) => document.querySelector(selector);
const create = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node; };

Object.entries(portfolio.profile).forEach(([key, value]) => document.querySelectorAll(`[data-profile="${key}"]`).forEach((node) => { node.textContent = value; }));
document.querySelector('[data-profile-link="email"]').href = `mailto:${portfolio.profile.email}`;
$("#project-count").textContent = `(${portfolio.projects.length})`;
$("#skill-count").textContent = `(${portfolio.skills.length})`;

const experienceList = $("#experience-list");
portfolio.experience.forEach((item) => {
  const card = create("a", "timeline-card"); card.href = "https://aptifolio.com/"; card.target = "_blank"; card.rel = "noreferrer";
  const meta = create("div", "card-meta"); meta.append(create("h3", "", item.role), create("span", "", `${item.company} - ${item.dates}`)); card.append(meta);
  const list = create("ul"); item.bullets.forEach((bullet) => list.append(create("li", "", bullet))); card.append(list);
  experienceList.append(card);
});

const projectList = $("#project-list");
portfolio.projects.forEach((item) => {
  const card = create("article", "project-card");
  const cover = create("div", "project-cover");
  const img = create("img");
  img.src = item.image || "";
  img.alt = `${item.title} project cover`;
  if (item.image) cover.append(img);
  if (!item.image) cover.textContent = item.symbol || "";
  const meta = create("div", "card-meta");
  meta.append(create("span", "", item.type), create("span", "", item.date));
  card.append(cover, meta);
  const title = create("h3", "", item.title); card.append(title);
  const desc = create("p", "project-description", item.description); card.append(desc);
  const tags = create("div", "tags"); item.tags.forEach((tag) => tags.append(create("span", "", tag))); card.append(tags);
  const links = create("div", "project-links");
  [["Website", item.website], ["GitHub", item.github]].forEach((pair) => { if (!pair[1]) return; const link = create("a", "", pair[0]); link.href = pair[1]; link.target = "_blank"; link.rel = "noreferrer"; links.append(link); });
  card.append(links); projectList.append(card);
});

const educationList = $("#education-list");
portfolio.education.forEach((item) => { const card = create("article", "education-card"); const left = create("div"); left.append(create("strong", "", item.school), create("p", "", item.dates)); card.append(left, create("p", "", item.degree)); educationList.append(card); });

let toastTimer;
document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  await navigator.clipboard.writeText(button.dataset.copy);
  const toast = $("#toast"); toast.textContent = "Copied to clipboard"; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}));

/* ------------------------------------------------------------------
   3D skill nebula - hand-rolled projection on Canvas 2D, no deps
------------------------------------------------------------------ */
(function initSkillNebula() {
  const stage = $("#skill-stage");
  const canvas = $("#skill-canvas");
  if (!stage || !canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const skills = portfolio.skills;
  const detail = $("#skill-detail");
  const detailName = $("#skill-detail-name");
  const detailCat = $("#skill-detail-cat");
  const detailNote = $("#skill-detail-note");
  const detailClose = $("#skill-detail-close");
  const index = $("#skill-index");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, R = 0, FOV = 0, DPR = 1;
  let rotX = -0.32, rotY = 0.5, velX = 0, velY = reduceMotion ? 0 : 0.0025;
  const AUTO_Y = reduceMotion ? 0 : 0.0025;
  let dragging = false, moved = false, pointerId = null, lastPX = 0, lastPY = 0;
  let hovered = -1, selected = -1;
  let target = null;
  let running = false, visible = true;

  const nodes = skills.map((skill, i) => ({ skill, i, p: { x: 0, y: 0, z: 0 }, v: { x: 0, y: 0, z: 0, k: 1 } }));
  const dust = [];
  const edges = [];
  const order = nodes.map((n) => n);

  (function layout() {
    const n = nodes.length;
    const ga = Math.PI * (3 - Math.sqrt(5));
    nodes.forEach((node, i) => {
      const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = ga * i;
      node.p.x = Math.cos(th) * r; node.p.y = y; node.p.z = Math.sin(th) * r;
    });

    for (let i = 0; i < 140; i += 1) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const rad = 1.25 + Math.random() * 0.55;
      dust.push({ p: { x: Math.cos(t) * s * rad, y: u * rad, z: Math.sin(t) * s * rad }, v: { x: 0, y: 0, z: 0, k: 1 } });
    }

    const seen = new Set();
    const chord = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    nodes.forEach((a) => {
      nodes.filter((b) => b !== a)
        .map((b) => ({ b, d: chord(a.p, b.p) }))
        .sort((m, n2) => m.d - n2.d)
        .slice(0, 3)
        .forEach(({ b }) => {
          const key = Math.min(a.i, b.i) + ":" + Math.max(a.i, b.i);
          if (seen.has(key)) return;
          seen.add(key); edges.push([a, b]);
        });
    });
  })();

  function resize() {
    const rect = stage.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.min(W, H) * 0.31;
    FOV = 2.6 * R;
  }

  function project(p, out) {
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const y1 = p.y * cx - z1 * sx;
    const z2 = p.y * sx + z1 * cx;
    const k = FOV / (FOV + z2 * R);
    out.x = W / 2 + x1 * R * k;
    out.y = H / 2 + y1 * R * k;
    out.z = z2;
    out.k = k;
  }

  function angLerp(a, b, t) {
    const d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    return a + d * t;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0, 255, 170, .28)";
    for (let i = 0; i < dust.length; i += 1) {
      const d = dust[i]; project(d.p, d.v);
      const front = (1 - d.v.z) / 2;
      ctx.globalAlpha = 0.06 + 0.3 * front * front;
      const r = Math.max(0.5, 1.5 * d.v.k);
      ctx.beginPath(); ctx.arc(d.v.x, d.v.y, r, 0, Math.PI * 2); ctx.fill();
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < edges.length; i += 1) {
      const a = edges[i][0].v, b = edges[i][1].v;
      const front = (1 - (a.z + b.z) / 2) / 2;
      const active = (hovered === edges[i][0].i || hovered === edges[i][1].i || selected === edges[i][0].i || selected === edges[i][1].i);
      ctx.globalAlpha = (active ? 0.5 : 0.13) * (0.25 + 0.75 * front);
      ctx.strokeStyle = "#00ffaa";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    order.sort((m, n2) => n2.v.z - m.v.z);
    for (let i = 0; i < order.length; i += 1) {
      const node = order[i];
      project(node.p, node.v);
      const front = (1 - node.v.z) / 2;
      const alpha = 0.22 + 0.78 * front;
      const isHot = node.i === hovered || node.i === selected;
      const font = Math.max(9, Math.min(20, 12.5 * node.v.k));

      ctx.globalAlpha = alpha;
      ctx.font = `${isHot ? 500 : 400} ${font}px "Roboto Mono", "SFMono-Regular", Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const label = node.skill.name;
      const tw = ctx.measureText(label).width;
      const px = node.v.x, py = node.v.y;

      if (isHot) {
        ctx.globalAlpha = Math.max(alpha, 0.85);
        ctx.fillStyle = "rgba(0, 255, 170, .14)";
        const padX = 8, padY = 5;
        ctx.fillRect(px - tw / 2 - padX, py - font / 2 - padY, tw + padX * 2, font + padY * 2);
        ctx.strokeStyle = "#00ffaa";
        ctx.globalAlpha = 0.85;
        ctx.strokeRect(px - tw / 2 - padX, py - font / 2 - padY, tw + padX * 2, font + padY * 2);
      }

      ctx.globalAlpha = alpha;
      ctx.shadowBlur = isHot ? 14 : 8 * front;
      ctx.shadowColor = "rgba(0, 255, 170, .9)";
      ctx.fillStyle = isHot ? "#c9ffe9" : "#00ffaa";
      ctx.fillText(label, px, py);
      ctx.shadowBlur = 0;

      ctx.globalAlpha = alpha * (isHot ? 1 : 0.75);
      ctx.fillStyle = "#00ffaa";
      ctx.beginPath(); ctx.arc(px, py + font * 0.85, Math.max(1.2, 2.1 * node.v.k), 0, Math.PI * 2); ctx.fill();

      node.hit = { x: px, y: py, w: Math.max(tw, 34), h: Math.max(font, 22) };
    }
    ctx.globalAlpha = 1;
  }

  function tick() {
    if (!visible) { running = false; return; }

    if (target) {
      rotY = angLerp(rotY, target.ry, 0.12);
      rotX = angLerp(rotX, target.rx, 0.12);
      if (Math.abs(angLerp(rotY, target.ry, 1) - rotY) < 0.001 && Math.abs(angLerp(rotX, target.rx, 1) - rotX) < 0.001) target = null;
    } else if (!dragging) {
      rotY += velY; rotX += velX;
      velX *= 0.92;
      velY += (AUTO_Y - velY) * 0.05;
      rotX = Math.max(-1.15, Math.min(1.15, rotX));
    }

    draw();
    requestAnimationFrame(tick);
  }

  function start() { if (running) return; running = true; requestAnimationFrame(tick); }

  function pickAt(x, y) {
    let best = -1, bestD = Infinity;
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const h = nodes[i].hit; if (!h) continue;
      const dx = Math.abs(x - h.x), dy = Math.abs(y - h.y);
      if (dx > h.w / 2 + 6 || dy > h.h / 2 + 6) continue;
      const d = dx * dx + dy * dy - nodes[i].v.z * 400;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function showDetail(i) {
    if (i < 0) { detail.hidden = true; selected = -1; syncChips(); return; }
    selected = i;
    detailName.textContent = skills[i].name;
    detailCat.textContent = skills[i].category;
    detailNote.textContent = skills[i].note;
    detail.hidden = false;
    syncChips();
  }

  function syncChips() {
    Array.from(index.children).forEach((li, i) => {
      const btn = li.querySelector("button");
      if (btn) btn.setAttribute("aria-pressed", String(i === selected));
    });
  }

  function focusNode(i) {
    const p = nodes[i].p;
    const r = Math.hypot(p.x, p.z);
    target = { ry: Math.atan2(p.x, -p.z), rx: Math.atan2(-p.y, r) };
  }

  skills.forEach((skill, i) => {
    const li = create("li");
    const btn = create("button", "", skill.name);
    btn.type = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => { showDetail(i); focusNode(i); start(); });
    btn.addEventListener("mouseenter", () => { hovered = i; start(); });
    btn.addEventListener("mouseleave", () => { if (hovered === i) hovered = -1; });
    li.append(btn); index.append(li);
  });

  detailClose.addEventListener("click", () => showDetail(-1));

  stage.addEventListener("pointerdown", (e) => {
    dragging = true; moved = false; pointerId = e.pointerId;
    lastPX = e.clientX; lastPY = e.clientY;
    target = null;
    stage.classList.add("is-dragging");
    stage.setPointerCapture(pointerId);
  });

  stage.addEventListener("pointermove", (e) => {
    const rect = stage.getBoundingClientRect();
    if (dragging) {
      const dx = e.clientX - lastPX, dy = e.clientY - lastPY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      lastPX = e.clientX; lastPY = e.clientY;
      rotY += dx * 0.006;
      rotX = Math.max(-1.15, Math.min(1.15, rotX - dy * 0.006));
      velY = dx * 0.006; velX = -dy * 0.006;
    } else {
      const found = pickAt(e.clientX - rect.left, e.clientY - rect.top);
      if (found !== hovered) { hovered = found; stage.style.cursor = found >= 0 ? "pointer" : ""; }
    }
    start();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    if (pointerId !== null && stage.hasPointerCapture(pointerId)) stage.releasePointerCapture(pointerId);
    pointerId = null;
    if (moved || !e) return;
    const rect = stage.getBoundingClientRect();
    const found = pickAt(e.clientX - rect.left, e.clientY - rect.top);
    if (found >= 0) { showDetail(found); focusNode(found); } else { showDetail(-1); }
  }

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", () => endDrag(null));
  stage.addEventListener("pointerleave", () => { hovered = -1; });

  if ("ResizeObserver" in window) new ResizeObserver(() => { resize(); start(); }).observe(stage);
  else window.addEventListener("resize", () => { resize(); start(); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0.02 }).observe(stage);
  }

  resize();
  start();
})();
