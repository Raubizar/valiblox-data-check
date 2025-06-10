import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Filter, ArrowUpDown, Search, Save, Loader2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SpeedometerChart from "@/components/SpeedometerChart";
import { generateNamingValidationPDF } from "@/lib/pdfGenerator";
import type { Project } from "@/types/database";

interface ValidationResult {
  folderPath: string;
  fileName: string;
  status: string;
  details: string;
}

interface ComplianceData {
  totalFiles: number;
  compliantFiles: number;
  compliancePercentage: number;
}

interface ValidationResultsProps {
  complianceData: ComplianceData;
  validationResults: ValidationResult[];
  onDownloadRequest?: () => void;
  onSaveToProject?: () => void;
  selectedProject?: Project | null;
  selectedDiscipline?: string;
  isSaving?: boolean;
}

export const ValidationResults = ({ 
  complianceData, 
  validationResults, 
  onDownloadRequest,
  onSaveToProject,
  selectedProject,
  selectedDiscipline,
  isSaving = false
}: ValidationResultsProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("folder");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    // First filter the results
    let filtered = [...validationResults];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(result => result.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(result => 
        result.fileName.toLowerCase().includes(term) || 
        result.folderPath.toLowerCase().includes(term) ||
        result.details.toLowerCase().includes(term)
      );
    }
    
    // Then sort the results
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "folder":
          comparison = a.folderPath.localeCompare(b.folderPath);
          break;
        case "filename":
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [validationResults, statusFilter, sortBy, sortDirection, searchTerm]);
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };
    const exportToCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary information
    csvContent += `"Total Files Verified","${complianceData.totalFiles}"\n`;
    csvContent += `"Names Comply","${complianceData.compliantFiles}"\n`;
    csvContent += `"Compliance Percentage","${complianceData.compliancePercentage}%"\n\n`;
    
    // Add additional filter information if applied
    if (statusFilter !== "all" || searchTerm) {
      csvContent += `"Filtered Results:","${filteredAndSortedResults.length} of ${validationResults.length} files shown"\n`;
      if (statusFilter !== "all") {
        csvContent += `"Status Filter:","${statusFilter === 'Ok' ? 'Compliant' : 'Non-Compliant'}"\n`;
      }
      if (searchTerm) {
        csvContent += `"Search Term:","${searchTerm}"\n`;
      }
      csvContent += `\n`;
    }
    
    // Add headers
    csvContent += '"Folder Path","File Name","Status","Details"\n';
    
    // Add currently filtered validation results
    filteredAndSortedResults.forEach(result => {
      // Remove HTML tags from details for CSV export
      const cleanDetails = result.details.replace(/<[^>]*>/g, '');
      csvContent += `"${result.folderPath}","${result.fileName}","${result.status}","${cleanDetails}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "naming_validation_results.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };    const handlePDFExport = async () => {
    try {
      await generateNamingValidationPDF(
        complianceData, 
        filteredAndSortedResults,
        selectedProject?.id,
        selectedDiscipline || undefined,
        selectedProject?.name
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here
    }
  };

  return (
    <div className="mb-16">      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-pdf-summary>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Naming Validation Summary
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          ({complianceData.totalFiles} files verified)
        </p>        <div className="overflow-x-auto">          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Compliance Rate</th>
              </tr>
            </thead>
            <tbody>              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Compliant</span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-green-600">
                  {complianceData.compliantFiles}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-green-600">
                  {complianceData.compliancePercentage}%
                </td>
                <td className="py-3 px-4" rowSpan={2}>
                  <div className="flex justify-center">
                    <SpeedometerChart 
                      percentage={complianceData.compliancePercentage} 
                      label="Compliance Rate"
                      size={100}
                    />
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Non-Compliant</span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-red-600">
                  {complianceData.totalFiles - complianceData.compliantFiles}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-red-600">
                  {100 - complianceData.compliancePercentage}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Action Buttons */}        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            onClick={onDownloadRequest || exportToCSV}
            variant="outline"
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
          
          <Button 
            onClick={handlePDFExport}
            variant="outline"
            className="flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export to PDF
          </Button>
          
          {selectedProject && onSaveToProject && (
            <Button 
              onClick={onSaveToProject}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save to {selectedProject.name}
                </>
              )}
            </Button>
          )}
        </div>      </div>{/* Detailed Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-pdf-details>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Detailed Validation Results
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search files or folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="Ok">Compliant</SelectItem>
                <SelectItem value="Wrong">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="folder">Folder</SelectItem>
                <SelectItem value="filename">Filename</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="flex items-center"
            >
              {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
            </Button>
          </div>
        </div>

        {/* Results Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Folder Path
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-5/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedResults.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No results match your current filters. Try adjusting your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 break-words">
                        <div className="break-all">
                          {result.folderPath}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 break-words">
                        <div className="break-all">
                          {result.fileName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={result.status === 'Ok' ? 
                            'bg-green-100 text-green-800 border-green-200' : 
                            'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {result.status === 'Ok' ? 
                            <CheckCircle className="w-3 h-3 mr-1" /> : 
                            '⚠️'
                          }
                          {result.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span dangerouslySetInnerHTML={{ 
                          __html: result.details.replace(/Parts not compliant:/g, '<span class="text-red-500 font-medium">Parts not compliant:</span>') 
                        }} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedResults.length} of {validationResults.length} total results
          {statusFilter !== "all" && ` (filtered by ${statusFilter === "Ok" ? "Compliant" : "Non-Compliant"})`}
          {searchTerm && ` (search: "${searchTerm}")`}
        </div>
      </div>
    </div>
  );
};
