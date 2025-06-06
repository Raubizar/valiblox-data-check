import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Zap } from 'lucide-react';

interface SampleLoadBoxProps {
  onLoadSample: () => void;
  onFileUpload?: () => void;
  onFolderSelect?: () => void;
  isLoading: boolean;
  loadingProgress: number;
  loadingStatus: string;
  title: string;
  description: string;
  sampleButtonText: string;
  disabled?: boolean;
}

export const SampleLoadBox: React.FC<SampleLoadBoxProps> = ({
  onLoadSample,
  onFileUpload,
  onFolderSelect,
  isLoading,
  loadingProgress,
  loadingStatus,
  title,
  description,
  sampleButtonText,
  disabled = false
}) => {
  if (isLoading) {
    return (
      <Card className="p-8 border-2 border-dashed border-blue-300 bg-blue-50 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Zap className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-blue-900">{loadingStatus}</h3>
          
          {/* Progress bar */}
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <p className="text-blue-700 text-sm">
            {loadingProgress}% complete
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 text-center bg-gray-50 hover:bg-blue-50">
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Title and description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Sample load button */}
        <div className="space-y-4">
          <Button
            onClick={onLoadSample}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
            disabled={disabled}
          >
            <Download className="w-5 h-5 mr-2" />
            {sampleButtonText}
          </Button>

          {/* Alternative options if provided */}
          {(onFileUpload || onFolderSelect) && (
            <>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500 px-2">or upload your own</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div className="flex gap-3 justify-center">
                {onFileUpload && (
                  <Button
                    onClick={onFileUpload}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={disabled}
                  >
                    Choose Files
                  </Button>
                )}
                
                {onFolderSelect && (
                  <Button
                    onClick={onFolderSelect}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={disabled}
                  >
                    Select Folder
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500">
          Sample includes realistic project files to demonstrate validation
        </p>
      </div>
    </Card>
  );
};
