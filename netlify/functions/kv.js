const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'rpg-fichas';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS, body: '' };
  }

  try {
    const store = getStore({
      name: STORE_NAME,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    if (event.httpMethod === 'GET') {
      const { action, key, prefix } = event.queryStringParameters || {};

      if (action === 'get') {
        let value = null;
        try { value = await store.get(key); } catch(e) {}
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ value }) };
      }

      if (action === 'list') {
        let keys = [];
        try {
          const result = await store.list({ prefix: prefix || '' });
          keys = result.blobs.map(b => b.key);
        } catch(e) {}
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ keys }) };
      }

      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown action' }) };
    }

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
