
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, Folder, File } from "lucide-react";

interface ProcessStepsProps {
  onTemplateUpload: () => void;
  onFilesSelect: () => void;
  templateUploaded: boolean;
}

export const ProcessSteps = ({ onTemplateUpload, onFilesSelect, templateUploaded }: ProcessStepsProps) => {
  return (
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
                onClick={onTemplateUpload}
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
                onClick={onFilesSelect}
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
  );
};
