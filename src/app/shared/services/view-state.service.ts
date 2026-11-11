import { DestroyRef, inject, Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, timestamp } from 'rxjs';
import { handleInput, Keybind } from '../utils/input-handler';
import { INPUTS } from '@app/constants/input-constants';

export interface ViewState {
  editModeOn: boolean;
}

const STORAGE_KEY = 'view-state';

const DEFAULT_STATE: ViewState = {
  editModeOn: false
};

@Injectable({ providedIn: 'root' })
export class ViewStateService {
  private readonly state = signal<ViewState>(this.restore());

  readonly getState = this.state.asReadonly();

  private setState(value: Partial<ViewState>): void {
    this.state.update(current => {
      const next = { ...current, ...value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  private restore(): ViewState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  }

  private readonly destroyRef = inject(DestroyRef);
   
  constructor() {
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.onKeyDown(event));
    
    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.onStorageChange(event));
  }

  private readonly switchModeBind = new Keybind(
    [INPUTS.SWITCH_VIEW_MODE],
    () => this.setState(
      {
        ...this.state(),
        editModeOn: !this.state().editModeOn
      }
    )
  );

  private onKeyDown(event: KeyboardEvent): void {    
    handleInput(event, [this.switchModeBind]);
  }

  private onStorageChange(event: StorageEvent): void {
    if (event.key === STORAGE_KEY) {
      if (event.newValue) {
        this.setState({...JSON.parse(event.newValue)});
      }
    }
  }
}