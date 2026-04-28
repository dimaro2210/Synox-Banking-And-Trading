import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkykcuirirhshahtyrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWtjdWlyaXJoc2hhaHR5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTE4MTAsImV4cCI6MjA4OTE2NzgxMH0.iyXcqygHMukiWFxLp155rqgaSmnangH97iz7bDhGk7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runChecks() {
  // 1. Check actual user IDs and format
  console.log('\n=== USERS ===');
  const { data: users } = await supabase.from('users').select('id, email, full_name').limit(5);
  console.log(JSON.stringify(users, null, 2));

  // 2. Try inserting a trade using a real UUID-style id and an existing user id
  if (users && users.length > 0) {
    const userId = users[0].id;
    console.log('\n=== Testing open_trades insert with user_id:', userId, '===');
    
    const { data, error } = await supabase.from('open_trades').insert({
      user_id: userId,
      status: 'open',
      direction: 'UP',
      strategy: 'Test',
      asset_pair: 'BTCUSD',
      leverage: 10,
      amount_usd: 100,
      time_minutes: 5,
      notify_user: 'NO',
      entry_price: 60000,
      placed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
      current_profit: 0
    }).select().single();
    
    if (error) {
      console.log('Insert error:', error.message, error.details, error.hint);
    } else {
      console.log('SUCCESS! Trade inserted:', JSON.stringify(data, null, 2));
      // Clean up
      await supabase.from('open_trades').delete().eq('id', data.id);
      console.log('Cleaned up test trade.');
    }
  }

  // 3. Check closed_trades columns too  
  console.log('\n=== Testing closed_trades insert ===');
  if (users && users.length > 0) {
    const userId = users[0].id;
    const { data, error } = await supabase.from('closed_trades').insert({
      user_id: userId,
      status: 'closed',
      direction: 'UP',
      strategy: 'Test',
      asset_pair: 'BTCUSD',
      leverage: 10,
      amount_usd: 100,
      time_minutes: 5,
      entry_price: 60000,
      placed_at: new Date().toISOString(),
      expires_at: new Date().toISOString(),
      closed_at: new Date().toISOString(),
      profit: 500,
      current_profit: 500
    }).select().single();
    
    if (error) {
      console.log('Closed trades insert error:', error.message, error.details, error.hint);
    } else {
      console.log('closed_trades SUCCESS:', JSON.stringify(data, null, 2));
      await supabase.from('closed_trades').delete().eq('id', data.id);
      console.log('Cleaned up test closed trade.');
    }
  }
}

runChecks();
