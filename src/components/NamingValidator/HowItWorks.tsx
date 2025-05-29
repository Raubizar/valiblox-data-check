
import { CheckCircle, X } from "lucide-react";

export const HowItWorks = () => {
  return (
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
  );
};
