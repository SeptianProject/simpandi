import { HMS } from "../system.js";
import { showToast, showEksporModal, updateUndoBadge } from "../helpers.js";
import { renderDashboard } from "./dashboard.ui.js";

export function renderBatchList(filter = "") {
  let batches = HMS.getAllBatches();
  if (filter) {
    const f = filter.toLowerCase();
    batches = batches.filter(
      (b) =>
        b.idBatch.toLowerCase().includes(f) ||
        b.namaPetani.toLowerCase().includes(f),
    );
  }
  const tbody = document.getElementById("batch-tbody");
  if (!tbody) return;
  tbody.innerHTML = batches.length
    ? batches
        .map(
          (b) => `
    <tr>
      <td><span class="batch-id">${b.idBatch}</span></td>
      <td>${b.namaKomoditas}</td>
      <td>${b.beratKg} kg</td>
      <td>${b.namaPetani}</td>
      <td><span class="badge grade-${b.kualitas.value.toLowerCase().replace("_", "-")}">${b.kualitas.label}</span></td>
      <td class="font-mono text-primary font-semibold">Rp ${b.hitungHargaJual().toLocaleString("id-ID")}</td>
      <td>
        <div class="action-btns">
          ${b.kualitas.value === "GRADE_A" ? `<button class="btn btn-sm btn-ekspor" onclick="window.handleEkspor('${b.idBatch}')">Ekspor</button>` : ""}
          <button class="btn btn-sm btn-delete" onclick="window.handleDelete('${b.idBatch}')">Hapus</button>
        </div>
      </td>
    </tr>`,
        )
        .join("")
    : `<tr><td colspan="7" class="empty-state-table">Tidak ada data</td></tr>`;

  document.getElementById("batch-count").textContent =
    `${batches.length} batch`;
}

export function setupBatchUI() {
  document
    .getElementById("batch-search")
    ?.addEventListener("input", (e) => renderBatchList(e.target.value));

  const komoditasSelect = document.getElementById("form-komoditas");
  const toggleKomo = (v) => {
    document.getElementById("kopi-fields").style.display =
      v === "kopi" ? "block" : "none";
    document.getElementById("bng-fields").style.display =
      v === "buah_naga" ? "block" : "none";
  };
  komoditasSelect?.addEventListener("change", (e) =>
    toggleKomo(e.target.value),
  );

  document.getElementById("form-batch")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      HMS.tambahBatch(
        fd.get("komoditas"),
        parseFloat(fd.get("berat")),
        fd.get("petani"),
        fd.get("kualitas"),
        {
          kadarAir: parseFloat(fd.get("kadar_air")),
          ukuranRerata: fd.get("ukuran"),
          lokasiKebun: fd.get("lokasi"),
          catatan: fd.get("catatan"),
        },
      );
      showToast("✅ Batch berhasil ditambahkan!", "success");
      e.target.reset();
      toggleKomo(komoditasSelect.value);
      renderBatchList();
      renderDashboard();
      updateUndoBadge();
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    }
  });

  // Assign global function for inline HTML handlers
  window.handleDelete = (id) => {
    if (!confirm(`Hapus batch ${id}?`)) return;
    HMS.hapusBatch(id);
    showToast(`🗑 Batch ${id} dihapus.`, "warning");
    renderBatchList();
    renderDashboard();
    updateUndoBadge();
  };

  window.handleEkspor = (id) => {
    try {
      showEksporModal(HMS.cetakEkspor(id));
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    }
  };
}
