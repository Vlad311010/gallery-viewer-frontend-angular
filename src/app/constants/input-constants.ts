const INPUTS = {
  // scroll 
  SCROLL_UP_WASD: 'KeyW',
  SCROLL_DOWN_WASD: 'KeyS',
  SCROLL_UP_ARROWS: 'ArrowUp',
  SCROLL_DOWN_ARROWS: 'ArrowDown',

  // search
  SUGGESTION_NAVIGATION_UP: 'ArrowUp',
  SUGGESTION_NAVIGATION_DOWN: 'ArrowDown',
  SUGGESTION_NAVIGATION_APPLY: 'Enter',
  SUGGESTION_NAVIGATION_CANCEL: 'Escape',

  // navigation
  PREV_PAGE_WASD: 'KeyA',
  NEXT_PAGE_WASD: 'KeyD',
  PREV_PAGE_ARROWS: 'ArrowLeft',
  NEXT_PAGE_ARROWS: 'ArrowRight',
  
  SEARCH_INPUT_FOCUS: 'KeyQ',
  FOLLOW_PREVIEW_LINK: 'KeyF',
  FULLSCREEN_MODE: 'KeyF',
  SWITCH_VIEW_MODE: 'KeyE',

  // Utils (ctrl + ...)
  COPY_NAME: 'KeyC',
} as const;

export default INPUTS;