
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, BarChart3 } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Available Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful validation tools designed to streamline your engineering workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Naming Standard Validator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ensure every file follows your project's Document Naming Standard — fast, consistent, and error-free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>DWG_001_Rev_A.dwg ✓</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                  <span>drawing-file.dwg ✗</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>RPT_002_Rev_B.pdf ✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Deliverables Tracker
              </CardTitle>
              <CardDescription className="text-gray-600">
                Instantly compare your deliverables list with the files submitted. Spot missing files, duplicates, and naming issues in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-xs text-gray-500">Found</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-xs text-gray-500">Missing</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">1</div>
                    <div className="text-xs text-gray-500">Duplicate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
