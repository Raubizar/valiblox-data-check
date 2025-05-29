
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FolderOpen, Calendar } from "lucide-react";

export const ProjectsTab = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Office Building A - Phase 1",
      status: "active",
      lastUpdated: "2024-05-28",
      filesCount: 245,
    },
    {
      id: 2,
      name: "Residential Complex B",
      status: "active",
      lastUpdated: "2024-05-27",
      filesCount: 189,
    },
    {
      id: 3,
      name: "Infrastructure Project C",
      status: "archived",
      lastUpdated: "2024-05-20",
      filesCount: 156,
    },
    {
      id: 4,
      name: "Shopping Mall Development",
      status: "active",
      lastUpdated: "2024-05-26",
      filesCount: 312,
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    namingStandard: "",
  });

  const handleCreateProject = () => {
    if (newProject.name) {
      const project = {
        id: projects.length + 1,
        name: newProject.name,
        status: "active",
        lastUpdated: new Date().toISOString().split('T')[0],
        filesCount: 0,
      };
      setProjects([...projects, project]);
      setNewProject({ name: "", namingStandard: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="namingStandard">Default Naming Standard</Label>
                <Select 
                  value={newProject.namingStandard}
                  onValueChange={(value) => setNewProject({...newProject, namingStandard: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select naming standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cad-standard">CAD Drawing Standard v2.1</SelectItem>
                    <SelectItem value="doc-control">Document Control Standard</SelectItem>
                    <SelectItem value="tech-specs">Technical Specifications</SelectItem>
                    <SelectItem value="qa-standard">Quality Assurance Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateProject} className="w-full bg-green-600 hover:bg-green-700">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                  {project.name}
                </CardTitle>
                <Badge
                  variant={project.status === "active" ? "default" : "secondary"}
                  className={project.status === "active" ? "bg-green-100 text-green-800" : ""}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Last updated: {project.lastUpdated}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FolderOpen className="w-4 h-4 mr-2" />
                {project.filesCount} files
              </div>
              <Button variant="outline" className="w-full">
                Open Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
