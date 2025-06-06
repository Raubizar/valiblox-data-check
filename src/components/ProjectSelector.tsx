import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { FolderOpen, Plus, Loader2 } from 'lucide-react';
import { ProjectService } from '../lib/projectService';
import type { Project } from '../types/database';

interface ProjectSelectorProps {
  selectedProject?: Project | null;
  onProjectSelect: (project: Project | null) => void;
  onNamingStandardLoad?: (file: File) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject,
  onProjectSelect,
  onNamingStandardLoad
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const projectList = await ProjectService.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      setIsCreating(true);
      const newProject = await ProjectService.createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined
      });
      
      setProjects(prev => [newProject, ...prev]);
      onProjectSelect(newProject);
      setShowCreateNew(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    if (projectId === 'new') {
      setShowCreateNew(true);
      return;
    }
    
    if (projectId === 'none') {
      onProjectSelect(null);
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (project) {
      onProjectSelect(project);
      loadNamingStandardForProject(project.id);
    }
  };

  const loadNamingStandardForProject = async (projectId: string) => {
    try {
      const namingStandards = await ProjectService.getNamingStandardsByProject(projectId);
      if (namingStandards.length > 0 && onNamingStandardLoad) {
        // Load the most recent naming standard
        const latest = namingStandards[0];
        const file = ProjectService.createFileFromData(latest.file_data, latest.file_name);
        onNamingStandardLoad(file);
      }
    } catch (error) {
      console.error('Error loading naming standard:', error);
    }
  };

  if (showCreateNew) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
        <div className="flex items-center mb-4">
          <FolderOpen className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <Input
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Brief project description..."
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isCreating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateNew(false);
                setNewProjectName('');
                setNewProjectDescription('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FolderOpen className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Project Selection</h3>
          <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
        </div>
        {selectedProject && (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            Project Selected
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Select a project to auto-load naming standards and save your validation results.
        </p>
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <Select
              value={selectedProject?.id || 'none'}
              onValueChange={handleProjectChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Loading projects..." : "Select a project..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project selected</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Project
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProject && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {selectedProject.name}
                </p>
                {selectedProject.description && (
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedProject.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProjectSelect(null)}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
