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

    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    sessionStorage.setItem(this.storageKey, String(seed));

    return seed;
  }

  public regenerate(): void {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    sessionStorage.setItem(this.storageKey, String(seed));
    this.seed.set(seed);
  }
}