import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FolderOpen, Plus } from "lucide-react";
import { ProjectService } from "@/lib/projectService";
import type { Project, Discipline } from "@/types/database";

interface ProjectContextSelectorProps {
  onProjectChange?: (projectId: string | null, disciplineId: string | null, projectName?: string) => void;
  selectedProjectId?: string | null;
  selectedDisciplineId?: string | null;
  showCreateProject?: boolean;
  className?: string;
}

export const ProjectContextSelector = ({
  onProjectChange,
  selectedProjectId,
  selectedDisciplineId,
  showCreateProject = false,
  className = ""
}: ProjectContextSelectorProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, disciplinesData] = await Promise.all([
        ProjectService.getProjects(),
        ProjectService.getDisciplines()
      ]);
      setProjects(projectsData);
      setDisciplines(disciplinesData);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    onProjectChange?.(projectId, null, project?.name); // Reset discipline when project changes
  };

  const handleDisciplineChange = (disciplineId: string) => {
    const project = projects.find(p => p.id === selectedProjectId);
    onProjectChange?.(selectedProjectId, disciplineId, project?.name);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Project Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-select" className="text-xs">Project</Label>
          <Select
            value={selectedProjectId || ""}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger id="project-select">
              <SelectValue placeholder="Select a project..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProjectId && (
          <div className="space-y-2">
            <Label htmlFor="discipline-select" className="text-xs">Discipline (Optional)</Label>
            <Select
              value={selectedDisciplineId || ""}
              onValueChange={handleDisciplineChange}
            >
              <SelectTrigger id="discipline-select">
                <SelectValue placeholder="Select discipline..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Disciplines</SelectItem>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline.id} value={discipline.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: discipline.color }}
                      />
                      {discipline.name} ({discipline.code})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedProject && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            <div>📁 {selectedProject.name}</div>
            {selectedProject.client && <div>👤 {selectedProject.client}</div>}
            {selectedProject.location && <div>📍 {selectedProject.location}</div>}
          </div>
        )}

        {showCreateProject && projects.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">No projects found</p>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Create Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
