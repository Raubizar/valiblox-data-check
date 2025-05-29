
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, Calendar } from "lucide-react";

export const ProjectsOverview = () => {
  const projects = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects Overview</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
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
