/* eslint-disable @typescript-eslint/no-explicit-any */
export class AICache {
  private cache = new Map<string, { value: any; timestamp: number }>();
  private readonly TTL_MS = 1000 * 60 * 60; // 1 hour cache

  public get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public set(key: string, value: any): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  public generateKey(prefix: string, body: any): string {
    return prefix + "_" + JSON.stringify(body);
  }
}

export const aiCache = new AICache();
