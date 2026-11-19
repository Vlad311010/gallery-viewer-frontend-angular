import { NgTemplateOutlet, KeyValuePipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';

export interface SelectOption {
  label: string;
  leftLabel?: string;
  rightLabel?: string;
}

@Component({
  selector: 'dropdown-selector',
  styleUrl: './dropdown-selector.component.scss',
  templateUrl: './dropdown-selector.component.html',
  imports: [NgTemplateOutlet, KeyValuePipe],
})
export class DropdownSelectorComponent<T> {
  data = input.required<Map<T, SelectOption>>()
  disabled = input.required<boolean>();
  initiallySelectedKey = input<T | null>(null)

  itemChange = output<T>();

  selectedItemKey = signal<T | null>(null);  
  isOpen = signal(false);

  selectedOptionData = computed(() => {
    let selectedOption : SelectOption = { label: "None" };
    const selectedKey = this.selectedItemKey();
    if (selectedKey) {
      const selectedOptionDataLabel = this.data().get(selectedKey)?.label;
      selectedOption = { leftLabel: selectedKey.toString(), label: selectedOptionDataLabel ?? selectedOption.label };
    }

    return selectedOption;
  });

  constructor() {
    effect(() => {
      this.selectedItemKey.set(this.initiallySelectedKey());
    })
  }

  private onDropDownClick() {
    this.isOpen.update(val => !val);
  }

  private onOptionSelect(key: T) {
    this.isOpen.set(false);
    this.selectedItemKey.set(key);
    this.itemChange.emit(key);
  }

  private closeDropdown() {
    this.isOpen.set(false);
  }
}
