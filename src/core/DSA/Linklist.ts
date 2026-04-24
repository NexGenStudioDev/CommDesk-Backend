class Node<T> {
  data: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.data = value;
    this.next = null;
  }
}

class LinkedList<T> {
  head: Node<T> | null;
  len: number;

  constructor() {
    this.head = null;
    this.len = 0;
  }

  createNewNode(value: T): Node<T> {
    return new Node(value);
  }

  append(value: T): void {
    const newNode = this.createNewNode(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }

    this.len++;
  }
}
