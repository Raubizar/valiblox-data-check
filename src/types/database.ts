// Database types for Supabase project management

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface NamingStandard {
  id: string;
  project_id?: string;
  name: string;
  file_data: Uint8Array;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface DrawingList {
  id: string;
  project_id?: string;
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
  drawing_list_id?: string;
  naming_standard_id?: string;
  report_type: 'deliverables' | 'naming';
  title: string;
  results: any; // JSON data from validation results
  summary?: any; // JSON summary statistics
  created_at: string;
}

// Helper types for creating new records
export type CreateProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type CreateNamingStandard = Omit<NamingStandard, 'id' | 'created_at'>;
export type CreateDrawingList = Omit<DrawingList, 'id' | 'created_at'>;
export type CreateReport = Omit<Report, 'id' | 'created_at'>;
