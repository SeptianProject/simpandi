import { HMS } from "./system.js";
import { updateUndoBadge } from "./helpers.js";
import { renderDashboard } from "./ui/dashboard.ui.js";
import { renderBatchList, setupBatchUI } from "./ui/batch.ui.js";
import { renderQueue, setupQueueUI } from "./ui/queue.ui.js";
import { renderBSTSection, setupSearchUI } from "./ui/search.ui.js";
import { renderTrackingOptions, setupTrackingUI } from "./ui/tracking.ui.js";
import { renderUndoStack, setupUndoUI } from "./ui/undo.ui.js";

document.addEventListener("DOMContentLoaded", () => {
  HMS.tambahBatch("kopi", 250, "Pak Slamet", "GRADE_A");
  HMS.tambahBatch("buah_naga", 120, "Bu Rina", "GRADE_B");
  HMS.undoStack.clear();

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section-page");

  function showSection(id) {
    sections.forEach((s) => s.classList.toggle("active", s.id === id));
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.dataset.section === id),
    );

    if (id === "dashboard") renderDashboard();
    if (id === "batch") renderBatchList();
    if (id === "queue") renderQueue();
    if (id === "tracking") renderTrackingOptions();
    if (id === "search") renderBSTSection();
    if (id === "undo") renderUndoStack();
  }

  navLinks.forEach((l) =>
    l.addEventListener("click", () => showSection(l.dataset.section)),
  );

  setupBatchUI();
  setupQueueUI();
  setupSearchUI();
  setupTrackingUI();
  setupUndoUI();

  showSection("dashboard");
  updateUndoBadge();
});
