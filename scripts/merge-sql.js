const fs = require('fs');
const path = require('path');

const files = [
  'schema.sql',
  'functions.sql',
  'policies.sql',
  'indexes.sql',
  'seed.sql',
  'upgrade.sql'
];

let finalSql = '';

files.forEach(f => {
  const p = path.join(process.cwd(), 'supabase', f);
  if (fs.existsSync(p)) {
    finalSql += `-- ==========================================================\n`;
    finalSql += `-- SOURCE FILE: ${f}\n`;
    finalSql += `-- ==========================================================\n\n`;
    finalSql += fs.readFileSync(p, 'utf8') + '\n\n';
  }
});

const destPath = path.join(process.cwd(), 'supabase', 'setup-all.sql');
fs.writeFileSync(destPath, finalSql);
console.log('[GCS CLI] setup-all.sql generated successfully at:', destPath);
