interface KeyboardShortcutOptions {
  allowInEditableContent?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  name?: string;
}

export class Keybind  {
  keycodes: string[];
  callback: (event: KeyboardEvent) => void;
  allowInEditableContent: boolean;
  ctrlKey : boolean;
  altKey : boolean;
  name? :  string;

  constructor (
    keycodes: string[],
    callback: (event: KeyboardEvent) => void,
    options: KeyboardShortcutOptions = {}
  ) {
    const {
      allowInEditableContent = false,
      ctrlKey = false,
      altKey = false,
      name = undefined
    } = options;    

    this.keycodes = keycodes;
    this.callback = callback;
    this.allowInEditableContent = allowInEditableContent;
    this.ctrlKey = ctrlKey;
    this.altKey = altKey;
    this.name = name;
  }
};

function bindMatch(bind: Keybind | undefined, event: KeyboardEvent) {
  if (!(event.target instanceof HTMLElement) || !bind) {
    return false;
  }

  const tag = event.target.tagName.toLowerCase();
  return bind.keycodes.some(keycode => keycode == event.code)
    && bind.ctrlKey === event.ctrlKey
    && bind.altKey === event.altKey
    && (!bind.allowInEditableContent || !(['input', 'textarea', 'select'].includes(tag) || event.target.isContentEditable))
}

export function handleInput(event: KeyboardEvent, keybinds : Keybind[]) {
  if (event.target instanceof HTMLElement) {
    const matchingBinds = keybinds.filter(x => bindMatch(x, event));
    if (!matchingBinds || matchingBinds.length == 0) {
      return;
    }
    else if (matchingBinds.length > 1) {
      console.warn("Multiple matching key bindings", matchingBinds);
    }

    const bind = matchingBinds[0];

    event.preventDefault();
    bind.callback(event);
  }
}

