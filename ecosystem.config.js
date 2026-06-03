module.exports = {
  apps: [
    {
      name: 'nomibedia',
      script: 'server.js',
      cwd: '/home/xs227431/nomibedia',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOSTNAME: '127.0.0.1',
        NEXT_PUBLIC_BASE_PATH: '/nomibedia',
        NEXT_PUBLIC_SUPABASE_URL: 'https://gicdeuwdchmzmhgpjfis.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_ukdxxYt8ClTMMg0QbjINVg_TPy3mU0F',
      },
    },
  ],
};
