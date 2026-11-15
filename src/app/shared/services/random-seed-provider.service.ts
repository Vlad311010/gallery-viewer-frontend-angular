import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class RandomSeedProviderService {
  private readonly storageKey = 'gallery-filter-seed';

  readonly seed = signal(this.getOrCreateSeed());

  private getOrCreateSeed(): number {
    const stored = sessionStorage.getItem(this.storageKey);

    if (stored !== null) {
      const value = Number(stored);
      if (Number.isSafeInteger(value)) return value;
    }

    const seed = this.generateSeed();
    sessionStorage.setItem(this.storageKey, String(seed));

    return seed;
  }

  public regenerate(): number {
    const seed = this.generateSeed();
    sessionStorage.setItem(this.storageKey, String(seed));
    this.seed.set(seed);
    return seed;
  }

  private generateSeed() {
    return Math.abs(crypto.getRandomValues(new Int32Array(1))[0]);
  }
}