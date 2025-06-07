import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderOpen, Plus } from "lucide-react";
import { ProjectService } from "@/lib/projectService";
import type { Project } from "@/types/database";

interface CompactProjectSelectorProps {
  selectedProject: Project | null;
  onProjectSelect: (project: Project | null) => void;
}

export const CompactProjectSelector = ({ selectedProject, onProjectSelect }: CompactProjectSelectorProps) => {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([
    { 
      id: "sample-1", 
      name: "Downtown Office Complex", 
      description: "Mixed-use commercial development",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "sample-2", 
      name: "Residential Tower A", 
      description: "High-rise residential building",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      setIsCreating(true);
      
      // Create the project
      const newProject = await ProjectService.createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined
      });
      
      // Add to local list and select it
      setAvailableProjects(prev => [...prev, newProject]);
      onProjectSelect(newProject);
      
      // Reset form and close dialog
      setNewProjectName("");
      setNewProjectDescription("");
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    if (projectId === "none") {
      onProjectSelect(null);
    } else {
      const project = availableProjects.find(p => p.id === projectId);
      onProjectSelect(project || null);
    }
  };
  return (
    <Card className="w-full max-w-md bg-blue-50 border-blue-200">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-medium text-blue-900">Project:</Label>
          </div>
          
          <div className="flex-1 min-w-0">
            <Select 
              value={selectedProject?.id || "none"} 
              onValueChange={handleProjectChange}
            >
              <SelectTrigger className="h-8 text-sm bg-white border-blue-300">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project selected</SelectItem>
                {availableProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      {project.description && (
                        <span className="text-xs text-gray-500 truncate">{project.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-3 text-xs border-blue-300 text-blue-700 hover:bg-blue-100">
                <Plus className="w-3 h-3 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to save your naming validation results.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Description (Optional)</Label>
                  <Input
                    id="projectDescription"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Brief project description"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setNewProjectName("");
                      setNewProjectDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={isCreating || !newProjectName.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreating ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {selectedProject && (
          <div className="mt-2 text-xs text-blue-700">
            Reports will be saved to: <span className="font-medium">{selectedProject.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
