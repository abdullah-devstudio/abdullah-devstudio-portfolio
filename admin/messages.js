import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { loadEmailJS, EMAILJS_PUBLIC_KEY } from "../contact.js";

const EMAILJS_SERVICE_ID = "abdullahdevstudio-email";
const EMAILJS_REPLY_TEMPLATE_ID = "mak-portfolio-reply-598";

const messagesList = document.getElementById("messages-list");
const messagesCount = document.getElementById("messages-count");
const messagesFeedback = document.getElementById("messages-feedback");
const messageSearch = document.getElementById("message-search");

const modal = document.getElementById("message-modal");
const modalTitle = document.getElementById("message-modal-title");
const modalName = document.getElementById("message-modal-name");
const modalEmail = document.getElementById("message-modal-email");
const modalDate = document.getElementById("message-modal-date");
const modalStatus = document.getElementById("message-modal-status");
const modalBody = document.getElementById("message-modal-body");
const modalToggleRead = document.getElementById("message-modal-toggle-read");
const modalDelete = document.getElementById("message-modal-delete");
const modalClose = document.getElementById("message-modal-close");
const replyToggle = document.getElementById("message-modal-reply-toggle");
const replyForm = document.getElementById("message-modal-reply-form");
const replyText = document.getElementById("message-modal-reply-text");
const replyStatus = document.getElementById("message-modal-reply-status");
const replySend = document.getElementById("message-modal-reply-send");

let messages = [];
let activeMessage = null;
let confirmDelete = false;
let busy = false;
let sendingReply = false;

function setReplyStatus(message, type = "success") {
  if (!replyStatus) return;
  if (!message) {
    replyStatus.textContent = "";
    replyStatus.hidden = true;
    delete replyStatus.dataset.type;
    return;
  }
  replyStatus.textContent = message;
  replyStatus.dataset.type = type;
  replyStatus.hidden = false;
}

function resetReplyState() {
  if (replyForm) replyForm.hidden = true;
  if (replyToggle) {
    replyToggle.textContent = "Reply";
    replyToggle.setAttribute("aria-expanded", "false");
  }
  if (replyText) replyText.value = "";
  if (replySend) {
    replySend.disabled = false;
    replySend.textContent = "Send Reply";
  }
  setReplyStatus("");
}

async function sendReply() {
  if (!activeMessage || sendingReply) return;
  const replyMessage = replyText?.value.trim() || "";
  if (!replyMessage) {
    setReplyStatus("Please write a reply before sending.", "error");
    return;
  }

  sendingReply = true;
  setReplyStatus("");
  if (replySend) {
    replySend.disabled = true;
    replySend.textContent = "Sending…";
  }

  try {
    const emailjs = await loadEmailJS();
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_REPLY_TEMPLATE_ID, {
      name: activeMessage.name || "",
      email: activeMessage.email || "",
      title: activeMessage.title || "",
      message: activeMessage.message || "",
      reply_message: replyMessage
    });
    if (replyText) replyText.value = "";
    setReplyStatus("Reply sent successfully.", "success");
    if (replySend) {
      replySend.disabled = false;
      replySend.textContent = "Send Reply";
    }
  } catch (error) {
    console.error("Reply could not be sent.", error);
    setReplyStatus("Reply could not be sent. Please try again.", "error");
    if (replySend) {
      replySend.disabled = false;
      replySend.textContent = "Send Reply";
    }
  } finally {
    sendingReply = false;
  }
}

function setFeedback(message, type = "success") {
  if (!messagesFeedback) return;
  messagesFeedback.textContent = message;
  messagesFeedback.dataset.type = type;
  messagesFeedback.hidden = false;
}

function clearFeedback() {
  if (!messagesFeedback) return;
  messagesFeedback.textContent = "";
  messagesFeedback.hidden = true;
  delete messagesFeedback.dataset.type;
}

function formatDateTime(timestamp) {
  if (!timestamp) return "Just now";
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function isUnread(message) {
  return message.status !== "read";
}

function updateUnreadBadge(count) {
  const badge = document.getElementById("messages-nav-badge");
  if (!badge) return;
  badge.textContent = String(count);
  badge.hidden = count <= 0;

  const statCount = document.getElementById("dashboard-messages-count");
  const statStatus = document.getElementById("dashboard-messages-status");
  if (statCount) statCount.textContent = String(count);
  if (statStatus) statStatus.textContent = count === 1 ? "1 unread · Connected" : `${count} unread · Connected`;
}

export async function refreshUnreadBadge() {
  try {
    const unreadQuery = query(collection(db, "messages"), where("status", "==", "unread"));
    const snapshot = await getDocs(unreadQuery);
    updateUnreadBadge(snapshot.size);
  } catch (error) {
    console.error("Unread message count could not be loaded.", error);
    const statStatus = document.getElementById("dashboard-messages-status");
    if (statStatus) statStatus.textContent = "Connected";
  }
}

function createStatusPill(unread) {
  const pill = document.createElement("span");
  pill.className = `project-status-pill ${unread ? "project-status-pill--featured" : "project-status-pill--muted"}`;
  pill.textContent = unread ? "Unread" : "Read";
  return pill;
}

function createMessageCard(message) {
  const card = document.createElement("article");
  card.className = "message-card";
  if (isUnread(message)) card.classList.add("message-card--unread");

  const body = document.createElement("div");
  body.className = "message-card__body";

  const headingRow = document.createElement("div");
  headingRow.className = "message-card__heading";
  const title = document.createElement("h3");
  title.textContent = message.title || "(No subject)";
  headingRow.append(title, createStatusPill(isUnread(message)));

  const sender = document.createElement("p");
  sender.className = "message-card__sender";
  sender.textContent = `${message.name || "Unknown sender"} · ${message.email || "no email"}`;

  const preview = document.createElement("p");
  preview.className = "message-card__preview";
  preview.textContent = message.message || "";

  const meta = document.createElement("p");
  meta.className = "message-card__meta";
  meta.textContent = formatDateTime(message.createdAt);

  const actions = document.createElement("div");
  actions.className = "message-card__actions";

  const viewButton = document.createElement("button");
  viewButton.className = "secondary-action";
  viewButton.type = "button";
  viewButton.textContent = "View";
  viewButton.addEventListener("click", () => openMessage(message));

  const toggleButton = document.createElement("button");
  toggleButton.className = "secondary-action";
  toggleButton.type = "button";
  toggleButton.textContent = isUnread(message) ? "Mark read" : "Mark unread";
  toggleButton.addEventListener("click", () => toggleRead(message));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-action";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    openMessage(message);
    startDeleteConfirm();
  });

  actions.append(viewButton, toggleButton, deleteButton);
  body.append(headingRow, sender, preview, meta, actions);
  card.append(body);
  return card;
}

function renderMessages() {
  if (!messagesList || !messagesCount) return;
  const searchTerm = messageSearch?.value.trim().toLowerCase() || "";
  const filtered = messages.filter((message) => {
    if (!searchTerm) return true;
    return [message.name, message.email, message.title, message.message]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);
  });

  const unreadCount = messages.filter(isUnread).length;
  updateUnreadBadge(unreadCount);
  const base = `${messages.length} message${messages.length === 1 ? "" : "s"} · ${unreadCount} unread`;
  messagesCount.textContent = searchTerm
    ? `${filtered.length} of ${messages.length} message${messages.length === 1 ? "" : "s"}`
    : base;

  messagesList.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "projects-empty";
    const heading = document.createElement("h3");
    heading.textContent = messages.length ? "No matching messages" : "No messages yet";
    const text = document.createElement("p");
    text.textContent = messages.length
      ? "Try a different search term."
      : "Messages sent through the public contact form will appear here.";
    empty.append(heading, text);
    messagesList.append(empty);
    return;
  }

  filtered.forEach((message) => messagesList.append(createMessageCard(message)));
}

async function loadMessages() {
  if (!messagesList) return;
  messagesList.replaceChildren();
  const loading = document.createElement("div");
  loading.className = "projects-loading";
  loading.textContent = "Loading messages…";
  messagesList.append(loading);

  try {
    const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(messagesQuery);
    messages = snapshot.docs.map((messageDocument) => ({
      id: messageDocument.id,
      ...messageDocument.data()
    }));
    renderMessages();
  } catch (error) {
    console.error("Messages could not be loaded.", error);
    messages = [];
    if (messagesCount) messagesCount.textContent = "Unable to load";
    messagesList.replaceChildren();
    const errorState = document.createElement("div");
    errorState.className = "projects-empty projects-empty--error";
    const heading = document.createElement("h3");
    heading.textContent = "Messages could not be loaded";
    const text = document.createElement("p");
    text.textContent = "Please refresh the page and try again.";
    errorState.append(heading, text);
    messagesList.append(errorState);
    setFeedback("Unable to load messages. Please refresh and try again.", "error");
  }
}

function syncModal() {
  if (!activeMessage) return;
  const unread = isUnread(activeMessage);
  if (modalTitle) modalTitle.textContent = activeMessage.title || "(No subject)";
  if (modalName) modalName.textContent = activeMessage.name || "Unknown sender";
  if (modalEmail) modalEmail.textContent = activeMessage.email || "no email";
  if (modalEmail) modalEmail.href = activeMessage.email ? `mailto:${activeMessage.email}` : "#";
  if (modalDate) modalDate.textContent = formatDateTime(activeMessage.createdAt);
  if (modalStatus) modalStatus.textContent = unread ? "Unread" : "Read";
  if (modalBody) modalBody.textContent = activeMessage.message || "";
  if (modalToggleRead) modalToggleRead.textContent = unread ? "Mark as read" : "Mark as unread";
}

function openMessage(message) {
  activeMessage = message;
  confirmDelete = false;
  resetReplyState();
  if (modalDelete) {
    modalDelete.textContent = "Delete";
    modalDelete.classList.remove("is-confirming");
  }
  syncModal();
  if (modal) {
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }
}

function closeMessage() {
  activeMessage = null;
  confirmDelete = false;
  resetReplyState();
  if (modal) modal.hidden = true;
  document.body.classList.remove("modal-open");
}

async function toggleRead(message) {
  if (busy) return;
  busy = true;
  clearFeedback();
  const nextStatus = isUnread(message) ? "read" : "unread";
  try {
    await updateDoc(doc(db, "messages", message.id), { status: nextStatus });
    message.status = nextStatus;
    renderMessages();
    if (activeMessage?.id === message.id) syncModal();
  } catch (error) {
    console.error("Message status could not be updated.", error);
    setFeedback("Could not update the message status. Please try again.", "error");
  } finally {
    busy = false;
  }
}

function startDeleteConfirm() {
  confirmDelete = true;
  if (modalDelete) {
    modalDelete.textContent = "Confirm delete?";
    modalDelete.classList.add("is-confirming");
  }
}

async function deleteActiveMessage() {
  if (!activeMessage || busy) return;
  busy = true;
  clearFeedback();
  const deletingId = activeMessage.id;
  if (modalDelete) {
    modalDelete.disabled = true;
    modalDelete.textContent = "Deleting…";
  }
  try {
    await deleteDoc(doc(db, "messages", deletingId));
    messages = messages.filter((message) => message.id !== deletingId);
    closeMessage();
    renderMessages();
    setFeedback("Message deleted.");
  } catch (error) {
    console.error("Message could not be deleted.", error);
    setFeedback("Could not delete the message. Please try again.", "error");
    confirmDelete = false;
    if (modalDelete) {
      modalDelete.textContent = "Delete";
      modalDelete.classList.remove("is-confirming");
    }
  } finally {
    busy = false;
    if (modalDelete) modalDelete.disabled = false;
  }
}

export function initMessagesCMS() {
  messageSearch?.addEventListener("input", renderMessages);

  modalClose?.addEventListener("click", closeMessage);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeMessage();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeMessage) closeMessage();
  });

  modalToggleRead?.addEventListener("click", () => {
    if (activeMessage) toggleRead(activeMessage);
  });

  replyToggle?.addEventListener("click", () => {
    if (!replyForm) return;
    const opening = replyForm.hidden;
    replyForm.hidden = !opening;
    replyToggle.textContent = opening ? "Hide reply" : "Reply";
    replyToggle.setAttribute("aria-expanded", String(opening));
    if (opening) {
      setReplyStatus("");
      replyText?.focus();
    }
  });

  replySend?.addEventListener("click", sendReply);

  modalDelete?.addEventListener("click", () => {
    if (!confirmDelete) {
      startDeleteConfirm();
      return;
    }
    deleteActiveMessage();
  });

  loadMessages();
}
