import { HMS } from "./system.js";

export function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.getElementById("toast-container").appendChild(toast);
  setTimeout(() => toast.classList.add("toast-show"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showEksporModal(doc) {
  const modal = document.getElementById("ekspor-modal");
  document.getElementById("modal-no-doc").textContent = doc.noDoc;
  document.getElementById("modal-komoditas").textContent = doc.komoditas;
  document.getElementById("modal-berat").textContent = `${doc.beratKg} kg`;
  document.getElementById("modal-kualitas").textContent = doc.kualitas;
  document.getElementById("modal-petani").textContent = doc.petani;
  document.getElementById("modal-harga").textContent =
    `Rp ${doc.hargaEkspor.toLocaleString("id-ID")}`;
  document.getElementById("modal-tgl").textContent = doc.tanggalEkspor;
  document.getElementById("modal-dest").textContent = doc.destinasi;
  modal.classList.add("modal-open");
}

export function updateUndoBadge() {
  const badge = document.getElementById("undo-badge");
  if (badge) badge.textContent = HMS.undoStack.size();
}
