import { KualitasPanen } from "./enums.js";
import { BisaDiekspor } from "./mixins.js";

export class HasilPanen {
  #idBatch;
  #beratKg;
  #timestamp;

  constructor(idBatch, beratKg, namaPetani, kualitas = KualitasPanen.GRADE_B) {
    if (new.target === HasilPanen)
      throw new Error("Abstract class tidak bisa diinstansiasi.");
    if (!idBatch || typeof beratKg !== "number" || beratKg <= 0)
      throw new Error("Input tidak valid.");

    this.#idBatch = idBatch;
    this.#beratKg = beratKg;
    this.#timestamp = new Date();
    this.namaPetani = namaPetani || "Tidak Diketahui";
    this.kualitas = kualitas;
    this.lokasiKebun = "";
    this.catatan = "";
  }

  get idBatch() {
    return this.#idBatch;
  }
  get beratKg() {
    return this.#beratKg;
  }
  get timestamp() {
    return this.#timestamp;
  }

  hitungHargaJual() {
    throw new Error("Method harus di-override");
  }

  getRingkasan() {
    return {
      idBatch: this.idBatch,
      komoditas: this.namaKomoditas,
      berat: `${this.beratKg} kg`,
      kualitas: this.kualitas.label,
      petani: this.namaPetani,
      harga: `Rp ${this.hitungHargaJual().toLocaleString("id-ID")}`,
      tanggal: this.timestamp.toLocaleDateString("id-ID"),
    };
  }

  toJSON() {
    return {
      idBatch: this.idBatch,
      namaKomoditas: this.namaKomoditas,
      beratKg: this.beratKg,
      kualitas: this.kualitas.value,
      namaPetani: this.namaPetani,
      lokasiKebun: this.lokasiKebun,
      catatan: this.catatan,
      timestamp: this.timestamp.toISOString(),
      hargaJual: this.hitungHargaJual(),
    };
  }
}

export class KopiRobusta extends BisaDiekspor(HasilPanen) {
  constructor(idBatch, beratKg, namaPetani, kualitas, kadarAir = 12) {
    super(idBatch, beratKg, namaPetani, kualitas);
    this.namaKomoditas = "Kopi Robusta";
    this.kadarAir = kadarAir;
    this.destinasiEkspor = "Eropa & Timur Tengah";
  }

  hitungHargaJual() {
    const BASE_PRICE = 28000;
    const qM = { GRADE_A: 1.4, GRADE_B: 1.0, REJECT: 0.45 };
    const wP = this.kadarAir > 14 ? 0.85 : this.kadarAir > 12 ? 0.95 : 1.0;
    return Math.round(BASE_PRICE * this.beratKg * qM[this.kualitas.value] * wP);
  }
}

export class BuahNaga extends BisaDiekspor(HasilPanen) {
  constructor(idBatch, beratKg, namaPetani, kualitas, ukuranRerata = "MEDIUM") {
    super(idBatch, beratKg, namaPetani, kualitas);
    this.namaKomoditas = "Buah Naga";
    this.ukuranRerata = ukuranRerata;
    this.destinasiEkspor = "Asia Tenggara & Tiongkok";
  }

  hitungHargaJual() {
    const BASE_PRICE = 12000;
    const qM = { GRADE_A: 1.5, GRADE_B: 1.0, REJECT: 0.3 };
    const sB = { SMALL: 0.9, MEDIUM: 1.0, LARGE: 1.15, JUMBO: 1.3 };
    return Math.round(
      BASE_PRICE *
        this.beratKg *
        qM[this.kualitas.value] *
        (sB[this.ukuranRerata] || 1.0),
    );
  }
}
