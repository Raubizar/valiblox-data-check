import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, FolderOpen, Calendar, ChevronDown, BarChart3, FileText, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ProjectService } from "@/lib/projectService";
import type { ProjectSummary, CreateProject } from "@/types/database";
import { SpeedometerChart } from "@/components/SpeedometerChart";

export const ProjectsTab = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);
  const [newProject, setNewProject] = useState<CreateProject>({
    name: '',
    description: '',
    client: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await ProjectService.getProjectSummaries();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!newProject.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Project name is required.",
          variant: "destructive",
        });
        return;
      }

      await ProjectService.createProject(newProject);
      
      toast({
        title: "Success",
        description: "Project created successfully!",
      });

      setShowCreateModal(false);
      setNewProject({
        name: '',
        description: '',
        client: '',
        location: '',
        status: 'active'
      });
      
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = async () => {
    try {
      if (!editingProject || !editingProject.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Project name is required.",
          variant: "destructive",
        });
        return;
      }      await ProjectService.updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
        client: editingProject.client,
        location: editingProject.location,
        status: editingProject.status as 'active' | 'completed' | 'on_hold' | 'cancelled'
      });
      
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });

      setShowEditModal(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await ProjectService.deleteProject(projectId);
      
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (project: ProjectSummary) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'on_hold': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={newProject.client || ''}
                  onChange={(e) => setNewProject(prev => ({...prev, client: e.target.value}))}
                  placeholder="Client name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProject.location || ''}
                  onChange={(e) => setNewProject(prev => ({...prev, location: e.target.value}))}
                  placeholder="Project location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProject.status} 
                  onValueChange={(value: any) => setNewProject(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description || ''}
                  onChange={(e) => setNewProject(prev => ({...prev, description: e.target.value}))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Project Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            {editingProject && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Project Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject(prev => prev ? {...prev, name: e.target.value} : null)}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-client">Client</Label>
                  <Input
                    id="edit-client"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject(prev => prev ? {...prev, client: e.target.value} : null)}
                    placeholder="Client name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject(prev => prev ? {...prev, location: e.target.value} : null)}
                    placeholder="Project location"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingProject.status} 
                    onValueChange={(value: any) => setEditingProject(prev => prev ? {...prev, status: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject(prev => prev ? {...prev, description: e.target.value} : null)}
                    placeholder="Project description"
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProject}>
                Update Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first project to start organizing your reports and validations.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <Collapsible>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {project.client && (
                          <div>Client: {project.client}</div>
                        )}
                        {project.location && (
                          <div>Location: {project.location}</div>
                        )}
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {project.total_reports} reports
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Updated {formatDate(project.updated_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Performance Indicators */}
                      <div className="flex gap-4">
                        {project.avg_match_rate !== null && project.avg_match_rate !== undefined && (
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Match Rate</div>
                            <SpeedometerChart 
                              percentage={Math.round(project.avg_match_rate)} 
                              label=""
                              size={60}
                            />
                          </div>
                        )}
                        
                        {project.avg_compliance_rate !== null && project.avg_compliance_rate !== undefined && (
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Compliance</div>
                            <SpeedometerChart 
                              percentage={Math.round(project.avg_compliance_rate)} 
                              label=""
                              size={60}
                            />
                          </div>
                        )}
                      </div>
                      
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">Deliverables Reports</div>
                        <div className="text-2xl font-bold text-blue-900">{project.deliverables_reports || 0}</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-green-900">Naming Reports</div>
                        <div className="text-2xl font-bold text-green-900">{project.naming_reports || 0}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-purple-900">Avg Match Rate</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {project.avg_match_rate !== null ? `${Math.round(project.avg_match_rate)}%` : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-orange-900">Avg Compliance</div>
                        <div className="text-2xl font-bold text-orange-900">
                          {project.avg_compliance_rate !== null ? `${Math.round(project.avg_compliance_rate)}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(project)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
