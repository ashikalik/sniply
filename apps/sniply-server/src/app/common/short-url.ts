export function getShortBaseUrl() {
  const configured = (
    process.env['SHORT_BASE_URL'] ??
    process.env['PUBLIC_BASE_URL']
  )?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (process.env['NODE_ENV']?.trim().toLowerCase() === 'production') {
    throw new Error('SHORT_BASE_URL or PUBLIC_BASE_URL is required in production');
  }

  const port = process.env['PORT']?.trim() || '3001';
  return `http://localhost:${port}`;
}

export function buildShortUrl(code: string, prefix = '') {
  const normalizedPrefix = prefix ? `/${prefix.replace(/^\/|\/$/g, '')}` : '';
  return `${getShortBaseUrl()}${normalizedPrefix}/${code}`;
}
