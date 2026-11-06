export class Keybind  {
  keycodes: string[];
  callback: () => void;
  allowInEditableContent: boolean;
  ctrlKey : boolean;

  constructor (
    keycodes: string[],
    callback: () => void,
    allowInEditableContent: boolean = false,
    ctrlKey: boolean = false
  ) {
    this.keycodes = keycodes;
    this.callback = callback;
    this.allowInEditableContent = allowInEditableContent;
    this.ctrlKey = ctrlKey;
  }
};

export function handleInput(event: KeyboardEvent, keybinds : Keybind[]) {
  if (event.target instanceof HTMLElement) {
    const tag = event.target.tagName.toLowerCase();
    const bind = keybinds.find(x => x.keycodes.some(keycode => keycode == event.code))
    
    if (
      !bind 
      || event.ctrlKey != bind.ctrlKey
    ) {
      return;
    }

    if (!bind.allowInEditableContent 
      && (['input', 'textarea', 'select'].includes(tag) || event.target.isContentEditable)
    ) {
      return;
    }

    event.preventDefault();
    bind.callback();
  }
}