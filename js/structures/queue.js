export class TrukQueue {
  constructor() {
    this._queue = [];
    this._idCounter = 1;
  }
  enqueue(platNomor, kapasitasKg, supir) {
    const truk = {
      id: this._idCounter++,
      platNomor,
      kapasitasKg,
      supir,
      waktuMasuk: new Date(),
      status: "MENUNGGU",
    };
    this._queue.push(truk);
    return truk;
  }
  dequeue() {
    if (this.isEmpty()) return null;
    const truk = this._queue.shift();
    truk.status = "SEDANG MUAT";
    truk.waktuMulai = new Date();
    return truk;
  }
  peek() {
    return this._queue[0] || null;
  }
  isEmpty() {
    return this._queue.length === 0;
  }
  size() {
    return this._queue.length;
  }
  toArray() {
    return [...this._queue];
  }
  estimasiTunggu(posisi) {
    return posisi * 30;
  }
}
