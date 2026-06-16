import { HMS } from "../system.js";
import { showToast } from "../helpers.js";
import { renderDashboard } from "./dashboard.ui.js";

export function renderQueue() {
  const container = document.getElementById("queue-list");
  if (!container) return;

  const antrian = HMS.trukQueue.toArray();

  if (antrian.length === 0) {
    container.innerHTML =
      '<div class="empty-state-table">Tidak ada truk dalam antrian</div>';
    document.getElementById("queue-count").textContent = "0 menunggu";
    return;
  }

  container.innerHTML = antrian
    .map(
      (truk, i) => `
    <div class="truk-card ${i === 0 ? "truk-first" : ""}">
      <div class="truk-info">
        <div class="truk-plat">${truk.platNomor} ${i === 0 ? '<span class="badge grade-grade-a" style="margin-left:8px">SEKARANG</span>' : ""}</div>
        <div class="truk-detail">
          <span>👤 ${truk.supir}</span>
          <span>⚖️ ${truk.kapasitasKg.toLocaleString("id-ID")} kg</span>
          <span>🕐 ${truk.waktuMasuk.toLocaleTimeString("id-ID")}</span>
        </div>
      </div>
      <div style="text-align: right">
        <div class="text-sm text-muted">Estimasi Tunggu</div>
        <div class="wait-time">${HMS.trukQueue.estimasiTunggu(i)}m</div>
      </div>
    </div>`,
    )
    .join("");

  document.getElementById("queue-count").textContent =
    `${antrian.length} menunggu`;
}

export function setupQueueUI() {
  document.getElementById("form-truk")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const truk = HMS.daftarkanTruk(
      fd.get("plat"),
      parseFloat(fd.get("kapasitas")),
      fd.get("supir"),
    );

    showToast(`🚛 Truk ${truk.platNomor} masuk antrean`, "success");
    e.target.reset();
    renderQueue();
    renderDashboard();
  });

  document
    .getElementById("btn-proses-antrian")
    ?.addEventListener("click", () => {
      const truk = HMS.prosesAntrian();
      if (!truk) {
        showToast("Antrean kosong!", "warning");
        return;
      }
      showToast(
        `✅ Truk ${truk.platNomor} mulai proses bongkar muat`,
        "success",
      );
      renderQueue();
      renderDashboard();
    });
}
