import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with hardcoded values
const supabaseUrl = 'https://xewxwbngpojfokcaumsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3h3Ym5ncG9qZm9rY2F1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDIyMDQsImV4cCI6MjA2NDgxODIwNH0.yIhnXTa2IrVt5uhpb3BWLSQXgEZdbOK3n-Kgpf5hwmc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'enhanced_supabase_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log('Applying database schema...');

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.error('Error executing statement:', error);
        console.error('Statement:', statement);
        throw error;
      }
    }

    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Failed to apply schema:', error);
    process.exit(1);
  }
}

applySchema(); 