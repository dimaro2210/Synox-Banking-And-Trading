import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkykcuirirhshahtyrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWtjdWlyaXJoc2hhaHR5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTE4MTAsImV4cCI6MjA4OTE2NzgxMH0.iyXcqygHMukiWFxLp155rqgaSmnangH97iz7bDhGk7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersSchema() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error fetching user:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in users table:', Object.keys(data[0]));
  } else {
    console.log('No users found to check schema.');
  }
}

checkUsersSchema();
