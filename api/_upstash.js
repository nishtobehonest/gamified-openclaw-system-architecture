const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function runRedisCommand(commandParts) {
  if (!redisUrl || !redisToken) {
    throw new Error('Missing Upstash Redis environment variables.');
  }

  const endpoint = `${redisUrl}/${commandParts.map((part) => encodeURIComponent(String(part))).join('/')}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${redisToken}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upstash request failed: ${response.status} ${text}`);
  }

  return response.json();
}

