import { supabase } from './supabase';
import type { 
  Project, 
  CreateProject, 
  CreateNamingStandard, 
  CreateDrawingList, 
  CreateReport,
  NamingStandard,
  DrawingList,
  Report
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

  static async createProject(project: CreateProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Naming Standards
  static async saveNamingStandard(
    file: File, 
    projectId?: string, 
    name?: string
  ): Promise<NamingStandard> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const namingStandard: CreateNamingStandard = {
      project_id: projectId,
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
        drawing_lists(name, file_name),
        naming_standards(name, file_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
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
