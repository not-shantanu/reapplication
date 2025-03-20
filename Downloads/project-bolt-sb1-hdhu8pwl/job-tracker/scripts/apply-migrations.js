const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://qfemixdottfdgkuhacys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZW1peGRvdHRmZGdrdWhhY3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTA5MDAsImV4cCI6MjA1Nzk4NjkwMH0.BlkYzhSZAcoUhwCR5ihMruAacG-bc4ioTBzYOcUNnd8';
const accessToken = 'sbp_b80a619b776a4333d3dcd10759eacbab0b938367';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigrations() {
  try {
    // Read both SQL files
    const execSqlPath = path.join(__dirname, '../supabase/migrations/20240320_create_exec_sql_function.sql');
    const applicationsPath = path.join(__dirname, '../supabase/migrations/20240320_create_applications_table.sql');
    
    const execSql = fs.readFileSync(execSqlPath, 'utf8');
    const applicationsSql = fs.readFileSync(applicationsPath, 'utf8');

    // First, create the exec_sql function
    console.log('Creating exec_sql function...');
    const { error: execError } = await supabase.rpc('exec_sql', {
      sql: execSql
    });

    if (execError) {
      console.error('Error creating exec_sql function:', execError);
      return;
    }

    // Then, create the applications table
    console.log('Creating applications table...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: applicationsSql
    });

    if (tableError) {
      console.error('Error creating applications table:', tableError);
      return;
    }

    console.log('All migrations applied successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

applyMigrations(); 