import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xewxwbngpojfokcaumsx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhld3h3Ym5ncG9qZm9rY2F1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDIyMDQsImV4cCI6MjA2NDgxODIwNH0.yIhnXTa2IrVt5uhpb3BWLSQXgEZdbOK3n-Kgpf5hwmc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
