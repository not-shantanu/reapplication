import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local file');
  process.exit(1);
}

console.log('Using URL:', supabaseUrl);
console.log('Using key:', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabase() {
  console.log('Testing database connection...');

  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('verification_pending')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('Connection successful!');
      console.log('Data:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testDatabase(); 