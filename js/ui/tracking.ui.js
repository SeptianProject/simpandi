import { HMS } from "../system.js";
import { showToast, updateUndoBadge } from "../helpers.js";

export function renderTrackingOptions() {
  const sel = document.getElementById("tracking-batch-select");
  if (!sel) return;

  const batches = HMS.getAllBatches();
  sel.innerHTML =
    '<option value="">-- Pilih Batch --</option>' +
    batches
      .map(
        (b) =>
          `<option value="${b.idBatch}">${b.idBatch} - ${b.namaKomoditas}</option>`,
      )
      .join("");
}

export function loadTrackingDetail(idBatch) {
  const container = document.getElementById("tracking-timeline");
  if (!container || !idBatch) return;

  const tracker = HMS.trackers.get(idBatch);
  if (!tracker) {
    container.innerHTML =
      '<div class="empty-state-table">Tidak ada data tracking.</div>';
    return;
  }

  const nodes = tracker.bacaMaju();
  container.innerHTML = nodes
    .map(
      (n, i) => `
    <div class="timeline-item ${i === nodes.length - 1 ? "timeline-current" : ""}">
      <div class="timeline-dot"></div>
      <div class="timeline-lokasi">${n.lokasi}</div>
      <div class="text-sm text-muted mt-8">${n.keterangan}</div>
      <div class="text-xs text-muted font-mono" style="margin-top:4px">${n.timestamp.toLocaleString("id-ID")}</div>
    </div>`,
    )
    .join("");

  // DLL prev pointer (baca mundur)
  const mundur = tracker.bacaMundur();
  document.getElementById("tracking-mundur").textContent = mundur
    .map((n) => n.lokasi)
    .join(" ← ");
}

export function setupTrackingUI() {
  document
    .getElementById("tracking-batch-select")
    ?.addEventListener("change", (e) => {
      loadTrackingDetail(e.target.value);
    });

  document.getElementById("form-tracking")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = document.getElementById("tracking-batch-select").value;

    if (!id) {
      showToast("Pilih batch terlebih dahulu", "warning");
      return;
    }

    HMS.updateTracking(id, fd.get("lokasi"), fd.get("keterangan"));
    showToast(`📍 Tracking batch diperbarui`, "success");
    e.target.reset();

    loadTrackingDetail(id);
    updateUndoBadge();
  });
}
