/**
 * Cloudflare Worker — Polymarket proxy for World Cup Optimizer
 *
 * Deploy at: dash.cloudflare.com → Workers & Pages → Create Worker
 * Paste this entire file, deploy, then copy the worker URL into index.html
 */

const ALLOWED_ORIGIN = '*'; // lock to your GitHub Pages URL later if you want
const POLYMARKET_BASE = 'https://gamma-api.polymarket.com';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://polymarket.com',
  'Referer': 'https://polymarket.com/',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/') {
      return new Response('World Cup proxy is running ✓', { status: 200 });
    }

    // Only allow /proxy?path=... requests
    if (url.pathname !== '/proxy') {
      return new Response('Not found', { status: 404 });
    }

    const path = url.searchParams.get('path');
    if (!path) {
      return json({ error: 'Missing ?path= parameter' }, 400);
    }

    // Only allow requests to gamma-api.polymarket.com
    if (!path.startsWith('/events/') && !path.startsWith('/markets')) {
      return json({ error: 'Disallowed path' }, 403);
    }

    const targetUrl = POLYMARKET_BASE + path;

    try {
      const resp = await fetch(targetUrl, { headers: HEADERS });
      const data = await resp.json();
      return json(data, resp.status);
    } catch (e) {
      return json({ error: e.message }, 502);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}
