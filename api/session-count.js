import { runRedisCommand } from './_upstash.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await runRedisCommand(['GET', 'openclaw:sessions_started']);
    const count = Number(data?.result ?? 0);
    return res.status(200).json({ ok: true, count: Number.isNaN(count) ? 0 : count });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}

