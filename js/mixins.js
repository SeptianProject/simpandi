export const BisaDiekspor = (Base) =>
  class extends Base {
    cetakDokumenEkspor() {
      if (this.kualitas.value !== "GRADE_A") {
        throw new Error(
          `Batch ${this.idBatch} tidak memenuhi syarat ekspor (bukan Grade A).`,
        );
      }
      return {
        noDoc: `EXP-${this.idBatch}-${Date.now()}`,
        komoditas: this.namaKomoditas,
        beratKg: this.beratKg,
        kualitas: this.kualitas.label,
        petani: this.namaPetani,
        tanggalEkspor: new Date().toLocaleDateString("id-ID"),
        hargaEkspor: this.hitungHargaJual() * 1.35,
        destinasi: this.destinasiEkspor || "Global Market",
        status: "SIAP EKSPOR",
      };
    }
  };
