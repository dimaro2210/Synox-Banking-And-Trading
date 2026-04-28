import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkykcuirirhshahtyrih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWtjdWlyaXJoc2hhaHR5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTE4MTAsImV4cCI6MjA4OTE2NzgxMH0.iyXcqygHMukiWFxLp155rqgaSmnangH97iz7bDhGk7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    const tables = ['users', 'transactions', 'notifications', 'open_trades', 'closed_trades', 'pending_deposits'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error querying table '${table}':`, error.message);
        } else {
            console.log(`Table '${table}' exists and is accessible. Columns:`, data.length > 0 ? Object.keys(data[0]) : 'Empty table');
        }
    }
}

checkTables();
