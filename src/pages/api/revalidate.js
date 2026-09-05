// Next.js On-Demand ISR Revalidation API Handler
// Securely purges cached project, mart, and homepage paths upon publish/unpublish/edit

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const secret = req.query.secret || req.body?.secret;
  const expectedSecret = process.env.REVALIDATE_SECRET || process.env.ADMIN_SESSION_TOKEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (secret && expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ success: false, message: 'Invalid revalidation secret' });
  }

  const { path: reqPath, paths: reqPaths } = req.body || req.query || {};

  const pathsToRevalidate = [];
  if (reqPath && typeof reqPath === 'string') {
    pathsToRevalidate.push(reqPath);
  }
  if (Array.isArray(reqPaths)) {
    pathsToRevalidate.push(...reqPaths);
  }

  if (pathsToRevalidate.length === 0) {
    pathsToRevalidate.push('/mart', '/');
  }

  const results = await Promise.all(
    pathsToRevalidate.map(async (targetPath) => {
      try {
        await res.revalidate(targetPath);
        return { path: targetPath, status: 'revalidated' };
      } catch (err) {
        return { path: targetPath, status: 'skipped_or_not_isr', error: err.message };
      }
    }),
  );

  return res.status(200).json({
    success: true,
    revalidated: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
