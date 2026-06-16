export class BSTNode {
  constructor(batch) {
    this.batch = batch;
    this.left = null;
    this.right = null;
  }
}

export class BatchBST {
  constructor() {
    this.root = null;
    this._size = 0;
  }
  _compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  insert(batch) {
    const node = new BSTNode(batch);
    if (!this.root) {
      this.root = node;
      this._size++;
      return;
    }
    let curr = this.root;
    while (true) {
      const cmp = this._compare(batch.idBatch, curr.batch.idBatch);
      if (cmp === 0) {
        curr.batch = batch;
        return;
      }
      if (cmp < 0) {
        if (!curr.left) {
          curr.left = node;
          this._size++;
          return;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = node;
          this._size++;
          return;
        }
        curr = curr.right;
      }
    }
  }

  search(idBatch) {
    let curr = this.root,
      steps = 0;
    while (curr) {
      steps++;
      const cmp = this._compare(idBatch, curr.batch.idBatch);
      if (cmp === 0) return { found: curr.batch, steps };
      curr = cmp < 0 ? curr.left : curr.right;
    }
    return { found: null, steps };
  }

  delete(idBatch) {
    this.root = this._deleteNode(this.root, idBatch);
  }
  _deleteNode(node, id) {
    if (!node) return null;
    const cmp = this._compare(id, node.batch.idBatch);
    if (cmp < 0) node.left = this._deleteNode(node.left, id);
    else if (cmp > 0) node.right = this._deleteNode(node.right, id);
    else {
      this._size--;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let minNode = node.right;
      while (minNode.left) minNode = minNode.left;
      node.batch = minNode.batch;
      node.right = this._deleteNode(node.right, minNode.batch.idBatch);
      this._size++;
    }
    return node;
  }

  inOrder() {
    const result = [];
    const traverse = (n) => {
      if (!n) return;
      traverse(n.left);
      result.push(n.batch);
      traverse(n.right);
    };
    traverse(this.root);
    return result;
  }

  toVisualTree(node = this.root, level = 0, prefix = "Root: ") {
    if (!node) return [];
    const lines = [
      { level, prefix, id: node.batch.idBatch, kualitas: node.batch.kualitas },
    ];
    lines.push(...this.toVisualTree(node.left, level + 1, "├─L: "));
    lines.push(...this.toVisualTree(node.right, level + 1, "└─R: "));
    return lines;
  }

  get size() {
    return this._size;
  }
}
