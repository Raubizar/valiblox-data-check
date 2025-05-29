
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, X, Upload, FileText, Download, Folder, File, ArrowRight } from "lucide-react";

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
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Naming Standard <span className="text-green-600">Validator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Ensure every file follows your project's Document Naming Standard — fast, consistent, and error-free.
            </p>
            {!validationComplete && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                  View Demo
                </Button>
              </div>
            )}
          </div>

          {/* Step-by-Step Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Simple 3-Step Process</h2>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Step 1: Download Template */}
              <Card className="p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Template</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Get the standard template for your project's naming convention.</p>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      <Download className="w-5 h-5 mr-2" />
                      Naming Convention Template.xlsx
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Step 2: Upload Your Convention */}
              <Card className="p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-lg">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Convention</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Upload your customized naming convention file.</p>
                    <Button 
                      onClick={handleTemplateUpload}
                      className={`w-full ${templateUploaded ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {templateUploaded ? 'AMS1-File n...tion App.xlsx ✓' : 'Choose File'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 3: Choose Validation Method */}
            <Card className="p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Validation Method</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Select files or folders to validate against your naming convention.</p>
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <Button 
                      onClick={handleFilesSelect}
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white h-auto py-4 px-6"
                    >
                      <Folder className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div>Select Folder</div>
                        <div className="text-sm opacity-90">Suite 1 and Office</div>
                      </div>
                    </Button>
                    <div className="flex items-center justify-center">
                      <span className="text-gray-400 font-medium text-lg">OR</span>
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 h-auto py-4 px-6"
                    >
                      <File className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div>Excel File</div>
                        <div className="text-sm opacity-75">with file names</div>
                      </div>
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
                  <Progress value={complianceData.compliancePercentage} className="h-4 mb-6" />
                  <div className="text-center">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
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
                        {validationResults.map((result, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{result.folderPath}</TableCell>
                            <TableCell className="max-w-md">
                              <div className="truncate text-gray-700" title={result.fileName}>
                                {result.fileName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={result.status === 'Ok' ? 'default' : 'destructive'}
                                className={result.status === 'Ok' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' : ''}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {result.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {result.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* How It Works Section - Only show when not completed */}
          {!validationComplete && (
            <div className="grid lg:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Upload Your Template</h3>
                      <p className="text-gray-600 leading-relaxed">Configure your project's naming convention template with custom rules and requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Select Your Files</h3>
                      <p className="text-gray-600 leading-relaxed">Choose a folder or upload a list of files to validate against your standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Get Instant Results</h3>
                      <p className="text-gray-600 leading-relaxed">Receive detailed validation results with compliance metrics and actionable insights.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Sample Validation Report</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">DWG_001_Rev_A.dwg</span>
                    <span className="text-xs text-green-600 ml-auto font-semibold">✓ Valid</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">RPT_002_Rev_B.pdf</span>
                    <span className="text-xs text-green-600 ml-auto font-semibold">✓ Valid</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">drawing-file.dwg</span>
                    <span className="text-xs text-red-600 ml-auto font-semibold">✗ Invalid</span>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Suggestion:</strong> Rename "drawing-file.dwg" to "DWG_003_Rev_A.dwg" to match your naming standard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Multiple File Types</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Supports DWG, PDF, DOCX, XLSX and more engineering file formats for comprehensive validation.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Custom Rules</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Configure your own naming conventions and validation rules to match your project requirements.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Export Reports</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    Download detailed validation reports in PDF or Excel format for documentation and compliance.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NamingValidator;
