-- Supabase Database Schema for Project Management
-- Run this in your Supabase SQL Editor

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Naming Standards table (stores Excel files as blobs)
CREATE TABLE IF NOT EXISTS naming_standards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_data BYTEA NOT NULL, -- Excel file content
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drawing Lists table (stores Excel files as blobs)
CREATE TABLE IF NOT EXISTS drawing_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_data BYTEA NOT NULL, -- Excel file content
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  sheet_name VARCHAR(255),
  column_name VARCHAR(255),
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (stores validation results)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  drawing_list_id UUID REFERENCES drawing_lists(id) ON DELETE SET NULL,
  naming_standard_id UUID REFERENCES naming_standards(id) ON DELETE SET NULL,
  report_type VARCHAR(50) NOT NULL, -- 'deliverables' or 'naming'
  title VARCHAR(255) NOT NULL,
  results JSONB NOT NULL, -- Store the comparison/validation results
  summary JSONB, -- Store summary statistics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_naming_standards_project ON naming_standards(project_id);
CREATE INDEX IF NOT EXISTS idx_drawing_lists_project ON drawing_lists(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

-- Enable Row Level Security (RLS) - for future auth implementation
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for now, until auth is implemented)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on naming_standards" ON naming_standards FOR ALL USING (true);
CREATE POLICY "Allow all operations on drawing_lists" ON drawing_lists FOR ALL USING (true);
CREATE POLICY "Allow all operations on reports" ON reports FOR ALL USING (true);

-- Insert some sample projects for testing
INSERT INTO projects (name, description) VALUES 
  ('Office Building Project', 'Commercial office building with MEP and structural drawings'),
  ('Residential Complex', 'Multi-story residential building project'),
  ('Hospital Renovation', 'Medical facility renovation and expansion project')
ON CONFLICT DO NOTHING;
