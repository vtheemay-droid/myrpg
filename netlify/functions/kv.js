// netlify/functions/kv.js
// Uses Netlify Blobs for persistent storage
// Docs: https://docs.netlify.com/blobs/overview/

import { getStore } from '@netlify/blobs';

const STORE_NAME = 'rpg-fichas';

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  // ── GET ──────────────────────────────────────
  if (req.method === 'GET') {
    const url    = new URL(req.url);
    const action = url.searchParams.get('action');
    const key    = url.searchParams.get('key');
    const prefix = url.searchParams.get('prefix');

    if (action === 'get') {
      try {
        const value = await store.get(key);
        return Response.json({ value });
      } catch {
        return Response.json({ value: null });
      }
    }

    if (action === 'list') {
      try {
        const { blobs } = await store.list({ prefix: prefix || '' });
        const keys = blobs.map(b => b.key);
        return Response.json({ keys });
      } catch {
        return Response.json({ keys: [] });
      }
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  }

  // ── POST ─────────────────────────────────────
  if (req.method === 'POST') {
    const body = await req.json();
    const { action, key, value } = body;

    if (action === 'set') {
      await store.set(key, value);
      return Response.json({ ok: true });
    }

    if (action === 'del') {
      await store.delete(key);
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

export const config = {
  path: '/api/kv',
};
