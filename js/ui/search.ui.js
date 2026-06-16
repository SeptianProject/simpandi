import { HMS } from "../system.js";

export function renderBSTSection() {
  const elSize = document.getElementById("bst-size");
  const container = document.getElementById("bst-visual");
  if (!elSize || !container) return;

  elSize.textContent = `${HMS.batchBST.size} dokumen`;

  const lines = HMS.batchBST.toVisualTree();
  if (lines.length === 0) {
    container.innerHTML =
      '<div class="text-muted">Indeks data kosong. Silakan catat panen terlebih dahulu.</div>';
    return;
  }

  // Visualisasi disederhanakan, tidak memusingkan user awam
  container.innerHTML = lines
    .map(
      (l) => `
    <div class="bst-node" style="padding-left:${l.level * 24}px; padding-bottom: 4px;">
      <span class="text-muted" style="margin-right:8px">↳</span>
      <span class="bst-id-badge" style="background:var(--gray-200); padding:2px 6px; border-radius:4px; font-size:12px;">${l.id}</span>
    </div>`,
    )
    .join("");
}

export function setupSearchUI() {
  const searchInput = document.getElementById("bst-search-input");
  const searchBtn = document.getElementById("bst-search-btn");
  const resEl = document.getElementById("bst-result");

  const doSearch = () => {
    const query = searchInput.value.trim().toUpperCase();
    if (!query) return;

    const result = HMS.cariBatch(query);

    if (result.found) {
      const b = result.found;
      resEl.innerHTML = `
        <div class="bg-light rounded mt-16 p-16" style="border-left: 4px solid var(--primary)">
          <div class="font-semibold text-primary mb-8">✅ Data berhasil ditarik dari arsip</div>
          <div class="text-sm">
            <div class="mb-8"><strong>ID Registrasi:</strong> <span class="font-mono">${b.idBatch}</span></div>
            <div class="mb-8"><strong>Komoditas:</strong> ${b.namaKomoditas} (${b.beratKg} kg)</div>
            <div class="mb-8"><strong>Mitra Petani:</strong> ${b.namaPetani}</div>
            <div class="mb-8"><strong>Status:</strong> ${b.kualitas.label}</div>
            <div><strong>Estimasi Nilai:</strong> Rp ${b.hitungHargaJual().toLocaleString("id-ID")}</div>
          </div>
        </div>`;
    } else {
      resEl.innerHTML = `
        <div class="rounded mt-16 p-16" style="background:#FFEBEE; color:#C62828">
          ❌ Dokumen dengan ID <strong>"${query}"</strong> tidak ditemukan di database.
        </div>`;
    }
  };

  searchBtn?.addEventListener("click", doSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });
}
