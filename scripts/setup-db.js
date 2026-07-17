const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual env loader
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("\x1b[31mError: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local\x1b[0m");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log("\x1b[34m[GCS CLI] Initializing database setup check...\x1b[0m");

  // 1. Check database connection
  try {
    const { data, error } = await supabase.from('admin_users').select('*').limit(1);
    if (error && error.code === '42P01') {
      console.log("\x1b[33m[Warning] The 'admin_users' table does not exist yet. Please copy the contents of supabase/schema.sql and execute it inside the Supabase SQL Editor.\x1b[0m");
    } else if (error) {
      throw error;
    } else {
      console.log("\x1b[32m[GCS CLI] Database connection verified successfully!\x1b[0m");
    }
  } catch (err) {
    console.error("\x1b[31mDatabase connection failed:\x1b[0m", err.message);
  }

  // 2. Programmatic Storage Bucket Creation
  console.log("\x1b[34m[GCS CLI] Provisioning storage buckets...\x1b[0m");
  try {
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    if (bucketsErr) throw bucketsErr;

    const hasMedia = buckets.some(b => b.name === 'media');
    if (!hasMedia) {
      console.log("[GCS CLI] Creating 'media' storage bucket...");
      const { data: newBucket, error: createErr } = await supabase.storage.createBucket('media', {
        public: true
      });
      if (createErr) throw createErr;
      console.log("\x1b[32m[GCS CLI] 'media' bucket created successfully!\x1b[0m");
    } else {
      console.log("\x1b[32m[GCS CLI] 'media' bucket already exists. Skipping.\x1b[0m");
    }
  } catch (err) {
    console.error("\x1b[31mStorage bucket provisioning failed:\x1b[0m", err.message);
  }

  console.log("\x1b[32m[GCS CLI] Setup checks finished.\x1b[0m");
}

main();
