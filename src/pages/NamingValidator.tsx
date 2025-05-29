
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, X, Upload, FileText, Download, Folder, File } from "lucide-react";

const NamingValidator = () => {
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  // Mock data for demonstration
  const complianceData = {
    totalFiles: 7,
    compliantFiles: 7,
    compliancePercentage: 100
  };

  const validationResults = [
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_F0_E_ELPS_DR_20000_Electrical Services - Earthing & Bonding - Ground Floor Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L0_E_ELPS_DR_30005_Electrical Services - Earthing & Bonding - Foundation Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L0_E_ELPS_DR_30000_Electrical Services - Earthing & Bonding - Ground Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L1_E_ELPS_DR_30001_Electrical Services - Earthing & Bonding - First Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_L2_E_ELPS_DR_30002_Electrical Services - Earthing & Bonding - Second Floor Layout - Suite 1.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_F4_E_ELPS_DR_20004_Electrical Services - Earthing & Bonding - Roof Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    },
    {
      folderPath: "Suite 1 and Office",
      fileName: "NL_AMS1_E_PH01_ETH_P1_E_ELPS_DR_30004_Electrical Services - Earthing & Bonding - First Floor Layout - Office.pdf",
      status: "Ok",
      details: "Delimiter correct; Number of parts correct;"
    }
  ];

  const handleTemplateUpload = () => {
    setTemplateUploaded(true);
  };

  const handleFilesSelect = () => {
    setFilesSelected(true);
    setValidationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Naming Standard Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ensure every file follows your project's Document Naming Standard — fast, consistent, and error-free.
            </p>
          </div>

          {/* Step-by-Step Process */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Step 1: Upload Template */}
              <Card className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Naming Convention Template</h3>
                    <p className="text-gray-600 mb-4">Get the standard template for your project's naming convention.</p>
                    <Button variant="outline" className="w-full mb-2">
                      <Download className="w-4 h-4 mr-2" />
                      Naming Convention Template.xlsx
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Step 2: Upload Your Convention */}
              <Card className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Project Naming Convention</h3>
                    <p className="text-gray-600 mb-4">Upload your customized naming convention file.</p>
                    <Button 
                      onClick={handleTemplateUpload}
                      className={`w-full ${templateUploaded ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {templateUploaded ? 'AMS1-File n...tion App.xlsx' : 'Choose File'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 3: Choose Validation Method */}
            <Card className="p-6 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose an option to check Naming Convention</h3>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Button 
                      onClick={handleFilesSelect}
                      size="lg" 
                      className="bg-yellow-600 hover:bg-yellow-700 text-white h-auto py-4"
                    >
                      <Folder className="w-5 h-5 mr-2" />
                      Select Folder with Files<br />
                      <span className="text-sm opacity-90">Suite 1 and Office</span>
                    </Button>
                    <div className="flex items-center justify-center text-gray-500 font-medium">
                      OR
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 h-auto py-4"
                    >
                      <File className="w-5 h-5 mr-2" />
                      Select Excel File with File Names
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Validation Results */}
          {validationComplete && (
            <div className="mb-16">
              {/* Compliance Summary */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Validation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-2">
                        Total Files Verified: <span className="font-bold text-yellow-600">{complianceData.totalFiles}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Names Comply: <span className="font-bold text-green-600">{complianceData.compliantFiles}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-2">
                        Compliance Percentage: <span className="font-bold text-green-600">{complianceData.compliancePercentage}%</span>
                      </div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div 
                            key={i} 
                            className="w-8 h-4 bg-green-500 rounded-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Progress value={complianceData.compliancePercentage} className="h-3" />
                </CardContent>
              </Card>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Validation Results</CardTitle>
                  <CardDescription>
                    Complete breakdown of file naming compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-800 text-white hover:bg-green-800">
                          <TableHead className="text-yellow-300">Folder Path</TableHead>
                          <TableHead className="text-yellow-300">File Name</TableHead>
                          <TableHead className="text-yellow-300">Compliance Status</TableHead>
                          <TableHead className="text-yellow-300">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.folderPath}</TableCell>
                            <TableCell className="max-w-md">
                              <div className="truncate" title={result.fileName}>
                                {result.fileName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={result.status === 'Ok' ? 'default' : 'destructive'}
                                className={result.status === 'Ok' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              >
                                {result.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {result.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Original How It Works Section - Condensed */}
          {!validationComplete && (
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Upload Your Template</h3>
                      <p className="text-gray-600">Configure your project's naming convention template.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Select Your Files</h3>
                      <p className="text-gray-600">Choose a folder or upload a list of files to validate.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Get Instant Results</h3>
                      <p className="text-gray-600">Receive detailed validation results and compliance metrics.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sample Validation Report</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">DWG_001_Rev_A.dwg</span>
                    <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">RPT_002_Rev_B.pdf</span>
                    <span className="text-xs text-green-600 ml-auto">✓ Valid</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">drawing-file.dwg</span>
                    <span className="text-xs text-red-600 ml-auto">✗ Invalid</span>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Suggestion:</strong> Rename "drawing-file.dwg" to "DWG_003_Rev_A.dwg"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Multiple File Types</CardTitle>
                <CardDescription>
                  Supports DWG, PDF, DOCX, XLSX and more engineering file formats
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Custom Rules</CardTitle>
                <CardDescription>
                  Configure your own naming conventions and validation rules
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>
                  Download detailed validation reports in PDF or Excel format
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NamingValidator;
