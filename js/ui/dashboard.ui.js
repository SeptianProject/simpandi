import { HMS } from "../system.js";

export function renderDashboard() {
  const stats = HMS.getStatistik();
  const el = (id) => document.getElementById(id);

  el("stat-total-batch").textContent = stats.totalBatch;
  el("stat-total-kg").textContent =
    `${stats.totalKg.toLocaleString("id-ID")} kg`;
  el("stat-total-nilai").textContent =
    `Rp ${(stats.totalNilai / 1000000).toFixed(1)}Jt`;
  el("stat-truk").textContent = stats.trukMenunggu;

  const total = stats.totalBatch || 1;
  ["a", "b", "r"].forEach((g, i) => {
    const key = ["GRADE_A", "GRADE_B", "REJECT"][i];
    const val = stats.byKualitas[key];
    el(`grade-${g}-val`).textContent = val;
    el(`grade-${g}-pct`).textContent = `${((val / total) * 100).toFixed(1)}%`;
    el(`bar-grade-${g}`).style.width = `${(val / total) * 100}%`;
  });

  const kopi = stats.byKomoditas["Kopi Robusta"] || 0;
  const bng = stats.byKomoditas["Buah Naga"] || 0;
  const maxBar = Math.max(kopi, bng, 1);
  el("bar-kopi").style.width = `${(kopi / maxBar) * 100}%`;
  el("bar-bng").style.width = `${(bng / maxBar) * 100}%`;

  const recent = HMS.getAllBatches().slice(-5).reverse();
  const tbody = el("recent-tbody");
  tbody.innerHTML = recent.length
    ? recent
        .map(
          (b) => `
    <tr>
      <td><span class="batch-id">${b.idBatch}</span></td>
      <td>${b.namaKomoditas}</td>
      <td>${b.beratKg} kg</td>
      <td><span class="badge grade-${b.kualitas.value.toLowerCase().replace("_", "-")}">${b.kualitas.label}</span></td>
      <td class="font-mono text-primary font-semibold">Rp ${b.hitungHargaJual().toLocaleString("id-ID")}</td>
    </tr>`,
        )
        .join("")
    : `<tr><td colspan="5" class="empty-state-table">Tidak ada data</td></tr>`;
}
