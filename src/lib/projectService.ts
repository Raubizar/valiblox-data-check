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
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
      return data || [];
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  }

  static async getProjectById(id: string): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(`Failed to fetch project: ${error.message}`);
      if (!data) throw new Error(`Project not found: ${id}`);
      return data;
    } catch (error) {
      console.error('Error in getProjectById:', error);
      throw error;
    }
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
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to create project: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to update project: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(`Failed to delete project: ${error.message}`);
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
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
  static async getReports(userId: string, filters?: ReportFilters): Promise<Report[]> {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          projects(name),
          disciplines(name, code, color)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.project_id) query = query.eq('project_id', filters.project_id);
        if (filters.discipline_id) query = query.eq('discipline_id', filters.discipline_id);
        if (filters.report_type) query = query.eq('report_type', filters.report_type);
        if (filters.start_date) query = query.gte('created_at', filters.start_date);
        if (filters.end_date) query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query;
      
      if (error) throw new Error(`Failed to fetch reports: ${error.message}`);
      return data || [];
    } catch (error) {
      console.error('Error in getReports:', error);
      throw error;
    }
  }

  static async getReportById(id: string): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          projects(name),
          disciplines(name, code, color)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw new Error(`Failed to fetch report: ${error.message}`);
      if (!data) throw new Error(`Report not found: ${id}`);
      return data;
    } catch (error) {
      console.error('Error in getReportById:', error);
      throw error;
    }
  }

  static async saveReport(report: CreateReport, userId: string): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({ ...report, user_id: userId })
        .select()
        .single();
      
      if (error) throw new Error(`Failed to save report: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Error in saveReport:', error);
      throw error;
    }
  }

  static async updateReport(id: string, updates: Partial<Report>, userId: string): Promise<Report> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to update report: ${error.message}`);
      return data;
    } catch (error) {
      console.error('Error in updateReport:', error);
      throw error;
    }
  }

  static async deleteReport(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) throw new Error(`Failed to delete report: ${error.message}`);
    } catch (error) {
      console.error('Error in deleteReport:', error);
      throw error;
    }
  }

  // Dashboard insights
  static async getDashboardInsights(): Promise<DashboardInsights> {
    try {
      // Get basic counts
      const [projectsResult, reportsResult] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id', { count: 'exact', head: true })
      ]);

      if (projectsResult.error) throw new Error(`Failed to count projects: ${projectsResult.error.message}`);
      if (reportsResult.error) throw new Error(`Failed to count reports: ${reportsResult.error.message}`);

      // Get average rates
      const { data: avgRates, error: avgError } = await supabase
        .from('reports')
        .select('match_rate, compliance_rate');

      if (avgError) throw new Error(`Failed to get average rates: ${avgError.message}`);

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

      if (recentError) throw new Error(`Failed to get recent reports: ${recentError.message}`);

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
    } catch (error) {
      console.error('Error in getDashboardInsights:', error);
      throw error;
    }
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
