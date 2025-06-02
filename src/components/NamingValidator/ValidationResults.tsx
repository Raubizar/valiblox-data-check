import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Filter, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

export const ValidationResults = ({ complianceData, validationResults }: ValidationResultsProps) => {
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
  };
  
  return (
    <div className="mb-16">
      {/* Compliance Summary */}
      <Card className="mb-8 border-2 border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-green-800">Validation Complete</CardTitle>
          <CardDescription className="text-green-600 text-lg">
            Your files have been successfully validated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Files Verified:</span>
                <span className="font-bold text-green-600 text-xl">{complianceData.totalFiles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Names Comply:</span>
                <span className="font-bold text-green-600 text-xl">{complianceData.compliantFiles}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Compliance Rate:</span>
                <span className="font-bold text-green-600 text-xl">{complianceData.compliancePercentage}%</span>
              </div>              <div className="flex space-x-1">
                {Array.from({ length: 10 }, (_, i) => {
                  // Calculate if this box should be filled
                  const threshold = (i + 1) * 10; // 10%, 20%, etc.
                  let colorClass = '';
                  
                  if (complianceData.compliancePercentage >= threshold) {
                    colorClass = 'bg-green-500'; // Fully filled
                  } else if (complianceData.compliancePercentage > (threshold - 10) && 
                            complianceData.compliancePercentage < threshold) {
                    colorClass = 'bg-yellow-500'; // Partially filled
                  } else {
                    colorClass = 'bg-red-200'; // Empty
                  }
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-8 h-4 rounded-sm ${colorClass}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <Progress value={complianceData.compliancePercentage} className="h-4 mb-6" />          <div className="text-center">
            <Button 
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}      <Card className="border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Detailed Validation Results</CardTitle>
          <CardDescription className="text-gray-600">
            Complete breakdown of file naming compliance for your project
          </CardDescription>
          
          {/* Filtering and search controls */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search files or folders..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Files</SelectItem>
                    <SelectItem value="Ok">Compliant</SelectItem>
                    <SelectItem value="Wrong">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="folder">Folder</SelectItem>
                    <SelectItem value="filename">Filename</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
          
          {/* Results count */}
          <div className="text-sm text-gray-500 mt-2">
            Showing {filteredAndSortedResults.length} of {validationResults.length} files
            {statusFilter !== "all" && ` (filtered by ${statusFilter === "Ok" ? "Compliant" : "Non-Compliant"})`}
            {searchTerm && ` (search: "${searchTerm}")`}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 hover:bg-gray-900">
                  <TableHead 
                    className="text-white font-semibold cursor-pointer"
                    onClick={() => toggleSort("folder")}
                  >
                    <div className="flex items-center">
                      Folder Path
                      {sortBy === "folder" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-white font-semibold cursor-pointer"
                    onClick={() => toggleSort("filename")}
                  >
                    <div className="flex items-center">
                      File Name
                      {sortBy === "filename" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-white font-semibold cursor-pointer"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === "status" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-semibold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No results match your current filters. Try adjusting your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedResults.map((result, index) => (
                    <TableRow key={index} className={`hover:bg-gray-50 ${index > 0 && result.folderPath === filteredAndSortedResults[index-1]?.folderPath ? 'border-t-0' : ''}`}>
                      <TableCell className="font-medium text-gray-900">
                        {/* Only show folder path if it's different from the previous row */}
                        {index === 0 || result.folderPath !== filteredAndSortedResults[index-1]?.folderPath ? (
                          <div className="bg-gray-100 px-3 py-1 rounded font-medium -ml-2">{result.folderPath}</div>
                        ) : ''}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate text-gray-700" title={result.fileName}>
                          {result.fileName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={result.status === 'Ok' ? 'default' : 'destructive'}
                          className={result.status === 'Ok' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' : 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200'}
                        >
                          {result.status === 'Ok' ? 
                            <CheckCircle className="w-4 h-4 mr-1" /> : 
                            <span className="mr-1">⚠️</span>
                          }
                          {result.status}
                        </Badge>
                      </TableCell>                    <TableCell className="text-gray-600">
                      <span dangerouslySetInnerHTML={{ __html: result.details.replace(/Parts not compliant:/g, '<span class="text-red-500 font-medium">Parts not compliant:</span>') }} />
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
