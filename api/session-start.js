import { runRedisCommand } from './_upstash.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await runRedisCommand(['INCR', 'openclaw:sessions_started']);
    return res.status(200).json({ ok: true, count: Number(data?.result ?? 0) });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}

