import { createClient } from '@supabase/supabase-js';

// Test Supabase connection with new credentials
const supabaseUrl = 'https://ymxaggixvsspegttixoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGFnZ2l4dnNzcGVndHRpeG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjgxMzEsImV4cCI6MjA3MzQ0NDEzMX0.ZlaNkKac6r29A3wNn70oOMICNWuPHoEt2S75GfbTORE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('departments').select('count');
    
    if (error) {
      console.error('Connection test failed:', error.message);
      
      // If tables don't exist yet, that's expected
      if (error.message.includes('relation "public.departments" does not exist')) {
        console.log('✅ Connection successful! Tables need to be created using the migration files.');
        console.log('📝 Next steps:');
        console.log('1. Run the init.sql migration in your Supabase SQL editor');
        console.log('2. Optionally run seed_data.sql for sample data');
        return true;
      }
      return false;
    }
    
    console.log('✅ Connection successful and tables exist!');
    console.log('📊 Database is ready to use.');
    return true;
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

testConnection();
