/* ============================================================
   Abdullah Dev Studio — Vanilla JS App
   Handles: theme, language, typing, navbar, animations, form
   ============================================================ */

// ── Translations ─────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home', about: 'About', services: 'Services',
      projects: 'Projects', contact: 'Contact', downloadCV: 'Download CV',
    },
    hero: {
      greeting: "Hello, I'm",
      roles: [
        'Crafting Responsive Web Experiences',
        'Developing JavaScript-Powered Solutions',
        'Building Firebase-Integrated Applications',
        'Designing Accessible User Interfaces',
        'Engineering Clean, Maintainable Code',
      ],
      cta: 'View My Projects',
      downloadCV: 'Download CV',
    },
    about: {
      title: 'About Me',
      bio1: "I am a focused and passionate Frontend Developer dedicated to crafting precise, modern, and accessible web experiences. I approach development with a craftsman's mindset — believing that great interfaces are born from a deep understanding of core technologies like HTML, CSS, and JavaScript.",
      bio2: 'Beyond just assembling components, I strive to build intuitive applications that feel quietly electric and perform flawlessly across all devices. My toolbelt includes modern JS features, Firebase for powerful backend integrations, and an eye for meticulous UI/UX details.',
      educationTitle: 'Education & Training',
      skillsTitle: 'Skills & Technologies',
      edu: [
        { year: '2026', title: 'Web Development Training', place: 'Banoqabil Institute' },
        { year: '2026', title: 'Intermediate in Computer Science', place: 'College 5-L New Karachi' },
        { year: '2024', title: 'Matriculation in Computer Science', place: 'Little Flower Secondary School' },
      ],
    },
    services: {
      title: 'My Services',
      subtitle: 'I offer a comprehensive set of frontend development services to bring your digital ideas to life.',
      items: [
        { title: 'Responsive Web Design', desc: 'Pixel-perfect layouts that adapt flawlessly across all devices and screen sizes.' },
        { title: 'JavaScript Development', desc: 'Clean ES6+ logic, complex DOM manipulation, async/await, and event handling.' },
        { title: 'Firebase Integration', desc: 'Auth, Realtime Database, Firestore, and Hosting setup for dynamic web apps.' },
        { title: 'UI/UX Implementation', desc: 'Accessible, user-focused interfaces grounded in strong design fundamentals.' },
        { title: 'RESTful API Integration', desc: 'Connecting to Fetch API and third-party APIs for dynamic, data-driven experiences.' },
        { title: 'Git & Version Control', desc: 'Professional GitHub workflow including branching, merging, and pull requests.' },
      ],
    },
    projects: {
      title: 'Featured Projects',
      viewAll: 'View All Projects →',
      featured: 'Featured Project',
      comingSoon: 'Coming Soon',
      github: 'View on GitHub',
      demo: 'Live Demo',
      desc1: 'An AI-powered career guidance platform helping users identify suitable career paths based on interests and skill sets. Built mobile-first. Served 50+ test users.',
      desc2: 'Another exciting project is in the works. Focused on performance and modern UI/UX principles. Stay tuned for updates.',
      backHome: '← Back to Home',
      pageTitle: 'All Projects',
      pageSubtitle: "A collection of work I've built — from real-world applications to experimental ideas.",
    },
    contact: {
      title: 'Get In Touch',
      subtitle: "Got a project in mind? Let's build something great together. I'm open for new opportunities.",
      name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
      np: 'John Doe', ep: 'john@example.com', sp: 'How can I help you?', mp: 'Your message here…',
      send: 'Send Message', sent: 'Message Sent!',
      thanks: "Thanks for reaching out! I'll get back to you soon.",
      location: 'Location',
    },
    footer: {
      tagline: 'Building modern web experiences with a focus on clean code, precise design, and excellent performance.',
      quickLinks: 'Quick Links', coreTech: 'Core Tech',
      copyright: '© 2026 Abdullah Dev Studio. All rights reserved.',
    },
  },
  ur: {
    nav: {
      home: 'گھر', about: 'میرے بارے میں', services: 'خدمات',
      projects: 'پروجیکٹس', contact: 'رابطہ', downloadCV: 'سی وی ڈاؤنلوڈ',
    },
    hero: {
      greeting: 'السلام علیکم، میں ہوں',
      roles: [
        'جوابدہ ویب تجربات تخلیق کرنا',
        'جاوا اسکرپٹ سے بہترین حل بنانا',
        'فائر بیس ایپلیکیشنز تیار کرنا',
        'قابل رسائی یوزر انٹرفیس ڈیزائن کرنا',
        'صاف اور قابل برقرار کوڈ لکھنا',
      ],
      cta: 'میرے پروجیکٹس دیکھیں',
      downloadCV: 'سی وی ڈاؤنلوڈ کریں',
    },
    about: {
      title: 'میرے بارے میں',
      bio1: 'میں ایک پرعزم اور جذبہ مند فرنٹ اینڈ ڈویلپر ہوں جو درست، جدید اور قابل رسائی ویب تجربات بنانے میں مہارت رکھتا ہوں۔ میں ڈویلپمنٹ کو فنکار کی نظر سے دیکھتا ہوں — بہترین انٹرفیس HTML، CSS اور JavaScript کی گہری سمجھ سے پیدا ہوتے ہیں۔',
      bio2: 'صرف کمپوننٹس جوڑنے سے آگے، میں ایسی ایپلیکیشنز بناتا ہوں جو بدیہی محسوس ہوں اور تمام آلات پر بے عیب کام کریں۔',
      educationTitle: 'تعلیم اور تربیت',
      skillsTitle: 'مہارتیں اور ٹیکنالوجیز',
      edu: [
        { year: '2026', title: 'ویب ڈویلپمنٹ تربیت', place: 'Banoqabil Institute' },
        { year: '2026', title: 'انٹرمیڈیٹ (کمپیوٹر سائنس)', place: 'College 5-L New Karachi' },
        { year: '2024', title: 'میٹرک (کمپیوٹر سائنس)', place: 'Little Flower Secondary School' },
      ],
    },
    services: {
      title: 'میری خدمات',
      subtitle: 'میں آپ کے ڈیجیٹل خیالات کو حقیقت میں بدلنے کے لیے فرنٹ اینڈ ڈویلپمنٹ کی جامع خدمات پیش کرتا ہوں۔',
      items: [
        { title: 'ریسپانسو ویب ڈیزائن', desc: 'تمام آلات اور اسکرین سائز پر بے عیب کام کرنے والے پکسل پرفیکٹ لے آؤٹ۔' },
        { title: 'جاوا اسکرپٹ ڈویلپمنٹ', desc: 'صاف ES6+ کوڈ، DOM ہیرا پھیری، async/await اور ایونٹ ہینڈلنگ۔' },
        { title: 'فائر بیس انٹیگریشن', desc: 'Auth، Realtime Database، Firestore اور Hosting کی مکمل ترتیب۔' },
        { title: 'UI/UX نفاذ', desc: 'مضبوط ڈیزائن اصولوں پر مبنی قابل رسائی، یوزر کے لیے موافق انٹرفیس۔' },
        { title: 'RESTful API انٹیگریشن', desc: 'Fetch API اور تھرڈ پارٹی APIs سے ڈائنامک ڈیٹا پر مبنی تجربات۔' },
        { title: 'گٹ اور ورژن کنٹرول', desc: 'پیشہ ورانہ GitHub ورک فلو — برانچنگ، مرجنگ اور پل ریکوئسٹس۔' },
      ],
    },
    projects: {
      title: 'نمایاں پروجیکٹس',
      viewAll: 'تمام پروجیکٹس دیکھیں ←',
      featured: 'نمایاں پروجیکٹ',
      comingSoon: 'جلد آ رہا ہے',
      github: 'گٹ ہب پر دیکھیں',
      demo: 'لائیو ڈیمو',
      desc1: 'ایک AI پاور کردہ کیریئر گائیڈنس پلیٹ فارم جو صارفین کو مناسب کیریئر راستے تلاش کرنے میں مدد کرتا ہے۔ 50+ ٹیسٹ صارفین۔',
      desc2: 'ایک اور دلچسپ پروجیکٹ زیر تکمیل ہے۔ جدید UI/UX اصولوں پر توجہ مرکوز۔',
      backHome: '← گھر واپس',
      pageTitle: 'تمام پروجیکٹس',
      pageSubtitle: 'میرے بنائے ہوئے کاموں کا مجموعہ — حقیقی ایپلیکیشنز سے لے کر تجرباتی خیالات تک۔',
    },
    contact: {
      title: 'رابطہ کریں',
      subtitle: 'کوئی پروجیکٹ ذہن میں ہے؟ آئیں مل کر کچھ عمدہ بنائیں۔ میں نئے مواقع کے لیے دستیاب ہوں۔',
      name: 'نام', email: 'ای میل', subject: 'موضوع', message: 'پیغام',
      np: 'آپ کا نام', ep: 'آپ کی ای میل', sp: 'موضوع لکھیں', mp: 'اپنا پیغام یہاں لکھیں...',
      send: 'پیغام بھیجیں', sent: 'پیغام بھیجا گیا!',
      thanks: 'رابطہ کرنے کا شکریہ! میں جلد جواب دوں گا۔',
      location: 'مقام',
    },
    footer: {
      tagline: 'صاف کوڈ، درست ڈیزائن اور بہترین کارکردگی کے ساتھ جدید ویب تجربات بنانا۔',
      quickLinks: 'فوری روابط', coreTech: 'بنیادی ٹیکنالوجی',
      copyright: '© ۲۰۲۶ عبداللہ ڈیو اسٹوڈیو۔ جملہ حقوق محفوظ ہیں۔',
    },
  },
};

// ── State ─────────────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

// ── Helper: get nested key ────────────────────────────────────
function getKey(obj, path) {
  return path.split('.').reduce((acc, k) => acc && acc[k], obj);
}

// ── Theme ─────────────────────────────────────────────────────
function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // Update toggle icon
  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  const mIcon = document.getElementById('theme-icon-mobile');
  if (mIcon) mIcon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ── Language ──────────────────────────────────────────────────
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const isRTL = lang === 'ur';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  if (isRTL) document.documentElement.classList.add('urdu');
  else document.documentElement.classList.remove('urdu');

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getKey(TRANSLATIONS[lang], key);
    if (val !== undefined && typeof val === 'string') el.textContent = val;
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const val = getKey(TRANSLATIONS[lang], key);
    if (val) el.placeholder = val;
  });

  // Update lang toggle button text
  const langBtn = document.getElementById('lang-btn-text');
  if (langBtn) langBtn.textContent = lang === 'en' ? 'اردو' : 'EN';
  const langBtnM = document.getElementById('lang-btn-text-mobile');
  if (langBtnM) langBtnM.textContent = lang === 'en' ? 'اردو' : 'EN';

  // Typing roles update
  if (window._typingInstance) window._typingInstance.updateRoles(TRANSLATIONS[lang].hero.roles);
}

function toggleLanguage() {
  applyLanguage(currentLang === 'en' ? 'ur' : 'en');
}

// ── Typing Animation ──────────────────────────────────────────
class TypingAnimation {
  constructor(elementId, roles, speed = 70, deleteSpeed = 40, pauseMs = 2200) {
    this.el = document.getElementById(elementId);
    this.roles = roles;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseMs = pauseMs;
    this.roleIdx = 0;
    this.charIdx = 0;
    this.isDeleting = false;
    this.timer = null;
    if (this.el) this.tick();
  }
  updateRoles(roles) {
    this.roles = roles;
    this.roleIdx = 0;
    this.charIdx = 0;
    this.isDeleting = false;
    clearTimeout(this.timer);
    this.tick();
  }
  tick() {
    if (!this.el) return;
    const role = this.roles[this.roleIdx];
    if (!this.isDeleting) {
      this.el.textContent = role.substring(0, this.charIdx + 1);
      this.charIdx++;
      if (this.charIdx === role.length) {
        this.isDeleting = true;
        this.timer = setTimeout(() => this.tick(), this.pauseMs);
        return;
      }
    } else {
      this.el.textContent = role.substring(0, this.charIdx - 1);
      this.charIdx--;
      if (this.charIdx === 0) {
        this.isDeleting = false;
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      }
    }
    this.timer = setTimeout(() => this.tick(), this.isDeleting ? this.deleteSpeed : this.speed);
  }
}

// ── Scroll Animations (IntersectionObserver) ──────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

  // Stagger children
  document.querySelectorAll('.stagger').forEach(container => {
    container.querySelectorAll('.fade-up, .fade-in').forEach(child => observer.observe(child));
  });
}

// ── Mobile Menu ───────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const openIcon = document.getElementById('menu-icon-open');
  const closeIcon = document.getElementById('menu-icon-close');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    if (openIcon) openIcon.style.display = isOpen ? 'none' : 'block';
    if (closeIcon) closeIcon.style.display = isOpen ? 'block' : 'none';
  });
  // Close on nav link click
  menu.querySelectorAll('a, button[data-scroll]').forEach(el => {
    el.addEventListener('click', () => {
      menu.classList.remove('open');
      if (openIcon) openIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    });
  });
}

// ── Smooth Scroll ─────────────────────────────────────────────
function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function initNavLinks() {
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo(el.getAttribute('data-scroll'));
    });
  });
}

// ── Active nav link highlight ─────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('text-primary'));
        const active = document.querySelector(`.nav-link[data-scroll="#${entry.target.id}"]`);
        if (active) active.classList.add('text-primary');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
}

// ── Contact Form ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.style.display = 'flex';
  });
}

//  ── Initializing Email JS ——————————————————————————————————————————————
emailjs.init({
  publicKey: "kK7YVXV-9YGNu85ZH"
});

//  ── Form with Email Js  ───────────────

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;

  try {
    await emailjs.send(
      "abdullahdevstudio-email",
      "template-contact598",
      {
        name: name,
        title: title,
        message: message
      }
    );

    alert("Message sent successfully!");
    contactForm.reset();

  } catch (error) {
    console.error("EmailJS Error:", error);
    alert("Failed to send message. Please try again.");
  }
});

// ── SVG Icons ─────────────────────────────────────────────────
const ICONS = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  lang: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  mappin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrowleft: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  arrowright: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  printer: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
};

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  initScrollAnimations();
  initMobileMenu();
  initNavLinks();
  initActiveNav();
  initContactForm();

  // Theme toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Lang toggle buttons
  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleLanguage);
  });

  // Typing
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    window._typingInstance = new TypingAnimation(
      'typing-text',
      TRANSLATIONS[currentLang].hero.roles
    );
  }
});

