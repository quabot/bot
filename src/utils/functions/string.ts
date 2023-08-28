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
