import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xewxwbngpojfokcaumsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3h3Ym5ncG9qZm9rY2F1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDIyMDQsImV4cCI6MjA2NDgxODIwNH0.yIhnXTa2IrVt5uhpb3BWLSQXgEZdbOK3n-Kgpf5hwmc';

async function testDatabaseSetup() {
  try {
    console.log('🔍 Testing Supabase database setup...\n');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let allTestsPassed = true;
    
    // Test 1: Check projects table
    console.log('1. Testing projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.log('❌ Projects table:', projectsError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Projects table exists');
      console.log(`   Found ${projects.length} sample projects`);
    }
    
    // Test 2: Check disciplines table
    console.log('\n2. Testing disciplines table...');
    const { data: disciplines, error: disciplinesError } = await supabase
      .from('disciplines')
      .select('*');
    
    if (disciplinesError) {
      console.log('❌ Disciplines table:', disciplinesError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Disciplines table exists');
      console.log(`   Found ${disciplines.length} disciplines`);
      disciplines.forEach(d => console.log(`   - ${d.name} (${d.code})`));
    }
    
    // Test 3: Check project_summary view
    console.log('\n3. Testing project_summary view...');
    const { data: summary, error: summaryError } = await supabase
      .from('project_summary')
      .select('*')
      .limit(3);
    
    if (summaryError) {
      console.log('❌ Project summary view:', summaryError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Project summary view exists');
      console.log(`   Found ${summary.length} project summaries`);
    }
    
    // Test 4: Check discipline_performance view
    console.log('\n4. Testing discipline_performance view...');
    const { data: performance, error: performanceError } = await supabase
      .from('discipline_performance')
      .select('*')
      .limit(3);
    
    if (performanceError) {
      console.log('❌ Discipline performance view:', performanceError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Discipline performance view exists');
      console.log(`   Found ${performance.length} discipline performance records`);
    }
    
    // Test 5: Test project creation
    console.log('\n5. Testing project creation...');
    const testProject = {
      name: 'Test Project ' + Date.now(),
      description: 'Test project created by setup verification',
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
      allTestsPassed = false;
    } else {
      console.log('✅ Project creation successful');
      console.log(`   Created project: ${newProject.name} (ID: ${newProject.id})`);
      
      // Clean up test project
      await supabase.from('projects').delete().eq('id', newProject.id);
      console.log('   Test project cleaned up');
    }
    
    // Final result
    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
      console.log('🎉 All database tests passed!');
      console.log('✅ Your Supabase database is properly configured');
      console.log('✅ You can now create projects in the dashboard');
    } else {
      console.log('❌ Some database tests failed');
      console.log('💡 Please run the enhanced_supabase_schema.sql in your Supabase dashboard');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('❌ Database setup test failed:', error.message);
    return false;
  }
}

testDatabaseSetup()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  });
