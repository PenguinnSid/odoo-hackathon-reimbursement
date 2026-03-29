import React, { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════
   HOMEPAGE STYLES
════════════════════════════════════════════════ */
const homepageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
  :root {
    --bg: #0f1117; --bg2: #161822; --bg3: #1e2030;
    --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
    --text: #e8e9f0; --text2: #8b8d9e; --text3: #555768;
    --accent: #6c8fff; --accent2: #4a6ef5;
    --green: #34d399; --green-bg: rgba(52,211,153,0.1);
    --amber: #fbbf24; --amber-bg: rgba(251,191,36,0.1);
    --red: #f87171; --red-bg: rgba(248,113,113,0.1);
    --blue-bg: rgba(108,143,255,0.1);
    --radius: 12px; --radius-sm: 8px; --radius-xs: 6px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --sidebar-w: 240px;
    --font: 'DM Sans', sans-serif;
    --font-display: 'DM Serif Display', serif;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:var(--font); background:var(--bg); color:var(--text); font-size:14px; line-height:1.5; overflow-x:hidden; }

  /* GRID BG */
  .hp-grid-bg { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(108,143,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(108,143,255,0.03) 1px,transparent 1px); background-size:60px 60px; }

  /* NAV */
  .hp-nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:0 48px; height:64px; display:flex; align-items:center; justify-content:space-between; background:rgba(15,17,23,0.85); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); transition:all 0.3s; }
  .hp-nav.scrolled { background:rgba(15,17,23,0.97); }
  .hp-logo { font-family:var(--font-display); font-size:22px; color:var(--text); text-decoration:none; background:none; border:none; cursor:pointer; }
  .hp-logo span { color:var(--accent); }
  .hp-nav-links { display:flex; align-items:center; gap:32px; }
  .hp-nav-link { color:var(--text2); font-size:13.5px; text-decoration:none; transition:color 0.2s; background:none; border:none; cursor:pointer; font-family:var(--font); }
  .hp-nav-link:hover { color:var(--text); }
  .hp-nav-cta { background:var(--accent2); color:#fff; border:none; border-radius:var(--radius-sm); padding:9px 20px; font-family:var(--font); font-size:13.5px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .hp-nav-cta:hover { background:#5a7ef8; transform:translateY(-1px); }

  /* HERO */
  .hp-hero { position:relative; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 24px 80px; z-index:1; }
  .hp-hero-glow { position:absolute; top:0; left:50%; transform:translateX(-50%); width:900px; height:600px; pointer-events:none; background:radial-gradient(ellipse 70% 60% at 50% 20%,rgba(108,143,255,0.15) 0%,transparent 70%); }
  .hp-hero-glow2 { position:absolute; bottom:-100px; right:-200px; width:600px; height:600px; pointer-events:none; background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(52,211,153,0.06) 0%,transparent 70%); }
  .hp-badge { display:inline-flex; align-items:center; gap:8px; background:var(--blue-bg); border:1px solid rgba(108,143,255,0.2); border-radius:20px; padding:6px 14px 6px 10px; font-size:12px; color:var(--accent); font-weight:500; margin-bottom:28px; animation:hpFadeUp 0.6s ease both; }
  .hp-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:hpPulse 2s infinite; }
  @keyframes hpPulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }
  @keyframes hpFadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  .hp-hero-h1 { font-family:var(--font-display); font-size:clamp(42px,7vw,76px); font-weight:400; line-height:1.1; letter-spacing:-0.02em; margin-bottom:24px; max-width:820px; animation:hpFadeUp 0.6s ease 0.1s both; }
  .hp-hero-h1 em { font-style:italic; color:var(--accent); }
  .hp-hero-sub { font-size:clamp(15px,2vw,18px); color:var(--text2); max-width:540px; line-height:1.7; margin-bottom:44px; font-weight:300; animation:hpFadeUp 0.6s ease 0.2s both; }
  .hp-hero-actions { display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:center; animation:hpFadeUp 0.6s ease 0.3s both; }
  .hp-btn-primary { background:var(--accent2); color:#fff; border:none; border-radius:var(--radius-sm); padding:14px 28px; font-family:var(--font); font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s,box-shadow 0.2s; }
  .hp-btn-primary:hover { background:#5a7ef8; transform:translateY(-2px); box-shadow:0 8px 32px rgba(74,110,245,0.3); }
  .hp-btn-outline { background:transparent; color:var(--text2); border:1px solid var(--border2); border-radius:var(--radius-sm); padding:14px 28px; font-family:var(--font); font-size:15px; font-weight:400; cursor:pointer; transition:all 0.2s; }
  .hp-btn-outline:hover { background:var(--bg3); color:var(--text); border-color:var(--accent); }

  /* PREVIEW */
  .hp-preview-wrap { position:relative; margin-top:72px; max-width:900px; width:100%; animation:hpFadeUp 0.8s ease 0.4s both; }
  .hp-preview-frame { background:var(--bg2); border:1px solid var(--border2); border-radius:16px; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,0.6); }
  .hp-preview-chrome { background:var(--bg3); border-bottom:1px solid var(--border); padding:12px 16px; display:flex; align-items:center; gap:12px; }
  .hp-chrome-dots { display:flex; gap:6px; }
  .hp-chrome-dot { width:10px; height:10px; border-radius:50%; }
  .hp-chrome-url { flex:1; background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:5px 12px; font-size:12px; color:var(--text3); text-align:center; }
  .hp-preview-inner { display:flex; height:340px; overflow:hidden; }
  .hp-mini-sidebar { width:140px; background:var(--bg2); border-right:1px solid var(--border); padding:16px 10px; display:flex; flex-direction:column; gap:4px; flex-shrink:0; }
  .hp-mini-logo { font-family:var(--font-display); font-size:14px; padding:0 6px 12px; border-bottom:1px solid var(--border); margin-bottom:8px; }
  .hp-mini-logo span { color:var(--accent); }
  .hp-mini-nav-item { display:flex; align-items:center; gap:8px; padding:7px 8px; border-radius:6px; font-size:12px; color:var(--text3); }
  .hp-mini-nav-item.active { background:var(--blue-bg); color:var(--accent); }
  .hp-mini-nav-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .hp-mini-content { flex:1; padding:16px; overflow:hidden; }
  .hp-mini-banner { background:linear-gradient(135deg,rgba(108,143,255,0.12),rgba(74,110,245,0.06)); border:1px solid rgba(108,143,255,0.15); border-radius:8px; padding:12px 14px; margin-bottom:12px; font-size:12px; }
  .hp-mini-banner strong { display:block; font-family:var(--font-display); font-size:14px; margin-bottom:2px; }
  .hp-mini-banner span { color:var(--text2); font-size:11px; }
  .hp-mini-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
  .hp-mini-stat { background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:8px; }
  .hp-mini-stat-label { font-size:9px; color:var(--text3); margin-bottom:4px; }
  .hp-mini-stat-value { font-size:16px; font-weight:300; color:var(--text); }
  .hp-mini-table { background:var(--bg2); border:1px solid var(--border); border-radius:6px; overflow:hidden; font-size:11px; }
  .hp-mini-th { background:var(--bg3); padding:6px 10px; color:var(--text3); font-size:9px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; display:flex; gap:20px; }
  .hp-mini-tr { display:flex; gap:20px; padding:7px 10px; border-top:1px solid var(--border); align-items:center; }
  .hp-mini-badge { padding:2px 7px; border-radius:20px; font-size:9px; font-weight:600; }
  .hp-mini-badge.green { background:var(--green-bg); color:var(--green); }
  .hp-mini-badge.blue { background:var(--blue-bg); color:var(--accent); }
  .hp-mini-badge.amber { background:var(--amber-bg); color:var(--amber); }
  .hp-preview-glow { position:absolute; inset:-1px; border-radius:16px; pointer-events:none; background:linear-gradient(to bottom,transparent 40%,rgba(15,17,23,0.5) 100%); }

  /* LOGOS */
  .hp-logos { padding:40px 48px; text-align:center; border-top:1px solid var(--border); border-bottom:1px solid var(--border); position:relative; z-index:1; }
  .hp-logos-label { font-size:12px; color:var(--text3); margin-bottom:20px; letter-spacing:0.06em; text-transform:uppercase; font-weight:500; }
  .hp-logos-row { display:flex; align-items:center; justify-content:center; gap:48px; flex-wrap:wrap; }
  .hp-logo-item { color:var(--text3); font-size:14px; font-weight:500; letter-spacing:0.02em; opacity:0.6; transition:opacity 0.2s; }
  .hp-logo-item:hover { opacity:1; }

  /* SECTIONS */
  .hp-section { position:relative; z-index:1; padding:96px 48px; max-width:1200px; margin:0 auto; }
  .hp-section-label { font-size:12px; color:var(--accent); font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px; }
  .hp-section-h2 { font-family:var(--font-display); font-size:clamp(32px,4vw,48px); font-weight:400; line-height:1.15; margin-bottom:16px; }
  .hp-section-h2 em { color:var(--accent); font-style:italic; }
  .hp-section-sub { font-size:16px; color:var(--text2); max-width:500px; line-height:1.7; font-weight:300; margin-bottom:60px; }

  /* FEATURES */
  .hp-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .hp-feature-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:28px; transition:border-color 0.25s,transform 0.25s; }
  .hp-feature-card:hover { border-color:var(--border2); transform:translateY(-4px); }
  .hp-feature-icon { width:40px; height:40px; border-radius:10px; background:var(--blue-bg); border:1px solid rgba(108,143,255,0.15); display:flex; align-items:center; justify-content:center; margin-bottom:18px; font-size:18px; }
  .hp-feature-h3 { font-size:15px; font-weight:500; margin-bottom:8px; }
  .hp-feature-p { font-size:13px; color:var(--text2); line-height:1.65; }

  /* WORKFLOW */
  .hp-workflow { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .hp-workflow-step { display:flex; gap:20px; padding:24px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:all 0.2s; }
  .hp-workflow-step:first-child { padding-top:0; }
  .hp-workflow-step:last-child { border-bottom:none; }
  .hp-workflow-step.active .hp-step-num { background:var(--accent2); color:#fff; border-color:var(--accent2); }
  .hp-step-num { width:36px; height:36px; border-radius:50%; background:transparent; border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:var(--text2); flex-shrink:0; transition:all 0.3s; }
  .hp-step-title { font-size:14px; font-weight:500; margin-bottom:6px; }
  .hp-step-desc { font-size:13px; color:var(--text2); line-height:1.6; }
  .hp-workflow-visual { background:var(--bg2); border:1px solid var(--border2); border-radius:var(--radius); padding:28px; box-shadow:var(--shadow); position:relative; overflow:hidden; }
  .hp-workflow-visual::before { content:''; position:absolute; top:-60px; right:-60px; width:180px; height:180px; background:radial-gradient(circle,rgba(108,143,255,0.12) 0%,transparent 70%); }

  /* ROLES */
  .hp-roles-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .hp-role-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:24px 20px; text-align:center; transition:all 0.25s; }
  .hp-role-card:hover { border-color:rgba(108,143,255,0.3); background:rgba(108,143,255,0.04); transform:translateY(-3px); }
  .hp-role-emoji { font-size:32px; margin-bottom:14px; display:block; }
  .hp-role-title { font-size:14px; font-weight:500; margin-bottom:8px; }
  .hp-role-desc { font-size:12px; color:var(--text2); line-height:1.6; }
  .hp-role-perms { margin-top:14px; display:flex; flex-direction:column; gap:5px; }
  .hp-role-perm { font-size:11px; color:var(--text3); display:flex; align-items:center; gap:6px; text-align:left; }
  .hp-role-perm::before { content:'✓'; color:var(--green); font-size:10px; flex-shrink:0; }

  /* METRICS */
  .hp-metrics-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  .hp-metric-card { text-align:center; }
  .hp-metric-value { font-family:var(--font-display); font-size:52px; font-weight:400; color:var(--text); letter-spacing:-0.02em; line-height:1; margin-bottom:8px; }
  .hp-metric-value span { color:var(--accent); }
  .hp-metric-label { font-size:13px; color:var(--text2); }

  /* TESTIMONIALS */
  .hp-testimonials { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .hp-testimonial { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:24px; transition:border-color 0.2s; }
  .hp-testimonial:hover { border-color:var(--border2); }
  .hp-testimonial-text { font-size:14px; color:var(--text2); line-height:1.7; margin-bottom:20px; font-weight:300; font-style:italic; }
  .hp-testimonial-author { display:flex; align-items:center; gap:10px; }
  .hp-t-avatar { width:32px; height:32px; border-radius:50%; background:var(--accent2); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; color:#fff; flex-shrink:0; }
  .hp-t-name { font-size:13px; font-weight:500; }
  .hp-t-role { font-size:11px; color:var(--text3); }
  .hp-stars { color:var(--amber); font-size:11px; margin-bottom:12px; }

  /* CTA */
  .hp-cta-section { position:relative; z-index:1; padding:96px 48px; text-align:center; background:linear-gradient(135deg,rgba(108,143,255,0.07) 0%,transparent 60%); border-top:1px solid var(--border); }
  .hp-cta-h2 { font-family:var(--font-display); font-size:clamp(32px,4vw,52px); font-weight:400; margin-bottom:16px; line-height:1.15; }
  .hp-cta-h2 em { color:var(--accent); font-style:italic; }
  .hp-cta-sub { font-size:16px; color:var(--text2); margin-bottom:40px; font-weight:300; }
  .hp-cta-actions { display:flex; align-items:center; justify-content:center; gap:14px; flex-wrap:wrap; }
  .hp-cta-note { font-size:12px; color:var(--text3); margin-top:16px; }

  /* FOOTER */
  .hp-footer { position:relative; z-index:1; border-top:1px solid var(--border); padding:48px; display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:40px; }
  .hp-footer-col-title { font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text3); margin-bottom:16px; }
  .hp-footer-links { display:flex; flex-direction:column; gap:10px; }
  .hp-footer-link { font-size:13px; color:var(--text2); text-decoration:none; transition:color 0.2s; background:none; border:none; cursor:pointer; font-family:var(--font); text-align:left; }
  .hp-footer-link:hover { color:var(--text); }
  .hp-footer-bottom { border-top:1px solid var(--border); padding:20px 48px; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
  .hp-footer-copy { font-size:12px; color:var(--text3); }
  .hp-footer-badges { display:flex; gap:10px; }
  .hp-footer-badge { font-size:11px; color:var(--text3); background:var(--bg3); border:1px solid var(--border); border-radius:20px; padding:3px 10px; }

  /* ANIMATIONS */
  .hp-fade-in { opacity:0; transform:translateY(16px); transition:opacity 0.6s ease,transform 0.6s ease; }
  .hp-fade-in.hp-visible { opacity:1; transform:translateY(0); }
`;

const appStyles = `
  .rf-auth { min-height:100vh; display:flex; align-items:center; justify-content:center; background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(108,143,255,0.12) 0%,transparent 70%),var(--bg); }
  .rf-auth-card { width:420px; background:var(--bg2); border:1px solid var(--border2); border-radius:20px; padding:44px 40px; box-shadow:var(--shadow); }
  .rf-auth-logo { font-family:var(--font-display); font-size:26px; color:var(--text); margin-bottom:6px; }
  .rf-auth-logo span { color:var(--accent); }
  .rf-auth-subtitle { color:var(--text2); font-size:13px; margin-bottom:32px; }
  .rf-role-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:28px; }
  .rf-role-btn { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 12px; cursor:pointer; text-align:left; transition:all 0.2s; color:var(--text); width:100%; }
  .rf-role-btn:hover,.rf-role-btn.active { border-color:var(--accent); background:var(--blue-bg); }
  .rf-role-icon { font-size:20px; margin-bottom:6px; display:block; }
  .rf-role-name { font-weight:500; font-size:13px; display:block; color:var(--text); }
  .rf-role-desc { font-size:11px; color:var(--text2); margin-top:2px; }
  .rf-divider { text-align:center; color:var(--text3); font-size:12px; margin:0 0 20px; position:relative; }
  .rf-divider::before,.rf-divider::after { content:''; position:absolute; top:50%; width:38%; height:1px; background:var(--border); }
  .rf-divider::before { left:0; } .rf-divider::after { right:0; }
  .rf-field { margin-bottom:14px; }
  .rf-field label { display:block; font-size:12px; color:var(--text2); margin-bottom:6px; font-weight:500; letter-spacing:0.02em; }
  .rf-field input { width:100%; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-xs); padding:10px 14px; color:var(--text); font-family:var(--font); font-size:14px; outline:none; transition:border-color 0.2s; }
  .rf-field input:focus { border-color:var(--accent); }
  .rf-btn-primary { width:100%; background:var(--accent2); color:#fff; border:none; border-radius:var(--radius-sm); padding:12px; font-family:var(--font); font-size:14px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.1s; margin-top:4px; }
  .rf-btn-primary:hover { background:#5a7ef8; transform:translateY(-1px); }
  .rf-app { display:flex; min-height:100vh; }
  .rf-sidebar { width:var(--sidebar-w); background:var(--bg2); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:10; }
  .rf-sidebar-logo { padding:24px 20px 20px; border-bottom:1px solid var(--border); }
  .rf-sidebar-logo-text { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .rf-sidebar-logo-text span { color:var(--accent); }
  .rf-role-badge { display:inline-block; margin-top:6px; font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:3px 8px; border-radius:20px; background:var(--blue-bg); color:var(--accent); border:1px solid rgba(108,143,255,0.2); }
  .rf-sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
  .rf-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius-xs); cursor:pointer; color:var(--text2); font-size:13.5px; font-weight:400; transition:all 0.15s; margin-bottom:2px; border:1px solid transparent; text-decoration:none; background:none; width:100%; }
  .rf-nav-item:hover { background:var(--bg3); color:var(--text); }
  .rf-nav-item.active { background:var(--blue-bg); color:var(--accent); border-color:rgba(108,143,255,0.15); font-weight:500; }
  .rf-nav-badge { margin-left:auto; background:var(--accent); color:#fff; font-size:10px; font-weight:600; padding:1px 6px; border-radius:10px; }
  .rf-sidebar-footer { padding:16px 12px; border-top:1px solid var(--border); }
  .rf-user-info { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-xs); margin-bottom:8px; }
  .rf-avatar { width:32px; height:32px; border-radius:50%; background:var(--accent2); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; color:#fff; flex-shrink:0; }
  .rf-user-name { font-size:13px; font-weight:500; }
  .rf-user-email { font-size:11px; color:var(--text2); }
  .rf-logout-btn { width:100%; background:transparent; border:1px solid var(--border); border-radius:var(--radius-xs); color:var(--text2); font-family:var(--font); font-size:12px; padding:8px; cursor:pointer; transition:all 0.2s; }
  .rf-logout-btn:hover { border-color:var(--red); color:var(--red); }
  .rf-main { margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; }
  .rf-topbar { background:var(--bg2); border-bottom:1px solid var(--border); padding:0 32px; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; }
  .rf-topbar-title { font-size:15px; font-weight:500; }
  .rf-topbar-actions { display:flex; align-items:center; gap:10px; }
  .rf-icon-btn { background:transparent; border:1px solid var(--border); border-radius:var(--radius-xs); padding:7px 10px; color:var(--text2); cursor:pointer; display:flex; align-items:center; transition:all 0.2s; }
  .rf-icon-btn:hover { background:var(--bg3); color:var(--text); }
  .rf-notif-badge { position:relative; display:inline-flex; }
  .rf-notif-dot { position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:var(--accent); border-radius:50%; border:2px solid var(--bg2); }
  .rf-page { padding:32px; }
  .rf-welcome-banner { background:linear-gradient(135deg,rgba(108,143,255,0.12),rgba(74,110,245,0.06)); border:1px solid rgba(108,143,255,0.15); border-radius:var(--radius); padding:24px 28px; margin-bottom:28px; display:flex; align-items:center; justify-content:space-between; }
  .rf-welcome-text h2 { font-family:var(--font-display); font-size:22px; font-weight:400; margin-bottom:4px; }
  .rf-welcome-text p { font-size:13px; color:var(--text2); }
  .rf-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
  .rf-stat-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:20px; transition:border-color 0.2s; }
  .rf-stat-card:hover { border-color:var(--border2); }
  .rf-stat-label { font-size:12px; color:var(--text2); font-weight:500; margin-bottom:8px; }
  .rf-stat-value { font-size:26px; font-weight:300; color:var(--text); letter-spacing:-0.02em; }
  .rf-stat-sub { font-size:11px; color:var(--text3); margin-top:4px; }
  .rf-stat-change { font-size:11px; margin-top:6px; }
  .rf-stat-change.up { color:var(--green); } .rf-stat-change.warn { color:var(--amber); }
  .rf-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .rf-section-title { font-size:14px; font-weight:500; color:var(--text); }
  .rf-table-wrap { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .rf-filters { padding:14px 18px; border-bottom:1px solid var(--border); display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .rf-filter-input { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-xs); padding:7px 12px; color:var(--text); font-family:var(--font); font-size:13px; outline:none; transition:border-color 0.2s; }
  .rf-filter-input:focus { border-color:var(--accent); }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  thead tr { background:var(--bg3); }
  th { text-align:left; padding:10px 18px; font-size:11px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:var(--text3); border-bottom:1px solid var(--border); white-space:nowrap; }
  td { padding:13px 18px; border-bottom:1px solid var(--border); color:var(--text2); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tbody tr { transition:background 0.15s; }
  tbody tr:hover { background:rgba(255,255,255,0.02); }
  td strong { color:var(--text); font-weight:500; }
  .rf-status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.02em; white-space:nowrap; }
  .rf-status-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:currentColor; display:inline-block; }
  .badge-draft { background:rgba(139,141,158,0.12); color:var(--text2); }
  .badge-submitted { background:var(--blue-bg); color:var(--accent); }
  .badge-under-review { background:var(--amber-bg); color:var(--amber); }
  .badge-approved { background:var(--green-bg); color:var(--green); }
  .badge-rejected { background:var(--red-bg); color:var(--red); }
  .badge-paid { background:rgba(52,211,153,0.18); color:#10b981; }
  .rf-amount { font-weight:500; color:var(--text); font-size:13px; }
  .rf-action-btns { display:flex; gap:6px; }
  .rf-empty { text-align:center; padding:60px 20px; color:var(--text3); }
  .rf-empty .icon { font-size:36px; margin-bottom:12px; opacity:0.5; }
  .rf-btn { padding:8px 16px; border-radius:var(--radius-xs); font-family:var(--font); font-size:13px; font-weight:500; cursor:pointer; transition:all 0.18s; border:1px solid transparent; display:inline-flex; align-items:center; gap:6px; }
  .rf-btn-accent { background:var(--accent2); color:#fff; }
  .rf-btn-accent:hover { background:#5a7ef8; }
  .rf-btn-ghost { background:transparent; color:var(--text2); border-color:var(--border); }
  .rf-btn-ghost:hover { background:var(--bg3); color:var(--text); }
  .rf-btn-sm { padding:5px 12px; font-size:12px; }
  .rf-btn-green { background:rgba(52,211,153,0.15); color:var(--green); border-color:rgba(52,211,153,0.2); }
  .rf-btn-green:hover { background:rgba(52,211,153,0.25); }
  .rf-btn-red { background:var(--red-bg); color:var(--red); border-color:rgba(248,113,113,0.2); }
  .rf-btn-red:hover { background:rgba(248,113,113,0.2); }
  .rf-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.2s; }
  .rf-modal-overlay.open { opacity:1; pointer-events:all; }
  .rf-modal { background:var(--bg2); border:1px solid var(--border2); border-radius:16px; width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,0.6); transform:translateY(12px); transition:transform 0.25s; }
  .rf-modal-overlay.open .rf-modal { transform:translateY(0); }
  .rf-modal-header { padding:24px 28px 0; display:flex; align-items:center; justify-content:space-between; }
  .rf-modal-title { font-size:16px; font-weight:500; }
  .rf-modal-close { background:none; border:none; color:var(--text2); cursor:pointer; font-size:20px; padding:4px; border-radius:4px; transition:color 0.2s; line-height:1; }
  .rf-modal-close:hover { color:var(--text); }
  .rf-modal-body { padding:24px 28px; }
  .rf-modal-footer { padding:0 28px 24px; display:flex; gap:10px; justify-content:flex-end; }
  .rf-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .rf-form-field { margin-bottom:16px; }
  .rf-form-field label { display:block; font-size:12px; color:var(--text2); font-weight:500; margin-bottom:6px; letter-spacing:0.02em; }
  .rf-form-field input,.rf-form-field select,.rf-form-field textarea { width:100%; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-xs); padding:9px 12px; color:var(--text); font-family:var(--font); font-size:13px; outline:none; transition:border-color 0.2s; }
  .rf-form-field input:focus,.rf-form-field select:focus,.rf-form-field textarea:focus { border-color:var(--accent); }
  .rf-form-field select { appearance:none; cursor:pointer; }
  .rf-form-field textarea { resize:vertical; min-height:80px; }
  select option { background:#1e2030; }
  .rf-upload-zone { border:2px dashed var(--border2); border-radius:var(--radius-sm); padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:var(--bg3); }
  .rf-upload-zone:hover,.rf-upload-zone.drag-over { border-color:var(--accent); background:var(--blue-bg); }
  .rf-upload-icon { font-size:28px; margin-bottom:8px; opacity:0.5; }
  .rf-upload-zone p { font-size:13px; color:var(--text2); }
  .rf-upload-hint { font-size:11px; color:var(--text3); margin-top:4px; }
  .rf-file-chip { display:inline-flex; align-items:center; gap:6px; background:var(--bg3); border:1px solid var(--border); border-radius:20px; padding:4px 10px 4px 8px; font-size:12px; color:var(--text2); margin-top:8px; }
  .rf-notif-panel { position:fixed; top:0; right:0; bottom:0; width:360px; background:var(--bg2); border-left:1px solid var(--border); z-index:50; transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.4,0,0.2,1); display:flex; flex-direction:column; }
  .rf-notif-panel.open { transform:translateX(0); }
  .rf-notif-header { padding:20px 20px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .rf-notif-title { font-size:15px; font-weight:500; }
  .rf-notif-list { flex:1; overflow-y:auto; padding:12px; }
  .rf-notif-item { padding:12px 14px; border-radius:var(--radius-sm); margin-bottom:8px; background:var(--bg3); border:1px solid var(--border); transition:border-color 0.2s; }
  .rf-notif-item.unread { border-color:rgba(108,143,255,0.2); background:rgba(108,143,255,0.05); }
  .rf-notif-item-title { font-size:13px; font-weight:500; margin-bottom:3px; display:flex; align-items:center; gap:6px; }
  .rf-notif-item-body { font-size:12px; color:var(--text2); }
  .rf-notif-item-time { font-size:11px; color:var(--text3); margin-top:5px; }
  .rf-notif-dot-inline { width:8px; height:8px; background:var(--accent); border-radius:50%; display:inline-block; flex-shrink:0; }
  .rf-toast-container { position:fixed; bottom:24px; right:24px; z-index:200; display:flex; flex-direction:column; gap:8px; }
  .rf-toast { background:var(--bg2); border:1px solid var(--border2); border-radius:var(--radius-sm); padding:12px 16px; font-size:13px; box-shadow:var(--shadow); display:flex; align-items:center; gap:8px; min-width:280px; animation:rfSlideIn 0.3s ease; }
  .rf-toast.success { border-left:3px solid var(--green); }
  .rf-toast.error { border-left:3px solid var(--red); }
  .rf-toast.info { border-left:3px solid var(--accent); }
  @keyframes rfSlideIn { from{transform:translateX(20px);opacity:0;}to{transform:translateX(0);opacity:1;} }
  .rf-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .rf-detail-item label { display:block; font-size:11px; color:var(--text3); font-weight:500; letter-spacing:0.04em; text-transform:uppercase; margin-bottom:4px; }
  .rf-detail-item span { font-size:13px; color:var(--text); }
  .rf-timeline { border-left:2px solid var(--border); padding-left:20px; margin-left:8px; }
  .rf-timeline-item { position:relative; padding-bottom:18px; }
  .rf-timeline-item::before { content:''; position:absolute; left:-25px; top:4px; width:8px; height:8px; border-radius:50%; background:var(--accent); border:2px solid var(--bg2); }
  .rf-timeline-item:last-child { padding-bottom:0; }
  .rf-timeline-label { font-size:12px; font-weight:500; color:var(--text); }
  .rf-timeline-sub { font-size:11px; color:var(--text2); margin-top:2px; }
  .rf-approval-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:18px 20px; margin-bottom:12px; display:flex; align-items:center; gap:16px; transition:border-color 0.2s; }
  .rf-approval-card:hover { border-color:var(--border2); }
  .rf-approval-card-amount { font-size:18px; font-weight:300; color:var(--text); min-width:90px; text-align:right; }
  .rf-chip { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:500; background:var(--bg3); color:var(--text2); border:1px solid var(--border); }
  .rf-divider-line { height:1px; background:var(--border); margin:20px 0; }
  .rf-comment-box { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:14px; font-size:12px; color:var(--text2); }
  .rf-page-heading { font-size:18px; font-weight:500; margin-bottom:4px; }
  .rf-page-sub { font-size:13px; color:var(--text2); margin-bottom:24px; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }
`;

/* ── CONSTANTS ── */
const ROLE_PROFILES = {
  employee: { name:'Employee User', email:'employee@company.com', avatar:'EU' },
  manager:  { name:'Manager User',  email:'manager@company.com',  avatar:'MU' },
  finance:  { name:'Finance User',  email:'finance@company.com',  avatar:'FU' },
  admin:    { name:'Admin User',    email:'admin@company.com',    avatar:'AU' },
};

const NAV_CONFIG = {
  employee: [
    { id:'dashboard', label:'Dashboard' },
    { id:'my-claims', label:'My Claims', badgeKey:'submitted-own' },
  ],
  manager: [
    { id:'dashboard',      label:'Dashboard' },
    { id:'approvals',      label:'Pending Approvals', badgeKey:'submitted-all' },
    { id:'all-claims',     label:'All Claims' },
    { id:'notifications',  label:'Notifications' },
  ],
  finance: [
    { id:'dashboard',     label:'Dashboard' },
    { id:'approvals',     label:'Final Approvals', badgeKey:'under-review-all' },
    { id:'all-claims',    label:'All Claims' },
    { id:'notifications', label:'Notifications' },
  ],
  admin: [
    { id:'dashboard',     label:'Dashboard' },
    { id:'all-claims',    label:'All Claims' },
    { id:'notifications', label:'Notifications' },
  ],
};

const fmt     = n => Number(n).toLocaleString('en-IN');
const fmtDate = d => { try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); } catch { return d; } };
const nowStr  = () => new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

function StatusBadge({ status }) {
  const map = {
    draft:['badge-draft','Draft'], submitted:['badge-submitted','Submitted'],
    'under-review':['badge-under-review','Under Review'], approved:['badge-approved','Approved'],
    rejected:['badge-rejected','Rejected'], paid:['badge-paid','Paid'],
  };
  const [cls, label] = map[status] || ['badge-draft','Unknown'];
  return <span className={`rf-status-badge ${cls}`}>{label}</span>;
}

const IconDashboard = () => (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
const IconClaims   = () => (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>);
const IconApprove  = () => (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>);
const IconNotif    = () => (<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>);
const IconBell     = () => (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>);
const NAV_ICONS = { dashboard:IconDashboard, 'my-claims':IconClaims, approvals:IconApprove, 'all-claims':IconClaims, notifications:IconNotif };

const API_BASE = (window.__RF_API_BASE__ || 'http://127.0.0.1:5000').replace(/\/$/, '');

async function apiCall(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/* ════════════════════════════════════════════════
   HOMEPAGE COMPONENT
════════════════════════════════════════════════ */
function DashboardPreview() {
  return (
    <div className="hp-preview-frame">
      <div className="hp-preview-chrome">
        <div className="hp-chrome-dots">
          <div className="hp-chrome-dot" style={{background:'#ff5f56'}}/>
          <div className="hp-chrome-dot" style={{background:'#ffbd2e'}}/>
          <div className="hp-chrome-dot" style={{background:'#27c93f'}}/>
        </div>
        <div className="hp-chrome-url">app.reimburseflow.com/dashboard</div>
      </div>
      <div className="hp-preview-inner">
        <div className="hp-mini-sidebar">
          <div className="hp-mini-logo">Reimburse<span>Flow</span></div>
          {[{label:'Dashboard',active:true},{label:'My Claims'},{label:'Approvals'},{label:'Reports'}].map(item => (
            <div key={item.label} className={`hp-mini-nav-item ${item.active?'active':''}`}>
              <span className="hp-mini-nav-dot"/>{item.label}
            </div>
          ))}
        </div>
        <div className="hp-mini-content">
          <div className="hp-mini-banner">
            <strong>Good morning, Priya 👋</strong>
            <span>Here's your expense overview</span>
          </div>
          <div className="hp-mini-stats">
            {[{label:'Total Reimbursed',value:'₹84k'},{label:'Pending Claims',value:'3'},{label:'Drafts',value:'1'},{label:'Rejected',value:'0'}].map(s=>(
              <div key={s.label} className="hp-mini-stat"><div className="hp-mini-stat-label">{s.label}</div><div className="hp-mini-stat-value">{s.value}</div></div>
            ))}
          </div>
          <div className="hp-mini-table">
            <div className="hp-mini-th"><span style={{flex:2}}>ID</span><span style={{flex:3}}>Description</span><span style={{flex:2}}>Amount</span><span style={{flex:2}}>Status</span></div>
            {[
              {id:'CLM-001',desc:'Client lunch',amt:'₹3,200',badge:'green',status:'Paid'},
              {id:'CLM-002',desc:'Travel – Pune',amt:'₹8,750',badge:'blue',status:'Submitted'},
              {id:'CLM-003',desc:'Hotel stay',amt:'₹12,000',badge:'amber',status:'Under Review'},
            ].map(r=>(
              <div key={r.id} className="hp-mini-tr">
                <span style={{flex:2,fontWeight:500,color:'var(--text)',fontSize:'10px'}}>{r.id}</span>
                <span style={{flex:3,color:'var(--text2)',fontSize:'10px'}}>{r.desc}</span>
                <span style={{flex:2,fontWeight:500,color:'var(--text)',fontSize:'10px'}}>{r.amt}</span>
                <span style={{flex:2}}><span className={`hp-mini-badge ${r.badge}`}>{r.status}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hp-preview-glow"/>
    </div>
  );
}

const workflowVisuals = [
  <div key={0} className="hp-workflow-visual">
    <div style={{marginBottom:16}}>
      <div style={{fontSize:12,color:'var(--text3)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:12}}>New Expense Claim</div>
      {[{label:'Expense Title',value:'Team offsite dinner'},{label:'Amount (₹)',value:'12,500'},{label:'Category',value:'Meals & Entertainment'},{label:'Date',value:'28 Mar 2026'}].map(f=>(
        <div key={f.label} style={{marginBottom:10}}>
          <div style={{fontSize:10,color:'var(--text2)',marginBottom:4}}>{f.label}</div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'8px 12px',fontSize:12,color:'var(--text)'}}>{f.value}</div>
        </div>
      ))}
    </div>
    <div style={{border:'2px dashed var(--border2)',borderRadius:8,padding:'16px',textAlign:'center',background:'var(--bg3)'}}>
      <div style={{fontSize:18,marginBottom:4,opacity:0.5}}>📎</div>
      <div style={{fontSize:11,color:'var(--text2)'}}>Drop receipt here</div>
    </div>
  </div>,
  <div key={1} className="hp-workflow-visual">
    <div style={{fontSize:12,color:'var(--text3)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:12}}>Manager Review</div>
    {[{id:'CLM-005',name:'Arjun Mehta',amt:'₹8,750'},{id:'CLM-006',name:'Priya Shah',amt:'₹12,500'},{id:'CLM-007',name:'Rahul Nair',amt:'₹4,200'}].map(c=>(
      <div key={c.id} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'12px 14px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:500,color:'var(--text)',marginBottom:2}}>{c.id} · {c.name}</div>
          <div style={{fontSize:11,color:'var(--text2)'}}>{c.amt}</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <span style={{background:'var(--red-bg)',color:'var(--red)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:4,padding:'3px 8px',fontSize:10,fontWeight:500}}>Reject</span>
          <span style={{background:'var(--green-bg)',color:'var(--green)',border:'1px solid rgba(52,211,153,0.2)',borderRadius:4,padding:'3px 8px',fontSize:10,fontWeight:500}}>✓ Approve</span>
        </div>
      </div>
    ))}
  </div>,
  <div key={2} className="hp-workflow-visual">
    <div style={{fontSize:12,color:'var(--text3)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:12}}>Approval Timeline · CLM-005</div>
    <div style={{borderLeft:'2px solid var(--border)',paddingLeft:20,marginLeft:8}}>
      {[
        {action:'Submitted by employee',by:'Arjun Mehta',time:'28 Mar, 9:12 AM',done:true},
        {action:'Manager approved',by:'Divya Rao (Manager)',time:'28 Mar, 11:40 AM',done:true},
        {action:'Finance review',by:'Under Review',time:'In progress',inProgress:true},
        {action:'Payment processed',by:'Pending',time:'—'},
      ].map((t,i)=>(
        <div key={i} style={{position:'relative',paddingBottom:16}}>
          <span style={{position:'absolute',left:-25,top:3,width:8,height:8,borderRadius:'50%',background:t.done?'var(--green)':t.inProgress?'var(--amber)':'var(--border2)',border:'2px solid var(--bg2)',display:'block'}}/>
          <div style={{fontSize:12,fontWeight:500,color:t.done?'var(--text)':t.inProgress?'var(--amber)':'var(--text3)'}}>{t.action}</div>
          <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{t.by} · {t.time}</div>
        </div>
      ))}
    </div>
  </div>,
  <div key={3} className="hp-workflow-visual">
    <div style={{fontSize:12,color:'var(--text3)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:12}}>Payment Processed</div>
    <div style={{textAlign:'center',padding:'20px 0'}}>
      <div style={{width:56,height:56,borderRadius:'50%',background:'var(--green-bg)',border:'1px solid rgba(52,211,153,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24}}>✓</div>
      <div style={{fontFamily:'DM Serif Display,serif',fontSize:32,color:'var(--green)',marginBottom:4}}>₹8,750</div>
      <div style={{fontSize:12,color:'var(--text2)',marginBottom:16}}>Paid to Arjun Mehta · HDFC ****4218</div>
      <div style={{background:'var(--green-bg)',border:'1px solid rgba(52,211,153,0.2)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'var(--green)'}}>Payment Reference: TXN-2026-03-28-4891</div>
    </div>
    <div style={{marginTop:12,fontSize:11,color:'var(--text3)',textAlign:'center'}}>Notification sent · Audit logged · Receipt archived</div>
  </div>,
];

function Homepage({ onEnterApp }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('hp-visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.hp-fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  return (
    <div style={{background:'var(--bg)',minHeight:'100vh'}}>
      <div className="hp-grid-bg"/>

      {/* NAV */}
      <nav className={`hp-nav ${scrolled?'scrolled':''}`}>
        <button className="hp-logo" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>Reimburse<span>Flow</span></button>
        <div className="hp-nav-links">
          <button className="hp-nav-link" onClick={()=>scrollTo('features')}>Features</button>
          <button className="hp-nav-link" onClick={()=>scrollTo('workflow')}>How it Works</button>
          <button className="hp-nav-link" onClick={()=>scrollTo('roles')}>For Teams</button>
        </div>
        <button className="hp-nav-cta" onClick={onEnterApp}>Sign in →</button>
      </nav>

      {/* HERO */}
      <section className="hp-hero">
        <div className="hp-hero-glow"/>
        <div className="hp-hero-glow2"/>
        <div className="hp-badge"><span className="hp-badge-dot"/>Now with Finance-to-Payment automation</div>
        <h1 className="hp-hero-h1">Expense reimbursements,<br/><em>finally effortless</em></h1>
        <p className="hp-hero-sub">Submit claims in seconds, track approvals in real-time, and get paid faster. Built for every role — employee, manager, finance, admin.</p>
        <div className="hp-hero-actions">
          <button className="hp-btn-primary" onClick={onEnterApp}>Get started free →</button>
          <button className="hp-btn-outline" onClick={()=>scrollTo('workflow')}>See how it works</button>
        </div>
        <div className="hp-preview-wrap"><DashboardPreview/></div>
      </section>

      {/* LOGOS */}
      <div className="hp-logos">
        <div className="hp-logos-label">Trusted by teams at</div>
        <div className="hp-logos-row">
          {['Tata Consultancy','Infosys BPM','Wipro Tech','HCL Enterprise','Mahindra Group','Reliance Digital'].map(l=>(
            <span key={l} className="hp-logo-item">{l}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="hp-section">
        <div className="hp-fade-in">
          <div className="hp-section-label">Core Features</div>
          <h2 className="hp-section-h2">Everything your team needs<br/>to <em>move faster</em></h2>
          <p className="hp-section-sub">From submission to settlement — one platform, zero spreadsheets, complete visibility.</p>
        </div>
        <div className="hp-features-grid hp-fade-in">
          {[
            {icon:'📋',title:'Smart Claim Submission',desc:'Drag-and-drop receipts, auto-categorisation, and policy validation before you even hit submit. No more back-and-forth.'},
            {icon:'✅',title:'Role-based Approval Flows',desc:'Manager approves, Finance does final review. Each step is enforced — no claim slips through without the right sign-off.'},
            {icon:'🔔',title:'Real-time Notifications',desc:'Employees know exactly where their claim is. Managers get pinged the moment something needs attention.'},
            {icon:'📊',title:'Finance Dashboard',desc:'Track total liability, pending payouts, and approval timelines in one place. Month-end closes have never been cleaner.'},
            {icon:'🔒',title:'Audit-grade Security',desc:'JWT-secured sessions, RBAC enforcement, and a full immutable audit trail on every action taken on every claim.'},
            {icon:'⚡',title:'Instant Payment Tracking',desc:'Once finance approves, payment reference is logged, employee is notified, and the claim is archived — automatically.'},
          ].map(f=>(
            <div key={f.title} className="hp-feature-card">
              <div className="hp-feature-icon">{f.icon}</div>
              <h3 className="hp-feature-h3">{f.title}</h3>
              <p className="hp-feature-p">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <div style={{borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',position:'relative',zIndex:1}}>
        <div className="hp-section" style={{paddingTop:64,paddingBottom:64}}>
          <div className="hp-metrics-grid hp-fade-in">
            {[
              {value:'98',suffix:'%',label:'Claims processed on time'},
              {value:'3×',suffix:'',label:'Faster approval cycles'},
              {value:'₹0',suffix:'',label:'Spreadsheet overhead'},
              {value:'24',suffix:'h',label:'Average time to payment'},
            ].map(m=>(
              <div key={m.label} className="hp-metric-card">
                <div className="hp-metric-value">{m.value}<span>{m.suffix}</span></div>
                <div className="hp-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WORKFLOW */}
      <section id="workflow" className="hp-section">
        <div className="hp-fade-in">
          <div className="hp-section-label">How it Works</div>
          <h2 className="hp-section-h2">From receipt to<br/><em>reimbursement</em></h2>
          <p className="hp-section-sub">Four clear steps. Every stakeholder in the loop. Zero ambiguity.</p>
        </div>
        <div className="hp-workflow hp-fade-in">
          <div>
            {[
              {title:'Submit a claim',desc:'Employees fill a simple form, attach a receipt, and submit. Policy limits are validated automatically.'},
              {title:'Manager reviews',desc:'The right manager sees it instantly. One click to approve or reject, with optional comments.'},
              {title:'Finance approves',desc:'Finance does the final check and marks it for payment. Full audit trail maintained throughout.'},
              {title:'Employee gets paid',desc:'Payment is logged with a reference number, and the employee is notified automatically.'},
            ].map((step,i)=>(
              <div key={i} className={`hp-workflow-step ${activeStep===i?'active':''}`} onClick={()=>setActiveStep(i)}>
                <div className="hp-step-num">{i+1}</div>
                <div><div className="hp-step-title">{step.title}</div><div className="hp-step-desc">{step.desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{transition:'all 0.4s ease'}}>{workflowVisuals[activeStep]}</div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{borderTop:'1px solid var(--border)',position:'relative',zIndex:1}}>
        <div className="hp-section">
          <div className="hp-fade-in">
            <div className="hp-section-label">Built for Every Role</div>
            <h2 className="hp-section-h2">One platform,<br/><em>four perspectives</em></h2>
            <p className="hp-section-sub">Every person in your org gets a tailored view — just what they need, nothing they don't.</p>
          </div>
          <div className="hp-roles-grid hp-fade-in">
            {[
              {emoji:'👤',title:'Employee',desc:"Submit and track your claims without chasing anyone.",perms:['Submit & draft claims','Real-time status updates','Payment confirmation','Expense history']},
              {emoji:'👔',title:'Manager',desc:"Review your team's claims and keep approvals moving.",perms:['Approve or reject claims','Add review comments','Team claim overview','Pending alerts']},
              {emoji:'💼',title:'Finance',desc:'Final approval authority with full payment visibility.',perms:['Final approval & pay','Finance dashboard','Audit trail access','Report exports']},
              {emoji:'⚙️',title:'Admin',desc:'Full system visibility across users, policies, and claims.',perms:['All claims access','Policy configuration','User management','System notifications']},
            ].map(r=>(
              <div key={r.title} className="hp-role-card">
                <span className="hp-role-emoji">{r.emoji}</span>
                <div className="hp-role-title">{r.title}</div>
                <div className="hp-role-desc">{r.desc}</div>
                <div className="hp-roles-perms">{r.perms.map(p=><div key={p} className="hp-role-perm">{p}</div>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{position:'relative',zIndex:1,borderTop:'1px solid var(--border)'}}>
        <div className="hp-section">
          <div className="hp-fade-in">
            <div className="hp-section-label">What Teams Say</div>
            <h2 className="hp-section-h2">Loved by finance teams<br/><em>across India</em></h2>
          </div>
          <div className="hp-testimonials hp-fade-in">
            {[
              {text:'We cut our month-end expense reconciliation from 3 days to half a day. The approval flow is just — clean.',name:'Divya Menon',role:'Finance Manager · Bengaluru',initials:'DM'},
              {text:'My team used to ping me on WhatsApp for every claim. Now I just open the dashboard and everything is right there.',name:'Rohan Verma',role:'Engineering Manager · Pune',initials:'RV'},
              {text:'Submitting a claim takes maybe 90 seconds. I actually get reimbursed before I forget I spent the money.',name:'Aisha Patel',role:'Senior Associate · Mumbai',initials:'AP'},
            ].map(t=>(
              <div key={t.name} className="hp-testimonial">
                <div className="hp-stars">★★★★★</div>
                <div className="hp-testimonial-text">"{t.text}"</div>
                <div className="hp-testimonial-author">
                  <div className="hp-t-avatar">{t.initials}</div>
                  <div><div className="hp-t-name">{t.name}</div><div className="hp-t-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="hp-cta-section">
        <div className="hp-fade-in">
          <h2 className="hp-cta-h2">Ready to <em>reimburse smarter?</em></h2>
          <p className="hp-cta-sub">Set up in minutes. No credit card required. Free for teams up to 10.</p>
          <div className="hp-cta-actions">
            <button className="hp-btn-primary" onClick={onEnterApp}>Start for free →</button>
            <button className="hp-btn-outline" onClick={onEnterApp}>Sign in to your account</button>
          </div>
          <p className="hp-cta-note">🔒 JWT-secured · RBAC enforced · SOC 2 compliant · Audit logged</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="hp-footer">
        <div>
          <div style={{fontFamily:'DM Serif Display,serif',fontSize:20,marginBottom:10}}>Reimburse<span style={{color:'var(--accent)'}}>Flow</span></div>
          <p style={{fontSize:12,color:'var(--text3)',maxWidth:200,lineHeight:1.6}}>Secure expense management for modern Indian teams.</p>
        </div>
        <div>
          <div className="hp-footer-col-title">Product</div>
          <div className="hp-footer-links">{['Features','Pricing','Integrations','Changelog','Roadmap'].map(l=><button key={l} className="hp-footer-link">{l}</button>)}</div>
        </div>
        <div>
          <div className="hp-footer-col-title">Company</div>
          <div className="hp-footer-links">{['About','Blog','Careers','Press','Contact'].map(l=><button key={l} className="hp-footer-link">{l}</button>)}</div>
        </div>
        <div>
          <div className="hp-footer-col-title">Legal</div>
          <div className="hp-footer-links">{['Privacy Policy','Terms of Service','Security','GDPR','Cookie Policy'].map(l=><button key={l} className="hp-footer-link">{l}</button>)}</div>
        </div>
      </footer>
      <div className="hp-footer-bottom">
        <span className="hp-footer-copy">© 2026 ReimburseFlow. All rights reserved.</span>
        <div className="hp-footer-badges">
          <span className="hp-footer-badge">🔒 SOC 2</span>
          <span className="hp-footer-badge">🇮🇳 Made in India</span>
          <span className="hp-footer-badge">✓ GST Compliant</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN APP COMPONENT
════════════════════════════════════════════════ */
function ReimburseFlowApp() {
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [session,     setSession]     = useState({ role:'employee', ...ROLE_PROFILES.employee });
  const [selectedRole,setSelectedRole]= useState('employee');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [claims,      setClaims]      = useState([]);
  const [notifications,setNotifications] = useState([]);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [toasts,      setToasts]      = useState([]);
  const [claimModalOpen,  setClaimModalOpen]  = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailClaimId,   setDetailClaimId]   = useState(null);
  const [claimForm, setClaimForm] = useState({ title:'', category:'', amount:'', date:new Date().toISOString().split('T')[0], desc:'', receipt:'' });
  const [searchQuery,    setSearchQuery]    = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [ocrData,        setOcrData]        = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const toast = (msg, type='info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const fetchClaims = async (roleArg = session.role, userIdArg = session.id) => {
    const q = roleArg === 'employee' && userIdArg ? `?role=${encodeURIComponent(roleArg)}&user_id=${encodeURIComponent(userIdArg)}` : `?role=${encodeURIComponent(roleArg)}`;
    const data = await apiCall(`/expenses/claims${q}`);
    setClaims(data.claims || []);
  };

  const fetchNotifications = async (roleArg = session.role) => {
    const data = await apiCall(`/expenses/notifications?role=${encodeURIComponent(roleArg)}`);
    setNotifications(data.notifications || []);
  };

  const refreshData = async (roleArg = session.role, userIdArg = session.id) => {
    setDataLoading(true);
    try {
      await Promise.all([fetchClaims(roleArg, userIdArg), fetchNotifications(roleArg)]);
    } finally {
      setDataLoading(false);
    }
  };

  const login = async () => {
    setAuthLoading(true);
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          role: selectedRole,
          email,
          password,
        }),
      });

      const user = data.user || { role: selectedRole, ...ROLE_PROFILES[selectedRole] };
      setSession(user);
      setLoggedIn(true);
      setCurrentView('dashboard');
      await refreshData(user.role, user.id);
      toast('Signed in as ' + user.name, 'success');
    } catch (err) {
      toast(err.message || 'Login failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {
      // No-op: local logout still proceeds.
    }
    setLoggedIn(false);
    setCurrentView('dashboard');
    setClaims([]);
    setNotifications([]);
    toast('Signed out successfully', 'info');
  };

  const myNotifs = notifications.filter(n => n.forRole.includes(session.role));
  const unreadCount = myNotifs.filter(n => n.unread).length;
  const markAllRead = async () => {
    setNotifications(n => n.map(x => ({ ...x, unread:false })));
    try {
      await apiCall('/expenses/notifications/mark-read', {
        method: 'PATCH',
        body: JSON.stringify({ role: session.role }),
      });
    } catch {
      // Keep optimistic UI state.
    }
  };

  const getBadge = key => {
    if (key === 'submitted-own')    return claims.filter(c => c.employeeId===session.id && c.status==='submitted').length;
    if (key === 'submitted-all')    return claims.filter(c => c.status==='submitted').length;
    if (key === 'under-review-all') return claims.filter(c => c.status==='under-review').length;
    return 0;
  };

  const approveClaim = async id => {
    try {
      await apiCall(`/expenses/claims/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ actor: session.name + ' (Manager)' }),
      });
      await refreshData();
      toast(id+' approved! Sent to Finance.','success');
    } catch (err) {
      toast(err.message || 'Unable to approve claim', 'error');
    }
  };

  const rejectClaim = async id => {
    const reason = window.prompt('Enter rejection reason (required):');
    if (!reason) return;
    try {
      await apiCall(`/expenses/claims/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ actor: session.name, reason }),
      });
      await refreshData();
      toast(id+' rejected.','error');
    } catch (err) {
      toast(err.message || 'Unable to reject claim', 'error');
    }
  };

  const financeApprove = async id => {
    try {
      await apiCall(`/expenses/claims/${id}/finance-approve`, {
        method: 'PATCH',
        body: JSON.stringify({ actor: session.name + ' (Finance)' }),
      });
      await refreshData();
      toast(id+' approved & payment processed!','success');
    } catch (err) {
      toast(err.message || 'Unable to finalize claim', 'error');
    }
  };

  const submitDraft = async id => {
    try {
      await apiCall(`/expenses/claims/${id}/submit`, {
        method: 'PATCH',
        body: JSON.stringify({ actor: session.name }),
      });
      await refreshData();
      toast(id+' submitted for approval!','success');
    } catch (err) {
      toast(err.message || 'Unable to submit draft', 'error');
    }
  };

  const submitClaim = async (asDraft=false) => {
    if (!asDraft) {
      if (!claimForm.title||!claimForm.category||!claimForm.amount||!claimForm.date||!claimForm.desc) { toast('Please fill all required fields','error'); return; }
      if (parseFloat(claimForm.amount)<=0) { toast('Amount must be greater than 0','error'); return; }
      if (parseFloat(claimForm.amount)>100000) { toast('Amount exceeds policy limit of ₹1,00,000','error'); return; }
    }
    if (!claimForm.title) { toast('Please enter a title','error'); return; }
    try {
      const payload = {
        employeeId: session.id || 'employee-demo',
        employee: session.name,
        title: claimForm.title,
        category: claimForm.category || 'Other',
        amount: parseFloat(claimForm.amount) || 0,
        date: claimForm.date,
        desc: claimForm.desc,
        receipt: claimForm.receipt,
        status: asDraft ? 'draft' : 'submitted',
        timeline: asDraft ? [] : [{ action:'Submitted', by: session.name, time: nowStr() }],
      };

      const data = await apiCall('/expenses/claims', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const id = data.claim?.id || 'Claim';
      setClaimModalOpen(false);
      setOcrData(null);
      setClaimForm({ title:'', category:'', amount:'', date:new Date().toISOString().split('T')[0], desc:'', receipt:'' });
      await refreshData();
      toast(asDraft?'Saved as draft: '+id:'Claim '+id+' submitted successfully!',asDraft?'info':'success');
    } catch (err) {
      toast(err.message || 'Unable to create claim', 'error');
    }
  };

  const handleFile = async file => {
    const allowed = ['image/png','image/jpeg','image/jpg','image/gif','image/bmp','image/tiff'];
    if (!allowed.includes(file.type)) { toast('Invalid file type. Use PNG, JPG, GIF, BMP, or TIFF.','error'); return; }
    if (file.size>10*1024*1024) { toast('File too large. Max 10 MB.','error'); return; }

    // Upload file for OCR processing
    setUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${window.__RF_API_BASE__ || 'http://127.0.0.1:5000'}/expenses/receipts/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(()=>({}));
        throw new Error(errData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) throw new Error(data.error || 'Upload failed');

      const receipt = data.receipt;
      setOcrData(receipt);
      setClaimForm(f => ({ ...f, receipt: receipt.id }));
      
      // Auto-fill form with OCR data if available
      if (receipt.parsed_amount) setClaimForm(f => ({ ...f, amount: receipt.parsed_amount.toString() }));
      if (receipt.parsed_date) setClaimForm(f => ({ ...f, date: receipt.parsed_date }));
      if (receipt.parsed_description) setClaimForm(f => ({ ...f, desc: receipt.parsed_description }));
      
      toast('Receipt uploaded & OCR processed!','success');
    } catch (err) {
      toast(err.message || 'Failed to upload receipt', 'error');
      setOcrData(null);
    } finally {
      setUploadingReceipt(false);
    }
  };

  const myClaims = claims.filter(c => c.employeeId===session.id);
  const pendingApprovals = claims.filter(c => session.role==='manager'?c.status==='submitted':c.status==='under-review');
  const detailClaim = claims.find(c => c.id===detailClaimId);
  const filteredMyClaims = myClaims.filter(c => (!searchQuery||(c.title+c.id+c.category).toLowerCase().includes(searchQuery.toLowerCase()))&&(!statusFilter||c.status===statusFilter));
  const filteredAllClaims = claims.filter(c => (!searchQuery||(c.title+c.id+c.employee+c.category).toLowerCase().includes(searchQuery.toLowerCase()))&&(!statusFilter||c.status===statusFilter)&&(!employeeFilter||c.employee===employeeFilter));
  const uniqueEmployees = [...new Set(claims.map(c => c.employee))];

  if (!loggedIn) return (
    <div className="rf-auth">
      <div className="rf-auth-card">
        <div className="rf-auth-logo">Reimburse<span>Flow</span></div>
        <div className="rf-auth-subtitle">Secure expense management for your team</div>
        <p style={{fontSize:'12px',color:'var(--text2)',marginBottom:'12px'}}>Sign in as:</p>
        <div className="rf-role-grid">
          {[{role:'employee',icon:'👤',name:'Employee',desc:'Submit & track claims'},{role:'manager',icon:'👔',name:'Manager',desc:'Review team claims'},{role:'finance',icon:'💼',name:'Finance',desc:'Final approvals & reports'},{role:'admin',icon:'⚙️',name:'Admin',desc:'Manage users & policies'}].map(r=>(
            <button key={r.role} className={`rf-role-btn ${selectedRole===r.role?'active':''}`} onClick={()=>setSelectedRole(r.role)}>
              <span className="rf-role-icon">{r.icon}</span>
              <span className="rf-role-name">{r.name}</span>
              <span className="rf-role-desc">{r.desc}</span>
            </button>
          ))}
        </div>
        <div className="rf-divider">credentials</div>
        <div className="rf-field"><label>Email</label><input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="rf-field"><label>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        <button className="rf-btn-primary" onClick={login} disabled={authLoading}>{authLoading ? 'Signing in...' : 'Sign in securely →'}</button>
        <p style={{fontSize:'11px',color:'var(--text3)',textAlign:'center',marginTop:'16px'}}>🔒 JWT-secured · RBAC enforced · Audit logged</p>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const role = session.role;
    if (role==='employee') {
      const totalAmt = myClaims.filter(c=>c.status==='approved'||c.status==='paid').reduce((s,c)=>s+c.amount,0);
      const pending = myClaims.filter(c=>['submitted','under-review'].includes(c.status)).length;
      const stats = [{label:'Total Reimbursed',value:'₹'+fmt(totalAmt),sub:'All time',change:'↑ this month',dir:'up'},{label:'Pending Claims',value:pending,sub:'Awaiting action',change:'',dir:''},{label:'Drafts',value:myClaims.filter(c=>c.status==='draft').length,sub:'Incomplete',change:'',dir:''},{label:'Rejected',value:myClaims.filter(c=>c.status==='rejected').length,sub:'This quarter',change:'',dir:''}];
      return (<><div className="rf-welcome-banner"><div className="rf-welcome-text"><h2>Good day, {session.name.split(' ')[0]} 👋</h2><p>Here's your expense overview</p></div><button className="rf-btn rf-btn-accent" onClick={()=>setClaimModalOpen(true)}>+ New Claim</button></div><StatsGrid stats={stats}/><div className="rf-section-header"><div className="rf-section-title">Recent Claims</div></div><div className="rf-table-wrap"><table><thead><tr><th>ID</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>{myClaims.slice(0,4).map(c=>(<tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.title}</td><td className="rf-amount">₹{fmt(c.amount)}</td><td>{fmtDate(c.date)}</td><td><StatusBadge status={c.status}/></td></tr>))}</tbody></table></div></>);
    }
    if (role==='manager') {
      const pending = claims.filter(c=>c.status==='submitted');
      const stats = [{label:'Pending Review',value:pending.length,sub:'Awaiting your action',change:'↑ needs attention',dir:'warn'},{label:'Approved This Month',value:claims.filter(c=>c.status==='approved'||c.status==='paid').length,sub:'Claims processed',change:'',dir:''},{label:'Total Value Pending',value:'₹'+fmt(pending.reduce((s,c)=>s+c.amount,0)),sub:'Pending approvals',change:'',dir:''},{label:'Rejected',value:claims.filter(c=>c.status==='rejected').length,sub:'This quarter',change:'',dir:''}];
      return (<><div className="rf-welcome-banner"><div className="rf-welcome-text"><h2>Good day, {session.name.split(' ')[0]} 👋</h2><p>Here's your approval overview</p></div></div><StatsGrid stats={stats}/><div className="rf-section-header"><div className="rf-section-title">Pending Approvals</div></div><div className="rf-table-wrap"><table><thead><tr><th>ID</th><th>Employee</th><th>Description</th><th>Amount</th><th>Actions</th></tr></thead><tbody>{pending.slice(0,4).map(c=>(<tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.employee}</td><td>{c.title}</td><td className="rf-amount">₹{fmt(c.amount)}</td><td><div className="rf-action-btns"><button className="rf-btn rf-btn-sm rf-btn-green" onClick={()=>approveClaim(c.id)}>✓ Approve</button><button className="rf-btn rf-btn-sm rf-btn-ghost" onClick={()=>{setDetailClaimId(c.id);setDetailModalOpen(true);}}>View</button></div></td></tr>))}</tbody></table></div></>);
    }
    const totalAmt = claims.reduce((s,c)=>s+c.amount,0);
    const stats = [{label:'Total Claims Value',value:'₹'+fmt(totalAmt),sub:'All submissions',change:'',dir:''},{label:'Awaiting Finance',value:claims.filter(c=>c.status==='under-review').length,sub:'Needs final approval',change:'↑ action needed',dir:'warn'},{label:'Paid Out',value:'₹'+fmt(claims.filter(c=>c.status==='paid').reduce((s,c)=>s+c.amount,0)),sub:'Disbursed',change:'',dir:'up'},{label:'Total Claims',value:claims.length,sub:'Organisation-wide',change:'',dir:''}];
    return (<><div className="rf-welcome-banner"><div className="rf-welcome-text"><h2>Good day, {session.name.split(' ')[0]} 👋</h2><p>Here's the organisation overview</p></div></div><StatsGrid stats={stats}/><div className="rf-section-header"><div className="rf-section-title">All Recent Claims</div></div><div className="rf-table-wrap"><table><thead><tr><th>ID</th><th>Employee</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{claims.slice(0,5).map(c=>(<tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.employee}</td><td className="rf-amount">₹{fmt(c.amount)}</td><td><StatusBadge status={c.status}/></td><td><button className="rf-btn rf-btn-sm rf-btn-ghost" onClick={()=>{setDetailClaimId(c.id);setDetailModalOpen(true);}}>View</button></td></tr>))}</tbody></table></div></>);
  };

  const viewTitle = {dashboard:'Dashboard','my-claims':'My Claims',approvals:'Approvals','all-claims':'All Claims',notifications:'Notifications'};

  return (
    <div className="rf-app">
      <nav className="rf-sidebar">
        <div className="rf-sidebar-logo">
          <div className="rf-sidebar-logo-text">Reimburse<span>Flow</span></div>
          <span className="rf-role-badge">{session.role.charAt(0).toUpperCase()+session.role.slice(1)}</span>
        </div>
        <div className="rf-sidebar-nav">
          {NAV_CONFIG[session.role].map(item => {
            const Icon = NAV_ICONS[item.id]||IconDashboard;
            const badge = item.badgeKey?getBadge(item.badgeKey):0;
            return (<button key={item.id} className={`rf-nav-item ${currentView===item.id?'active':''}`} onClick={()=>{setCurrentView(item.id);setSearchQuery('');setStatusFilter('');setEmployeeFilter('');}}><Icon/>{item.label}{badge>0&&<span className="rf-nav-badge">{badge}</span>}</button>);
          })}
        </div>
        <div className="rf-sidebar-footer">
          <div className="rf-user-info"><div className="rf-avatar">{session.avatar}</div><div><div className="rf-user-name">{session.name}</div><div className="rf-user-email">{session.email}</div></div></div>
          <button className="rf-logout-btn" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="rf-main">
        <div className="rf-topbar">
          <div className="rf-topbar-title">{viewTitle[currentView]||'Dashboard'}</div>
          <div className="rf-topbar-actions">
            <div className="rf-notif-badge">
              <button className="rf-icon-btn" onClick={()=>{setNotifOpen(o=>!o);if(!notifOpen)markAllRead();}}><IconBell/></button>
              {unreadCount>0&&<span className="rf-notif-dot"/>}
            </div>
          </div>
        </div>

        <div className="rf-page">
          {currentView==='dashboard'&&renderDashboard()}

          {currentView==='my-claims'&&(
            <><div className="rf-page-heading">My Claims</div><div className="rf-page-sub">Track and manage your expense reimbursements</div>
            <div className="rf-section-header" style={{marginBottom:'14px'}}>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <input className="rf-filter-input" style={{width:'220px'}} type="text" placeholder="Search claims…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                <select className="rf-filter-input" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">All statuses</option>{['draft','submitted','under-review','approved','rejected','paid'].map(s=><option key={s} value={s}>{s}</option>)}</select>
              </div>
              <button className="rf-btn rf-btn-accent" onClick={()=>setClaimModalOpen(true)}>+ New Claim</button>
            </div>
            <div className="rf-table-wrap"><table><thead><tr><th>Claim ID</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filteredMyClaims.length===0?<tr><td colSpan="7"><div className="rf-empty"><div className="icon">📄</div><p>No claims yet. Submit your first expense!</p></div></td></tr>:filteredMyClaims.map(c=>(<tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.title}</td><td><span className="rf-chip">{c.category}</span></td><td className="rf-amount">₹{fmt(c.amount)}</td><td>{fmtDate(c.date)}</td><td><StatusBadge status={c.status}/></td><td><div className="rf-action-btns"><button className="rf-btn rf-btn-sm rf-btn-ghost" onClick={()=>{setDetailClaimId(c.id);setDetailModalOpen(true);}}>View</button>{c.status==='draft'&&<button className="rf-btn rf-btn-sm rf-btn-accent" onClick={()=>submitDraft(c.id)}>Submit</button>}</div></td></tr>))}</tbody></table></div></>
          )}

          {currentView==='approvals'&&(
            <><div className="rf-page-heading">{session.role==='manager'?'Pending Approvals':'Final Approvals'}</div><div className="rf-page-sub">Review and action team expense claims</div>
            {pendingApprovals.length===0?<div className="rf-empty"><div className="icon">✅</div><p>No pending approvals. You're all caught up!</p></div>:pendingApprovals.map(c=>(
              <div key={c.id} className="rf-approval-card">
                <div style={{flex:1}}><div style={{fontSize:'11px',color:'var(--text3)',marginBottom:'2px'}}>{c.id} · {fmtDate(c.date)}</div><div style={{fontSize:'14px',fontWeight:500,marginBottom:'4px'}}>{c.title}</div><div style={{fontSize:'12px',color:'var(--text2)'}}>{c.employee} · <span className="rf-chip">{c.category}</span></div>{c.receipt&&<div style={{marginTop:'6px'}}><span className="rf-file-chip">📎 {c.receipt}</span></div>}</div>
                <div className="rf-approval-card-amount">₹{fmt(c.amount)}</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button className="rf-btn rf-btn-sm rf-btn-ghost" onClick={()=>{setDetailClaimId(c.id);setDetailModalOpen(true);}}>Details</button>
                  <button className="rf-btn rf-btn-sm rf-btn-red" onClick={()=>rejectClaim(c.id)}>Reject</button>
                  {session.role==='manager'?<button className="rf-btn rf-btn-sm rf-btn-green" onClick={()=>approveClaim(c.id)}>✓ Approve</button>:<button className="rf-btn rf-btn-sm rf-btn-green" onClick={()=>financeApprove(c.id)}>✓ Final Approve</button>}
                </div>
              </div>
            ))}</>
          )}

          {currentView==='all-claims'&&(
            <><div className="rf-page-heading">All Claims</div><div className="rf-page-sub">Full view of all organisation reimbursements</div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'14px'}}>
              <input className="rf-filter-input" style={{width:'220px'}} type="text" placeholder="Search…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
              <select className="rf-filter-input" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">All statuses</option>{['submitted','under-review','approved','rejected','paid'].map(s=><option key={s} value={s}>{s}</option>)}</select>
              <select className="rf-filter-input" value={employeeFilter} onChange={e=>setEmployeeFilter(e.target.value)}><option value="">All employees</option>{uniqueEmployees.map(e=><option key={e} value={e}>{e}</option>)}</select>
            </div>
            <div className="rf-table-wrap"><table><thead><tr><th>Claim ID</th><th>Employee</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filteredAllClaims.length===0?<tr><td colSpan="8"><div className="rf-empty"><div className="icon">📄</div><p>No claims found.</p></div></td></tr>:filteredAllClaims.map(c=>(<tr key={c.id}><td><strong>{c.id}</strong></td><td>{c.employee}</td><td>{c.title}</td><td><span className="rf-chip">{c.category}</span></td><td className="rf-amount">₹{fmt(c.amount)}</td><td>{fmtDate(c.date)}</td><td><StatusBadge status={c.status}/></td><td><div className="rf-action-btns"><button className="rf-btn rf-btn-sm rf-btn-ghost" onClick={()=>{setDetailClaimId(c.id);setDetailModalOpen(true);}}>View</button>{c.status==='under-review'&&session.role==='finance'&&<button className="rf-btn rf-btn-sm rf-btn-green" onClick={()=>financeApprove(c.id)}>Final Approve</button>}</div></td></tr>))}</tbody></table></div></>
          )}

          {currentView==='notifications'&&(
            <><div className="rf-page-heading">Notifications</div><div className="rf-page-sub">Stay updated on claim activity</div>
            {myNotifs.length===0?<div className="rf-empty"><div className="icon">🔔</div><p>No notifications</p></div>:myNotifs.map(n=>(
              <div key={n.id} className={`rf-notif-item ${n.unread?'unread':''}`} style={{marginBottom:'10px'}}><div className="rf-notif-item-title">{n.title}</div><div className="rf-notif-item-body">{n.body}</div><div className="rf-notif-item-time">{n.time}</div></div>
            ))}</>
          )}
        </div>
      </div>

      {/* NOTIFICATION PANEL */}
      <div className={`rf-notif-panel ${notifOpen?'open':''}`}>
        <div className="rf-notif-header"><div className="rf-notif-title">Notifications</div><button className="rf-modal-close" onClick={()=>setNotifOpen(false)}>×</button></div>
        <div className="rf-notif-list">{myNotifs.length===0?<div style={{padding:'20px',textAlign:'center',color:'var(--text3)',fontSize:'13px'}}>No notifications</div>:myNotifs.map(n=>(<div key={n.id} className={`rf-notif-item ${n.unread?'unread':''}`}><div className="rf-notif-item-title">{n.unread&&<span className="rf-notif-dot-inline"/>}{n.title}</div><div className="rf-notif-item-body">{n.body}</div><div className="rf-notif-item-time">{n.time}</div></div>))}</div>
      </div>

      {/* CLAIM MODAL */}
      <div className={`rf-modal-overlay ${claimModalOpen?'open':''}`} onClick={e=>{if(e.target===e.currentTarget){setClaimModalOpen(false);setOcrData(null);}}}>
        <div className="rf-modal">
          <div className="rf-modal-header"><div className="rf-modal-title">Submit New Expense Claim</div><button className="rf-modal-close" onClick={()=>{setClaimModalOpen(false);setOcrData(null);}}>×</button></div>
          <div className="rf-modal-body">
            <div className="rf-form-row">
              <div className="rf-form-field"><label>Expense Title</label><input type="text" placeholder="e.g. Client lunch at Taj" value={claimForm.title} onChange={e=>setClaimForm(f=>({...f,title:e.target.value}))}/></div>
              <div className="rf-form-field"><label>Category</label><select value={claimForm.category} onChange={e=>setClaimForm(f=>({...f,category:e.target.value}))}><option value="">Select category</option>{['Travel','Meals','Accommodation','Office Supplies','Software','Training','Medical','Other'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="rf-form-row">
              <div className="rf-form-field"><label>Amount (₹)</label><input type="number" placeholder="0.00" min="1" value={claimForm.amount} onChange={e=>setClaimForm(f=>({...f,amount:e.target.value}))}/></div>
              <div className="rf-form-field"><label>Expense Date</label><input type="date" value={claimForm.date} onChange={e=>setClaimForm(f=>({...f,date:e.target.value}))}/></div>
            </div>
            <div className="rf-form-field"><label>Description / Business Purpose</label><textarea placeholder="Describe the business purpose of this expense…" value={claimForm.desc} onChange={e=>setClaimForm(f=>({...f,desc:e.target.value}))}/></div>
            <div className="rf-form-field"><label>Receipt Upload</label><UploadZone receipt={claimForm.receipt} onFile={handleFile} ocrData={ocrData} uploading={uploadingReceipt}/></div>
          </div>
          <div className="rf-modal-footer">
            <button className="rf-btn rf-btn-ghost" onClick={()=>submitClaim(true)}>Save as Draft</button>
            <button className="rf-btn rf-btn-accent" onClick={()=>submitClaim(false)}>Submit Claim →</button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <div className={`rf-modal-overlay ${detailModalOpen?'open':''}`} onClick={e=>{if(e.target===e.currentTarget)setDetailModalOpen(false);}}>
        <div className="rf-modal" style={{width:'620px'}}>
          <div className="rf-modal-header"><div className="rf-modal-title">{detailClaim?`${detailClaim.title} · ${detailClaim.id}`:'Claim Details'}</div><button className="rf-modal-close" onClick={()=>setDetailModalOpen(false)}>×</button></div>
          {detailClaim&&(<><div className="rf-modal-body">
            <div className="rf-detail-grid">
              <div className="rf-detail-item"><label>Claim ID</label><span>{detailClaim.id}</span></div>
              <div className="rf-detail-item"><label>Status</label><span><StatusBadge status={detailClaim.status}/></span></div>
              <div className="rf-detail-item"><label>Employee</label><span>{detailClaim.employee}</span></div>
              <div className="rf-detail-item"><label>Category</label><span><span className="rf-chip">{detailClaim.category}</span></span></div>
              <div className="rf-detail-item"><label>Amount</label><span style={{fontSize:'18px',fontWeight:300,color:'var(--text)'}}>₹{fmt(detailClaim.amount)}</span></div>
              <div className="rf-detail-item"><label>Date</label><span>{fmtDate(detailClaim.date)}</span></div>
            </div>
            <div style={{marginBottom:'16px'}}><label style={{display:'block',fontSize:'11px',color:'var(--text3)',fontWeight:500,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:'6px'}}>Business Purpose</label><div style={{fontSize:'13px',color:'var(--text2)'}}>{detailClaim.desc}</div></div>
            {detailClaim.receipt&&<div style={{marginBottom:'16px'}}><label style={{display:'block',fontSize:'11px',color:'var(--text3)',fontWeight:500,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:'6px'}}>Receipt</label><span className="rf-file-chip">📎 {detailClaim.receipt}</span></div>}
            {detailClaim.comment&&<div className="rf-comment-box"><strong style={{color:'var(--text)',display:'block',marginBottom:'4px',fontSize:'13px'}}>Manager Comment</strong>{detailClaim.comment}</div>}
            <div className="rf-divider-line"/>
            <div style={{fontSize:'12px',fontWeight:500,color:'var(--text3)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:'12px'}}>Approval Timeline</div>
            {detailClaim.timeline.length===0?<div style={{fontSize:'13px',color:'var(--text3)'}}>No activity yet.</div>:<div className="rf-timeline">{detailClaim.timeline.map((t,i)=>(<div key={i} className="rf-timeline-item"><div className="rf-timeline-label">{t.action}</div><div className="rf-timeline-sub">{t.by} · {t.time}</div></div>))}</div>}
          </div>
          <div className="rf-modal-footer">
            {session.role==='manager'&&detailClaim.status==='submitted'&&<><button className="rf-btn rf-btn-red" onClick={()=>{rejectClaim(detailClaim.id);setDetailModalOpen(false);}}>Reject</button><button className="rf-btn rf-btn-green" onClick={()=>{approveClaim(detailClaim.id);setDetailModalOpen(false);}}>✓ Approve</button></>}
            {session.role==='finance'&&detailClaim.status==='under-review'&&<button className="rf-btn rf-btn-green" onClick={()=>{financeApprove(detailClaim.id);setDetailModalOpen(false);}}>✓ Final Approve & Pay</button>}
          </div></>)}
        </div>
      </div>

      {/* TOASTS */}
      <div className="rf-toast-container">{toasts.map(t=>(<div key={t.id} className={`rf-toast ${t.type}`}><span>{{success:'✓',error:'✕',info:'ℹ'}[t.type]||'ℹ'}</span>{t.msg}</div>))}</div>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (<div className="rf-stats-grid">{stats.map((s,i)=>(<div key={i} className="rf-stat-card"><div className="rf-stat-label">{s.label}</div><div className="rf-stat-value">{s.value}</div><div className="rf-stat-sub">{s.sub}</div>{s.change&&<div className={`rf-stat-change ${s.dir}`}>{s.change}</div>}</div>))}</div>);
}

function UploadZone({ receipt, onFile, ocrData, uploading }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();
  
  if (ocrData) {
    return (<div><div style={{background:'var(--blue-bg)',border:'1px solid rgba(108,143,255,0.2)',borderRadius:'8px',padding:'14px',marginBottom:'12px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}><strong style={{color:'var(--text)'}}>✓ Receipt processed with OCR</strong></div>
      <table style={{width:'100%',fontSize:'12px'}}>
        <tbody>
          <tr><td style={{padding:'4px 0',color:'var(--text2)'}}>Amount:</td><td style={{fontWeight:500,color:'var(--text)'}}>{ocrData.parsed_amount?`${ocrData.parsed_currency||'USD'} ${ocrData.parsed_amount}`:'-'}</td></tr>
          {ocrData.parsed_date&&<tr><td style={{padding:'4px 0',color:'var(--text2)'}}>Date:</td><td style={{fontWeight:500,color:'var(--text)'}}>{ocrData.parsed_date}</td></tr>}
          {ocrData.parsed_vendor&&<tr><td style={{padding:'4px 0',color:'var(--text2)'}}>Vendor:</td><td style={{fontWeight:500,color:'var(--text)'}}>{ocrData.parsed_vendor}</td></tr>}
          <tr><td style={{padding:'4px 0',color:'var(--text2)'}}>Status:</td><td style={{fontWeight:500,color:'var(--green)'}}>{ocrData.status}</td></tr>
        </tbody>
      </table>
      {ocrData.raw_text&&<div style={{marginTop:'10px',fontSize:'11px',color:'var(--text3)',maxHeight:'100px',overflow:'auto',background:'var(--bg2)',padding:'8px',borderRadius:'4px'}}><em>«{ocrData.raw_text}...»</em></div>}
    </div></div>);
  }

  return (<><div className={`rf-upload-zone ${drag?'drag-over':''} ${uploading?'drag-over':''}`} onClick={()=>!uploading&&inputRef.current.click()} onDragOver={e=>{e.preventDefault();!uploading&&setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if(e.dataTransfer.files[0]&&!uploading)onFile(e.dataTransfer.files[0]);}}>
    <div className="rf-upload-icon">{uploading?'⏳':'📎'}</div>
    <p>{uploading?'Processing with OCR...':'Click to upload or drag & drop'}</p>
    <p className="rf-upload-hint">{uploading?'Please wait...':'PNG, JPG, GIF, BMP, TIFF — max 10 MB · OCR processes automatically'}</p>
  </div>
  <input ref={inputRef} type="file" style={{display:'none'}} accept="image/*" onChange={e=>{if(e.target.files[0])onFile(e.target.files[0]);}} disabled={uploading}/>
  </>);
}

/* ════════════════════════════════════════════════
   ROOT ENTRY POINT — wires Homepage → Login → App
════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'app'

  useEffect(() => {
    // Inject both style blocks
    const homeTag = document.createElement('style');
    homeTag.textContent = homepageStyles;
    document.head.appendChild(homeTag);

    const appTag = document.createElement('style');
    appTag.textContent = appStyles;
    document.head.appendChild(appTag);

    return () => {
      if (document.head.contains(homeTag)) document.head.removeChild(homeTag);
      if (document.head.contains(appTag)) document.head.removeChild(appTag);
    };
  }, []);

  if (view === 'home') {
    return <Homepage onEnterApp={() => setView('app')} />;
  }

  return <ReimburseFlowApp />;
}