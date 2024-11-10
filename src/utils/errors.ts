export class NewsError extends Error {
  constructor(message: string, public source?: string) {
    super(message);
    this.name = 'NewsError';
    Object.setPrototypeOf(this, NewsError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.message}${this.source ? ` (${this.source})` : ''}`;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      source: this.source
    };
  }
}