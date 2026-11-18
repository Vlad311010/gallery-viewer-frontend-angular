import { NgxToastConfig, NgxToastPosition } from "ngx-toastf";

export function toastDefaultOptions(
  overrides: Partial<NgxToastConfig> = {}
): NgxToastConfig {
  return {
    title: 'Done',
    tapDismiss: false,
    autoClose: true,
    duration: 2500,
    pauseOnHover: true,
    closeButton: false,
    animationDuration: 300,
    position: NgxToastPosition.BottomRight,
    ...overrides
  };
}