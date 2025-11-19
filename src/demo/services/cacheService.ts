/**
 * Frontend Cache Service
 * 
 * Implements comprehensive caching strategy for API responses, user data,
 * and application state with performance optimizations based on test results.
 */

import { TIMEOUT_CONFIG } from '../../config/timeouts';

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expires: number;
  hitCount: number;
  lastAccessed: number;
  tags: string[];
}

// Cache configuration
interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  enablePersistence: boolean;
  enableCompression: boolean;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
  hitRate: number;
}

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private persistenceKey = 'dermaiq_cache';

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: 1000, // Maximum number of cache entries
      defaultTTL: TIMEOUT_CONFIG.CACHE.API_RESPONSE_CACHE, // 5 minutes
      cleanupInterval: 60000, // 1 minute
      enablePersistence: true,
      enableCompression: false, // Disabled for simplicity
      ...config
    };

    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
      hitRate: 0
    };

    this.initializeCache();
    this.startCleanupTimer();
  }

  /**
   * Initialize cache from persistent storage
   */
  private initializeCache(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.persistenceKey);
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();

        // Only restore non-expired entries
        for (const [key, entry] of Object.entries(data)) {
          const cacheEntry = entry as CacheEntry;
          if (cacheEntry.expires > now) {
            this.cache.set(key, cacheEntry);
          }
        }

        this.updateStats();
        // console.log(`Cache initialized with ${this.cache.size} entries`);
      }
    } catch (error) {
      // console.warn('Failed to initialize cache from storage:', error);
    }
  }

  /**
   * Save cache to persistent storage
   */
  private saveToStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.persistenceKey, JSON.stringify(data));
    } catch (error) {
      // console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update access statistics
    entry.hitCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateStats();

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl?: number, tags: string[] = []): void {
    const now = Date.now();
    const expires = now + (ttl || this.config.defaultTTL);

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expires,
      hitCount: 0,
      lastAccessed: now,
      tags
    };

    // Check cache size limit
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
    this.updateStats();
    this.saveToStorage();
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete cached data
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    this.updateStats();
    this.saveToStorage();
  }

  /**
   * Clear cache by tags
   */
  clearByTags(tags: string[]): number {
    let deletedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (tags.some(tag => entry.tags.includes(tag))) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.updateStats();
      this.saveToStorage();
    }

    return deletedCount;
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires <= now) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.updateStats();
      this.saveToStorage();
      // console.log(`Cache cleanup: removed ${deletedCount} expired entries`);
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.memoryUsage = this.estimateMemoryUsage();
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // Unicode characters
      totalSize += JSON.stringify(entry).length * 2;
    }
    
    return totalSize;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart cleanup timer if interval changed
    if (newConfig.cleanupInterval) {
      this.startCleanupTimer();
    }
  }

  /**
   * Get cache keys by pattern
   */
  getKeys(pattern?: RegExp): string[] {
    const keys = Array.from(this.cache.keys());
    
    if (pattern) {
      return keys.filter(key => pattern.test(key));
    }
    
    return keys;
  }

  /**
   * Get cache entries by tags
   */
  getEntriesByTags(tags: string[]): Array<{ key: string; entry: CacheEntry }> {
    const results: Array<{ key: string; entry: CacheEntry }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (tags.some(tag => entry.tags.includes(tag))) {
        results.push({ key, entry });
      }
    }
    
    return results;
  }

  /**
   * Preload data into cache
   */
  async preload<T>(
    key: string,
    loader: () => Promise<T>,
    ttl?: number,
    tags: string[] = []
  ): Promise<T> {
    // Check if already cached
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Load and cache data
    try {
      const data = await loader();
      this.set(key, data, ttl, tags);
      return data;
    } catch (error) {
      // console.error(`Failed to preload cache for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache entries
   */
  invalidate(keys: string[]): number {
    let invalidatedCount = 0;
    
    for (const key of keys) {
      if (this.delete(key)) {
        invalidatedCount++;
      }
    }
    
    return invalidatedCount;
  }

  /**
   * Warm up cache with initial data
   */
  async warmup(loaders: Array<{ key: string; loader: () => Promise<any>; ttl?: number; tags?: string[] }>): Promise<void> {
    const promises = loaders.map(({ key, loader, ttl, tags }) =>
      this.preload(key, loader, ttl, tags).catch(error => {
        console.warn(`Failed to warm up cache for key ${key}:`, error);
      })
    );

    await Promise.all(promises);
    // console.log(`Cache warmup completed for ${loaders.length} entries`);
  }

  /**
   * Destroy cache service
   */
  destroy(): void {
    this.stopCleanupTimer();
    this.clear();
  }
}

// Cache service instance
export const cacheService = new CacheService();

// Cache key generators
export const CacheKeys = {
  // API responses
  api: {
    health: () => 'api:health',
    modelStatus: () => 'api:model_status',
    performanceStats: () => 'api:performance_stats',
    treatmentPlan: (condition: string) => `api:treatment_plan:${condition}`,
    doctorRecommendations: (state: string) => `api:doctor_recommendations:${state}`,
    analysisResult: (imageHash: string) => `api:analysis_result:${imageHash}`
  },
  
  // User data
  user: {
    profile: (userId: string) => `user:profile:${userId}`,
    preferences: (userId: string) => `user:preferences:${userId}`,
    authStatus: (userId: string) => `user:auth_status:${userId}`
  },
  
  // Application state
  app: {
    config: () => 'app:config',
    theme: () => 'app:theme',
    language: () => 'app:language'
  }
} as const;

// Cache tags
export const CacheTags = {
  API: 'api',
  USER: 'user',
  APP: 'app',
  ANALYSIS: 'analysis',
  TREATMENT: 'treatment',
  DOCTORS: 'doctors'
} as const;

// Cache TTL constants
export const CacheTTL = {
  SHORT: 60000, // 1 minute
  MEDIUM: TIMEOUT_CONFIG.CACHE.API_RESPONSE_CACHE, // 5 minutes
  LONG: TIMEOUT_CONFIG.CACHE.SESSION_CACHE, // 30 minutes
  VERY_LONG: 3600000 // 1 hour
} as const;

export default cacheService;
