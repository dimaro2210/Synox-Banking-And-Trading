import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkykcuirirhshahtyrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWtjdWlyaXJoc2hhaHR5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTE4MTAsImV4cCI6MjA4OTE2NzgxMH0.iyXcqygHMukiWFxLp155rqgaSmnangH97iz7bDhGk7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOTPSending() {
  const email = 'oziegbedavid43@gmail.com'; 
  
  const { data: userBefore, error: fetchError } = await supabase.from('users').select('id, otp_code').ilike('email', email).single();
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }
  console.log('User ID:', userBefore.id);
  console.log('OTP before:', userBefore.otp_code);

  const freshOtp = 'TEST' + Math.floor(1000 + Math.random() * 9000);
  console.log('Attempting to update to:', freshOtp);
  
  const { error: updateError } = await supabase.from('users').update({ otp_code: freshOtp }).eq('id', userBefore.id);
  
  if (updateError) {
    console.error('Update error:', updateError);
    console.log('REASON: RLS might be blocking updates from the frontend.');
    return;
  }

  const { data: userAfter } = await supabase.from('users').select('otp_code').eq('id', userBefore.id).single();
  console.log('OTP after:', userAfter?.otp_code);

  if (userAfter?.otp_code === freshOtp) {
    console.log('SUCCESS: Database updated.');
  } else {
    console.log('FAILURE: Database did not update (likely RLS error returning success but doing nothing, or no rows matched).');
  }
}

testOTPSending();
