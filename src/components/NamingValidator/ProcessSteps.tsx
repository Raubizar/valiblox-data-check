
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, Folder, File } from "lucide-react";
import * as XLSX from 'xlsx';
import { createTemplateFile } from "@/lib/naming";

interface ProcessStepsProps {
  onTemplateUpload: (rules: any[][]) => void;
  onFilesSelect: (files: FileList | File[]) => void;
  templateUploaded: boolean;
}

export const ProcessSteps = ({ onTemplateUpload, onFilesSelect, templateUploaded }: ProcessStepsProps) => {
  const [templateFileName, setTemplateFileName] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const templateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const handleTemplateFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTemplateFileName(file.name);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const namingConvention = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      onTemplateUpload(namingConvention as any[][]);
    } catch (error) {
      console.error('Error reading naming convention file:', error);
      alert('Error reading the naming convention file. Please check the format and try again.');
    }
  };
    
  const handleFolderSelect = async () => {
    try {
      // Use the File System Access API to select a folder
      const directoryHandle = await window.showDirectoryPicker();
      setFolderName(directoryHandle.name);
      
      // Collect files from the folder
      const files: File[] = [];
      const traverseDirectory = async (dirHandle: FileSystemDirectoryHandle, path = "") => {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const fileHandle = entry as FileSystemFileHandle;
            const file = await fileHandle.getFile();
            // Add custom property to track the folder path
            Object.defineProperty(file, 'folderPath', {
              value: path || dirHandle.name,
              writable: false
            });
            files.push(file);
          } else if (entry.kind === 'directory') {
            // Recursively process subdirectories
            const dirEntry = entry as FileSystemDirectoryHandle;
            await traverseDirectory(
              dirEntry, 
              path ? `${path}/${entry.name}` : entry.name
            );
          }
        }
      };
      
      await traverseDirectory(directoryHandle);
      onFilesSelect(files);
    } catch (error) {
      console.error('Error selecting folder:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        alert('Error selecting folder. Try using the file upload option instead.');
      }
    }
  };
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files);
    }
  };
  
  // Function to generate a template directly in the browser
  const generateTemplate = () => {
    try {
      const blob = createTemplateFile();
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Naming-Convention-Template.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error generating template:', error);
      alert('There was an error generating the template. Please try the download link instead.');
    }
  };
  
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Simple 3-Step Process</h2>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-12">        {/* Step 1: Download Template */}
        <Card className="p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-lg">1</span>
            </div>
            <div className="flex-1">              <h3 className="text-xl font-semibold text-gray-900 mb-3">Download Template</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Get the standard template for your project's naming convention.</p>
              <div className="space-y-2">
                <a href="./Naming-Convention-Template.xlsx" download="Naming-Convention-Template.xlsx">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    <Download className="w-5 h-5 mr-2" />
                    Download Template
                  </Button>
                </a>
                <Button 
                  variant="ghost" 
                  className="w-full text-green-600 hover:bg-green-50 text-sm"
                  onClick={generateTemplate}
                >
                  Generate in Browser
                </Button>
              </div>
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
              <input 
                type="file" 
                ref={templateInputRef}
                className="hidden" 
                accept=".xlsx,.xls" 
                onChange={handleTemplateFileChange} 
              />
              <Button 
                onClick={() => templateInputRef.current?.click()}
                className={`w-full ${templateUploaded ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
              >
                <Upload className="w-5 h-5 mr-2" />
                {templateFileName ? `${templateFileName} ✓` : 'Choose File'}
              </Button>
            </div>
          </div>
        </Card>
      </div>      {/* Step 3: Choose Validation Method */}
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
                onClick={handleFolderSelect}
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white h-auto py-4 px-6"
                disabled={!templateUploaded}
              >
                <Folder className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div>Select Folder</div>
                  <div className="text-sm opacity-90">{folderName || "Choose a folder"}</div>
                </div>
              </Button>
              
              <div className="flex items-center justify-center">
                <span className="text-gray-400 font-medium text-lg">OR</span>
              </div>
              
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple
                  accept=".pdf,.dwg,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" 
                  onChange={handleFileSelect} 
                />
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-green-600 text-green-600 hover:bg-green-50 h-auto py-4 px-6 w-full"
                  disabled={!templateUploaded}
                >
                  <File className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div>Select Files</div>
                    <div className="text-sm opacity-75">multiple files</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
