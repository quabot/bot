export function isSnowflake(string: string) {
  const arr = string.split('');

  return !arr.map(v => /\d/g.test(v)).some(v => v === false);
}

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function replaceHtmlCharCodes(string: string) {
  return string.replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&').replaceAll('&reg;', '®');
}

export function screamingSnakeToPascalCase(string: string) {
  return string
    .toLowerCase()
    .split('_')
    .map(s => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join('');
}
