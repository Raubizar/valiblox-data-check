
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download } from "lucide-react";

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
  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary information
    csvContent += `"Total Files Verified","${complianceData.totalFiles}"\n`;
    csvContent += `"Names Comply","${complianceData.compliantFiles}"\n`;
    csvContent += `"Compliance Percentage","${complianceData.compliancePercentage}%"\n\n`;
    
    // Add headers
    csvContent += '"Folder Path","File Name","Status","Details"\n';
    
    // Add validation results
    validationResults.forEach(result => {
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

      {/* Detailed Results Table */}
      <Card className="border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Detailed Validation Results</CardTitle>
          <CardDescription className="text-gray-600">
            Complete breakdown of file naming compliance for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 hover:bg-gray-900">
                  <TableHead className="text-white font-semibold">Folder Path</TableHead>
                  <TableHead className="text-white font-semibold">File Name</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationResults.map((result, index) => (                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{result.folderPath}</TableCell>
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
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <span dangerouslySetInnerHTML={{ __html: result.details.replace(/Parts not compliant:/g, '<span class="text-red-500 font-medium">Parts not compliant:</span>') }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
