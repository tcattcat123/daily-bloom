import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://hyotkgmgdsmsnnsrvldh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b3RrZ21nZHNtc25uc3J2bGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTIwOTIsImV4cCI6MjA4NTI2ODA5Mn0.EeJM-BksNBUYg2IW3OcwThlciwPk3f2vstwMb7wiKQ0'
);

const { data, error } = await s.from('user_data').select('user_id, data');
if (error) { console.log('ERR', error); process.exit(1); }

for (const r of data) {
  const d = r.data;
  console.log('=== USER:', r.user_id, '===');
  console.log('rituals:', JSON.stringify(d.rituals));
  console.log('habits:', JSON.stringify(d.habits));
  console.log('personalHabits:', JSON.stringify(d.personalHabits));
  console.log('weekData:', JSON.stringify(d.weekData?.map((w) => ({ day: w.name, enabled: w.enabledHabits }))));
  console.log('');
}
