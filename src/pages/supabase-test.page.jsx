import CustomHead from '@src/components/dom/CustomHead';
import { supabase } from '@src/lib/supabase/client';
import { createServerSupabaseClient } from '@src/lib/supabase/server';

export async function getServerSideProps() {
  const isUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const isKeyConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let initialCategories = [];
  let queryError = null;

  if (!isUrlConfigured || !isKeyConfigured) {
    queryError = {
      message: 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.',
    };
  } else {
    try {
      const serverClient = createServerSupabaseClient();
      if (serverClient) {
        const { data, error } = await serverClient.from('categories').select('*').order('sort_order', { ascending: true });

        if (error) {
          queryError = { message: error.message, details: error.details, hint: error.hint, code: error.code };
        } else {
          initialCategories = data || [];
        }
      }
    } catch (err) {
      queryError = { message: err.message || 'Server-side query execution failed' };
    }
  }

  return {
    props: {
      isUrlConfigured,
      isKeyConfigured,
      initialCategories,
      queryError,
    },
  };
}

export default function SupabaseTestPage({ isUrlConfigured, isKeyConfigured, initialCategories, queryError }) {
  const isClientReady = Boolean(supabase);

  return (
    <>
      <CustomHead title="Supabase Database Connection Test | HOMIES STUDIO" />
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d10',
          color: '#f0f4f1',
          padding: '6rem 2rem 4rem',
          fontFamily: 'sans-serif',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div style={{ borderBottom: '1px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supabase Database Verification</h1>
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Browser → Next.js → Supabase Client → Supabase API → PostgreSQL (<code>categories</code> table)
          </p>
        </div>

        {/* Environment Configuration Check */}
        <div
          style={{
            background: '#16161c',
            border: '1px solid #282833',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>1. Environment & Client Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#202028', padding: '0.8rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>NEXT_PUBLIC_SUPABASE_URL</div>
              <div style={{ fontWeight: 700, marginTop: '0.2rem', color: isUrlConfigured ? '#4ade80' : '#f87171' }}>{isUrlConfigured ? '✓ Configured' : '✕ Missing'}</div>
            </div>

            <div style={{ background: '#202028', padding: '0.8rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
              <div style={{ fontWeight: 700, marginTop: '0.2rem', color: isKeyConfigured ? '#4ade80' : '#f87171' }}>{isKeyConfigured ? '✓ Configured' : '✕ Missing'}</div>
            </div>

            <div style={{ background: '#202028', padding: '0.8rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>Supabase Client Instance</div>
              <div style={{ fontWeight: 700, marginTop: '0.2rem', color: isClientReady ? '#4ade80' : '#f87171' }}>{isClientReady ? '✓ Initialized' : '✕ Not Initialized'}</div>
            </div>
          </div>
        </div>

        {/* Query Execution Status */}
        <div
          style={{
            background: '#16161c',
            border: '1px solid #282833',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            2. PostgreSQL Query Status (<code>SELECT * FROM public.categories</code>)
          </h3>

          {queryError ? (
            <div
              style={{
                background: '#2c1214',
                border: '1px solid #dc2626',
                borderRadius: '8px',
                padding: '1.2rem',
                color: '#fca5a5',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#ef4444' }}>✕ Database Query Status / Error:</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(queryError, null, 2)}</div>
            </div>
          ) : (
            <div
              style={{
                background: '#0d2818',
                border: '1px solid #16a34a',
                borderRadius: '8px',
                padding: '1rem 1.2rem',
                color: '#86efac',
                fontWeight: 700,
              }}
            >
              ✓ SUCCESS — Successfully fetched {initialCategories.length} category records from Supabase PostgreSQL!
            </div>
          )}
        </div>

        {/* Category Records Display */}
        {initialCategories && initialCategories.length > 0 && (
          <div
            style={{
              background: '#16161c',
              border: '1px solid #282833',
              borderRadius: '12px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>3. Returned Records from Database ({initialCategories.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {initialCategories.map((cat) => (
                <div
                  key={cat.id || cat.slug}
                  style={{
                    background: '#202028',
                    padding: '1rem 1.2rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{cat.icon || '📁'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.2rem' }}>
                        Slug: <code>{cat.slug}</code> • Sort Order: {cat.sort_order}
                      </div>
                      {cat.description && <div style={{ fontSize: '0.8rem', color: '#bbb', marginTop: '0.3rem' }}>{cat.description}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
