import { CACHE_CLEANUP_INTERVAL_MS, CACHE_TTL_MS } from "@/lib/constants";

/**
 * In-memory TTL cache for AI responses with periodic cleanup.
 * Uses lazy initialization to avoid module-level side effects.
 * @template T - Type of cached values
 */
export class AICache<T = unknown> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private readonly TTL_MS: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(ttlMs = CACHE_TTL_MS) {
    this.TTL_MS = ttlMs;
  }

  private ensureCleanup(): void {
    if (this.cleanupInterval !== null) return;
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") return;

    this.cleanupInterval = setInterval(() => this.evictStale(), CACHE_CLEANUP_INTERVAL_MS);
    if (this.cleanupInterval.unref) this.cleanupInterval.unref();
  }

  private evictStale(): void {
    const cutoff = Date.now() - this.TTL_MS;
    for (const [key, entry] of this.cache) {
      if (entry.timestamp < cutoff) this.cache.delete(key);
    }
  }

  get(key: string): T | null {
    this.ensureCleanup();
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: T): void {
    this.ensureCleanup();
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  generateKey(prefix: string, body: Record<string, unknown>): string {
    return prefix + "_" + JSON.stringify(body);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new AICache();