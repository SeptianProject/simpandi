export class UndoStack {
  constructor(maxSize = 50) {
    this._stack = [];
    this._maxSize = maxSize;
  }
  push(action) {
    const entry = { ...action, timestamp: new Date() };
    if (this._stack.length >= this._maxSize) this._stack.shift();
    this._stack.push(entry);
    return entry;
  }
  pop() {
    return this._stack.pop() || null;
  }
  size() {
    return this._stack.length;
  }
  toArray() {
    return [...this._stack].reverse();
  }
  clear() {
    this._stack = [];
  }
}
