/* ============================================================
   Contact Form — EmailJS + Firestore
   Reuses the existing Firebase initialization from
   admin/firebase-config.js (no duplicate init).
   ============================================================ */
import { db } from "./admin/firebase-config.js";
import {
  collection, addDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

export const EMAILJS_PUBLIC_KEY = "kK7YVXV-9YGNu85ZH";
const EMAILJS_SERVICE_ID = "abdullahdevstudio-email";
const EMAILJS_TEMPLATE_ID = "mak-portfolio-mail-598";

// ── Load EmailJS SDK once ────────────────────────────────────
export function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve(window.emailjs);
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => resolve(window.emailjs);
    s.onerror = () => reject(new Error("Failed to load EmailJS SDK"));
    document.head.appendChild(s);
  });
}

// ── Validation ───────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateContactForm({ name, email, title, message }) {
  if (!name || name.length > 100) return "Please enter your name (max 100 characters).";
  if (!email || !EMAIL_RE.test(email) || email.length > 255) return "Please enter a valid email address.";
  if (!title || title.length > 150) return "Please enter a subject (max 150 characters).";
  if (!message || message.length > 2000) return "Please enter a message (max 2000 characters).";
  return null;
}

// ── EmailJS send ─────────────────────────────────────────────
async function sendContactMessage(data) {
  const emailjs = await loadEmailJS();
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    name: data.name,
    email: data.email,
    title: data.title,
    message: data.message,
  });
}

// ── Firestore save ───────────────────────────────────────────
function saveContactMessage(data) {
  return addDoc(collection(db, "messages"), {
    name: data.name,
    email: data.email,
    title: data.title,
    message: data.message,
    createdAt: serverTimestamp(),
    status: "unread",
  });
}

// ── UI helpers ───────────────────────────────────────────────
function showNotice(el, text, isError) {
  if (!el) return;
  el.style.display = "flex";
  el.querySelector("p").textContent = text;
  el.style.background = isError
    ? "color-mix(in srgb,#ef4444 10%,transparent)"
    : "color-mix(in srgb,var(--primary) 10%,transparent)";
  el.style.border = isError
    ? "1px solid color-mix(in srgb,#ef4444 30%,transparent)"
    : "1px solid color-mix(in srgb,var(--primary) 20%,transparent)";
  el.style.color = isError ? "#ef4444" : "var(--primary)";
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactTitle = document.getElementById("contact-title");
  const contactMessage = document.getElementById("contact-message");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const notice = document.getElementById("form-success");
  let submitting = false;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions

    const data = {
      name: contactName.value.trim(),
      email: contactEmail.value.trim(),
      title: contactTitle.value.trim(),
      message: contactMessage.value.trim(),
    };

    const error = validateContactForm(data);
    if (error) {
      showNotice(notice, error, true);
      return;
    }

    submitting = true;
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    notice.style.display = "none";

    // 1) Send through EmailJS first
    try {
      await sendContactMessage(data);
    } catch (err) {
      console.error("EmailJS send failed:", err);
      showNotice(notice, "Sorry, your message could not be sent. Please try again.", true);
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.textContent = originalLabel;
      return;
    }

    // 2) Save to Firestore after a successful email send
    try {
      await saveContactMessage(data);
    } catch (err) {
      console.error("Firestore save failed:", err);
      showNotice(
        notice,
        "Your message was sent, but it could not be saved to the dashboard. I still received it by email.",
        true
      );
      contactForm.reset();
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.textContent = originalLabel;
      return;
    }

    // 3) Both succeeded
    showNotice(
      notice,
      "Your message has been sent successfully. Thank you for reaching out.",
      false
    );
    contactForm.reset();
    submitting = false;
    submitBtn.disabled = false;
    submitBtn.style.opacity = "";
    submitBtn.textContent = originalLabel;
  });
});
