import { supabase } from './supabase';
import type { 
  Project, 
  CreateProject, 
  CreateNamingStandard, 
  CreateDrawingList, 
  CreateReport,
  NamingStandard,
  DrawingList,
  Report,
  Discipline,
  ProjectSummary,
  DisciplinePerformance,
  ReportFilters,
  DashboardInsights
} from '../types/database';

export class ProjectService {
  // Projects
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getProjectSummaries(): Promise<ProjectSummary[]> {
    const { data, error } = await supabase
      .from('project_summary')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createProject(project: CreateProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProject(id: string, updates: Partial<CreateProject>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Disciplines
  static async getDisciplines(): Promise<Discipline[]> {
    const { data, error } = await supabase
      .from('disciplines')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  static async getDisciplinePerformance(): Promise<DisciplinePerformance[]> {
    const { data, error } = await supabase
      .from('discipline_performance')
      .select('*')
      .order('total_reports', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  // Naming Standards
  static async saveNamingStandard(
    file: File, 
    projectId?: string,
    disciplineId?: string,
    name?: string
  ): Promise<NamingStandard> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const namingStandard: CreateNamingStandard = {
      project_id: projectId,
      discipline_id: disciplineId,
      name: name || file.name,
      file_data: uint8Array,
      file_name: file.name,
      file_size: file.size
    };

    const { data, error } = await supabase
      .from('naming_standards')
      .insert(namingStandard)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getNamingStandardsByProject(projectId: string): Promise<NamingStandard[]> {
    const { data, error } = await supabase
      .from('naming_standards')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Drawing Lists
  static async saveDrawingList(
    file: File,
    projectId?: string,
    sheetName?: string,
    columnName?: string,
    itemsCount?: number,
    name?: string
  ): Promise<DrawingList> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const drawingList: CreateDrawingList = {
      project_id: projectId,
      name: name || file.name,
      file_data: uint8Array,
      file_name: file.name,
      file_size: file.size,
      sheet_name: sheetName,
      column_name: columnName,
      items_count: itemsCount || 0
    };

    const { data, error } = await supabase
      .from('drawing_lists')
      .insert(drawingList)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  // Reports
  static async saveReport(report: CreateReport): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getReportsByProject(projectId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        disciplines(name, code, color),
        drawing_lists(name, file_name),
        naming_standards(name, file_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getReportsWithFilters(filters: ReportFilters): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select(`
        *,
        projects(name),
        disciplines(name, code, color),
        drawing_lists(name, file_name),
        naming_standards(name, file_name)
      `);

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    
    if (filters.discipline_id) {
      query = query.eq('discipline_id', filters.discipline_id);
    }
    
    if (filters.report_type) {
      query = query.eq('report_type', filters.report_type);
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  static async deleteReport(id: string): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Dashboard insights
  static async getDashboardInsights(): Promise<DashboardInsights> {
    // Get basic counts
    const [projectsResult, reportsResult] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('reports').select('id', { count: 'exact', head: true })
    ]);

    if (projectsResult.error) throw projectsResult.error;
    if (reportsResult.error) throw reportsResult.error;

    // Get average rates
    const { data: avgRates, error: avgError } = await supabase
      .from('reports')
      .select('match_rate, compliance_rate');

    if (avgError) throw avgError;

    const matchRates = avgRates?.filter(r => r.match_rate !== null).map(r => r.match_rate) || [];
    const complianceRates = avgRates?.filter(r => r.compliance_rate !== null).map(r => r.compliance_rate) || [];

    const avgMatchRate = matchRates.length > 0 
      ? matchRates.reduce((sum, rate) => sum + rate, 0) / matchRates.length 
      : 0;
    
    const avgComplianceRate = complianceRates.length > 0 
      ? complianceRates.reduce((sum, rate) => sum + rate, 0) / complianceRates.length 
      : 0;

    // Get recent reports
    const { data: recentReports, error: recentError } = await supabase
      .from('reports')
      .select(`
        *,
        projects(name),
        disciplines(name, code, color)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    // Get project and discipline performance
    const [projectPerformance, disciplinePerformance] = await Promise.all([
      this.getProjectSummaries(),
      this.getDisciplinePerformance()
    ]);

    return {
      total_projects: projectsResult.count || 0,
      total_reports: reportsResult.count || 0,
      avg_match_rate: Math.round(avgMatchRate * 100) / 100,
      avg_compliance_rate: Math.round(avgComplianceRate * 100) / 100,
      recent_reports: recentReports || [],
      project_performance: projectPerformance,
      discipline_performance: disciplinePerformance
    };
  }

  // Helper to convert file data back to File object
  static createFileFromData(
    fileData: Uint8Array, 
    fileName: string, 
    type: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ): File {
    const blob = new Blob([fileData], { type });
    return new File([blob], fileName, { type });
  }
}
