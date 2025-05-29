
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle, Download } from "lucide-react";

export const FeaturesSection = () => {
  return (
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
  );
};
