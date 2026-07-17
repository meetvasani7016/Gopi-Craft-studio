const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Manual parsing of .env.local to load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
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

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const args = process.argv.slice(2);
  let email = "";
  let password = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i+1]) {
      email = args[i+1];
    }
    if (args[i] === '--password' && args[i+1]) {
      password = args[i+1];
    }
  }

  if (!email || !password) {
    console.log("\x1b[33mUsage: node scripts/create-admin.js --email <email> --password <password>\x1b[0m");
    process.exit(1);
  }

  console.log(`\x1b[34m[GCS CLI] Creating Admin auth user: ${email}...\x1b[0m`);

  // 1. Create User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  });

  if (authError) {
    console.error("\x1b[31mAuthentication user creation failed:\x1b[0m", authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`\x1b[32m[GCS CLI] Auth user created successfully. ID: ${userId}\x1b[0m`);

  // 2. Assign Role in admin_users
  const { error: roleError } = await supabase
    .from('admin_users')
    .upsert({
      id: userId,
      role: 'super_admin'
    });

  if (roleError) {
    console.error("\x1b[31mRole mapping in admin_users failed:\x1b[0m", roleError.message);
    process.exit(1);
  }

  console.log(`\x1b[32m[GCS CLI] Success! Configured ${email} as Super Admin.\x1b[0m`);
}

main();
