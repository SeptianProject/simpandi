import { BatchBST } from "./structures/bst.js";
import { TrukQueue } from "./structures/queue.js";
import { UndoStack } from "./structures/stack.js";
import { BatchTracker } from "./structures/linkedlist.js";
import { KualitasPanen } from "./enums.js";
import { KopiRobusta, BuahNaga } from "./models.js";

class HarvestManagementSystem {
  constructor() {
    this.batchBST = new BatchBST();
    this.trukQueue = new TrukQueue();
    this.undoStack = new UndoStack();
    this.trackers = new Map();
    this.allBatches = new Map();
    this._batchCounter = 1000;
  }

  generateBatchId(prefix = "BWI") {
    return `${prefix}-${++this._batchCounter}`;
  }

  tambahBatch(komoditas, beratKg, namaPetani, kualitasKey, extras = {}) {
    const id = this.generateBatchId(komoditas === "kopi" ? "KPI" : "BNG");
    const kualitas = KualitasPanen[kualitasKey] || KualitasPanen.GRADE_B;
    let batch =
      komoditas === "kopi"
        ? new KopiRobusta(
            id,
            beratKg,
            namaPetani,
            kualitas,
            extras.kadarAir || 12,
          )
        : new BuahNaga(
            id,
            beratKg,
            namaPetani,
            kualitas,
            extras.ukuranRerata || "MEDIUM",
          );

    batch.lokasiKebun = extras.lokasiKebun || "";
    batch.catatan = extras.catatan || "";

    this.batchBST.insert(batch);
    this.allBatches.set(id, batch);

    const tracker = new BatchTracker(id);
    tracker.tambahLokasi(
      "Kebun Petani",
      `Panen oleh ${namaPetani} - ${beratKg} kg`,
    );
    this.trackers.set(id, tracker);

    this.undoStack.push({
      type: "TAMBAH_BATCH",
      data: batch.toJSON(),
      keterangan: `Tambah batch ${id}`,
    });
    return batch;
  }

  hapusBatch(idBatch) {
    const batch = this.allBatches.get(idBatch);
    if (!batch) return false;
    this.undoStack.push({
      type: "HAPUS_BATCH",
      data: batch.toJSON(),
      keterangan: `Hapus batch ${idBatch}`,
    });
    this.batchBST.delete(idBatch);
    this.allBatches.delete(idBatch);
    return true;
  }

  undoAksiTerakhir() {
    const aksi = this.undoStack.pop();
    if (!aksi) return null;
    if (aksi.type === "HAPUS_BATCH") {
      const d = aksi.data;
      const k = KualitasPanen[d.kualitas];
      const batch =
        d.namaKomoditas === "Kopi Robusta"
          ? new KopiRobusta(d.idBatch, d.beratKg, d.namaPetani, k)
          : new BuahNaga(d.idBatch, d.beratKg, d.namaPetani, k);
      this.batchBST.insert(batch);
      this.allBatches.set(d.idBatch, batch);
    } else if (aksi.type === "TAMBAH_BATCH") {
      this.batchBST.delete(aksi.data.idBatch);
      this.allBatches.delete(aksi.data.idBatch);
    }
    return aksi;
  }

  cariBatch(idBatch) {
    return this.batchBST.search(idBatch);
  }

  updateTracking(idBatch, lokasi, keterangan) {
    const tracker = this.trackers.get(idBatch);
    if (!tracker) return null;
    const node = tracker.tambahLokasi(lokasi, keterangan);
    this.undoStack.push({
      type: "UPDATE_TRACKING",
      data: { idBatch, lokasi, keterangan },
      keterangan: `Update tracking ${idBatch} → ${lokasi}`,
    });
    return node;
  }

  daftarkanTruk(plat, kap, supir) {
    return this.trukQueue.enqueue(plat, kap, supir);
  }
  prosesAntrian() {
    return this.trukQueue.dequeue();
  }
  cetakEkspor(idBatch) {
    const batch = this.allBatches.get(idBatch);
    if (!batch) throw new Error(`Batch ${idBatch} tidak ditemukan.`);
    return batch.cetakDokumenEkspor();
  }

  getStatistik() {
    const batches = Array.from(this.allBatches.values());
    const byKualitas = { GRADE_A: 0, GRADE_B: 0, REJECT: 0 };
    const byKomoditas = { "Kopi Robusta": 0, "Buah Naga": 0 };
    batches.forEach((b) => {
      byKualitas[b.kualitas.value]++;
      byKomoditas[b.namaKomoditas] = (byKomoditas[b.namaKomoditas] || 0) + 1;
    });

    return {
      totalBatch: batches.length,
      totalKg: batches.reduce((s, b) => s + b.beratKg, 0),
      totalNilai: batches.reduce((s, b) => s + b.hitungHargaJual(), 0),
      byKualitas,
      byKomoditas,
      trukMenunggu: this.trukQueue.size(),
    };
  }

  getAllBatches() {
    return this.batchBST.inOrder();
  }
}

export const HMS = new HarvestManagementSystem();
