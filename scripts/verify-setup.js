const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Env loader
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

async function main() {
  console.log("\x1b[34m[GCS CLI] Starting Setup Verification Audit...\x1b[0m");
  let passed = true;

  // 1. Env check
  console.log("\n1. ENVIRONMENT VARIABLES AUDIT:");
  const variables = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  variables.forEach(v => {
    if (process.env[v]) {
      console.log(`  \x1b[32m✔ ${v} is configured\x1b[0m`);
    } else {
      console.log(`  \x1b[31m✘ ${v} is missing\x1b[0m`);
      passed = false;
    }
  });

  if (!passed) {
    console.error("\n\x1b[31m[Audit Failed] Missing environment variables. Please rename .env.local.example to .env.local and enter your keys.\x1b[0m");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // 2. Database tables audit
  console.log("\n2. DATABASE TABLES AUDIT:");
  const tables = [
    'products',
    'categories',
    'orders',
    'admin_users',
    'product_variants',
    'shipping_rules',
    'activity_logs',
    'inventory_history'
  ];

  for (const t of tables) {
    try {
      const { data, error, status } = await supabase.from(t).select('*').limit(1);
      if (error) throw error;
      console.log(`  \x1b[32m✔ Table '${t}' verified successfully\x1b[0m`);
    } catch (err) {
      console.log(`  \x1b[31m✘ Table '${t}' check failed: ${err.message}\x1b[0m`);
      passed = false;
    }
  }

  // 3. Storage bucket audit
  console.log("\n3. STORAGE AUDIT:");
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    const mediaBucket = buckets.find(b => b.name === 'media');
    if (mediaBucket) {
      console.log("  \x1b[32m✔ Storage bucket 'media' exists and is active\x1b[0m");
    } else {
      console.log("  \x1b[31m✘ Storage bucket 'media' is missing\x1b[0m");
      passed = false;
    }
  } catch (err) {
    console.log(`  \x1b[31m✘ Storage audit failed: ${err.message}\x1b[0m`);
    passed = false;
  }

  // 4. Admin count audit
  console.log("\n4. SECURITY AUDIT:");
  try {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`  \x1b[34mℹ Current Admin User Count: ${count || 0}\x1b[0m`);
    if ((count || 0) === 0) {
      console.log("  \x1b[33m⚠ Warning: No administrators registered. Access setup wizard at /admin/setup-wizard to register your first admin.\x1b[0m");
    }
  } catch (err) {
    console.log(`  \x1b[31m✘ Security check failed: ${err.message}\x1b[0m`);
    passed = false;
  }

  console.log("\n------------------------------------------------");
  if (passed) {
    console.log("\x1b[32m✔ ALL DIAGNOSTIC CHECKS PASSED SUCCESSFULLY!\x1b[0m");
  } else {
    console.log("\x1b[31m✘ SOME AUDIT DIAGNOSTIC CHECKS FAILED. See errors above.\x1b[0m");
  }
}

main();
