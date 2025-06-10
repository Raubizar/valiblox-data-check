const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xewxwbngpojfokcaumsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3h3Ym5ncG9qZm9rY2F1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDIyMDQsImV4cCI6MjA2NDgxODIwNH0.yIhnXTa2IrVt5uhpb3BWLSQXgEZdbOK3n-Kgpf5hwmc';

async function testProjectOperations() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Check if projects table exists
    console.log('\n1. Testing if projects table exists...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message);
      console.log('Error code:', projectsError.code);
      
      if (projectsError.code === 'PGRST116') {
        console.log('💡 Projects table does not exist. Need to run schema setup.');
        return false;
      }
    } else {
      console.log('✅ Projects table exists');
      console.log('Current projects:', projectsData?.length || 0);
    }
    
    // Test 2: Try to create a test project
    console.log('\n2. Testing project creation...');
    const testProject = {
      name: 'Test Project ' + Date.now(),
      description: 'Test project created by automated test',
      client: 'Test Client',
      location: 'Test Location',
      status: 'active'
    };
    
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Project creation failed:', createError.message);
      console.log('Error code:', createError.code);
      console.log('Error details:', createError.details);
      return false;
    } else {
      console.log('✅ Project created successfully!');
      console.log('New project ID:', newProject.id);
      
      // Clean up - delete the test project
      console.log('\n3. Cleaning up test project...');
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', newProject.id);
      
      if (deleteError) {
        console.log('⚠️ Failed to clean up test project:', deleteError.message);
      } else {
        console.log('✅ Test project cleaned up successfully');
      }
    }
    
    // Test 3: Check project_summary view
    console.log('\n4. Testing project_summary view...');
    const { data: summaryData, error: summaryError } = await supabase
      .from('project_summary')
      .select('*')
      .limit(1);
    
    if (summaryError) {
      console.log('❌ Project summary view error:', summaryError.message);
      console.log('Error code:', summaryError.code);
    } else {
      console.log('✅ Project summary view exists');
      console.log('Summary data available:', summaryData?.length || 0);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error:', error.message);
    return false;
  }
}

testProjectOperations()
  .then(success => {
    if (success) {
      console.log('\n🎉 All project operations work correctly!');
    } else {
      console.log('\n❌ Some project operations failed. Database schema may need to be set up.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  });
