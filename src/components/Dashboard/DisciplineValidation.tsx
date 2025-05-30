
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface ValidationProject {
  id: number;
  name: string;
  disciplines: {
    id: number;
    name: string;
    color: string;
    fileScope: string;
  }[];
}

export const DisciplineValidation = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);

  const projects: ValidationProject[] = [
    {
      id: 1,
      name: "Office Building A - Phase 1",
      disciplines: [
        { id: 1, name: "Architecture", color: "bg-blue-500", fileScope: "ARCH_*" },
        { id: 2, name: "Structure", color: "bg-green-500", fileScope: "STRUCT_*" },
        { id: 3, name: "MEP", color: "bg-orange-500", fileScope: "MEP_*" }
      ]
    },
    {
      id: 2,
      name: "Residential Complex B",
      disciplines: [
        { id: 4, name: "Architecture", color: "bg-blue-500", fileScope: "ARCH_*" },
        { id: 5, name: "Landscape", color: "bg-green-600", fileScope: "LAND_*" }
      ]
    }
  ];

  const getSelectedProject = () => {
    return projects.find(p => p.id.toString() === selectedProject);
  };

  const getSelectedDiscipline = () => {
    const project = getSelectedProject();
    return project?.disciplines.find(d => d.id.toString() === selectedDiscipline);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
  };

  const runValidation = () => {
    const discipline = getSelectedDiscipline();
    if (!discipline || uploadedFiles.length === 0) return;

    // Simulate validation results
    const results = {
      disciplineName: discipline.name,
      totalFiles: uploadedFiles.length,
      passedFiles: Math.floor(uploadedFiles.length * 0.85),
      failedFiles: Math.ceil(uploadedFiles.length * 0.15),
      issues: [
        { file: "ARCH_001_Rev_A.dwg", issue: "Missing revision suffix" },
        { file: "ARCH_floor_plan.pdf", issue: "Incorrect naming convention" }
      ]
    };
    
    setValidationResults(results);
  };

  const sendReports = () => {
    console.log("Sending discipline-specific report to team...");
    console.log("Sending summary report to project manager...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Discipline Validation</h2>
        <p className="text-gray-600">Upload and validate files for specific project disciplines</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project & Discipline Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discipline">Select Discipline</Label>
              <Select 
                value={selectedDiscipline} 
                onValueChange={setSelectedDiscipline}
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a discipline" />
                </SelectTrigger>
                <SelectContent>
                  {getSelectedProject()?.disciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${discipline.color}`}></div>
                        <span>{discipline.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {discipline.fileScope}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDiscipline && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>File Scope:</strong> Only upload files matching the pattern "{getSelectedDiscipline()?.fileScope}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900">
                    Drop files here or click to upload
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload files for {getSelectedDiscipline()?.name || 'selected discipline'}
                  </p>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={!selectedDiscipline}
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={runValidation}
              disabled={!selectedDiscipline || uploadedFiles.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Run Validation
            </Button>
          </div>
        </CardContent>
      </Card>

      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Validation Results - {validationResults.disciplineName}</span>
              {validationResults.failedFiles === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{validationResults.totalFiles}</div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{validationResults.passedFiles}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{validationResults.failedFiles}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            {validationResults.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Issues Found:</h4>
                {validationResults.issues.map((issue: any, index: number) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-800">{issue.file}</div>
                    <div className="text-sm text-red-600">{issue.issue}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <Button onClick={sendReports} className="bg-blue-600 hover:bg-blue-700">
                Send Reports
              </Button>
              <Button variant="outline">
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
