export class TrackingNode {
  constructor(lokasi, keterangan, timestamp = new Date()) {
    this.lokasi = lokasi;
    this.keterangan = keterangan;
    this.timestamp = timestamp;
    this.prev = null;
    this.next = null;
  }
}

export class BatchTracker {
  constructor(idBatch) {
    this.idBatch = idBatch;
    this.head = null;
    this.tail = null;
    this._size = 0;
  }
  tambahLokasi(lokasi, keterangan) {
    const node = new TrackingNode(lokasi, keterangan);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
    return node;
  }
  bacaMaju() {
    const r = [];
    let c = this.head;
    while (c) {
      r.push(c);
      c = c.next;
    }
    return r;
  }
  bacaMundur() {
    const r = [];
    let c = this.tail;
    while (c) {
      r.push(c);
      c = c.prev;
    }
    return r;
  }
  get size() {
    return this._size;
  }
}
