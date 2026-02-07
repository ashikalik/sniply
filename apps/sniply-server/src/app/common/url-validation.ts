import { BadRequestException } from '@nestjs/common';
import { isIP } from 'node:net';

const PRIVATE_IPV4_RANGES: Array<[number, number]> = [
  // 10.0.0.0/8
  [ipToInt('10.0.0.0'), ipToInt('10.255.255.255')],
  // 172.16.0.0/12
  [ipToInt('172.16.0.0'), ipToInt('172.31.255.255')],
  // 192.168.0.0/16
  [ipToInt('192.168.0.0'), ipToInt('192.168.255.255')],
  // 127.0.0.0/8 (loopback)
  [ipToInt('127.0.0.0'), ipToInt('127.255.255.255')],
  // 169.254.0.0/16 (link-local)
  [ipToInt('169.254.0.0'), ipToInt('169.254.255.255')],
];

function ipToInt(ip: string) {
  return ip
    .split('.')
    .map((part) => parseInt(part, 10))
    .reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
}

function isPrivateIpv4(ip: string) {
  const ipInt = ipToInt(ip);
  return PRIVATE_IPV4_RANGES.some(
    ([start, end]) => ipInt >= start && ipInt <= end,
  );
}

function isPrivateIpv6(ip: string) {
  const normalized = ip.toLowerCase();
  return (
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80')
  );
}

export function validateHttpUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new BadRequestException('longUrl is invalid');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException('Only http and https URLs are allowed');
  }

  const blockPrivate =
    String(process.env.BLOCK_PRIVATE_IPS ?? '').toLowerCase() === 'true';
  if (!blockPrivate) {
    return url;
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost') {
    throw new BadRequestException('Private hostnames are not allowed');
  }

  const ipVersion = isIP(hostname);
  if (ipVersion === 4 && isPrivateIpv4(hostname)) {
    throw new BadRequestException('Private IPs are not allowed');
  }
  if (ipVersion === 6 && isPrivateIpv6(hostname)) {
    throw new BadRequestException('Private IPs are not allowed');
  }

  return url;
}
