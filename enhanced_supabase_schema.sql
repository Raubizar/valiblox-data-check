-- Enhanced Supabase Database Schema for Project Management with Disciplines
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS drawing_lists CASCADE;
DROP TABLE IF EXISTS naming_standards CASCADE;
DROP TABLE IF EXISTS disciplines CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client VARCHAR(255),
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disciplines lookup table
CREATE TABLE disciplines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280', -- Hex color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default disciplines
INSERT INTO disciplines (name, code, description, color) VALUES 
  ('Architectural', 'ARC', 'Architectural drawings and plans', '#EF4444'),
  ('Structural', 'STR', 'Structural engineering drawings', '#3B82F6'),
  ('Mechanical', 'MEC', 'Mechanical systems and HVAC', '#10B981'),
  ('Electrical', 'ELE', 'Electrical systems and power', '#F59E0B'),
  ('Plumbing', 'PLB', 'Plumbing and water systems', '#8B5CF6'),
  ('Fire Protection', 'FP', 'Fire safety and protection systems', '#DC2626'),
  ('Civil', 'CIV', 'Civil engineering and site work', '#059669'),
  ('General', 'GEN', 'General or multi-discipline documents', '#6B7280');

-- Naming Standards table (stores Excel files as blobs)
CREATE TABLE naming_standards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  file_data BYTEA NOT NULL, -- Excel file content
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drawing Lists table (stores Excel files as blobs)
CREATE TABLE drawing_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  file_data BYTEA NOT NULL, -- Excel file content
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  sheet_name VARCHAR(255),
  column_name VARCHAR(255),
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (stores validation results with discipline tagging)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE SET NULL,
  drawing_list_id UUID REFERENCES drawing_lists(id) ON DELETE SET NULL,
  naming_standard_id UUID REFERENCES naming_standards(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('deliverables', 'naming')),
  title VARCHAR(255) NOT NULL,
  results JSONB NOT NULL,
  summary JSONB,
  file_count INTEGER DEFAULT 0,
  match_rate DECIMAL(5,2),
  compliance_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  renamed_at TIMESTAMP WITH TIME ZONE
);

-- Add user_id and renamed_at columns if table already exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='user_id') THEN
    ALTER TABLE reports ADD COLUMN user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='renamed_at') THEN
    ALTER TABLE reports ADD COLUMN renamed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow users to access their own reports
CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own reports" ON reports
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete their own reports" ON reports
  FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Users can update their own reports" ON reports
  FOR UPDATE USING (user_id = auth.uid());

-- Trigger to update renamed_at when title changes
CREATE OR REPLACE FUNCTION update_renamed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title IS DISTINCT FROM OLD.title THEN
    NEW.renamed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_renamed_at ON reports;
CREATE TRIGGER set_renamed_at
  BEFORE UPDATE OF title ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_renamed_at();

-- Create indexes for better performance
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_disciplines_code ON disciplines(code);
CREATE INDEX idx_naming_standards_project ON naming_standards(project_id);
CREATE INDEX idx_naming_standards_discipline ON naming_standards(discipline_id);
CREATE INDEX idx_drawing_lists_project ON drawing_lists(project_id);
CREATE INDEX idx_drawing_lists_discipline ON drawing_lists(discipline_id);
CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_reports_discipline ON reports(discipline_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Enable Row Level Security (RLS) - for future auth implementation
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawing_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for now, until auth is implemented)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on disciplines" ON disciplines FOR ALL USING (true);
CREATE POLICY "Allow all operations on naming_standards" ON naming_standards FOR ALL USING (true);
CREATE POLICY "Allow all operations on drawing_lists" ON drawing_lists FOR ALL USING (true);
CREATE POLICY "Allow all operations on reports" ON reports FOR ALL USING (true);

-- Insert sample projects for testing
INSERT INTO projects (name, description, client, location, status) VALUES 
  ('Office Building Project', 'Commercial office building with MEP and structural drawings', 'ABC Corporation', 'New York, NY', 'active'),
  ('Residential Complex', 'Multi-story residential building project', 'XYZ Developers', 'Los Angeles, CA', 'active'),
  ('Hospital Renovation', 'Medical facility renovation and expansion project', 'City Health System', 'Chicago, IL', 'on_hold');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create views for dashboard insights
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.client,
    p.location,
    p.status,
    COUNT(DISTINCT r.id) as total_reports,
    COUNT(DISTINCT CASE WHEN r.report_type = 'deliverables' THEN r.id END) as deliverables_reports,
    COUNT(DISTINCT CASE WHEN r.report_type = 'naming' THEN r.id END) as naming_reports,
    AVG(CASE WHEN r.report_type = 'deliverables' THEN r.match_rate END) as avg_match_rate,
    AVG(CASE WHEN r.report_type = 'naming' THEN r.compliance_rate END) as avg_compliance_rate,
    MAX(r.created_at) as last_report_date,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN reports r ON p.id = r.project_id
GROUP BY p.id, p.name, p.description, p.client, p.location, p.status, p.created_at, p.updated_at;

CREATE VIEW discipline_performance AS
SELECT 
    d.id,
    d.name,
    d.code,
    d.color,
    COUNT(DISTINCT r.id) as total_reports,
    AVG(CASE WHEN r.report_type = 'deliverables' THEN r.match_rate END) as avg_match_rate,
    AVG(CASE WHEN r.report_type = 'naming' THEN r.compliance_rate END) as avg_compliance_rate,
    COUNT(DISTINCT r.project_id) as projects_count
FROM disciplines d
LEFT JOIN reports r ON d.id = r.discipline_id
GROUP BY d.id, d.name, d.code, d.color;

SELECT column_name FROM information_schema.columns WHERE table_name = 'reports';
