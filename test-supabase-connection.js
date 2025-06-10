import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xewxwbngpojfokcaumsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3h3Ym5ncG9qZm9rY2F1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDIyMDQsImV4cCI6MjA2NDgxODIwNH0.yIhnXTa2IrVt5uhpb3BWLSQXgEZdbOK3n-Kgpf5hwmc';

async function testSupabaseConnection() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    console.log('Testing connection with simple query...');
    
    // Try a very simple query
    const { data, error } = await supabase
      .from('non_existent_table')
      .select('*')
      .limit(1);
    
    // We expect this to fail with a "table doesn't exist" error, which means connection works
    if (error) {
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        console.log('✅ Connection successful! (Table not found error is expected)');
        console.log('Database is accessible and responding');
        return true;
      } else {
        console.log('❌ Connection error:', error.message);
        console.log('Error code:', error.code);
        return false;
      }
    }
    
    console.log('✅ Unexpected success - table exists:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.error('💡 Network issue - check internet connection');
    } else if (error.message.includes('key')) {
      console.error('💡 Authentication issue - check API key');
    }
    
    return false;
  }
}

testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Supabase is ready to use!');
    } else {
      console.log('\n💥 Supabase setup needs attention');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
