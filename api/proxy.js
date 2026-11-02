export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ConvenioMartTrendRadar/1.0 (contact@conveniomart.example)',
        'Accept': 'application/json, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream HTTP ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';
    const text = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
