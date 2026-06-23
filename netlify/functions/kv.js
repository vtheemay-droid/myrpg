const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'rpg-fichas';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS, body: '' };
  }

  try {
    const store = getStore(STORE_NAME);

    // ── GET ──────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const { action, key, prefix } = event.queryStringParameters || {};

      if (action === 'get') {
        const value = await store.get(key);
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ value: value ?? null }) };
      }

      if (action === 'list') {
        const result = await store.list({ prefix: prefix || '' });
        const keys = result.blobs.map(b => b.key);
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ keys }) };
      }

      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown action' }) };
    }

    // ── POST ─────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const { action, key, value } = JSON.parse(event.body || '{}');

      if (action === 'set') {
        await store.set(key, value);
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
      }

      if (action === 'del') {
        await store.delete(key);
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
      }

      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown action' }) };
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (err) {
    console.error('KV error:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
