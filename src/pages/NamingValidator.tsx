
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, X, Upload, FileText, Download } from "lucide-react";

const NamingValidator = () => {
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
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              <Upload className="w-5 h-5 mr-2" />
              Upload Files to Validate
            </Button>
          </div>

          {/* How It Works */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upload Your Files</h3>
                    <p className="text-gray-600">Drag and drop your engineering files or select them from your computer.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Set Your Standards</h3>
                    <p className="text-gray-600">Configure your project's naming convention rules and requirements.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Get Instant Results</h3>
                    <p className="text-gray-600">Receive a detailed report with validation results and suggested corrections.</p>
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
