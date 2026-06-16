import { HMS } from "../system.js";
import { showToast, updateUndoBadge } from "../helpers.js";
import { renderDashboard } from "./dashboard.ui.js";
import { renderBatchList } from "./batch.ui.js";
import { renderBSTSection } from "./search.ui.js";

export function renderUndoStack() {
  const container = document.getElementById("undo-history");
  if (!container) return;

  const history = HMS.undoStack.toArray();
  document.getElementById("undo-size").textContent =
    `${HMS.undoStack.size()} aktivitas terekam`;

  if (history.length === 0) {
    container.innerHTML =
      '<div class="empty-state-table">Sistem belum mencatat aktivitas operasional hari ini.</div>';
    return;
  }

  const formatType = (type) => {
    if (type === "TAMBAH_BATCH") return "Input Data Panen";
    if (type === "HAPUS_BATCH") return "Hapus Data Panen";
    if (type === "UPDATE_TRACKING") return "Pembaruan Rute Logistik";
    return type;
  };

  container.innerHTML = history
    .map(
      (aksi, i) => `
    <div class="p-16 mb-8 rounded flex-between" style="border:1px solid var(--gray-200); border-left: 4px solid ${i === 0 ? "var(--primary)" : "var(--gray-400)"}">
      <div>
        <div class="font-semibold text-sm mb-8">
          ${formatType(aksi.type)} 
          ${i === 0 ? '<span class="badge grade-grade-a" style="margin-left:8px; padding:2px 6px;">BISA DIBATALKAN</span>' : ""}
        </div>
        <div class="text-sm text-muted">${aksi.keterangan}</div>
      </div>
      <div class="text-xs text-muted font-mono">${aksi.timestamp.toLocaleTimeString("id-ID")}</div>
    </div>`,
    )
    .join("");
}

export function setupUndoUI() {
  document.getElementById("btn-undo")?.addEventListener("click", () => {
    const aksi = HMS.undoAksiTerakhir();
    if (!aksi) {
      showToast("Tidak ada aksi yang bisa dibatalkan saat ini.", "warning");
      return;
    }

    showToast(
      `↩Koreksi berhasil: ${aksi.keterangan} telah dibatalkan.`,
      "success",
    );

    renderUndoStack();
    renderBatchList();
    renderDashboard();
    renderBSTSection();
    updateUndoBadge();
  });
}
