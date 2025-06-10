// Database types for Supabase project management

export interface Project {
  id: string;
  name: string;
  description?: string;
  client?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Discipline {
  id: string;
  name: string;
  code: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface NamingStandard {
  id: string;
  project_id?: string;
  discipline_id?: string;
  name: string;
  file_data: Uint8Array;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface DrawingList {
  id: string;
  project_id?: string;
  discipline_id?: string;
  name: string;
  file_data: Uint8Array;
  file_name: string;
  file_size: number;
  sheet_name?: string;
  column_name?: string;
  items_count: number;
  created_at: string;
}

export interface Report {
  id: string;
  project_id?: string;
  discipline_id?: string;
  drawing_list_id?: string;
  naming_standard_id?: string;
  report_type: 'deliverables' | 'naming';
  title: string;
  results: any; // JSON data from validation results
  summary?: any; // JSON summary statistics
  file_count: number;
  match_rate?: number; // For deliverables reports
  compliance_rate?: number; // For naming validation reports
  created_at: string;
}

// Dashboard view types
export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  client?: string;
  location?: string;
  status: string;
  total_reports: number;
  deliverables_reports: number;
  naming_reports: number;
  avg_match_rate?: number;
  avg_compliance_rate?: number;
  last_report_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DisciplinePerformance {
  id: string;
  name: string;
  code: string;
  color: string;
  total_reports: number;
  avg_match_rate?: number;
  avg_compliance_rate?: number;
  projects_count: number;
}

// Filter and query types
export interface ReportFilters {
  project_id?: string;
  discipline_id?: string;
  report_type?: 'deliverables' | 'naming';
  date_from?: string;
  date_to?: string;
}

export interface DashboardInsights {
  total_projects: number;
  total_reports: number;
  avg_match_rate: number;
  avg_compliance_rate: number;
  recent_reports: Report[];
  project_performance: ProjectSummary[];
  discipline_performance: DisciplinePerformance[];
}

// Helper types for creating new records
export type CreateProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type CreateNamingStandard = Omit<NamingStandard, 'id' | 'created_at'>;
export type CreateDrawingList = Omit<DrawingList, 'id' | 'created_at'>;
export type CreateReport = Omit<Report, 'id' | 'created_at'>;
