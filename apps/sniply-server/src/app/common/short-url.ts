export function getShortBaseUrl() {
  const configured = process.env['SHORT_BASE_URL']?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const port = process.env['PORT']?.trim() || '3001';
  return `http://localhost:${port}`;
}

export function buildShortUrl(code: string, prefix = '') {
  const normalizedPrefix = prefix ? `/${prefix.replace(/^\/|\/$/g, '')}` : '';
  return `${getShortBaseUrl()}${normalizedPrefix}/${code}`;
}
