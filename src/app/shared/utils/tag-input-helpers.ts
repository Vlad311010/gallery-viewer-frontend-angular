import CONSTANTS from "@app/constants/tag-constants";

export interface CurrentWord {
  value: string;
  start: number;
  end: number;
  hasExclusionPrefix: boolean;
}

export function getCurrentWord(
  value: string,
  cursorPosition: number,
): CurrentWord {
  if (!value) {
    return {
      value: '',
      start: -1,
      end: -1,
      hasExclusionPrefix: false
    }
  }

  let start = cursorPosition;
  while (start > 0 && value[start - 1] !== " ") {
    start--;
  }

  let end = cursorPosition;

  while (end < value.length && value[end] !== " ") {
    end++;
  }

  let hasExclusionPrefix = false;
  if (value[start] === CONSTANTS.TAG_EXCLUSION_CHARACTER) {
    start++;
    hasExclusionPrefix = true;
  }

  return {
    value: value.slice(start, end),
    start,
    end,
    hasExclusionPrefix
  };
}

export function replaceCurrentWord(
  value: string,
  word: CurrentWord,
  replacement: string,
): {
  value: string;
  cursorPosition: number;
} {
  const newValue =
    value.slice(0, word.start) +
    replacement +
    value.slice(word.end);

  return {
    value: newValue.trimEnd() + CONSTANTS.SPACE_CHARACTER,
    cursorPosition: word.start + replacement.length + 1,
  };
}