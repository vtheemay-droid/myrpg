const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const siteID = process.env.BLOB_SITE_ID;
  const token = process.env.BLOB_TOKEN;

  if (!siteID || !token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Variáveis BLOB_SITE_ID e BLOB_TOKEN não configuradas" }),
    };
  }

  const store = getStore({ name: "fichas", siteID, token });
  const path = event.path.replace("/.netlify/functions/ficha", "");
  const segments = path.split("/").filter(Boolean);

  try {
    if (event.httpMethod === "GET" && segments.length === 0) {
      const { blobs } = await store.list();
      const fichas = [];
      for (const blob of blobs) {
        const data = await store.get(blob.key, { type: "json" });
        if (data) fichas.push({ id: blob.key, ...data });
      }
      return { statusCode: 200, headers, body: JSON.stringify(fichas) };
    }

    if (event.httpMethod === "GET" && segments.length === 1) {
      const id = segments[0];
      const data = await store.get(id, { type: "json" });
      if (!data) return { statusCode: 404, headers, body: JSON.stringify({ error: "Ficha não encontrada" }) };
      return { statusCode: 200, headers, body: JSON.stringify({ id, ...data }) };
    }

    if (event.httpMethod === "POST" && segments.length === 0) {
      const body = JSON.parse(event.body);
      const id = Math.floor(100000 + Math.random() * 900000).toString();
      const ficha = {
        ...body,
        id,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      await store.setJSON(id, ficha);
      return { statusCode: 201, headers, body: JSON.stringify(ficha) };
    }

    if (event.httpMethod === "PUT" && segments.length === 1) {
      const id = segments[0];
      const existing = await store.get(id, { type: "json" });
      if (!existing) return { statusCode: 404, headers, body: JSON.stringify({ error: "Ficha não encontrada" }) };
      const body = JSON.parse(event.body);
      const updated = {
        ...existing,
        ...body,
        id,
        atualizadoEm: new Date().toISOString(),
      };
      await store.setJSON(id, updated);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    if (event.httpMethod === "DELETE" && segments.length === 1) {
      const id = segments[0];
      await store.delete(id);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método não permitido" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
